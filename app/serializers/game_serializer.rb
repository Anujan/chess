class GameSerializer < ActiveModel::Serializer
  attributes :id, :turn, :moves
  has_one :white, embed: :objects
  has_one :black, embed: :objects
end
