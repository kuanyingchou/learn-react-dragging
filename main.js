import React, { Component } from 'react';
import { render } from 'react-dom';
import {Motion, spring} from 'react-motion';

const colors = ['#FC7753', '#66D7D1', '#DBD56E', '#F2EFEA', '#403D58'];

class Cell extends Component {
  handleMouseDown(e) {
    e.preventDefault();
    console.log('mouse down');
  }
  getStyle(scale, x, y) {
    return {
      position: 'absolute', 
      width: 100, 
      height: 100,
      background: colors[this.props.id % colors.length],
      left: x,
      top: y,
      border: `5px solid ${colors[3]}`,
      borderRadius: '5px',
      WebkitUserSelect: 'none',
      transform: `scale(${scale})`,
      zIndex: this.props.front?10:1,
      fontFamily: 'monospace'
    };
  }
  render() {
    let front = this.props.front;
    let scale = 3; //window.innerWidth / 100;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let width = 100;
    let height = 100;

    let bgStyle = { //TODO: move to parent
      position: 'absolute',
      background: 'black',
      opacity: 0.5,
      width: windowWidth,
      height: windowHeight,
      zIndex: 5
    };

    let content = 
      <Motion 
        defaultStyle = {{
          s: 1,
          x: this.props.x,
          y: this.props.y,
        }}
        style = {{
          s: spring(front ? scale : 1),
          x: spring(front ? windowWidth/2-width/2 : this.props.x),
          y: spring(front ? windowHeight/2-height/2 : this.props.y)
        }}
        >
        {({s, x, y}) =>
          <div 
            key={this.props.id} 
            style={ this.getStyle(s, x, y) }
            onClick={ (e)=>this.props.onClick(e, this.props.id) }
            onDoubleClick={ (e)=>this.props.onDoubleClick(e, this.props.id) }
            onMouseDown={ (e)=>this.props.onMouseDown(e, this.props.id) }
            onMouseUp={ (e)=>this.props.onMouseUp(e, this.props.id) }
            >
            <div>id: {this.props.id}</div> 
            <div>position: {`(${this.props.x}, ${this.props.y})`} </div>
            <div>front: {front?'true':'false'} </div>
          </div>
        }
      </Motion>
    ;
    let res = null;
    if(front) {
      res = 
        <div>
          <div 
            style={ bgStyle }
            onMouseDown={ (e)=>this.props.onMouseDown(e, this.props.id) }
            onMouseUp={ (e)=>this.props.onMouseUp(e, this.props.id) }
            > </div>
          { content }
        </div>
      ;
    } else {
      res = content;
    }
    return ( <div> { res } </div> );
  }
}

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
  
