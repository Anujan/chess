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

    //this.get_game_status(options.game_name);

    this.turn = null;

    this.timer = null;
  },
  change_state: function(data) {
    if (data.status != 'Waiting'){
      if (!this.game_started)
      {
        this.player.color = data.your_color;
        console.log('welcome to chess. your color is', this.player.color);
        this.remote_player.color = this.player.color == "white" ? "black" : "white";
        this.turn = data.game.turn;
        this.play();
        this.game_started = true;
      } else {
        this.turn = data.game.turn;
      }
    }
  },
  get_game_status: function(name){
    var that = eval(name);
    $.get("/find", function( data ) {
     that.change_state(data);
    });
    if (!that.game_over){
      setTimeout(function(){that.get_game_status(name);},2000);
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
    console.log("ready", this.ready);
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
    this.moves = [];
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
    this.moves = [];
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
$("#find").on("click", function(){
  $.get("/find", function( data ) {
   g.change_state(data);
  });
});
//g.get_game_status("g");