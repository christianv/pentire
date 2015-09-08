var React = require('react');

var Picture = React.createClass({
  render: function(){
    return (
      <div className="p-picture-container">
        <img className="p-picture-image" src={this.props.data.image} />
        <div className={this.props.hideName ? 'p-hidden' : ''}>{this.props.data.name}</div>
      </div>
    );
  }
});

module.exports = Picture;
