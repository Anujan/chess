class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :color
  has_many :moves
end
