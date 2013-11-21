var Game = Class.extend({
  init: function(options) {
    this.board = new Board();

    //this.game_id = this.get_game_id();
    this.game_over = false;
    this.game_started = false;

    this.player = new Player(this);
    this.remote_player = new RemotePlayer(this);
    //this.other_player = new RemotePlayer(this);
    this.ready = true;

    this.game_moves = [];
    this.started = false;
    this.get_game_status();

    this.turn = 'white';
    this.play();
  },
  change_state: function(data){
    stat = JSON.parse(data);
    if (!stat.game_status == 'Waiting'){
      if (!this.game_started)
      {
        this.player.color = stat.your_color;

        this.remote_player.color = this.player.color == "white" ? "black" : "white";

        this.play();
      }
      else{

        this.remote_player.moves(stat.moves);
        this.turn = stat.turn;

      }
    }
  },
  get_game_status: function(){
    var that = this;
    $.get( "http://danujanchess.herokuapp.com/find", function( data ) {
     console.log(data);
     that.change_state(data);
    });
    if(!this.game_over)
      set_timeout(this.get_game_status,4000);
  },
  play: function() {
    console.log('welcome to chess. your color is', this.player.color,' its your turn');
    this.board.render();
  },
  move: function(player) {
    if(player.color != this.turn){
      console.log('not your turn');
      return;
    }
    if(!this.ready)
      return;
    var rightColor = this.board.is_color(player.startCoord, this.turn);
    this.ready = false;

    this.board.move(player.startCoord, player.endCoord, false);
    this.ready = true;
    this.game_moves.push([player.startCoord,player.endCoord]);
    $.post( "http://danujanchess.herokuapp.com/move",
    { start_pos: player.startCoord, end_pos: player.endCoord });

    this.turn = this.turn == "white" ? "black" : "white";
    this.board.render();
    if(this.board.checkmate(this.turn))
    {
      console.log('game over');
      this.game_over  = true;
      this.turn = this.turn == "white" ? "black" : "white";
      console.log(this.turn, ' wins');
      $(".square").unbind('click');
    }

  }
});

var Player = Class.extend({
  init: function(game){
    var self = this;
    this.color = 'none';
    var pickedPiece = false;
    this.startCoord = [];
    this.endCoord = []
    $(".square").on('click', function(e) {
      var row = $(this).parent().index();
      var column = $(this).index();
      pickedPiece = !pickedPiece;
      if (pickedPiece) {
        self.startCoord = [row, column];
      } else {
        self.endCoord = [row, column];
        game.move(self);
      }
    });
  }
});



var RemotePlayer = Class.extend({
  init: function(game,color){
    this.endCoord = [];
    this.startCoord = [];
    this.color = color;
  },
  move: function(moves){
    if (this.game.game_moves.length < moves.length)
    {
      this.startCoord = moves[moves.length-1][0];
      this.endCoord = moves[moves.length-1][1];
      game.move(self);
    }
  }
});
var g = new Game();
/*
class Game
  def play_loop
    puts "Welcome to our game of Chess."
    puts "You make moves by typing in the coordinate that you wish to move from, followed by the coordinate you're moving to"

    turn = :white

    until board.checkmate?(turn)
      white_turn = turn == :white
      player = white_turn ? @white : @black
      puts self.board
      puts "#{turn.to_s.capitalize}'s turn".bold
      begin
        input = player.play_turn

        case input[:action]
        when :save
          save
        when :load
          load
        else
          board.is_color?(input[:start_pos],turn)
          self.board.move(input[:start_pos], input[:end_pos])
        end
      rescue InvalidMoveException => e
        puts e.message
        retry
      end
      turn = white_turn ? :black : :white
    end

    if board.checked?(:black)
      puts "Checkmate! White Wins!".bold
    elsif board.checked?(:white)
      puts "Checkmate! Black Wins!".bold
    else
      puts "Stalemate. No one wins!".bold
    end
  end
end

class HumanPlayer
  LETTER_HASH = {:a => 0, :b => 1, :c => 2, :d => 3,
    :e => 4, :f => 5, :g => 6, :h => 7}
  def play_turn
    puts "Where do you want to move?"
    input = gets.chomp
    if input.include?('l')
      return {:action =>  :load}
    elsif input.include?('s')
      return {:action =>  :save}
    end
    start_coord, end_coord = input.split(" ")

    start_pos = start_coord.split("")
    end_pos = end_coord.split("")

    start_pos[1] = 8 - start_pos[1].to_i
    start_pos[0] = LETTER_HASH[start_pos[0].to_sym]

    end_pos[1] = 8 - end_pos[1].to_i
    end_pos[0] = LETTER_HASH[end_pos[0].to_sym]

    start_pos[0],start_pos[1] = start_pos[1],start_pos[0]
    end_pos[0],end_pos[1] = end_pos[1],end_pos[0]

    { :start_pos  =>  start_pos,
      :end_pos    =>  end_pos,
      :action     =>  :move}
  end
end

if __FILE__ == $PROGRAM_NAME
  Game.new
end
*/