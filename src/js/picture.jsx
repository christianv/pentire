var React = require('react');

var Picture = React.createClass({
  render: function(){
    return (
      <div className="p-picture-container">
        <img className="p-picture-image" src={this.props.data.image} />
        <div>{this.props.data.name}</div>
      </div>
    );
  }
});

module.exports = Picture;
