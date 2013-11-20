class Move < ActiveRecord::Base
  attr_accessible :end_pos, :player_id, :start_pos
  serialize :end_pos
  serialize :start_pos

  belongs_to(
    :player,
    class_name: 'Player',
    foreign_key: :player_id,
    primary_key: :id
  )
end
