let NeuralNetwork = require('./network');

let net = new NeuralNetwork(64, 128, 256, 1);
let examples = [...new Array(30)].map(() => ({
  inputs: [...new Array(64)].map(() => -1 + 2*Math.random()),
  expected: [Math.random()]
}));

const display = () => {
  return examples.reduce((s, e) => {
    return s + '\n' + net
      .run(...e.inputs)
      .map((i, j) => i.toFixed(5) + '|' + e.expected[j].toFixed(5)).join(':');
  }, '');
};

net.configure({
  iterations: 1000000000,
  min_error: 0.000000000001,
  progress: (e) => {
    console.log('\x1Bc');
    console.log(`error: ${e.toFixed(12)}${display()}`);
    return true;
  }
});

net.train(...examples);
