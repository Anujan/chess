class Message < ActiveRecord::Base
  attr_accessible :color, :game_id, :message
  validates :color, :game_id, :message, presence: true

  belongs_to :game
end
