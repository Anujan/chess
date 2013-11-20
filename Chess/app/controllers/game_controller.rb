class GameController < ApplicationController

  def find
    player = nil
    if session[:token].nil?
      #new player
      player = Player.create
      session[:token] = player.session_token
    else
      player = Player.find_by_session_token(session[:token])
    end
    unless player.nil?
      player.last_request = Time.now
      player.save
      if player.game_id.nil?
        time_before_expires = 10.seconds.ago
        players = Player.where("last_request > ? AND game_id IS NULL", time_before_expires)

        if players.count >= 2
          game = Game.create(black_id: players.first.id, white_id: players.second.id, turn: :black)
          game.black.update_attributes(game_id: game.id, color: 'BLACK')
          game.white.update_attributes(game_id: game.id, color: 'WHITE')
          render json: { game: game, your_player_id: player.id }
        else
          render json: {status: "Waiting for another player still..."}
        end
      else
        render json: { game: player.game, your_player_id: player.id }
      end
    end
  end
end
