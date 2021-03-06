class Game < ActiveRecord::Base
  attr_accessible :black_id, :moves, :turn, :white_id, :moves

  belongs_to(
    :white,
    class_name: 'Player',
    foreign_key: :white_id,
    primary_key: :id
  )
  serialize :moves

  belongs_to(
    :black,
    class_name: 'Player',
    foreign_key: :black_id,
    primary_key: :id
  )

  has_many :messages

  def switch_turn!
    self.turn = self.turn == :white ? :black : :white
  end
end
