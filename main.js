import React, { Component } from 'react';
import { render } from 'react-dom';
import { Motion, spring } from 'react-motion';
import { colors } from './Constants';
import Cell from './Cell';

class Honeycomb extends Component {
  constructor() {
    super();
    this.state = { 
      windowWidth: window.innerWidth,
      oldMouseX: 0,
      oldMouseY: 0,
      mouseX: 0,
      mouseY: 0,
      cells: [
        {x:100, y:100, id:0, holded: false, front:false}, 
        {x:150, y:150, id:1, holded: false, front:false},
        {x:200, y:200, id:2, holded: false, front:false}
      ],
      holdIndex: -1
    };
  }

  handleCellMouseDown(e, idx) {
    e.preventDefault();
    this.setState({
      oldMouseX: e.clientX,
      oldMouseY: e.clientY,
      holdIndex: idx
    });
  }
  handleCellMouseUp(e, idx) {
    if(e.clientX === this.state.oldMouseX &&
        e.clientY === this.state.oldMouseY) {
      
      //console.log('click on cell');
      let newCells = this.state.cells.slice();
      newCells[idx].front = ! newCells[idx].front;
      this.setState({
        cells: newCells, 
        mouseX: e.clientX, 
        mouseY: e.clientY,
        oldMouseX: 0, 
        oldMouseY: 0
      });
    }
  }
  handleCellClick(e, idx) {
    e.preventDefault();
  }
  handleCellDoubleClick(e, idx) {
    e.preventDefault();
  }

  handleMouseMove(e) {
    e.preventDefault();
    //console.log('mouse move');
    let dx = e.clientX - this.state.mouseX;;
    let dy = e.clientY - this.state.mouseY;

    let newState = {
      mouseX: e.clientX, 
      mouseY: e.clientY
    };
    let holdIndex = this.state.holdIndex;
    if(holdIndex >= 0 && !this.state.cells[holdIndex].front) {
      newState.cells = this.state.cells.slice();
      let target = newState.cells[holdIndex];
      target.x += dx;
      target.y += dy;
    }

    this.setState(newState);
  }
  handleMouseUp(e) {
    e.preventDefault();
    this.setState({holdIndex: -1});
  }
  handleClick(e) {
    e.preventDefault();
    //console.log("click");
  }
  handleDoubleClick(e) {
    e.preventDefault();
  }

  handleResize(e) {
    this.setState({ windowWidth: window.innerWidth });
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    let cells = this.state.cells.map(
      (cell) => {
        return (
          <Cell 
            key={cell.id} 
            id={cell.id} 
            onMouseDown={this.handleCellMouseDown.bind(this)}
            onMouseUp={this.handleCellMouseUp.bind(this)}
            onClick={this.handleCellClick.bind(this)}
            onDoubleClick={this.handleCellDoubleClick.bind(this)}
            x={cell.x}
            y={cell.y}
            front={cell.front}
          />
        );
      }
    );
    let style = {
      width: window.innerWidth,
      height: window.innerHeight,
      background: colors[4],
    };
    return (
      <div
        style={style}
        onMouseUp={this.handleMouseUp.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}
        onClick={this.handleClick.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
        >
        { cells }
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Honeycomb />
    );
  }
}

render(
  <App />,
  document.getElementById('root'));
  
