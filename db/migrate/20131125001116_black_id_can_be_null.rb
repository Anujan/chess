class BlackIdCanBeNull < ActiveRecord::Migration
  def change
    change_column :games, :black_id, :integer, null: true
  end
end
