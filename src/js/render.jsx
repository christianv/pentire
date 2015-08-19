var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./app.jsx');
var Game = require('./game.jsx');
var Overview = require('./overview.jsx');

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute name="game" handler={Game} />
    <Route name="overview" handler={Overview} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById('app'));
});

