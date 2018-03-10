const WEIGHT_MAX = 900000000;

const init = (layer_def) => {
  const arr = (l) => [...new Array(l)];
  const rand = (l) => arr(l).map(() => Math.random()*0.4 - 0.2);
  const zero = (l) => arr(l).map(() => 0);

  return layer_def.map((l, i) => {
    let layer = {
      outputs: zero(l),
      sums: zero(l),
      deltas:  zero(l),
      a: (x) => 1/(1 + Math.exp(-x)),
      da: (x) => Math.exp(-x)/Math.pow(1 + Math.exp(-x), 2)
    };

    if(i > 0) {
      layer = Object.assign(layer, {
        bias: rand(l),
        weights: arr(l).map(() => rand(layer_def[i-1])),
      });
    }

    return layer;
  });
};

const outputs = (network) => network[network.length - 1].outputs;
const inputs = (network) => network[0].outputs;

const error = (network, example) => {
  let ots = outputs(network);

  return example.outs
    .map((e, i) => ({ e, o: ots[i] }))
    .map(({ e, o }) => Math.pow(e - o, 2))
    .sum()/ots.length;
}

module.exports = { init, outputs, inputs, error };
