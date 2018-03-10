const deltas = (network, target) =>
  network.reverse().map((l, i) => {
    let pl = network[i - 1];
    l.deltas = l.sums.map((o, j) => 
      i == 0
        ? target[j] - l.outputs[j]
        : pl.deltas.reduce((s, d, k) => s + d*pl.weights[k][j], 0)*l.da(o));
    return l;
  }).reverse();

const adjust = (network) => 
  network.map((l, i) => {
    if(i == 0) return l;

    l.deltas.forEach((d, j) => 
      network[i-1].outputs.forEach((o, k) => l.weights[j][k] += 0.1*d*o));

    return l;
  });

module.exports = { deltas, adjust };
