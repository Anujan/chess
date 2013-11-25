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
    moves = moves.slice(this.game_moves.length);

    for( var i = 0; i < moves.length; i++)
    {
      move_items = [];
      moves[i].forEach(function(e, i, arr) {
        move_items.push(e.map(function(el) {
          return parseInt(el, 10);
        }));
      });

      if(this.game_over != true)
        this.move(this.turn, move_items[0], move_items[1]);
    }
  },
  change_state: function(data) {

    if (data.status != 'Waiting'){
      if (!this.game_started)
      {
        this.player.color = data.your_color;
        $('#error_label').text('welcome to chess. your color is', this.player.color);
        this.remote_player.color = this.player.color == "white" ? "black" : "white";
        this.turn = 'white';
        this.play();
        this.game_started = true;
      } else {
        this.apply_moves(data.game.moves);
      }
    } else {
      $('#turn_label').html('Waiting for a player...');
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
    $('#turn_label').html(g.turn + "'s turn!");
    this.board.render();
  },
  move: function(player_color, start_coord, end_coord ) {
      // console.log("ready", this.ready);
  //     if(!this.ready)
  //       return;
    var rightColor = this.board.is_color(start_coord, this.turn);
    this.ready = false;

    this.board.move(start_coord, end_coord, false);
    this.ready = true;
    this.game_moves.push([start_coord, end_coord]);

    this.turn = this.turn == "white" ? "black" : "white";
    $('#turn_label').html(g.turn + "'s turn!");
    this.board.render();
    if(this.board.checkmate(this.turn))
    {
      this.game_over  = true;
      this.turn = this.turn == "white" ? "black" : "white";
      alert("GAME OVER!" + this.turn + " WINS!");
      $(".square").unbind('click');
    }
    return true;
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
        $('#error_label').text('not your turn');
        return;
      }
      var row = $(this).parent().index();
      var column = $(this).index();
      pickedPiece = !pickedPiece;
      if (pickedPiece) {
        self.startCoord = [row, column];
        $(this).addClass('highlight');
      } else {
        self.endCoord = [row, column];
        $('.square').removeClass('highlight');
        if (game.move(self.color, self.startCoord, self.endCoord))
        {
          $.post( "/move",
          { sx: self.startCoord[0],
            sy: self.startCoord[1],
            ex: self.endCoord[0],
            ey: self.endCoord[1]
          });
        }
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
g.get_game_status("g");