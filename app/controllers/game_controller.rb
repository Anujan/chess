class GameController < ApplicationController
  def find
    player = Player.find_by_session_token(session[:token])
    unless player
      player = Player.create
      session[:token] = player.session_token
    end

    unless player.game_id
      game = Game.where('black_id IS NULL').last
      if game
        player.game = game
        game.black_id = player.id
        player.save
        game.save
        Pusher.trigger("lobby", "game", {
          status: "Start",
          game: player.game
        })
      else
        player.game = Game.create(black_id: nil, white_id: player.id, turn: :white, moves: [])
        player.save

        Pusher.trigger("lobby", "game",{ status: "Waiting" })
      end
      head :ok
    else

      Pusher.trigger("lobby", "game", {
        status: "Start",
        game: player.game
      })
      sleep 1
      Pusher.trigger("game_#{player.game.id}", "move", {
        status: "Moved",
        game: player.game,
        your_player_id: player.id,
        your_color: player.color,
        chat: player.game.messages
      })
      head :ok
    end
  end

  def move
    player = Player.find_by_session_token(session[:token])

    if player.nil? || player.game.nil?
      render json: {
        error: true,
        message: "It's not your turn or you're not apart of this game"
      }
    elsif [params[:sx], params[:sy], params[:ex], params[:ey]].any? {|p| p.nil?}
      render json: {
        error: true,
        message: "You didn't provide sufficient params"
      }
    else
      move = [
        [
          params[:sx],
          params[:sy]
        ],
        [
          params[:ex],
          params[:ey]
        ]
      ]
      player.game.moves.push(move)
      player.game.switch_turn!
      player.game.save!
      Pusher.trigger("game_#{player.game.id}", "move", {
        status: "Moved",
        game: player.game,
        your_player_id: player.id,
        your_color: player.color,
        chat: player.game.messages
      })
      head :ok
    end
  end

  def chat
    player = Player.find_by_session_token(session[:token])
    if player && player.game
      player.game.messages.create(params[:chat])
    else
      render json: {error: true, status: "You're not in a game"}
    end
  end
end
