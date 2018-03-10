const stays_on_board = (moves) => 
  moves.filter((m) => {
    for(let i = 0; i < m.length; i++)
      if(m[i] < 0 || m[i] > 7) return false;

    return true;
  });

const does_not_take_own = (moves, board, is_white) => {
  let pred = is_white 
    ? (p) => p <= 0
    : (p) => p >= 0;

  return moves.filter(([a, b]) => pred(board[a][b]));
}

const cuttoff = (mo, sor, pred, board, is_white) => {
  let p = mo.sort(sor).find(([a, b]) => board[a][b] != 0);
  if(p) {
    mo = mo.filter(m => pred(m, p));

    if((is_white && board[p[0]][p[1]] < 0) || (!is_white && board[p[0]][p[1]] > 0))
      mo.push(p);
  }

  return mo;
};

const does_not_jump_lat = (start, moves, board, is_white) => {
  let rm = cuttoff(moves.filter(m => m[1] < start[1]),
    (a, b) => b[1] - a[1], (m, p) => m[1] > p[1], board, is_white);

  let lm = cuttoff(moves.filter(m => m[1] > start[1]),
    (a, b) => a[1] - b[1], (m, p) => m[1] < p[1], board, is_white);

  let tm = cuttoff(moves.filter(m => m[0] < start[0]),
    (a, b) => b[0] - a[0], (m, p) => m[0] > p[0], board, is_white);

  let bm = cuttoff(moves.filter(m => m[0] > start[0]),
    (a, b) => a[0] - b[0], (m, p) => m[0] < p[0], board, is_white);

  return rm.concat(lm).concat(tm).concat(bm);
};

const does_not_jump_diag = (start, moves, board, is_white) => {
  let rtm = cuttoff(moves.filter(m => m[0] < start[0] && m[1] < start[1]),
    (a, b) => b[1] - a[1], (m, p) => m[1] > p[1], board, is_white);

  let ltm = cuttoff(moves.filter(m => m[0] < start[0] && m[1] > start[1]),
    (a, b) => a[1] - b[1], (m, p) => m[1] < p[1], board, is_white);

  let rbm = cuttoff(moves.filter(m => m[0] > start[0] && m[1] < start[1]),
    (a, b) => b[1] - a[1], (m, p) => m[1] > p[1], board, is_white);

  let tbm = cuttoff(moves.filter(m => m[0] > start[0] && m[1] > start[1]),
    (a, b) => a[1] - b[1], (m, p) => m[1] < p[1], board, is_white);

  return rtm.concat(ltm).concat(rbm).concat(tbm);
};

const can_take_diag = (start, moves, board, is_white) =>
  moves.filter(([a, b]) => {
    if(b == start[1]+1 || b == start[1]-1) {
      return (is_white && board[a][b] < 0) || (!is_white && board[a][b] > 0)
    }
    return true;
  });

const can_be_blocked = (start, moves, board, is_white) => 
  moves.filter(([a, b]) => {
    if(b == start[1]) {
      let m = is_white ? -1 : 1;
      if(a == start[0] + m*1) return board[a][b] == 0;
      if(a == start[0] + m*2) return board[a][b] == 0 && board[a-m*1][b] == 0;
    }
    return true;
  });

const can_castle = (start, moves, board, is_white, permitted) => {
  if(permitted) {
    let col = is_white ? 7 : 0;
    if(start[0] == col && start[1] == 4) {
      if(!(board[col][5] == 0 && board[col][6] == 0 && Math.abs(board[col][7]) == 4))
        moves = moves.filter(([a, b]) => b != 6);

      if(!(board[col][3] == 0 && board[col][2] == 0 && board[col][1] == 0 && Math.abs(board[col][0]) == 4))
        moves = moves.filter(([a, b]) => b != 2);

      return moves;
    }
  }
    
  return moves.filter(([a, b]) => Math.abs(b - start[1]) <= 1);
};

module.exports = { 
  stays_on_board,
  does_not_take_own,
  does_not_jump_lat,
  does_not_jump_diag,
  can_take_diag,
  can_be_blocked,
  can_castle
};
