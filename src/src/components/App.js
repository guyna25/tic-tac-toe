import React from 'react';

//TODO score
/**
 * Board component of tic tac toe
 */
class App extends React.Component {
  #PLAYER_1_SIGN = 'X';
  #PLAYER_2_SIGN = 'O';
  #NO_SIGN = null;
  #START_INC_VEC = [ [[0,0], [1, 0]], [[0,0], [0, 1]], [[0,0], [1, 1]],
                            [[0,2], [1, 0]], [[0,2], [1, -1]],
                            [[2,0], [0, 1]],
                            [[0,1], [1, 0]],
                            [[1,0], [0, 1]]
                      ];
  #START_STATE = {
    'turn' : 0,
    'haveWon': 0,
    'bot': -1, //-1 means human mode, otherwise it is the bot player's turn
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
  turnToSign(turn) {
    if (turn === 0) {
      return this.#PLAYER_1_SIGN;
    }
    return this.#PLAYER_2_SIGN;
  }

  checkStreak(board, start, inc_vec) {    
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
      for (const streak_opt of this.#START_INC_VEC) {
        if (this.checkStreak(board, streak_opt[0], streak_opt[1])) {
          this.setState({'haveWon': this.state.turn + 1})
        }
      }
    }
  };

  move(props) {
    if (this.state.board[props.idx] === this.#NO_SIGN) {
      this.setState(state => {
        const board = state.board.map((item, j) => {
          if (j === props.idx) {
            if (props.turn === 0) {
              return this.#PLAYER_1_SIGN;
            } else {
              return this.#PLAYER_2_SIGN;
            }
          } else {
            return item;
          }
        });

        const turn = ((props.turn + 1) % 2);
        return {
          board, turn
        };
      });
    }
  }
  
  isCorner = (idx) => {
    //relies on the fact in every square board the edges are in a place determined by the edge length
    return idx === 0 || idx === (this.BOARD_SIZE - 1) 
            || idx === (this.state.board.length - 1) || idx === (this.state.board.length - this.state.BOARD_SIZE);
  }

  isCenter = (idx) => {
    return idx == Math.ceil(this.state.board.length / 2);
  }

  isSide = (idx) => {
    return !(this.isCenter(idx) || this.isCorner(idx));
  }

  getBotMove(props) {
    //This is an implementation of Newell and Simon's 1972 perfect tic-tac-toe player
    //check if can win
    let tempBoard = props.board;
    let options = [];
    for (let boardIdx = 0; boardIdx < tempBoard.length; boardIdx++) {
      if (tempBoard[boardIdx] === this.#NO_SIGN) {
          options.push(boardIdx);
      }
    }
    // for (const streak_opt of this.#START_INC_VEC) {
    //   if (this.checkStreak(board, streak_opt[0], streak_opt[1])) {
    //     this.setState({'haveWon': this.state.turn + 1})
    //   }
    // }
    //check if can block
    //check if can fork
    //check f can block fork
    //opposite corner
    //empty corner
    for (const option of options) {
      if (this.isCorner(option)) {
        return option;
      }
    }
    //empty side
    for (const option of options) {
      if (this.isSide(option)) {
        return option;
      }
    }
    return 1;
  }

  onBoardClick(props)
  {
    if (!this.state.haveWon) {
      let currBoard = this.state.board.slice();
      let nextTurn = (this.state.turn + 1) % 2;
      currBoard[props.idx] = this.state.turn === 0 ? this.#PLAYER_1_SIGN : this.#PLAYER_2_SIGN;
      this.move({'idx':props.idx, 'turn':this.state.turn});
      this.updateWin(currBoard);
      if (this.state.bot !== -1) { //this prevents loop of bot moves
        let botMove = this.getBotMove({'board': currBoard, 'turn':nextTurn});
        this.move({'idx': botMove, 'turn':nextTurn});
        this.forceUpdate();
      }
    }
  }

  changeMode(props) {
    if (props.value !== -1) { //moved to bot mode
        let move = this.getBotMove({'board': this.state.board.slice(), 'turn':this.state.turn});
        this.move({'idx':move, 'turn':props.value});
    }
    props.target.setState({'bot': props.value});
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
  
  getHeadMsg() {
      if (this.state.haveWon) {
        if (this.state.haveWon === 1) {
              return `Player ${this.#PLAYER_1_SIGN} has won`;
		}
        else {
            return `Player ${this.#PLAYER_2_SIGN} has won`;
		}
	  } else {
        if (this.state.turn === 1) {
              return `The current player is ${this.#PLAYER_1_SIGN}`;
		}
        else {
            return `The current player is ${this.#PLAYER_2_SIGN}`;
		}
	  }
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
          {this.getHeadMsg()}
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
          <button key='humanMode' onClick={() => this.changeMode({'target':this, 'value':-1})}>
            HUMAN
          </button>
          <button key='botMode' onClick={() => this.changeMode({'target':this, 'value':this.state.turn})}>
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