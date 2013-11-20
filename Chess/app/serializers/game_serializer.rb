class GameSerializer < ActiveModel::Serializer
  attributes :id, :turn
  has_one :white
  has_one :black
end
