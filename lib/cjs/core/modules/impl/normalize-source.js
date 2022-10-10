"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeContractSource = void 0;
function normalizeContractSource(contractSrc, useVM2) {
    // Convert from ES Module format to something we can run inside a Function.
    // Removes the `export` keyword and adds ;return handle to the end of the function.
    // Additionally it removes 'IIFE' declarations
    // (which may be generated when bundling multiple sources into one output file
    // - eg. using esbuild's "IIFE" bundle format).
    // We also assign the passed in SmartWeaveGlobal to SmartWeave, and declare
    // the ContractError exception.
    // We then use `new Function()` which we can call and get back the returned handle function
    // which has access to the per-instance globals.
    const lines = contractSrc.trim().split('\n');
    const first = lines[0];
    const last = lines[lines.length - 1];
    if ((/\(\s*\(\)\s*=>\s*{/g.test(first) || /\s*\(\s*function\s*\(\)\s*{/g.test(first)) &&
        /}\s*\)\s*\(\)\s*;/g.test(last)) {
        lines.shift();
        lines.pop();
        contractSrc = lines.join('\n');
    }
    contractSrc = contractSrc
        .replace(/export\s+async\s+function\s+handle/gmu, 'async function handle')
        .replace(/export\s+function\s+handle/gmu, 'function handle');
    if (useVM2) {
        return `
    ${contractSrc}
    module.exports = handle;`;
    }
    else {
        return `
    const [SmartWeave, BigNumber, logger] = arguments;

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var ContractError = (function (_Error) {
      _inherits(ContractError, _Error);
    
      function ContractError(message) {
        _classCallCheck(this, ContractError);
    
        _get(Object.getPrototypeOf(ContractError.prototype), 'constructor', this).call(this, message);this.name = 'ContractError';
      }
    
      return ContractError;
    })(Error);
    
    ;
    
    function ContractAssert(cond, message) { if (!cond) throw new ContractError(message) };
    ${contractSrc};
    return handle;
  `;
    }
}
exports.normalizeContractSource = normalizeContractSource;
//# sourceMappingURL=normalize-source.js.map