// Transform a function with a callback into a Promise.
// Thx to https://apr.js.org/#awaitify
// https://github.com/sergioramos/apr/blob/master/packages/awaitify/index.js
export const awaitify =
  (λ) =>
  (...args) =>
    new Promise((resolve, reject) =>
      λ(...args, (err, ...args) => (err ? reject(err) : resolve(...args))),
    );
