const stockfish = require('stockfish')();

const get_best_move = (moves, depth, progress) => new Promise((res) => {
  stockfish.onmessage = (event) => {
    if(event.includes('bestmove')) {
      let move = /bestmove (\w*)/g.exec(event)[1];
      res(move);
    }

    progress(event);
  }

  stockfish.postMessage(`position startpos moves ${moves.join(' ')}`);
  stockfish.postMessage(`go depth ${depth}`);
});

module.exports = { get_best_move };
