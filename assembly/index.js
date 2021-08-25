const fs = require('fs');
const loader = require('@assemblyscript/loader');
// const imports = {
//   'assembly/index': {
//     init: function () {},
//   },
// };
const load = async () => {
  const module = await loader.instantiate(
    fs.readFileSync(__dirname + '/build/optimized.wasm')
  );
  return module;
};

module.exports = load().exports;
