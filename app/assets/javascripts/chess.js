window.Chess = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var codeView = new JA.Views.CodeView();

    $('#annot').html(postsView.render().$el);
  }
};

$(document).ready(function(){
  Chess.initialize();
});
