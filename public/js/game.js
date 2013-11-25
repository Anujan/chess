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
  apply_moves: function(moves) {
    moves = moves.slice(this.game_moves.length-1);
    for( var i = 0; i < moves.length; i++)
    {
      if(this.game_over  != true)
        this.move(player_color, moves[i][0], moves[i][1] )
    }
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
        this.apply_moves(data.game.moves);
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
  move: function(player_color, start_coord, end_coord ) {
    console.log("ready", this.ready);
    if(!this.ready)
      return;
    var rightColor = this.board.is_color(start_coord, this.turn);
    this.ready = false;

    this.board.move(start_coord, end_coord, false);
    this.ready = true;
    this.game_moves.push([start_coord, end_coord]);
    $.post( "/move",
    { sx: start_coord[0],
      sy: start_coord[1],
      ex: end_coord[0],
      ey: end_coord[1]
    });

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
      if(self.color != game.turn){
        console.log('not your turn');
        return;
      }
      var row = $(this).parent().index();
      var column = $(this).index();
      pickedPiece = !pickedPiece;
      if (pickedPiece) {
        self.startCoord = [row, column];
      } else {
        self.endCoord = [row, column];

        game.move(self.color, self.startCoord, self.endCoord);
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