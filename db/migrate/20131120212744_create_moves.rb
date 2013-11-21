class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.integer :player_id
      t.string :start_pos
      t.string :end_pos

      t.timestamps
    end
    add_index :moves, :player_id
  end
end
