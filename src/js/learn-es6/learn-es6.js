// Multiline strings
var test = `hey
multiline`;
console.log(test);

// Template interpolation
var name = 'Bob';
console.log(`My name is ${name}`);

// List matching
var [a, , b] = [1, 2, 3];
console.log(a, b);

// List matching with default
var [a = 11] = [];
console.log(a)

// Default in function
function f(x, y = 10) {
  return x + y;
}
console.log(f(3) === 13);

// Spread - y is an array
function f(x, ...y) {
  console.log(x, y);
}
f(4,5);

// let => Block scoped
//   Change with var: doesn't hoist, you need to use it in the right order
// const => You can only assign it once
(function() {
  let x;
  {
    const x = 'test';
    // x = 'hey';
  }
  {
    let y = 'my own block';
    console.log(y);
  }
  // y is undefined
  x = 'tests';
  console.log(x);
})();

let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0, cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur }
      }
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}

// Modules
import * as math from './math.js';
console.log(22, math.pi);

import {pi, sum} from './math.js';
console.log(222, math.pi);

// Promises
function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  })
}

var p = timeout(1000).then(() => {
  console.log('timeout');
    return timeout(2000);
}).then(() => {
    throw new Error("hmm");
}).catch(err => {
    return Promise.all([timeout(100), timeout(200)]);
})

function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i){
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
