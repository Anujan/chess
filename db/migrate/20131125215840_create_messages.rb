class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :color
      t.string :message
      t.integer :game_id

      t.timestamps
    end
  end
end
