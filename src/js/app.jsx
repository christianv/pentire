var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var CustomLink = React.createClass({
  getDefaultProps: function () {
    return { activeClassName: 'p-active' };
  },
  render: function () {
    return <Link {...this.props}>{this.props.children}</Link>;
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <header className="p-header">
          <h1>SIS Team Members</h1>
        </header>
        <ul className="p-navigation">
          <li><CustomLink to="game">Game</CustomLink></li>
          <li><CustomLink to="overview">Overview</CustomLink></li>
        </ul>

        <div className="p-container">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

module.exports = App;
