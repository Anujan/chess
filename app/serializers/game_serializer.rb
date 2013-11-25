class GameSerializer < ActiveModel::Serializer
  attributes :id, :turn, :moves
  has_one :white, embed: :objects
  has_one :black, embed: :objects
  has_many :messages, embed: :objects

  def moves
    object.moves.map { |e| e.map(&:to_i) }
  end
end
