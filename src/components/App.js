import React from 'react';

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
  /**
  * Constructor for this class
  * @param  {Array} props contains board size
  */
  constructor(props)
  {
    super(props);
    var size = props.boardSize ? props.boardSize : 3;
    this.#START_STATE['BOARD_SIZE'] = size;
    this.#START_STATE['board'] = new Array(size * size).fill(this.#NO_SIGN);
    this.state = {...this.#START_STATE};
  };
  /**
  *reset rreverts the object its starting state
  * @param  {[App]} e [the object to revert]
  */
  reset(e) {this.setState({...e.#START_STATE});}
  /**
 * [someFunction description]
 * @param  {Number} x the x coordinate on a 2d board
 * @param  {Number} y the y coordinate on a 2d board
 * @return {Number} the coordinate in a 1d board
 */
  flatten(x, y)  {return this.state.BOARD_SIZE * x + y};
  /**
 * Converts a turn number into the matching sign
 * @param  {Number} turn the turn to convert
 * @return {String} the matching turn
 */
  turnToSign(turn) {
    if (turn === 0) {
      return this.#PLAYER_1_SIGN;
    }
    return this.#PLAYER_2_SIGN;
  }
/**
 * This function checks if three slots are a sreak
 * @param  {Array} board the current board
 * @param  {Number} start the start slot
 * @param {Array} inc_vec the increment of every coordinate
 * @return {boolean} true if its a streak, false otherwise
 */
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
/**
 * This function checks if a given board has a streak
 * @param  {Array} board the board to check
 * @return {boolean} true if has streak, false otherwise
 */
  hasStreak(board) {
    for (const streak_opt of this.#START_INC_VEC) {
      if (this.checkStreak(board, streak_opt[0], streak_opt[1])) {
        return true;
      }
    }
    return false;
  }
  /**
  * This function checks if a given board has a fork
 * @param  {Array} props contains the board
 * @return {boolean} true if has fork, false otherwise
 */
  hasFork(props) {
    let fork = false;
    switch(props.moveIdx) {
      case 0:
        fork = (props.board[0] === props.board[1] && props.board[0] === props.board[3])
        break;
      case 1:
        fork = (props.board[1] === props.board[2] && props.board[1] === props.board[4])
          || (props.board[1] === props.board[0] && props.board[1] === props.board[4]);
        break;
      case 2:
        fork = (props.board[2] === props.board[1] && props.board[2] === props.board[5]);
        break;
      case 3:
        fork = (props.board[3] === props.board[0] && props.board[3] === props.board[4]) ||
          (props.board[3] === props.board[6] && props.board[3] === props.board[4]);
        break;
      case 4:
        fork = (props.board[4] === props.board[3] && props.board[4] === props.board[1]) ||
          (props.board[4] === props.board[3] && props.board[4] === props.board[7]) ||
          (props.board[4] === props.board[5] && props.board[4] === props.board[1]) ||
          (props.board[4] === props.board[5] && props.board[4] === props.board[7]);
        break;
      case 5:
        fork = (props.board[5] === props.board[4] && props.board[5] === props.board[2]) ||
          (props.board[5] === props.board[4] && props.board[5] === props.board[8]);
        break;
      case 6:
        fork = (props.board[6] === props.board[3] && props.board[6] === props.board[7]);
        break;
      case 7:
        fork = (props.board[7] === props.board[4] && props.board[7] === props.board[8]) ||
          (props.board[7] === props.board[4] && props.board[7] === props.board[6]);
        break;
      case 8:
        fork = (props.board[8] === props.board[7] && props.board[8] === props.board[5]);
        break;
      default:
        break;
    }
    //yes, this is a very lazy solution, I know, the semester started, okay?
    return fork
  }
/**
 * Cheks and updates if theres a win on the board
 * @param  {Array} board the board to check
 */
  updateWin(board) {
    if (!this.state.haveWon) {
      if (this.hasStreak(board)) {
          this.setState({'haveWon': this.state.turn + 1})
      }
    }
  };
/**
 * Makes a given move in the board
 * @param  {Array} props should contain board and move
 */
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
  /**
 * Checks if a given index is a corner slot
 * @param  {Number} idx the index to check
 * @return {boolean} true if corner, false otherwise
 */
  isCorner = (idx) => {
    //relies on the fact in every square board the edges are in a place determined by the edge length
    return idx === 0 || idx === (this.BOARD_SIZE - 1) 
            || idx === (this.state.board.length - 1) || idx === (this.state.board.length - this.state.BOARD_SIZE);
  }
 /**
 * Checks if a given index is a center slot
 * @param  {Number} idx the index to check
 * @return {boolean} true if center, false otherwise
 */
  isCenter = (idx) => {
    return idx === Math.ceil(this.state.board.length / 2) - 1;
  }
 /**
 * Checks if a given index is a side slot
 * @param  {Number} idx the index to check
 * @return {boolean} true if side, false otherwise
 */
  isSide = (idx) => {
    return !(this.isCenter(idx) || this.isCorner(idx));
  }
/**
 * Returns a bot move
 * @param  {Array} props contains the current board and the move the bot makes
 * @return {Number} index of the bot move
 */
  getBotMove(props) {
    //This is an implementation of Newell and Simon's 1972 perfect tic-tac-toe player
    let tempBoard = props.board.slice();
    let options = [];
    for (let boardIdx = 0; boardIdx < tempBoard.length; boardIdx++) {
      if (tempBoard[boardIdx] === this.#NO_SIGN) {
          options.push(boardIdx);
      }
    }
    //check if can win
    for (const option of options) {
      tempBoard[option] = this.turnToSign(props.turn);
      if (this.hasStreak(tempBoard)) {
        return option;
      }
      tempBoard[option] = this.#NO_SIGN;
    }
    //check if can block
    for (const option of options) {
      tempBoard[option] = this.turnToSign((props.turn + 1) % 2);
      if (this.hasStreak(tempBoard)) {
        return option;
      }
      tempBoard[option] = this.#NO_SIGN;
    }
    //check if can fork
    for (const option of options) {
      tempBoard[option] = this.turnToSign(props.turn);
      if (this.hasFork({'board': tempBoard, 'moveIdx': option})) {
        return option;
      }
      tempBoard[option] = this.#NO_SIGN;
    }
    //check f can block fork
    for (const option of options) {
      tempBoard[option] = this.turnToSign((props.turn + 1) % 2);
      if (this.hasFork({'board': tempBoard, 'moveIdx': option})) {
        return option;
      }
      tempBoard[option] = this.#NO_SIGN;
    }
    //center
    for (const option of options) {
      if (this.isCenter(option)) {
        return option;
      }
    }
    //opposite corner
    for (const option of options) {
      if (this.isCorner(option)) {
        let goodOption =  false;
        switch (option) {
          case 0:
            if (tempBoard[8] === this.turnToSign((props.turn + 1) % 2)) {
              goodOption = true;
            }
            break;
          case 8:
            if (tempBoard[0] === this.turnToSign((props.turn + 1) % 2)) {
              goodOption = true;
            }
            break;
          case 2:
            if (tempBoard[6] === this.turnToSign((props.turn + 1) % 2)) {
              goodOption = true;
            }
            break;
          case 6:
            if (tempBoard[2] === this.turnToSign((props.turn + 1) % 2)) {
              goodOption = true;
            }
            break;
          default:
            break;
        }
        if (goodOption) {return option;};
      }
    }
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
/**
 * Handles board clicks
 * @param  {Array} props contains the selected index
 */
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
/**
 * Change mode to bot or human
 * @param  {Array} props The mode to change to
 */
  changeMode(props) {
    if (props.value !== -1) { //moved to bot mode
        let move = this.getBotMove({'board': this.state.board.slice(), 'turn':this.state.turn});
        this.move({'idx':move, 'turn':props.value});
    }
    props.target.setState({'bot': props.value});
  }
/**
 * [someFunction description]
 * @param  {Array} props contains idx of the board
 * @return {Square} Square component
 */
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
  /**
 * Returns the message displayed at top of game
 * @return {String} the message to display at the top
 */
  getHeadMsg() {
      if (this.state.haveWon) {
        if (this.state.haveWon === 1) {
              return `Player ${this.#PLAYER_1_SIGN} has won`;
		}
        else {
            return `Player ${this.#PLAYER_2_SIGN} has won`;
		}
	  } else {
        if (this.state.turn === 0) {
              return `The current player is ${this.#PLAYER_1_SIGN}`;
		}
        else {
            return `The current player is ${this.#PLAYER_2_SIGN}`;
		}
	  }
  }
/**
 * Renders the app component
 * @return {App} The app component
 */
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