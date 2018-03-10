require('../util');
const {
  init_board,
  get_pieces,
  get_squares,
  get_move,
  forward_board
} = require('./board');

const {
  is_draw,
  who_won,
  is_pawn_promotion
} = require('./analysis');

const {
  display_board,
  display_square,
  display_move
} = require('./display');

const piece_moves = require('./move_to_rule');
const { get_best_move } = require('./engine');

const init_game = () => {
  let game = {
    is_white: true,
    board: init_board(),
    move_history: [],
    is_over: false,
    winning_side: 0
  };

  game.moves_next = get_moves(game);

  return game;
};

const get_moves = (game) => {
  let { board, is_white, move_history } = game; 
  let moves = move_history.map(get_move);

  return get_pieces(board, is_white)
    .map(p => piece_moves[p.piece](p.square, board, moves, is_white)
    .map(m => ({ from: p.square, to: m, prom: null })))
    .flatten()
    .map(mo => display_move(mo) + (is_pawn_promotion(board, mo) ? 'q' : ''));
}

const make_move = (game, move) => {
  game.board = forward_board(game.board, get_move(move));
  game.is_white = !game.is_white;
  game.moves_next = get_moves(game);
  game.move_history = [...game.move_history, move];

  let draw = is_draw(game.board, game.move_history.map(get_move), game.is_white);

  game.is_over = game.moves_next.length == 0 || draw;
  game.winning_side = draw ? 0 : who_won(game.board);

  return game;
};

module.exports = {
  init_game,
  get_moves,
  make_move
};
