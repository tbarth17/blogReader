(function() {
  'use strict';

  var Post = Backbone.Model.extend({
    idAttribute: '_id'
  });

  var Posts = Backbone.Collection.extend({
    model: Post,
    url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
  });

  var PostDetailView = Backbone.View.extend({
    template: _.template($('#post-view-template').text()),

    initialize: function(options) {
      options = options || {};
      this.$container = options.$container;
      this.$container.append(this.$el);
      this.render();
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    }

  });

  var BlogTitleListView = Backbone.View.extend({
    tagName: 'ul',

    template: _.template($('#post-list-template').text()),

    initialize: function(options){
      options = options || {};
      this.$container = options.$container;
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.collection, 'add remove', this.renderChildren);
    },

    render: function(){
      this.$el.html(this.template());
    },

    renderChildren: function(){
      this.itemViews = this.itemViews || [];
      _.invoke(this.itemViews, 'remove');

      var self = this;
      this.collection.each(function(child){
        var childView = new BlogTitlesView({
          model: child,
          $container: self.$el
        });
        self.itemViews.push(childView);
      });
    }
  });

  var BlogTitlesView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#post-item-template').text()),

    initialize: function(options){
      options = options || {};
      this.$container = options.$container;
      this.$container.append(this.el);
      this.render();
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });


  var AppRouter = Backbone.Router.extend({
    routes: {
      'posts/:id': 'showPost',
    },

    initialize: function(){
      this.collection = new Posts();
      new BlogTitleListView({$container: $('.title-list-container'), collection: this.collection});
      this.postsAreFetched = this.collection.fetch();
    },

    showPost: function(id){
      $('.content').empty();
      var self = this;
      this.postsAreFetched.done(function(posts){
        var post = self.collection.get(id);
        new PostDetailView({
          model: post,
          $container: $('.content')
        });
      });
    }
  });

$(document).ready(function() {
  var appRouter = new AppRouter();
  Backbone.history.start();
});



})();
