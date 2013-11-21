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