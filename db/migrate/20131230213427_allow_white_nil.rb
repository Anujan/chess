class AllowWhiteNil < ActiveRecord::Migration
  def change
    change_column :games, :white_id, :integer, null: true
  end
end
