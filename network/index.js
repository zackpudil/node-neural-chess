const { init, errors, outputs } = require('./model');
const { train, run } = require('./operations');
const { serialize, parse } = require('../util');

const fs = require('fs');

class NeuralNetwork {
  constructor(...layers) {
    this.net = init(layers);
    this.options = {
      iterations: 1000000,
      min_error: 0.0000001,
      porgress: (e) => true
    };
  }

  run(...inputs) {
    this.net = run(this.net, inputs);
    return outputs(this.net);
  }

  configure(options) {
    this.options = Object.assign(this.options, options);
  }

  activations(...acts) {
    acts.forEach((a) => {
      this.net[a.layer].a = a.activation;
      this.net[a.layer].da = a.change;
    });
  }

  train(...examples) {
    this.net = train(
      this.net, 
      examples.map(e => ({
        ins: e.inputs,
        outs: e.expected
      })),
      this.options.iterations,
      this.options.min_error,
      this.options.progress
    );
  }

  save(file_name) {
    let net_save = this.net.map((l) => Object.assign({}, l, {
      deltas: undefined,
      a: serialize(l.a),
      da: serialize(l.da)
    }));

    fs.writeFileSync(file_name + '-nn.json', JSON.stringify(net_save));
  }

  load(file_name) {
    try {
      let data = fs.readFileSync(file_name + '-nn.json');
      this.net = Object.assign(JSON.parse(data)).map((l) => Object.assign({}, l, {
        a: parse(l.a),
        da: parse(l.da)
      }));
    } catch (ex) { }
  }
}

module.exports = NeuralNetwork;
