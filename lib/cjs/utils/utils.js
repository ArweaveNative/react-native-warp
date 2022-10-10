"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isomorphicRandomUUID = exports.bufToBn = exports.indent = exports.stripTrailingSlash = exports.timeout = exports.descS = exports.desc = exports.ascS = exports.asc = exports.mapReviver = exports.mapReplacer = exports.deepCopy = exports.sleep = void 0;
/* eslint-disable */
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const fast_copy_1 = __importDefault(require("fast-copy"));
const crypto_1 = require("crypto");
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const deepCopy = (input, useFastCopy = false) => {
    return useFastCopy ? (0, fast_copy_1.default)(input) : (0, cloneDeep_1.default)(input);
};
exports.deepCopy = deepCopy;
const mapReplacer = (key, value) => {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries())
        };
    }
    else {
        return value;
    }
};
exports.mapReplacer = mapReplacer;
const mapReviver = (key, value) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
};
exports.mapReviver = mapReviver;
const asc = (a, b) => a - b;
exports.asc = asc;
const ascS = (a, b) => +a - +b;
exports.ascS = ascS;
const desc = (a, b) => b - a;
exports.desc = desc;
const descS = (a, b) => +b - +a;
exports.descS = descS;
function timeout(s) {
    let timeoutId = null;
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject('timeout');
        }, s * 1000);
    });
    return {
        timeoutId,
        timeoutPromise
    };
}
exports.timeout = timeout;
function stripTrailingSlash(str) {
    return str.endsWith('/') ? str.slice(0, -1) : str;
}
exports.stripTrailingSlash = stripTrailingSlash;
function indent(callDepth) {
    return ''.padEnd(callDepth * 2, ' ');
}
exports.indent = indent;
function bufToBn(buf) {
    const hex = [];
    const u8 = Uint8Array.from(buf);
    u8.forEach(function (i) {
        let h = i.toString(16);
        if (h.length % 2) {
            h = '0' + h;
        }
        hex.push(h);
    });
    return BigInt('0x' + hex.join(''));
}
exports.bufToBn = bufToBn;
function isomorphicRandomUUID() {
    if (isBrowser() && self.crypto) {
        return self.crypto.randomUUID();
    }
    else {
        return (0, crypto_1.randomUUID)();
    }
}
exports.isomorphicRandomUUID = isomorphicRandomUUID;
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
//# sourceMappingURL=utils.js.map