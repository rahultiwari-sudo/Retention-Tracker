const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/function initLayerB\(\) \{[\s\S]*?\n\}\nfunction getDisplayLayerB\(layerB, confirmedLayerB, pendingErrors, id\) \{[\s\S]*?\n\}\nfunction normalizeLayerB\(value\) \{[\s\S]*?\n\}\nfunction layerBEquals\(a, b\) \{[\s\S]*?\n\}/);

assert.ok(match, 'sync helper functions should be defined in index.html');

const context = vm.createContext({});
const script = new vm.Script(match[0]);
script.runInContext(context);

const getDisplayLayerB = context.getDisplayLayerB;
const layerBEquals = context.layerBEquals;
assert.strictEqual(getDisplayLayerB({ a: { disposition: 'Interested' } }, { a: { disposition: 'Call Later' } }, { a: true }, 'a').disposition, 'Interested');
assert.strictEqual(getDisplayLayerB({ a: { disposition: 'Interested' } }, { a: { disposition: 'Call Later' } }, {}, 'a').disposition, 'Call Later');
assert.strictEqual(layerBEquals({ connectedRetention: 'Yes' }, { connectedRetention: 'Yes' }), true);
assert.strictEqual(layerBEquals({ connectedRetention: 'Yes' }, { connectedRetention: 'No' }), false);
assert.strictEqual(layerBEquals({ remarks: ['a'] }, { remarks: ['a'] }), true);
console.log('sync helper regression test passed');
