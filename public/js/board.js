var Board = Class.extend({
  init: function(pieces){
    if(!pieces)
      this.build_board();
    else
      this.pieces = pieces;
  },
  build_board: function(){
    this.pieces = new Array(8);
    for (var i = 0; i < 8; i++) {
      this.pieces[i] = new Array(8);
    }
    this.add_board_struct();
    this.add_pawns();
    this.add_rooks();
    this.add_knights();
    this.add_bishops();
    this.add_queens();
    this.add_kings();

    return;
  },
  add_board_struct: function(){
    board = $('#board');
    for (var i = 0; i < 8; i++) {
      var row = $(document.createElement('div'));
      row.addClass('row');
      for (var y = 0; y < 8; y ++ ){
        var sq = $(document.createElement('span'));
        sq.addClass('square');
        row.append(sq);
      }
      board.append(row);
    }
  },
  add_pawns: function(){
    var pawn = {
      board : this
    };
    for( var i = 0; i  < 8; i++)
    {
      black = {
        color : 'black',
        pos   : [1,i]
      };
      this.pieces[1][i] = new Pawn(mergeObj(pawn,black));
      white = {
        color : 'white',
        pos   : [6,i]
      };
      this.pieces[6][i] = new Pawn(mergeObj(pawn,white));
    }
    return true;
  },
  add_rooks: function(){
    var positions = [[0,0], [0, 7], [7, 0], [7, 7]];
    var rook = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      rook = mergeObj(rook,{ color : color, pos : p});

      this.pieces[p[0]][p[1]] = new Rook(rook);
    }
    return true;
  },
  add_knights: function(){
    var positions = [[0,1], [0, 6], [7, 1], [7, 6]];
    var knight = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      knight = mergeObj(knight,{ color : color, pos : position});

      this.pieces[p[0]][p[1]] = new Knight(knight);
    }
    return true;
  },
  add_knights: function(){
    var positions = [[0,1], [0, 6], [7, 1], [7, 6]];
    var knight = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      knight = mergeObj(knight,{ color : color, pos : p});

      this.pieces[p[0]][p[1]] = new Knight(knight);
    }
    return true;
  },
  add_bishops: function(){
    var positions = [[0,2], [0, 5], [7, 2], [7, 5]];
    var bishop = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      bishop = mergeObj(bishop,{ color : color, pos : p});

      this.pieces[p[0]][p[1]] = new Bishop(bishop);
    }
    return true;
  },
  add_queens: function(){
    var positions = [[0,3],[7, 3]]
    var queen = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      queen = mergeObj(queen,{ color : color, pos : p});

      this.pieces[p[0]][p[1]] = new Queen(queen);
    }
    return true;
  },
  add_kings: function(){
    var positions = [[0,4],[7, 4]];
    var king = {
      board : this
    };
    var color;
    for( var position in positions )
    {
      p = positions[position];
      if (p[0] == 0)
        color = 'black';
      else
        color = 'white'

      king = mergeObj(king,{ color : color, pos : p});

      this.pieces[p[0]][p[1]] = new King(king);
    }
    return true;
  },
  render: function(){
    var display = "";
    for(var row = 0; row < 8; row++) {
      for(var col = 0; col < 8; col++)
      {
        var x = parseInt(row)+1;
        var y = parseInt(col)+1;
        var sq =
          $( "#board div.row:nth-child("+x+") span.square:nth-child("+y+") " );
        var piece = this.pieces[row][col];
        if ( piece instanceof Piece) {
          sq.html(piece.to_s());
        } else{
          sq.html('.');
        }
      }
      display += "\n";
    }
    return true;
  },
  is_color: function(pos,color){
    var piece = this.pieces[pos[0]][pos[1]];
    if (!piece || piece.color != color)
    {
      throw 'That is not your piece';
      return false;
    }
    return true;
  },
  checked: function(color){
    var moves = [];
    var k = this.king(color);
    var piece;

    for(var x = 0; x < 8; x++) {
      for(var y = 0; y < 8; y++) {
        piece = this.pieces[x][y];
        if (piece && piece.color != color)
        {
          moves = piece.moves();
          if (moves_includes(moves,k.pos))
            return true;
        }
      }
    }
    return false;
  },
  checkmate: function(color){
    var potential = [];
    var moves = [];
    var piece;
    for(var x in this.pieces) {
      for(var y in this.pieces[x]) {
        piece = this.pieces[x][y];
        if(piece && piece.color == color)
          {
            moves = piece.valid_moves();

            if (moves.length > 0)
            {
              return false;
            }
          }
        }
      }
    return true;
  },
  king: function(color){
    var piece;
    for(var row = 0; row < 8; row++) {
      for(var col = 0; col < 8; col++) {
        piece = this.pieces[row][col];

        if (piece && piece.color == color && piece.king) {
            return piece;
        }
      }
    }
    return;
  },
  passant_check: function(piece,end_pos){
    if (! piece instanceof Pawn)
      return;
    if (Math.abs(piece.pos[0]-end_pos[0])==2)
    {
      piece.passant = true;
    }
    var last = this.last_moved;
    if (last instanceof Pawn && last.passant == true)
      if (Math.abs(last.pos[1]-piece.pos[1]) == 1)
        if (( piece.color == 'black' && piece.pos[0] ==4)
          || piece.color == 'white' && piece.pos[0] == 3)
          {
            this.pieces[last.pos[0]][last.pos[1]] = null;
          }
    return;
  },
  castle_check: function(piece, end_pos) {
    if (piece instanceof King) {
        if (Math.abs(end_pos[1]-piece.pos[1]) == 2) {
          if (piece.moved) {
            throw "You can't castle once you've moved your King";
            return;
          } else if (this.checked(piece.color)) {
            throw "You can't castle when you're in check!";
            return;
          }
          var direction = end_pos[1] - piece.pos[1] > 0 ? 7 : 0;
          var pieces_between = [[piece.pos[0], piece.pos[1] + (direction == 7 ? 1 : -1)],
          [piece.pos[0], piece.pos[1] + (direction == 7 ? 2 : -2)]];
          var target_rook = this.pieces[end_pos[0]][direction];
          if (!target_rook || !(target_rook instanceof Rook) || target_rook.moved) {
            throw "You can't castle in that direction because your rook has already moved";
            return;
          }
          for (var p in pieces_between) {
            if (piece.move_into_check(p)) {
              throw "You can't move over squares under attack when castling!";
              return;
            } else if (this.pieces[p[0]][p[1]]) {
              throw "You can't move over squares that are occupied.";
              return;
            }
            this.pieces[pieces_between[0][0]][pieces_between[0][1]] = target_rook
            this.pieces[target_rook.pos[0]][target_rook.pos[1]] = null
            target_rook.pos = [pieces_between[0][0], pieces_between[0][1]]
            target_rook.moved = true;
          }
        }
        piece.moved = true;
    } else if (piece instanceof Rook) {
      piece.moved = true;
    }
  },
  queened_check: function(piece) {
    if (!(piece instanceof Pawn)) {
      return piece;
    } else {
     var end_dest = piece.color == "black" ? 7 : 0;
     if (piece.pos[0] == end_dest) {
       this.pieces[piece.pos[0]][piece.pos[1]] = new Queen({board: this, pos: piece.pos, color: piece.color});
     }
    }
    return this.pieces[piece.pos[0]][piece.pos[1]];
  },
  move: function(start_pos, end_pos, checked_test) {
    var piece = this.pieces[start_pos[0]][start_pos[1]];
    var moves = piece.moves();
    if(this.off_the_grid(piece.pos))
    console.log('missing');

    if (checked_test == false) {
      moves = piece.valid_moves();
    }
    if (moves_includes(moves,end_pos)) {
      if (checked_test == false) {
        //this.castle_check(piece, end_pos);
      }
      this.passant_check(piece, end_pos);
      try{

      this.pieces[end_pos[0]][end_pos[1]] = piece;
      }
      catch(err){
        console.log('piece',piece);
        console.log('start',start_pos,'end',end_pos);
      }
      this.pieces[start_pos[0]][start_pos[1]] = null;
      piece.pos = end_pos;
      //piece = this.queened_check(piece);
      this.last_moved = piece;
    } else {
      throw "Invalid Destination";
    }
    return true;
  },
  dup: function() {

    var duped = [];

    for( var x = 0; x < 8; x++)
    {
      duped.push([]);
      for(var y = 0; y < 8; y++)
      {
        if (this.pieces[x][y])
          duped[x].push(cloneObject(this.pieces[x][y]));
        else
          duped[x].push(null);
      }
    }
    return duped;
    var duped_pieces = new Array(8);
    for (var i = 0; i < 8; i++) {
       duped_pieces[i] = new Array(8);
    }
    var piece;
    for (var x in this.pieces) {
      for (var y in this.pieces[x]) {
        piece = this.pieces[x][y];
        if (piece)
          duped_pieces[piece.pos[0]][piece.pos[1]] = cloneObject(piece);
      }
    }
    return duped_pieces;
  },
  off_the_grid: function(pos) {
    return pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7;
  }
});

function cloneObject(obj) {
    return jQuery.extend(true, {}, obj);
}
