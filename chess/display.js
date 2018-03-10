const NUMBER_TO_PIECE_MAP = { 0: '  ', 1: 'p', 2: 'n', 3: 'b', 4: 'r', 5: 'q', 6: 'k' };
const NUMBER_TO_COLUMN_MAP = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };

const display_board = (board) => 
  board.map(r => r
    .map(i => [NUMBER_TO_PIECE_MAP[Math.abs(i)], i])
    .map(i => {
      if(i[1] == 0) return i[0];
      else if(i[1] < 0) return 'b'+i[0];
      else return 'w'+i[0];
    }));

const display_square = (sq) =>
  NUMBER_TO_COLUMN_MAP[sq[1]]+(8-sq[0]).toString();

const display_move = (move) =>
  display_square(move.from)+display_square(move.to);

module.exports = {
  display_board,
  display_square,
  display_move
};
