var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
require('./style.css');

var MainContainer = React.createClass({
  getInitialState: function() {
    return {
      boardSize: {x: 37, y: 40},
      newBoard: [],
      test: '',
      generation: 0
    }
  },
  componentDidMount: function() {
    this.setState({
      newBoard: this.createBoardArray(this.state.boardSize.x, this.state.boardSize.y)
    })
  },
  createBoardArray: function(x, y) {
    var board = [];
    var count = 1;
    for (var i = 0; i <= y; i++) {
      for (var j = 0; j <= x; j++) {
        board.push(<Box id={count} key={count++}/>)
      }
    }
    return board
  },
  startGame: function() {
    this.setState({
      generation: 0
    })
  },
  render: function() {
    return (
      <div className="container">
        <div id="main-grid" className="jumbotron">
          {this.state.newBoard}
        </div>
        <button className="btn btn-default" onClick={this.state.startGame}>Start</button>
      </div>
    );
  }
});

var Box = React.createClass({
  getInitialState: function() {
    return {
      status: 'dead',
      clear: false,
      newClass: 'box dead'
    }
  },
  changeStatus: function() {
    if (this.state.status == 'dead') { this.setState({ newClass: 'box alive', status: 'alive'}) }
    else { this.setState({ newClass: 'box dead', status: 'dead' }) };
  },
  render: function() {
    return (
      <div className={this.state.newClass} onClick={this.changeStatus}></div>
    )
  }
});



ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
