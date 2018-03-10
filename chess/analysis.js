require('../util');
const { get_pieces, forward_board, get_square } = require('./board');
const { display_move } = require('./display');
const piece_moves = require('./move_to_rule');

const is_draw = (board, moves, is_white) => {
  let wpieces = get_pieces(board, true);
  let bpieces = get_pieces(board, false);

  if(wpieces.length == 1 && bpieces.length == 1)
    return true;

  if(moves.length >= 50) {
    let last_three_turns = moves
      .map(display_move)
      .tuple(4)
      .slice(-3, -1)
      .map(tu => tu.reduce((a, b) => a+b, ''));

    if(last_three_turns.all_same()) {
      return true;
    }
  }

  let no_check = !piece_moves.is_king_in_check(board, moves, is_white)

  let no_moves = get_pieces(board, is_white)
    .map(p => piece_moves[p.piece](p.square, board, moves, is_white)
    .map(m => ({ from: p.square, to: m, prom: null })))
    .flatten()
    .length == 0

  return no_check && no_moves;

};

const is_pawn_promotion = (board, move) => {
  let sq = board[move.from[0]][move.from[1]];
  if(sq == 1 && move.to[0]  == 0) return true;
  if(sq == -1 && move.to[0] == 7) return true;

  return false;
};

const who_won = (board) => {
  return piece_moves.is_king_in_check(board, [], true)
    ? -1 : 1;
};

const is_equal = (board_a, board_b) => {
  for(let i = 0; i < board_a.length; i++)
  for(let j = 0; j < board_a[0].length; j++) {
    if(board_a[i][j]  != board_b[i][j]) return false;
  }

  return true;
}

const get_score = (board) => 
  board.reduce((a, row) => a + row.sum(), 0);

module.exports = {
  is_draw,
  is_pawn_promotion,
  who_won,
  get_score
};
