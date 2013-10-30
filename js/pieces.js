
var Piece = function() {};
// inhertiable attributes / methods
Piece.prototype = {
  board       : null,
  color       : '',
  pos         : [],
  move_coords : [],
  valid_moves : function(){
    var moves = this.moves();
    var valid_moves = [];
    for (var move in moves) {
      if (!this.move_into_check(move))
        valid_moves.push(move);
    }
    return valid_moves;
  },
  move_into_check : function(pos) {
    var new_board = new Board(this.board.dup());
    new_board.move(this.pos, pos, true);
    return new_board.checked(this.color);
  }
};

class InvalidMoveException < StandardError
end

class SlidingPiece < Piece
  def move_dirs(cord)

    moves = []
    i =  1
    while true
      pos = [self.pos[0] + (cord[0]* i), self.pos[1] + (cord[1] * i)]
      break if self.board.off_the_grid?(pos)
      hit_piece = self.board.pieces[pos[0]][pos[1]]
      if !hit_piece.nil?
        moves << pos if hit_piece.color != self.color
        break
      end
      moves << pos
      i += 1
    end

    moves
  end

  def moves
    self.move_coords.inject([]) do |moves,dir|
      moves + move_dirs(dir)
    end
  end
end

var SteppingPiece = function() {};
SteppingPiece.prototype = {
  moves: function() {
    var move_arr = [];
    for (var move in this.move_coords) {
      x = move[0] + this.pos[0];
      y = move[1] + this.pos[1];
      move_arr.push([x, y]);
    }
    ret_arr = []
    for (var move in move_arr) {
      if (!this.board.off_the_grid(move)) {
        space = this.board.pieces[move[0]][move[1]];
        if (space == null || space.color != this.color)
        ret_arr.push(space.pos)
      }
    }
    return move_arr;
  }
}

class Pawn < SteppingPiece
  attr_accessor :passant
  def initialize(options)
    super(options)
    @passant = false
  end
  def to_s
    self.color == :white ? "\u2659" : "\u265F"
  end
  def moves
    moves = []

    [[1,1],[1,-1]].each do |attack|
      attack[0] = -attack[0] if self.color == :white
      space = self.board.pieces[pos[0] + attack[0]][pos[1] + attack[1]]
      moves << [pos[0] + attack[0], pos[1] + attack[1]] unless space.nil? || space.color == self.color
    end
    last = self.board.last_moved
    if last.is_a?(Pawn) && last.passant && (last.pos[1]-self.pos[1]).abs == 1
      moves << [last.pos[0]+1,last.pos[1]] if self.color == :black && self.pos[0] == 4
      moves << [last.pos[0]-1,last.pos[1]] if self.color == :white && self.pos[0] == 3
    end

    steps = [[1,0]]
    steps << [2,0] if self.color == :white && self.pos[0] == 6
    steps << [2,0] if self.color == :black && self.pos[0] == 1

    steps.each do |move|
      move[0] = -move[0] if self.color == :white
      space = self.board.pieces[pos[0] + move[0]][pos[1] + move[1]]
      moves << [pos[0] + move[0],pos[1] + move[1]] if space.nil?
    end

    moves
  end
end

class Knight < SteppingPiece
  KNIGHT_MOVES = [[1,2],[-1,2],[1,-2],
    [-1,-2],[2,1],[-2,1],[-2,-1],[2,-1]]

  def initialize(options)
    super
    @move_coords = KNIGHT_MOVES
  end

  def to_s
    self.color == :white ? "\u2658" : "\u265E"
  end
end

class King < SteppingPiece
  attr_accessor :moved
  KING_MOVES = [[1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, 1], [-1, -1], [1, -1], [0, 2], [0, -2]]

  def initialize(options)
    super
    @move_coords = KING_MOVES
    @moved = false
  end

  def to_s
    self.color == :white ? "\u2654" : "\u265A"
  end
end

class Bishop < SlidingPiece
  BISHOP_MOVES = [[1, 1], [-1, 1], [-1, -1], [1, -1]]

  def initialize(options)
    super
    @move_coords = BISHOP_MOVES
  end

  def to_s
    self.color == :white ? "\u2657" : "\u265D"
  end
end

class Rook < SlidingPiece
  attr_accessor :moved
  ROOKIE_MOVES = [[1, 0], [0, 1], [-1, 0], [0, -1]]

  def initialize(options)
    super
    @moved = false
    @move_coords = ROOKIE_MOVES
  end

  def to_s
    self.color == :white ? "\u2656" : "\u265C"
  end
end

class Queen < SlidingPiece
  QUEEN_MOVES = [[1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, 1], [-1, -1], [1, -1]]

  def initialize(options)
    super
    @move_coords = QUEEN_MOVES
  end

  def to_s
    self.color == :white ? "\u2655" : "\u265B"
  end
end