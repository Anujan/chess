var Piece = Class.extend({
  init: function(options) {
    this.board = options.board;
    this.color = options.color;
    this.pos = options.pos;
  },
  valid_moves: function(){
    var moves = this.moves();
    var valid_moves = [];
    for (var i in moves) {
      if (!this.move_into_check(moves[i]))
        valid_moves.push(moves[i]);
    }
    console.log('valid moves',valid_moves);
    return valid_moves;
  },
  move_into_check : function(pos) {
    console.log(pos);

    var new_board = new Board(this.board.dup());
    if(new_board.off_the_grid(pos))
      return false;
    new_board.move(this.pos, pos, true);
    return new_board.checked(this.color);
  }
});

var SlidingPiece = Piece.extend({
  init: function(options) {
    this._super(options);
  },
  move_dirs: function(cord) {
    var moves = [];
    var i = 1;
    console.log('init cord', cord);
    while (true) {
      var pos = [this.pos[0] + (cord[0] * i), this.pos[1] + (cord[1] * i)];
      if (this.board.off_the_grid(pos)) {
        break;
      }
      var hit_piece = this.board.pieces[pos[0]][pos[1]];
      if (hit_piece) {
        if (hit_piece.color != this.color) {
          moves.push(pos);
          break;
        }
      }
      moves.push(pos);
      i++;
    }
    console.log(moves);
    return moves;
  },
  moves: function() {
    var moves = [];
    var coords = this.move_coords;
    for (var i in coords) {
      moves.concat(this.move_dirs(coords[i]));
    }
    console.log('moves',moves);
    return moves;
  }
});

var SteppingPiece = Piece.extend({
  init: function(options) {
    this._super(options);
  },
  moves: function() {
    var move_arr = [];
    for (var i in this.move_coords) {
      var x = this.move_coords[i][0] + this.pos[0];
      var y = this.move_coords[i][1] + this.pos[1];
      move_arr.push([x, y]);
    }
    var ret_arr = [];
    for (var i in move_arr) {
      if (!this.board.off_the_grid(move_arr[i])) {
        var space = this.board.pieces[move_arr[i][0]][move_arr[i][1]];
        if (!space || space.color != this.color) {
        	ret_arr.concat(move_arr[i]);
        }
      }
    }
    return move_arr;
  }
});

var Pawn = SteppingPiece.extend({
  init: function(options) {
    this._super(options);
    this.passant = false;
  },
  to_s: function() {
    return this.color == "white" ? "\u2659" : "\u265F";
  },
  moves: function() {
    var moves = [];
    var attack_arr = [[1,1], [1,-1]];
    for (var i in attack_arr) {
      if (this.color == "white") {
        attack_arr[i][0] = -attack_arr[i][0];
      }
      var space = this.board.pieces[this.pos[0] + attack_arr[i][0]][this.pos[1] + attack_arr[i][1]];
      if (space && space.color != this.color) {
        moves.push([this.pos[0] + attack_arr[i][0], this.pos[1] + attack_arr[i][1]]);
      }
    }
    var last = this.board.last_moved;
    if (last instanceof Pawn && last.passant && Math.abs((last.pos[1]-this.pos[1])) == 1) {
      if (this.color == "black" && this.pos[0] == 4) {
        moves.push([last.pos[0]+1,last.pos[1]]);
      } else if (this.color == "white" && this.pos[0] == 3) {
        moves.push([last.pos[0]-1,last.pos[1]]);
      }
    }
    var steps = [[1, 0]];
    if ((this.color == "white" && this.pos[0] == 6) || (this.color == "black" && this.pos[1] == 1)) {
      steps.push([2,0]);
    }
    for (var i in steps) {
      if (this.color == "white") {
        steps[i][0] = -(steps[i][0]);
      }
      var space = this.board.pieces[this.pos[0] + steps[i][0]][this.pos[1] + steps[i][1]];
      if (!space) {
        moves.push([this.pos[0] + steps[i][0],this.pos[1] + steps[i][1]]);
      }
    }
    return moves;
   }
});

var Knight = SteppingPiece.extend({
    init: function(options) {
      this._super(options);
      this.move_coords = [[1,2],[-1,2],[1,-2],
      [-1,-2],[2,1],[-2,1],[-2,-1],[2,-1]];
    },

    to_s: function() {
      return this.color == "white" ? "\u2658" : "\u265E";
    }
});

var King = SteppingPiece.extend({
  init: function(options) {
    this._super(options);
    this.moved = false;
    this.move_coords = [[1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, 1], [-1, -1], [1, -1], [0, 2], [0, -2]];
  },
  to_s: function() {
    return this.color == "white" ? "\u2654" : "\u265A";
  }
});

var Bishop = SlidingPiece.extend({
  init: function(options) {
    this._super(options);
    this.move_coords = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
  },
  to_s: function() {
    return this.color == "white" ? "\u2657" : "\u265D";
  }
});

var Rook = SlidingPiece.extend({
  init: function(options) {
    this._super(options);
    this.moved = false;
    this.move_coords = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  },
  to_s: function() {
    return this.color == "white" ? "\u2656" : "\u265C";
  }
});

var Queen = SlidingPiece.extend({
  init: function(options) {
    this._super(options);
    this.move_coords = [[1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, 1], [-1, -1], [1, -1]];
  },
  to_s: function() {
    return this.color == "white" ? "\u2655" : "\u265B";
  }
});