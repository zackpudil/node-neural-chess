require('../util');
const { init_game, make_move }  = require('./game');
const { get_best_move } = require('./engine');
const { display_board } = require('./display');

class ChessGame {
  constructor() {
    this.game = init_game();
    this.options = {
      white: ChessGame.random,
      black: ChessGame.engine(8),
      on_turn: (board, move) => { },
    };
  }

  static engine(depth, prog = () => {}) {
    return async (game) => 
      await get_best_move(game.move_history, depth, prog);
  }

  static async random(game) {
    return game.moves_next.random();
  }

  static displayBoard(board) { 
    return display_board(board);
  }

  configure(options) {
    this.options = Object.assign({}, this.options, options);
  }

  async play() {
    var move;
    while(!this.game.is_over) {
      move = await this.take_turn();
      this.options.on_turn(this.game.board, move);
    }

    return this.game.winning_side;
  }

  async take_turn() {
    let mv = this.game.is_white ?
      await this.options.white(this.game) :
      await this.options.black(this.game);

    this.game = make_move(this.game, mv);
    return mv;
  }
}

module.exports = ChessGame;
