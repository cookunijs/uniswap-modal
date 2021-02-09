"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsTransactionUnsupported = exports.useTradeExactOut = exports.useTradeExactIn = void 0;
const trades_1 = require("utils/trades");
const sdk_1 = require("@uniswap/sdk");
const lodash_flatmap_1 = __importDefault(require("lodash.flatmap"));
const react_1 = require("react");
const constants_1 = require("../constants");
const Reserves_1 = require("../data/Reserves");
const wrappedCurrency_1 = require("../utils/wrappedCurrency");
const index_1 = require("./index");
const Tokens_1 = require("./Tokens");
const hooks_1 = require("state/user/hooks");
function useAllCommonPairs(currencyA, currencyB) {
    const { chainId } = index_1.useActiveWeb3React();
    const bases = chainId ? constants_1.BASES_TO_CHECK_TRADES_AGAINST[chainId] : [];
    const [tokenA, tokenB] = chainId
        ? [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)]
        : [undefined, undefined];
    const basePairs = react_1.useMemo(() => lodash_flatmap_1.default(bases, (base) => bases.map(otherBase => [base, otherBase])).filter(([t0, t1]) => t0.address !== t1.address), [bases]);
    const allPairCombinations = react_1.useMemo(() => tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base) => [tokenA, base]),
            // token B against all bases
            ...bases.map((base) => [tokenB, base]),
            // each base against all bases
            ...basePairs
        ]
            .filter((tokens) => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
            if (!chainId)
                return true;
            const customBases = constants_1.CUSTOM_BASES[chainId];
            if (!customBases)
                return true;
            const customBasesA = customBases[tokenA.address];
            const customBasesB = customBases[tokenB.address];
            if (!customBasesA && !customBasesB)
                return true;
            if (customBasesA && !customBasesA.find(base => tokenB.equals(base)))
                return false;
            if (customBasesB && !customBasesB.find(base => tokenA.equals(base)))
                return false;
            return true;
        })
        : [], [tokenA, tokenB, bases, basePairs, chainId]);
    const allPairs = Reserves_1.usePairs(allPairCombinations);
    // only pass along valid pairs, non-duplicated pairs
    return react_1.useMemo(() => Object.values(allPairs
        // filter out invalid pairs
        .filter((result) => Boolean(result[0] === Reserves_1.PairState.EXISTS && result[1]))
        // filter out duplicated pairs
        .reduce((memo, [, curr]) => {
        var _a;
        memo[curr.liquidityToken.address] = (_a = memo[curr.liquidityToken.address]) !== null && _a !== void 0 ? _a : curr;
        return memo;
    }, {})), [allPairs]);
}
const MAX_HOPS = 3;
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
function useTradeExactIn(currencyAmountIn, currencyOut) {
    const allowedPairs = useAllCommonPairs(currencyAmountIn === null || currencyAmountIn === void 0 ? void 0 : currencyAmountIn.currency, currencyOut);
    const [singleHopOnly] = hooks_1.useUserSingleHopOnly();
    return react_1.useMemo(() => {
        var _a, _b;
        if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
            if (singleHopOnly) {
                return ((_a = sdk_1.Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0]) !== null && _a !== void 0 ? _a : null);
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar = null;
            for (let i = 1; i <= MAX_HOPS; i++) {
                const currentTrade = (_b = sdk_1.Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0]) !== null && _b !== void 0 ? _b : null;
                // if current trade is best yet, save it
                if (trades_1.isTradeBetter(bestTradeSoFar, currentTrade, constants_1.BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade;
                }
            }
            return bestTradeSoFar;
        }
        return null;
    }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly]);
}
exports.useTradeExactIn = useTradeExactIn;
/**
 * Returns the best trade for the token in to the exact amount of token out
 */
function useTradeExactOut(currencyIn, currencyAmountOut) {
    const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut === null || currencyAmountOut === void 0 ? void 0 : currencyAmountOut.currency);
    const [singleHopOnly] = hooks_1.useUserSingleHopOnly();
    return react_1.useMemo(() => {
        var _a, _b;
        if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
            if (singleHopOnly) {
                return ((_a = sdk_1.Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 1, maxNumResults: 1 })[0]) !== null && _a !== void 0 ? _a : null);
            }
            // search through trades with varying hops, find best trade out of them
            let bestTradeSoFar = null;
            for (let i = 1; i <= MAX_HOPS; i++) {
                const currentTrade = (_b = sdk_1.Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: i, maxNumResults: 1 })[0]) !== null && _b !== void 0 ? _b : null;
                if (trades_1.isTradeBetter(bestTradeSoFar, currentTrade, constants_1.BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
                    bestTradeSoFar = currentTrade;
                }
            }
            return bestTradeSoFar;
        }
        return null;
    }, [currencyIn, currencyAmountOut, allowedPairs, singleHopOnly]);
}
exports.useTradeExactOut = useTradeExactOut;
function useIsTransactionUnsupported(currencyIn, currencyOut) {
    const unsupportedToken = Tokens_1.useUnsupportedTokens();
    const { chainId } = index_1.useActiveWeb3React();
    const tokenIn = wrappedCurrency_1.wrappedCurrency(currencyIn, chainId);
    const tokenOut = wrappedCurrency_1.wrappedCurrency(currencyOut, chainId);
    // if unsupported list loaded & either token on list, mark as unsupported
    if (unsupportedToken) {
        if (tokenIn && Object.keys(unsupportedToken).includes(tokenIn.address)) {
            return true;
        }
        if (tokenOut && Object.keys(unsupportedToken).includes(tokenOut.address)) {
            return true;
        }
    }
    return false;
}
exports.useIsTransactionUnsupported = useIsTransactionUnsupported;
