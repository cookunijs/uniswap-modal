"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePair = exports.usePairs = exports.PairState = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const abi_1 = require("@ethersproject/abi");
const hooks_1 = require("../hooks");
const hooks_2 = require("../state/multicall/hooks");
const wrappedCurrency_1 = require("../utils/wrappedCurrency");
const PAIR_INTERFACE = new abi_1.Interface(IUniswapV2Pair_json_1.abi);
var PairState;
(function (PairState) {
    PairState[PairState["LOADING"] = 0] = "LOADING";
    PairState[PairState["NOT_EXISTS"] = 1] = "NOT_EXISTS";
    PairState[PairState["EXISTS"] = 2] = "EXISTS";
    PairState[PairState["INVALID"] = 3] = "INVALID";
})(PairState = exports.PairState || (exports.PairState = {}));
function usePairs(currencies) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const tokens = react_1.useMemo(() => currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency_1.wrappedCurrency(currencyA, chainId),
        wrappedCurrency_1.wrappedCurrency(currencyB, chainId)
    ]), [chainId, currencies]);
    const pairAddresses = react_1.useMemo(() => tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? sdk_1.Pair.getAddress(tokenA, tokenB) : undefined;
    }), [tokens]);
    const results = hooks_2.useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');
    return react_1.useMemo(() => {
        return results.map((result, i) => {
            const { result: reserves, loading } = result;
            const tokenA = tokens[i][0];
            const tokenB = tokens[i][1];
            if (loading)
                return [PairState.LOADING, null];
            if (!tokenA || !tokenB || tokenA.equals(tokenB))
                return [PairState.INVALID, null];
            if (!reserves)
                return [PairState.NOT_EXISTS, null];
            const { reserve0, reserve1 } = reserves;
            const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
            return [
                PairState.EXISTS,
                new sdk_1.Pair(new sdk_1.TokenAmount(token0, reserve0.toString()), new sdk_1.TokenAmount(token1, reserve1.toString()))
            ];
        });
    }, [results, tokens]);
}
exports.usePairs = usePairs;
function usePair(tokenA, tokenB) {
    return usePairs([[tokenA, tokenB]])[0];
}
exports.usePair = usePair;
