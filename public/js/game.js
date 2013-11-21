var Game = Class.extend({
  init: function(options) {
    this.board = new Board();

    this.game_over = false;
    this.game_started = false;

    this.player = new Player(this);
    this.remote_player = new RemotePlayer(this);
    this.ready = true;

    this.game_moves = [];
    this.started = false;
    this.get_game_status();

    this.turn = null;

    this.timer = null;
  },
  change_state: function(data){
    if (data.status != 'Waiting'){
      if (!g.game_started)
      {
        g.player.color = data.your_color;
        console.log('welcome to chess. your color is', this.player.color);
        g.remote_player.color = g.player.color == "white" ? "black" : "white";
        g.turn = data.game.turn;
        g.play();
      } else {
        g.remote_player.moves(data.game[g.remote_player.color].moves);
        g.turn = data.game.turn;
      }
    }
  },
  get_game_status: function(){
    var that = this;
    $.get("/find", function( data ) {
     g.change_state(data);
    });
    if (!this.timer){
      this.timer = setInterval(this.get_game_status,2000);
    }
    if (this.game_over){
      clearInterval(this.timer);
    }
  },
  play: function() {
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
    $.post( "/move",
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
    this.endCoord = [];
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
    this.game = game;
  },
  move: function(moves){
    if (this.game.game_moves.length < moves.length)
    {
      this.startCoord = moves[moves.length-1][0];
      this.endCoord = moves[moves.length-1][1];
      this.game.move(this);
    }
  }
});
var g = new Game();