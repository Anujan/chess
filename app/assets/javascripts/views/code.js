Chess.Views.CodeVIew = Backbone.View.extend({

    initialize: function(   ){
      this.indexLines();
    },

    events: {
        'click .annot': 'addAnnotation'
    },

    addAnnotation: function (e) {
        var id = $(e.currentTarget);
    },
    
    indexLines: function(){
      var plaintexts = $('.pln');
      
      var newReg = new RegExp("\n")
      var lineNumber = 1;
      
      _.each(plaintexts, function( plain ){
        if( newReg.test( $(plain).html() ) )
        {
          $(plain)
            .addClass('line')
            .attr('data-ln') = lineNumber;
          lineNumber++;
        }
      });
    },

    render: function() {
        var that = this;
        this.$el.html(JST["index"]({lines: that.lineCount }));
        return this;
    }
});