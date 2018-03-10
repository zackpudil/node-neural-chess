const pawn = (i, j, is_white) => {
  let moves = [];
  let { m, s } = is_white ? {m: -1, s: 6} : {m: 1, s: 1};

  moves.push([i+m*1, j]);
  if(i == s) moves.push([i+m*2, j]);
  moves.push([i+m*1,j+1]);
  moves.push([i+m*1,j-1]);

  return moves;
};

const rook = (i, j) => {
  let moves = [];
  for(let b = 0; b < 8; b++) moves.push([b, j]);
  for(let b = 0; b < 8; b++) moves.push([i, b]);

  moves = moves.filter(([a, b]) => a != i || b != j);

  return moves;
};

const bishop = (i, j) => {
  let moves = [];
  for(let b = -8; b < 8; b++) {
    moves.push([i+b, j+b]);
    moves.push([i-b, j+b]);
  }
  moves = moves.filter(([a, b]) => a != i || b != j);

  return moves;
};

const knight = (i, j) => {
  let moves = [];

  for(let k = 0;  k <= 1; k++) {
    let { a, b } = k == 0 ? { a: 1, b: 2 } : { a: 2, b: 1 };
    moves.push([i+a, j+b]);
    moves.push([i-a, j+b]);
    moves.push([i+a, j-b]);
    moves.push([i-a, j-b]);
  }

  return moves;
};

const king = (i, j) =>  {
  let moves = [];

  for(let a = -1; a <= 1; a++) 
  for(let b = -1; b <= 1; b++)
    moves.push([i+a, j+b]);

  moves.push([i, j+2]);
  moves.push([i, j-2]);

  moves = moves.filter(([a, b]) => a != i || b != j);

  return moves;
}

module.exports = {
  pawn,
  bishop,
  knight,
  rook,
  king
};
