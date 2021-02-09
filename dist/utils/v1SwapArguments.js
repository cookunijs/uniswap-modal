"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
const sdk_1 = require("@uniswap/sdk");
const V1_1 = require("../data/V1");
const useToggledVersion_1 = require("../hooks/useToggledVersion");
function toHex(currencyAmount) {
    return `0x${currencyAmount.raw.toString(16)}`;
}
/**
 * Get the arguments to make for a swap
 * @param trade trade to get v1 arguments for swapping
 * @param options options for swapping
 */
function v1SwapArguments(trade, options) {
    if (V1_1.getTradeVersion(trade) !== useToggledVersion_1.Version.v1) {
        throw new Error('invalid trade version');
    }
    if (trade.route.pairs.length > 2) {
        throw new Error('too many pairs');
    }
    const isExactIn = trade.tradeType === sdk_1.TradeType.EXACT_INPUT;
    const inputETH = trade.inputAmount.currency === sdk_1.ETHER;
    const outputETH = trade.outputAmount.currency === sdk_1.ETHER;
    if (inputETH && outputETH)
        throw new Error('ETHER to ETHER');
    const minimumAmountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    const maximumAmountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    const deadline = `0x${options.deadline.toString(16)}`;
    if (isExactIn) {
        if (inputETH) {
            return {
                methodName: 'ethToTokenTransferInput',
                args: [minimumAmountOut, deadline, options.recipient],
                value: maximumAmountIn
            };
        }
        else if (outputETH) {
            return {
                methodName: 'tokenToEthTransferInput',
                args: [maximumAmountIn, minimumAmountOut, deadline, options.recipient],
                value: '0x0'
            };
        }
        else {
            const outputToken = trade.outputAmount.currency;
            // should never happen, needed for type check
            if (!(outputToken instanceof sdk_1.Token)) {
                throw new Error('token to token');
            }
            return {
                methodName: 'tokenToTokenTransferInput',
                args: [maximumAmountIn, minimumAmountOut, '0x1', deadline, options.recipient, outputToken.address],
                value: '0x0'
            };
        }
    }
    else {
        if (inputETH) {
            return {
                methodName: 'ethToTokenTransferOutput',
                args: [minimumAmountOut, deadline, options.recipient],
                value: maximumAmountIn
            };
        }
        else if (outputETH) {
            return {
                methodName: 'tokenToEthTransferOutput',
                args: [minimumAmountOut, maximumAmountIn, deadline, options.recipient],
                value: '0x0'
            };
        }
        else {
            const output = trade.outputAmount.currency;
            if (!(output instanceof sdk_1.Token)) {
                throw new Error('invalid output amount currency');
            }
            return {
                methodName: 'tokenToTokenTransferOutput',
                args: [
                    minimumAmountOut,
                    maximumAmountIn,
                    constants_1.MaxUint256.toHexString(),
                    deadline,
                    options.recipient,
                    output.address
                ],
                value: '0x0'
            };
        }
    }
}
exports.default = v1SwapArguments;
