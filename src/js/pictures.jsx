var React = require('react');
var Picture = require('./picture.jsx');

module.exports = React.createClass({
  render() {
    return (
      <div className="p-pictures-container">
        {this.props.pictures.map(function(picture) {
          return <Picture key={picture.image} data={picture}/>;
        })}
      </div>
    );
  }
});
