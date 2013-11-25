class Game < ActiveRecord::Base
  attr_accessible :black_id, :moves, :turn, :white_id

  belongs_to(
    :white,
    class_name: 'Player',
    foreign_key: :white_id,
    primary_key: :id
  )

  belongs_to(
    :black,
    class_name: 'Player',
    foreign_key: :black_id,
    primary_key: :id
  )

  def game_moves
    moves = []
    moves += self.black.moves if self.black
    moves += self.white.moves if self.white
    moves
  end

  def self.available?
    games = Game.where(" black_id IS NULL")
    games.first
  end

  def switch_turn!
    self.turn = self.turn == :white ? :black : :white
    self.save!
  end
end
