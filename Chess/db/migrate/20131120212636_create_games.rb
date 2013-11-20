class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :black_id, null: false
      t.integer :white_id, null: false
      t.string :turn, null: false

      t.timestamps
    end
    add_index :games, :black_id
    add_index :games, :white_id
  end
end
