const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/function initLayerB\(\) \{[\s\S]*?\n\}\nfunction normalizeLayerB\(value\) \{[\s\S]*?\n\}\nfunction layerBEquals\(a, b\) \{[\s\S]*?\n\}/);

assert.ok(match, 'layerBEquals helper should be defined in index.html');

const context = vm.createContext({});
const script = new vm.Script(match[0]);
script.runInContext(context);

const layerBEquals = context.layerBEquals;
assert.strictEqual(layerBEquals({ connectedRetention: 'Yes' }, { connectedRetention: 'Yes' }), true);
assert.strictEqual(layerBEquals({ connectedRetention: 'Yes' }, { connectedRetention: 'No' }), false);
assert.strictEqual(layerBEquals({ remarks: ['a'] }, { remarks: ['a'] }), true);
console.log('layerBEquals regression test passed');
