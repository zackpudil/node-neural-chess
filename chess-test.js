require('./util');
let ChessGame = require('./chess');
let NeuralNetwork = require('./network');

let last_score = 0;
let last_board = [];
let examples = [];

const prog = (e) => {
  process.stdout.write(e.substr(0, 50)+'\r');
  let match = /score cp (-*\d{1,2})/g.exec(e);
  if (match && match.length >= 2) {
    last_score = parseInt(match[1])/100.0;
  }
};

let net = new NeuralNetwork(64, 128, 256, 2);
net.configure({
  iterations: 5000000,
  min_error: 0.000000001,
  progress: (e) => {
    process.stdout.write([...new Array(80)].map(() => ' ').join('')+'\r');
    console.log('\x1Bc');
    console.log(ChessGame.displayBoard(last_board));
    console.log(`error: ${e.toFixed(12)}`);
    examples.forEach(e => {
      console.log(net
        .run(...e.inputs)
        .map((i, j) => i.toFixed(8) + '|' + e.expected[j].toFixed(8))
        .join(':'));
    });
    console.log(examples.length);
    return true;
  }
});

net.load('chess-score');

const play_game = async() => {
  let cg = new ChessGame();
  cg.configure({
    black: ChessGame.engine(15, prog),
    white: ChessGame.engine(15, prog),
    on_turn: (board, move) => {
      net.save('chess-score');

      last_board = board;
      examples.push({
        inputs: board.map(r => r.map(i => i/6.0)).flatten(),
        expected: [Math.abs(last_score), last_score < 0 ? 0 : 1]
      });
      net.train(...examples);
    }
  });

  console.log(await cg.play());
  await play_game();
}

play_game();
