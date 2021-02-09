"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTradeBetter = void 0;
const index_1 = require("./../constants/index");
const sdk_1 = require("@uniswap/sdk");
// returns whether tradeB is better than tradeA by at least a threshold percentage amount
function isTradeBetter(tradeA, tradeB, minimumDelta = index_1.ZERO_PERCENT) {
    if (tradeA && !tradeB)
        return false;
    if (tradeB && !tradeA)
        return true;
    if (!tradeA || !tradeB)
        return undefined;
    if (tradeA.tradeType !== tradeB.tradeType ||
        !sdk_1.currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
        !sdk_1.currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)) {
        throw new Error('Trades are not comparable');
    }
    if (minimumDelta.equalTo(index_1.ZERO_PERCENT)) {
        return tradeA.executionPrice.lessThan(tradeB.executionPrice);
    }
    else {
        return tradeA.executionPrice.raw.multiply(minimumDelta.add(index_1.ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice);
    }
}
exports.isTradeBetter = isTradeBetter;
