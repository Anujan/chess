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
    var self = this;
    if ( data.chat ){
      var chat;
      new_chats = data.chat.slice($( "#chats p" ).length);
      new_chats.forEach(function( e, i, arr) {
        chat = $(document.createElement('p'));
        chat.html(e.color + ": " + e.message);
        $("#chats").append(chat);
      });
    }

    this.apply_moves(data.game.moves);
  },
  start_game: function(data){
    var self = this;
    this.remote_player.color = this.player.color == "white" ? "black" : "white";
    this.turn = 'white';
    $('#error_label').text('Game started, your color is '+ this.player.color);
    this.play();
    this.game_started = true;
    var channel = pusher.subscribe('game_' + data.game.id);
    channel.bind('move', function(data) {
      self.change_state(data);
    });
  },
  get_game_status: function(name){
    var that = name;
    var that = this;
    var lobby = pusher.subscribe('lobby');
    lobby.bind( 'game', function( data ){
      if ( data.status == 'Waiting'){
        $('#turn_label').html("You are white, waiting for black to join.");
        that.player.color = 'white';

      } else {
        that.player.color = that.player.color == 'white' ? 'white' : 'black';
        lobby.unbind('game');
        that.start_game(data);
      }
    });
    $.get("/find");
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
    $("#chat").keypress( function(e){
      if (e.charCode == 13)
      self.send();
    });
    $("#send_chat").on('click', function(){self.send();});
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
  },
  send: function() {
    var text = $("#chat").val();
    var self = this;
    if (text)
    {
      $.post( "/chat",
      {
        chat:
        {
          color: self.color,
          message: text
        }
      });
    }
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
g.get_game_status(g);