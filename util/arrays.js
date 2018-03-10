Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
}
Array.prototype.flatten = function() {
  return this.reduce((a, b) => a.concat(b), []);
}

Array.prototype.last = function () {
  return this[this.length - 1];
}

Array.prototype.prune = function () {
  return this.filter(t => t !== null && t !== undefined);
}

Array.prototype.tuple = function (l) {
  return this.reduce((a, b, i) => {
    if(i % l == 0) a.push([])
    a.last().push(b);

    return a;
  }, []);
}

Array.prototype.all_same = function () {
  for(let i = 1; i < this.length; i++) {
    if(this[i] != this[i-1]) return false;
  }

  return true;
}

Array.prototype.random = function () {
  let idx = parseInt(Math.random()*this.length);
  return this[idx];
}
