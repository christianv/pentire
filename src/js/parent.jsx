var React = require('react');
var Picture = require('./picture.jsx');
var $ = require('jquery');

var Parent = React.createClass({
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
      <div>
        <h1>SIS Team Members</h1>
        <ul className="pictures-container">
          {this.state.pictures.map(function(picture) {
            return <Picture key={picture.image} data={picture}/>;
          })}
        </ul>
      </div>
    );
  }
});
module.exports = Parent;
