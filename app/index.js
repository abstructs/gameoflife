var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
require('./style.css');

var MainContainer = React.createClass({
  getInitialState: function() {
    return {
      boardSize: {x: 9, y: 10},
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
    var coordinates = {};
    var count = 1;
    for (var i = 0; i < y; i++) {
      for (var j = 0; j <= x; j++) {
        coordinates = {
          x: j,
          y: i
        }
        board.push(<Box key={count++} coordinates={coordinates}/>)
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

    //check if cell is alive (only calculates neighbors of alive cells)

    //calculate neighors and determine whether cell will be alive or dead
    var leftNeighbor = $('#' + this.props.coordinates.y + (parseInt(this.props.coordinates.x) - 1).toString()).attr('class').split(' ');
    var rightNeigbhor = $('#' + this.props.coordinates.y + (parseInt(this.props.coordinates.x) + 1).toString()).attr('class').split(' ');
    var topNeighbor = $('#' + (parseInt(this.props.coordinates.y) - 1).toString() + this.props.coordinates.x).attr('class').split(' ');
    var bottomNeighbor = $('#' + (parseInt(this.props.coordinates.y) + 1).toString() + this.props.coordinates.x).attr('class').split(' ');

    var topRightNeighor = $('#' + (parseInt(this.props.coordinates.y) - 1).toString() + (parseInt(this.props.coordinates.x) + 1).toString()).attr('class').split(' ');
    var topLeftNeighor = $('#' + (parseInt(this.props.coordinates.y) - 1).toString() + (parseInt(this.props.coordinates.x) - 1).toString()).attr('class').split(' ');
    var bottomRightNeighor = $('#' + (parseInt(this.props.coordinates.y) + 1).toString() + (parseInt(this.props.coordinates.x) + 1).toString()).attr('class').split(' ');
    var bottomLeftNeighor = $('#' + (parseInt(this.props.coordinates.y) + 1).toString() + (parseInt(this.props.coordinates.x) - 1).toString()).attr('class').split(' ');
    // array to check the "score" of the alive cell
    var scoreCheck = [];



  },

  render: function() {
    return ( // sets id to the value of y and x for that block, helps keep track of where each block is
      // the goal here was to make each block able to manage itself
      <div id={this.props.coordinates.y.toString() + this.props.coordinates.x.toString()} className={this.state.newClass} onClick={this.changeStatus}></div>
    )
  }
});



ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
