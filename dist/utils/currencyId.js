"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyId = void 0;
const sdk_1 = require("@uniswap/sdk");
function currencyId(currency) {
    if (currency === sdk_1.ETHER)
        return 'ETH';
    if (currency instanceof sdk_1.Token)
        return currency.address;
    throw new Error('invalid currency');
}
exports.currencyId = currencyId;
