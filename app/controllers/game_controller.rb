class GameController < ApplicationController
  def find
    player = nil
    if session[:token].nil?
      player = Player.create
      session[:token] = player.session_token
    else
      player = Player.find_by_session_token(session[:token])
    end
    unless player.nil?
      player.last_request = Time.now
      player.save
      if player.game_id.nil?
        time_before_expires = 30.seconds.ago
        players = Player.where("last_request > ? AND game_id IS NULL", time_before_expires)
        if players.count >= 2
          game = Game.create(black_id: players.first.id, white_id: players.second.id, turn: :white, board: "")

          game.black.update_attributes(game_id: game.id, color: :black)
          game.white.update_attributes(game_id: game.id, color: :white)
          render json: {
            game: game,
            your_color: player.color
          }
        else
          render json: {
            status: "Waiting"
          }
        end
      else
        render json: {
          status: "Start",
          game: player.game,
          your_color: player.color
        }
      end
    else
      session[:token] = nil
      render json: {
        status: "Waiting"
      }
    end
  end

  def move
    player = Player.find_by_session_token(session[:token])
    if player.nil? || player.game_id.nil? || player.game.turn != player.color
      render json: {
        error: true,
        message: "It's not your turn or you're not apart of this game"
      }
    elsif params[:board].nil?
      render json: {
        error: true,
        message: "You didn't provide sufficient params"
      }
    else
      player.game.board = params[:board]
      player.game.switch_turn!
      render json: {
        status: "Go",
        game: player.game,
        your_player_id: player.id,
        your_color: player.color
      }
    end
  end
end
