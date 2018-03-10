
const serialize = (fn) => {
  let str = fn.toString()
    .split('\n')
    .map(n => n.includes(';') ? n : n+';')
    .join('');

  let arg = /^(?:function (?:\w)*)*\((\w).*\)/g.exec(str)[1];
  let body = /(?:=> {;|=>|{;)(.*)(?:}|;)/.exec(str)[1].replace(/}/g, '');

  if(!body.includes('return')) {
    body = 'return' + body;
  }

  return { arg, body };
};

const parse = (fn_desc) => new Function(fn_desc.arg, fn_desc.body);

module.exports = { serialize, parse };
