import React from 'react';

//TODO score
/**
 * Board component of tic tac toe
 */
class App extends React.Component {
  #PLAYER_1_SIGN = 'X';
  #PLAYER_2_SIGN = 'O';
  #NO_SIGN = ' ';
  #START_STATE = {
    'turn' : 0,
    'haveWon': 0,
    'human': true //true means both players are human
  };
  constructor(props)
  {
    super(props);
    var size = props.boardSize ? props.boardSize : 3;
    this.#START_STATE['BOARD_SIZE'] = size;
    this.#START_STATE['board'] = new Array(size * size).fill(this.#NO_SIGN);
    this.state = {...this.#START_STATE};
  };
  reset(e) {this.setState({...e.#START_STATE});}
  flatten(x, y)  {return this.state.BOARD_SIZE * x + y};
  isRowWinning(board, start, inc_vec) {    
    let [currX, currY] = start;
    let nextX = currX + inc_vec[0]; let nextY = currY + inc_vec[1];
    for (let times = 0;times < this.state.BOARD_SIZE - 1;times++) {
      
      if (board[this.flatten(currX, currY)] === this.#NO_SIGN || 
          board[this.flatten(currX, currY)] !== board[this.flatten(nextX, nextY)]) {
          return false;
      }
      currX = nextX; currY = nextY;
      nextX = currX + inc_vec[0]; nextY = currY + inc_vec[1];
    }
    return true;
  }

  updateWin(board) {
    if (!this.state.haveWon) {
      let start_inc_vec = [ [[0,0], [1, 0]], [[0,0], [0, 1]], [[0,0], [1, 1]],
                            [[0,2], [1, 0]], [[0,2], [1, -1]],
                            [[2,0], [0, 1]],
                            [[0,1], [1, 0]],
                            [[1,0], [0, 1]]
                      ];
      for (const streak_opt of start_inc_vec) {
        if (this.isRowWinning(board, streak_opt[0], streak_opt[1])) {
          this.setState({'haveWon': this.state.turn + 1})
        }
      }
    }
  };
  onBoardClick(props)
  {
    if (!this.state.haveWon) {
      if (this.state.board[props.idx] === this.#NO_SIGN) {
        this.setState(state => {
          const board = state.board.map((item, j) => {
            if (j === props.idx) {
              if (this.state.turn === 0) {
                return this.#PLAYER_1_SIGN;
              } else {
                return this.#PLAYER_2_SIGN;
              }
            } else {
              return item;
            }
          });

          const turn = ((this.state.turn + 1) % 2);
          return {
            board, turn
          };
        });
      }
      let currBoard = this.state.board.slice();
      currBoard[props.idx] = this.state.turn === 0 ? this.#PLAYER_1_SIGN : this.#PLAYER_2_SIGN;
      this.updateWin(currBoard);
    }
  }

  changeMode(props) {
    props.target.setState({'human': props.value});
  }

  Square(props) {
    let sign;
    if (this.state.board[props.idx] === this.#NO_SIGN) {
      sign = './toe.png';
    } else if (this.state.board[props.idx] === this.#PLAYER_1_SIGN){
      sign = './tic.png';
    } else {
      sign = './tac.png';
    }
    let style = {
      'backgroundImage': sign,
      'height': '30px',
      'width': '30px',
      'borderColor':'black',
      'border':'10px',
      'padding':'5px'
    };
    return (
        <button  key={String(props.idx)} className="square" onClick={props.onClick}>
          <img src={sign} style={style} alt=''/>
        </button>
      );
    }

  render() {
    let grid = [];
    for (let i=0;i<this.state.board.length;i++) {
      grid.push( this.Square({'value':this.NO_SIGN, 
                             'onClick': e => this.onBoardClick({'event':e, 'idx':i}), 
                             'idx': i}));
      
    }
    return (
      <div>
        <div>
          The current player: {this.state.turn == 0 ? this.#PLAYER_1_SIGN : this.#PLAYER_2_SIGN}
        </div>
        <div className="board-row">
          {grid[0]}
          {grid[1]}
          {grid[2]}
        </div>
        <div className="board-row">
          {grid[3]}
          {grid[4]}
          {grid[5]}
        </div>
        <div className="board-row">
          {grid[6]}
          {grid[7]}
          {grid[8]}
          <br/>
        </div>
        <div className="mode">
          Play with: 
          <br/>
          <button key='mode' onClick={() => this.changeMode({'target':this, 'value':true})}>
            HUMAN
          </button>
          <button key='mode' onClick={() => this.changeMode({'target':this, 'value':false})}>
            LIZARDBOT
          </button>
        </div>
        <div className="reset">
          <button  key='reset' onClick={() => this.reset(this)} >
          Reset baby
          </button>
        </div>
      </div>
    );
  }
}

export default App;