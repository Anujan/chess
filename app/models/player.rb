class Player < ActiveRecord::Base
  attr_accessible :color, :game_id

  belongs_to(
    :game,
    class_name: 'Game',
    foreign_key: :game_id,
    primary_key: :id
  )

  has_many :moves

  after_initialize :ensure_token

  def ensure_token
    self.session_token ||= SecureRandom.urlsafe_base64
  end
end
