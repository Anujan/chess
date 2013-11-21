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

  def switch_turn!
    self.turn = self.turn == :white ? :black : :white
    self.save!
  end
end
