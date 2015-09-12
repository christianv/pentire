var React = require('react');

var Picture = React.createClass({
  componentDidUpdate: function () {
    let pictureElement = document.querySelector('.p-picture-image', React.findDOMNode(this));

    pictureElement.className = pictureElement.className.replace(' p-loaded', '');

    let loaded = () => {
      console.log('loaded');
      pictureElement.removeEventListener('load', loaded);
      pictureElement.className = pictureElement.className.replace(' p-animate-correct', '').replace(' p-animate-incorrect', '');
      pictureElement.className = pictureElement.className + ' p-loaded';
    };

    pictureElement.addEventListener('load', loaded);
  },
  shouldComponentUpdate: function(nextProps) {
    return nextProps.data.image !== this.props.data.image;
  },
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
