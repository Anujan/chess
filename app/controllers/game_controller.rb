class GameController < ApplicationController
  def find
    @player = Player.find_by_token(cookies[:token])

    if @player && @player.game && @player.game.black
      start_game
    else

      @player = Player.create unless @player

      cookies[:token] = { value: @player.token , expires: Time.now + 30}

      if @player.game
        wait
      else
        game_available = Game.available?
        if game_available
          @player.color = :black
          @player.game = game_available
          game_available.black = @player
          game_available.save
          @player.save!
          #game_av.save!
          start_game
        else
          game = Game.create(white_id: @player.id, turn: :white)
          @player.game = game
          @player.color = :white
          @player.save

          game.white = @player
          game.save
          wait
        end
      end
    end
  end

   def wait
     render json: {status: "Waiting"}
   end

   def start_game
     game = @player.game
     render json: {
       status: "Go",
       color: @player.color,
       moves: game.game_moves,
       turn: game.turn
       }
   end
    #
    # if player.game.black
    #   render json: {
    #     status: "Start",
    #     game: player.game,
    #     your_player_id: player.id,
    #     your_color: player.color
    #   }

    # player = nil
   #  if session[:token].nil?
   #    player = Player.create
   #    session[:token] = player.session_token
   #  else
   #    player = Player.find_by_session_token(session[:token])
   #  end
   #  unless player.nil?
   #    player.last_request = Time.now
   #    player.save
   #    if player.game_id.nil?
   #      time_before_expires = 30.seconds.ago
   #      players = Player.where("last_request > ? AND game_id IS NULL", time_before_expires)
   #      if players.count >= 2
   #        game = Game.create(black_id: players.first.id, white_id: players.second.id, turn: :black)
   #        game.black.update_attributes(game_id: game.id, color: :black)
   #        game.white.update_attributes(game_id: game.id, color: :white)
   #        render json: { game: game, your_player_id: player.id }
   #      else
   #
   #      end
   #    else
   #
   #    end
   #  else
   #    session[:token] = nil
   #    render json: { status: "Waiting" }
   #  end


  def move
    begin
      player = Player.find_by_token!(session[:token])

      move = player.moves.create!(params[:move])

      game_moves = player.game.moves

      render json: { status: "Go", game: player.game, your_player_id: player.id, moves: game_moves }
    rescue StandardError => e
      render json: { error: true, message: e.message }
    end
    # if player.nil? || player.game_id.nil? || player.game.turn != player.color
#       render json: { error: true, message: "It's not your turn or you're not apart of this game"}
#     elsif params[:start_pos].nil? || params[:end_pos].nil?
#       render json: { error: true, message: "You didn't provide sufficient move coordinates"}
#     else
#       player.moves.create(start_pos: params[:start_pos], end_pos: params[:end_pos])
#       player.game.switch_turn!
#
#     end
  end
end
