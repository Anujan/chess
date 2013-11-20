class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :color
      t.integer :game_id
      t.string :session_token
      t.time :last_request

      t.timestamps
    end

    add_index :players, :game_id
    add_index :players, :session_token
  end
end
