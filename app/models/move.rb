class Move < ActiveRecord::Base
  attr_accessible :end_pos, :player_id, :start_pos
  serialize :end_pos
  serialize :start_pos

  validates_presence_of :end_pos, :start_pos, :player_id

  after_save :switch

  belongs_to(
    :player,
    class_name: 'Player',
    foreign_key: :player_id,
    primary_key: :id
  )

  def switch
    self.player.game.switch_turn!
  end
end
