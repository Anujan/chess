# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131125215840) do

  create_table "games", :force => true do |t|
    t.integer  "black_id",   :null => false
    t.integer  "white_id",   :null => false
    t.string   "turn",       :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.text     "board"
    t.text     "moves"
  end

  add_index "games", ["black_id"], :name => "index_games_on_black_id"
  add_index "games", ["white_id"], :name => "index_games_on_white_id"

  create_table "messages", :force => true do |t|
    t.string   "color"
    t.string   "message"
    t.integer  "game_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "moves", :force => true do |t|
    t.integer  "player_id"
    t.string   "start_pos"
    t.string   "end_pos"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "moves", ["player_id"], :name => "index_moves_on_player_id"

  create_table "players", :force => true do |t|
    t.string   "color"
    t.integer  "game_id"
    t.string   "session_token"
    t.time     "last_request"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "players", ["game_id"], :name => "index_players_on_game_id"
  add_index "players", ["session_token"], :name => "index_players_on_session_token"

end
