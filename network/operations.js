const { sigmoid, deltas, adjust } = require('./math');
const { error } = require('./model');

const run = (network, inputs) => {
  return network.map((l, i) => {
    if(i == 0) {
      l.outputs = inputs;
      return l;
    }

    let ins = network[i - 1].outputs;
    l.sums = l.bias.map((bias, j) => bias + ins.reduce((a, b, k) => a + b*l.weights[j][k], 0));
    l.outputs = l.sums.map(s => l.a(s));

    return l;
  });
};

const train = (network, examples, iter, min_err, prog) => {
  let err = 1000000;
  let prev_errs = [];

  for(let i = 0; i < iter && err > min_err; i++) {
    examples.forEach((example) => {
      network = run(network, example.ins);
      network = deltas(network, example.outs);
      network = adjust(network);
    });

    prev_errs.push(err);
    if(prev_errs.length >= 150) prev_errs.shift();

    err = examples
      .map(ex => error(run(network, ex.ins), ex))
      .sum()/examples.length;

    if(!prog(err, i)) break;

    if(prev_errs.filter(pe => pe === err).length >= 100) {
      //throw Error('Error not changing for 100 times');
    }
  }

  return network;
};

module.exports = { run, train };
