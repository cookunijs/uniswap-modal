"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1_EXCHANGE_ABI = exports.V1_EXCHANGE_INTERFACE = exports.V1_FACTORY_ABI = exports.V1_FACTORY_INTERFACE = exports.V1_FACTORY_ADDRESSES = void 0;
const abi_1 = require("@ethersproject/abi");
const sdk_1 = require("@uniswap/sdk");
const v1_exchange_json_1 = __importDefault(require("./v1_exchange.json"));
exports.V1_EXCHANGE_ABI = v1_exchange_json_1.default;
const v1_factory_json_1 = __importDefault(require("./v1_factory.json"));
exports.V1_FACTORY_ABI = v1_factory_json_1.default;
const V1_FACTORY_ADDRESSES = {
    [sdk_1.ChainId.MAINNET]: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
    [sdk_1.ChainId.ROPSTEN]: '0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351',
    [sdk_1.ChainId.RINKEBY]: '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36',
    [sdk_1.ChainId.GÖRLI]: '0x6Ce570d02D73d4c384b46135E87f8C592A8c86dA',
    [sdk_1.ChainId.KOVAN]: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30'
};
exports.V1_FACTORY_ADDRESSES = V1_FACTORY_ADDRESSES;
const V1_FACTORY_INTERFACE = new abi_1.Interface(v1_factory_json_1.default);
exports.V1_FACTORY_INTERFACE = V1_FACTORY_INTERFACE;
const V1_EXCHANGE_INTERFACE = new abi_1.Interface(v1_exchange_json_1.default);
exports.V1_EXCHANGE_INTERFACE = V1_EXCHANGE_INTERFACE;
