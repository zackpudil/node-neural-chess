const { 
  stays_on_board,
  does_not_take_own,
  does_not_jump_lat,
  does_not_jump_diag, 
  can_take_diag,
  can_be_blocked,
  can_castle
} = require('./rules');

const {
  pawn,
  bishop,
  knight,
  rook,
  king
} = require('./moves');

const {
  get_pieces,
  get_squares,
  forward_board
} = require('./board');

const { display_board, display_move, display_square } = require('./display');

const is_square_under_attack = (square, board, hmoves, is_white) => 
  get_pieces(board, !is_white)
    .map(p => piece_moves[p.piece](p.square, board, hmoves, !is_white, false)
        .filter(m => m[0] == square[0] && m[1]  == square[1]))
    .flatten()
    .length != 0;

const is_king_in_check = (board, hmoves, is_white) =>
  is_square_under_attack(get_squares(board, 6, is_white)[0], board, hmoves, is_white);

const piece_moves = {
  1: (square, board, hmoves, is_white, king_check = true) => {
    let moves = stays_on_board(pawn(...square, is_white));

    if(king_check)
      moves = can_take_diag(square, moves, board, is_white);

    moves = can_be_blocked(square, moves, board, is_white);

    if(king_check) {
      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });
    }

    return moves;
  },
  2: (square, board, hmoves, is_white, king_check = true) => {
    let moves = stays_on_board(knight(...square));
    moves = does_not_take_own(moves, board, is_white);

    if(king_check) {
      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });
    }

    return moves;
  },
  3: (square, board, hmoves, is_white, king_check = true) => {
    let moves  = stays_on_board(bishop(...square));
    moves = does_not_jump_diag(square, moves, board, is_white);

    if(king_check) {
      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });
    }

    return moves;
  },
  4: (square, board, hmoves, is_white, king_check = true) => {
    let moves = stays_on_board(rook(...square));
    moves = does_not_jump_lat(square, moves, board, is_white);

    if(king_check) {
      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });
    }

    return moves;
  },
  5: (square, board, hmoves, is_white, king_check = true) => {
    let bmoves = stays_on_board(bishop(...square));
    bmoves = does_not_jump_diag(square, bmoves, board, is_white);

    let rmoves = stays_on_board(rook(...square));
    rmoves = does_not_jump_lat(square, rmoves, board, is_white);

    let moves = rmoves.concat(bmoves);

    if(king_check) {
      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });
    }

    return moves;
  },
  6: (square, board, hmoves, is_white, king_check = true) => {
    let moves = stays_on_board(king(...square));
    moves = does_not_take_own(moves, board, is_white);

    if(king_check) {
      moves = can_castle(square, moves, board, is_white,
        !is_king_in_check(board, hmoves, is_white)
        && !hmoves.some(m => 
            (is_white ? m.from[0] == 7 : m.from[0] == 0)
            && (m.from[1] == 4 || m.from[1] == 0 || m.from[1] == 7)));

      moves = moves.filter(m => {
        let v_board = forward_board(board, { from: square, to: m });
        return !is_king_in_check(v_board, hmoves, is_white);
      });

      moves = moves.filter(([a, b]) => {
        if(b == square[1]+2) {
          return !is_square_under_attack([a, b], board, hmoves, is_white)
            && !is_square_under_attack([a, b-1], board, hmoves, is_white);
        }

        if(b == square[1]-2) {
          return !is_square_under_attack([a, b], board, hmoves, is_white)
            && !is_square_under_attack([a, b+1], board, hmoves, is_white);
        }

        return true;
      });
    }

    return moves;
  }
};

piece_moves.is_king_in_check = is_king_in_check;

module.exports = piece_moves;
