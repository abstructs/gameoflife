'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
require('./style.css');

var MainContainer = React.createClass({
  getInitialState: function() {
    return {
      boardSize: {x: 49, y: 50},
      boardArray: [],
      generation: 0,
      startGame: false,
      intervalID: undefined
    }
  },
  componentDidMount: function() {
    this.createBoardArray(this.state.boardSize.x, this.state.boardSize.y);
  },
  createBoardArray: function(x, y, status) {
    var board = [];
    var coordinates = {};
    var cell = {}
    var count = 0;
    for (var i = 0; i < y; i++) {
      for (var j = 0; j <= x; j++) {
        cell = {
          coordinates: {
            x: (('0' + j).slice(-2)).toString(),
            y: (('0' + i).slice(-2)).toString()
          },
          status: 'dead'
        }
        board.push({cell});
      }
    }
    this.setState({
      boardArray: board
    });
  },
  nextBoardArray: function() {
    // all this does it create side effects to change the classnames of our board
    this.state.boardArray.map(function(item){
        // get the current element from jQuery
        var currentSelector = $('#' + item.cell.coordinates.y + item.cell.coordinates.x);
        var currentArray = currentSelector.attr('class').split(' ');

        // get neighoring elements from jQuery
        var leftNeighbor = $('#' + item.cell.coordinates.y + ('0' + ((parseInt(item.cell.coordinates.x) - 1).toString()).slice(-2)));
        var rightNeigbhor = $('#' + item.cell.coordinates.y + ('0' + ((parseInt(item.cell.coordinates.x) + 1).toString()).slice(-2)));
        var topNeighbor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) - 1).toString()).slice(-2)) + item.cell.coordinates.x);
        var bottomNeighbor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) + 1).toString()).slice(-2)) + item.cell.coordinates.x);

        var topRightNeighor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) - 1).toString()).slice(-2)) + ('0' + ((parseInt(item.cell.coordinates.x) + 1).toString()).slice(-2)));
        var topLeftNeighor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) - 1).toString()).slice(-2)) + ('0' + ((parseInt(item.cell.coordinates.x) - 1).toString()).slice(-2)));
        var bottomRightNeighor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) + 1).toString()).slice(-2)) + ('0' + ((parseInt(item.cell.coordinates.x) + 1).toString()).slice(-2)));
        var bottomLeftNeighor = $('#' + ('0' + ((parseInt(item.cell.coordinates.y) + 1).toString()).slice(-2)) + ('0' + ((parseInt(item.cell.coordinates.x) - 1).toString()).slice(-2)));

        // array to calculate the scores for next iteration
        var scoreCheck = [];
        scoreCheck.push(
          leftNeighbor,
          rightNeigbhor,
          topNeighbor,
          bottomNeighbor,
          topRightNeighor,
          topLeftNeighor,
          bottomRightNeighor,
          bottomLeftNeighor
        );
        // if the element is alive
        if (currentArray[1] == 'alive') {
          for (var i = 0; i < scoreCheck.length; i++) {
            // if there is an element that exists in the neighoring position
            if (scoreCheck[i].length == 1) {
              console.log('leftNeighbor: ' + JSON.stringify(leftNeighbor))
              console.log('rightNeigbhor: ' + JSON.stringify(rightNeigbhor))
              console.log('topNeighbor: ' + JSON.stringify(topNeighbor))
              console.log('bottomNeighbor: ' + JSON.stringify(bottomNeighbor))

              console.log('topRightNeighor: ' + JSON.stringify(topRightNeighor))
              console.log('topLeftNeighor: ' + JSON.stringify(topLeftNeighor))
              console.log('bottomRightNeighor: ' + JSON.stringify(bottomRightNeighor))
              console.log('bottomLeftNeighor: ' + JSON.stringify(bottomLeftNeighor))

              // get the score from the class (attr usually returns first element, split allows us to get all of them)
              var score = scoreCheck[i].attr('class').split(' ');
              // iterate on the element
              var iterateScore = (parseInt(score[2]) + 1).toString()
              scoreCheck[i].addClass(iterateScore);
              scoreCheck[i].removeClass(score[2]);
              // remove old class so there aren't two numbers in our class
            }
          }
        }
    });
  },
  renderNextBoard: function() {
    this.state.boardArray.map(function(item){
      var currentSelector = $('#' + item.cell.coordinates.y.toString() + item.cell.coordinates.x.toString());
      var currentArray = currentSelector.attr('class').split(' ');
      // turns dead cells to alive cells
      if (currentArray[1] == 'dead' && currentArray[2] === '3') {
        console.log(currentArray[2])
        currentSelector.addClass('alive 0');
        currentSelector.removeClass('dead 3')
      }
      else if (currentArray[1] === 'alive' && currentArray[2] === '2' || currentArray[2] === '3') {
        // keeps alive cell alive
        currentSelector.removeClass('alive ' + currentArray[2]);
        currentSelector.addClass('alive 0');
      }
      else if ((parseInt(currentArray[2]) > 2 || parseInt(currentArray[2]) < 3) && currentArray[1] == 'dead') {
        // keeps dead cells dead
        currentSelector.removeClass('dead 0 1 2 3 4 5 6 7 8');
        currentSelector.addClass('dead 0');
      }
      else if ((parseInt(currentArray[2]) > 2 || parseInt(currentArray[2]) < 3) && currentArray[1] == 'alive') {
        // turns alive cells into dead cells
        currentSelector.removeClass('alive 0 1 2 3 4 5 6 7 8');
        currentSelector.addClass('dead 0');
      }
    });
  },
  manageGame: function() {
    var that = this;
    var startGame;
    var button = $('#start-game-btn');
    var intervalID;
    if (button.html() === "Start") { button.html("Stop"), startGame = true;}
    else { button.html("Start"), startGame = false;}

    if (startGame === true) {
      var count = this.state.generation;
      this.setState({
        intervalID: setInterval(function() {
                      that.nextBoardArray();
                      that.renderNextBoard();
                      that.setState({
                        generation: count++
                      })
                    }, 100),
      });
    }
    else if (startGame == false) {
      clearInterval(this.state.intervalID);
      if ($('.alive').length === 0) {this.setState({generation: 0})}
    }
    else {
      console.log("Error, start button modified")
    }
  },
  createBoard: function() {
    var count = 1;
    var that = this;
    return this.state.boardArray.map(function(item) {
       return <Box key={count++} coordinates={item.cell.coordinates} />
    });
  },
  render: function() {
    return (
      <div className="container">
        <div id="main-grid" className="jumbotron">
          <h3 id="title-text">Game of Life</h3>
          <p>Generation: {this.state.generation}</p>
          <div>
            {this.createBoard()}
          </div>
        </div>
        <button className="btn btn-default" id="start-game-btn" onClick= {() => { this.manageGame(true) }}>Start</button>
      </div>
    );
  }
});

var Box = React.createClass({
  getInitialState: function() {
    return {
      status: 'dead',
      newClass: 'box dead 0',
      coordinates: this.props.coordinates
    }
  },
  changeStatus: function() {
    var currentSelector = $('#' + this.state.coordinates.y.toString() + this.state.coordinates.x.toString());
    var currentArray = currentSelector.attr('class').split(' ');
    var score = currentArray[2];
    var status = currentArray[1];
    //lets you change cells at any time
    if (status === 'dead') {
      currentSelector.removeClass('dead ' + score);
      currentSelector.addClass('alive ' + score);
    }
    else if (status === 'alive') {
      currentSelector.removeClass('alive ' + score);
      currentSelector.addClass('dead ' + score);
    };
  },
  render: function() {
    return ( // sets id to the value of y and x for that block, helps keep track of where each block is
      // the goal here was to make each block able to manage itself
      <div id={this.state.coordinates.y.toString() + this.state.coordinates.x.toString()} className={this.state.newClass} onClick={this.changeStatus}>
      </div>
    )
  }
});
ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
