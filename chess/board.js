require ('../util');

const COLUMN_TO_NUMBER_MAP = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
const PIECE_TO_NUMBER_MAP = { ' ': 0, 'p': 1, 'n': 2, 'b': 3, 'r': 4, 'q': 5, 'k': 6 };
const NUMBER_TO_PIECE_MAP = { 0: '  ', 1: 'p', 2: 'n', 3: 'b', 4: 'r', 5: 'q', 6: 'k' };

const { display_move } = require('./display');

const init_board = () =>  [
  [-4, -2, -3, -5, -6, -3, -2, -4],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [ 1,  1,  1,  1,  1,  1,  1,  1],
  [ 4,  2,  3,  5,  6,  3,  2,  4]
];

const get_pieces = (board, is_white) =>
  board
    .map((row, i) => row
      .map((sq, j) => {
        if(is_white ? sq > 0 : sq < 0) {
          return {
            piece: Math.abs(sq),
            square: [i, j]
          }
        }
      }))
      .flatten()
      .prune();

const get_squares = (board, piece, is_white) =>
  board.map((row, i) => row.map((sq, j) => {
    let np = piece*(is_white ? 1 : -1);
    if(np === sq) return [i, j];
  }))
  .flatten()
  .prune();

const get_move = (move_str) => ({
  from: [8 - parseInt(move_str.substr(1, 1)), COLUMN_TO_NUMBER_MAP[move_str.substr(0, 1)]],
  to: [8 - parseInt(move_str.substr(3, 1)), COLUMN_TO_NUMBER_MAP[move_str.substr(2, 1)]],
  prom: move_str.substr(4, 1) ? PIECE_TO_NUMBER_MAP[move_str.substr(4, 1)] : 5
});

const kingRookCastle = (w) => ({ from: [w ? 7 : 0, 7], to: [w ? 7 : 0, 5] });
const queenRookCastle = (w) => ({ from: [w ? 7 : 0, 0], to: [w ? 7 : 0, 3] });

const forward_board = (board, move) => {
  let new_board = [...board.map(r => r.slice())];
  new_board[move.to[0]][move.to[1]] = new_board[move.from[0]][move.from[1]];

  new_board[move.from[0]][move.from[1]] = 0;

  if(move.prom && move.prom != 5) {
    console.log(move.prom);
  }

  let sq = new_board[move.to[0]][move.to[1]];
  if(sq == 1 && move.to[0]  == 0) new_board[move.to[0]][move.to[1]] = move.prom ? move.prom : 5;
  if(sq == -1 && move.to[0] == 7) new_board[move.to[0]][move.to[1]] = move.prom ? -move.prom : -5;

  if(sq == 6) {
    if(display_move(move) == 'e1g1') new_board = forward_board(new_board, kingRookCastle(true))
    if(display_move(move) == 'e1c1') new_board = forward_board(new_board, queenRookCastle(true))
  }

  if(sq == -6) {
    if(display_move(move) == 'e8g8') new_board = forward_board(new_board, kingRookCastle(false))
    if(display_move(move) == 'e8c8') new_board = forward_board(new_board, queenRookCastle(false))
  }

  if(sq == 1) {
    if(move.to[0] == 2
      && (move.from[1] == move.to[1] +1 || move.from[1] == move.to[1] - 1)
      && new_board[3][move.to[1]] == -1
      && board[move.to[0]][move.to[1]] == 0 ){
      new_board[3][move.to[1]] = 0;
    }
  }

  if(sq == -1) {
    if(move.to[0] == 5
      && (move.from[1] == move.to[1] +1 || move.from[1] == move.to[1] - 1)
      && new_board[4][move.to[1]] == 1
      && board[move.to[0]][move.to[1]] == 0) {
      new_board[4][move.to[1]] = 0;
    }
  }

  return new_board;
};

module.exports = {
  init_board,
  get_pieces,
  get_squares,
  get_move,
  forward_board
};
