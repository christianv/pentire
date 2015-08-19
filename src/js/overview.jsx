var React = require('react');
var Picture = require('./picture.jsx');
var $ = require('jquery');

var Overview = React.createClass({
  getInitialState() {
    return {
      pictures: []
    };
  },
  componentDidMount() {
    let url = 'https://sisteam.herokuapp.com/api/pictures';
    $.get(url, function(result) {
      if (this.isMounted()) {
        this.setState({
          pictures: result.pictures
        });
      }
    }.bind(this));
  },
  render() {
    return (
      <ul className="p-pictures-container">
        {this.state.pictures.map(function(picture) {
          return <Picture key={picture.image} data={picture}/>;
        })}
      </ul>
    );
  }
});
module.exports = Overview;
