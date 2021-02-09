"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MULTICALL_NETWORKS = exports.MULTICALL_ABI = void 0;
const sdk_1 = require("@uniswap/sdk");
const abi_json_1 = __importDefault(require("./abi.json"));
exports.MULTICALL_ABI = abi_json_1.default;
const MULTICALL_NETWORKS = {
    [sdk_1.ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [sdk_1.ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
    [sdk_1.ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
    [sdk_1.ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    [sdk_1.ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e'
};
exports.MULTICALL_NETWORKS = MULTICALL_NETWORKS;
