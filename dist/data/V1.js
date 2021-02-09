"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useV1TradeExchangeAddress = exports.getTradeVersion = exports.useV1Trade = exports.useUserHasLiquidityInAllTokens = exports.useAllTokenV1Exchanges = exports.MockV1Pair = exports.useV1ExchangeAddress = void 0;
const constants_1 = require("@ethersproject/constants");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const hooks_1 = require("../hooks");
const Tokens_1 = require("../hooks/Tokens");
const useContract_1 = require("../hooks/useContract");
const useToggledVersion_1 = require("../hooks/useToggledVersion");
const hooks_2 = require("../state/multicall/hooks");
const hooks_3 = require("../state/wallet/hooks");
function useV1ExchangeAddress(tokenAddress) {
    var _a, _b;
    const contract = useContract_1.useV1FactoryContract();
    const inputs = react_1.useMemo(() => [tokenAddress], [tokenAddress]);
    return (_b = (_a = hooks_2.useSingleCallResult(contract, 'getExchange', inputs)) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
}
exports.useV1ExchangeAddress = useV1ExchangeAddress;
class MockV1Pair extends sdk_1.Pair {
    constructor(etherAmount, tokenAmount) {
        super(tokenAmount, new sdk_1.TokenAmount(sdk_1.WETH[tokenAmount.token.chainId], etherAmount));
    }
}
exports.MockV1Pair = MockV1Pair;
function useMockV1Pair(inputCurrency) {
    const token = inputCurrency instanceof sdk_1.Token ? inputCurrency : undefined;
    const isWETH = Boolean(token && token.equals(sdk_1.WETH[token.chainId]));
    const v1PairAddress = useV1ExchangeAddress(isWETH ? undefined : token === null || token === void 0 ? void 0 : token.address);
    const tokenBalance = hooks_3.useTokenBalance(v1PairAddress, token);
    const ETHBalance = hooks_3.useETHBalances([v1PairAddress])[v1PairAddress !== null && v1PairAddress !== void 0 ? v1PairAddress : ''];
    return react_1.useMemo(() => token && tokenBalance && ETHBalance && inputCurrency ? new MockV1Pair(ETHBalance.raw, tokenBalance) : undefined, [ETHBalance, inputCurrency, token, tokenBalance]);
}
// returns all v1 exchange addresses in the user's token list
function useAllTokenV1Exchanges() {
    const allTokens = Tokens_1.useAllTokens();
    const factory = useContract_1.useV1FactoryContract();
    const args = react_1.useMemo(() => Object.keys(allTokens).map(tokenAddress => [tokenAddress]), [allTokens]);
    const data = hooks_2.useSingleContractMultipleData(factory, 'getExchange', args, hooks_2.NEVER_RELOAD);
    return react_1.useMemo(() => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.reduce((memo, { result }, ix) => {
        if ((result === null || result === void 0 ? void 0 : result[0]) && result[0] !== constants_1.AddressZero) {
            memo[result[0]] = allTokens[args[ix][0]];
        }
        return memo;
    }, {})) !== null && _a !== void 0 ? _a : {}; }, [allTokens, args, data]);
}
exports.useAllTokenV1Exchanges = useAllTokenV1Exchanges;
// returns whether any of the tokens in the user's token list have liquidity on v1
function useUserHasLiquidityInAllTokens() {
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const exchanges = useAllTokenV1Exchanges();
    const v1ExchangeLiquidityTokens = react_1.useMemo(() => chainId ? Object.keys(exchanges).map(address => new sdk_1.Token(chainId, address, 18, 'UNI-V1', 'Uniswap V1')) : [], [chainId, exchanges]);
    const balances = hooks_3.useTokenBalances(account !== null && account !== void 0 ? account : undefined, v1ExchangeLiquidityTokens);
    return react_1.useMemo(() => Object.keys(balances).some(tokenAddress => {
        var _a;
        const b = (_a = balances[tokenAddress]) === null || _a === void 0 ? void 0 : _a.raw;
        return b && sdk_1.JSBI.greaterThan(b, sdk_1.JSBI.BigInt(0));
    }), [balances]);
}
exports.useUserHasLiquidityInAllTokens = useUserHasLiquidityInAllTokens;
/**
 * Returns the trade to execute on V1 to go between input and output token
 */
function useV1Trade(isExactIn, inputCurrency, outputCurrency, exactAmount) {
    // get the mock v1 pairs
    const inputPair = useMockV1Pair(inputCurrency);
    const outputPair = useMockV1Pair(outputCurrency);
    const inputIsETH = inputCurrency === sdk_1.ETHER;
    const outputIsETH = outputCurrency === sdk_1.ETHER;
    // construct a direct or through ETH v1 route
    let pairs = [];
    if (inputIsETH && outputPair) {
        pairs = [outputPair];
    }
    else if (outputIsETH && inputPair) {
        pairs = [inputPair];
    }
    // if neither are ETH, it's token-to-token (if they both exist)
    else if (inputPair && outputPair) {
        pairs = [inputPair, outputPair];
    }
    const route = inputCurrency && pairs && pairs.length > 0 && new sdk_1.Route(pairs, inputCurrency, outputCurrency);
    let v1Trade;
    try {
        v1Trade =
            route && exactAmount
                ? new sdk_1.Trade(route, exactAmount, isExactIn ? sdk_1.TradeType.EXACT_INPUT : sdk_1.TradeType.EXACT_OUTPUT)
                : undefined;
    }
    catch (error) {
        console.debug('Failed to create V1 trade', error);
    }
    return v1Trade;
}
exports.useV1Trade = useV1Trade;
function getTradeVersion(trade) {
    var _a, _b;
    const isV1 = (_b = (_a = trade === null || trade === void 0 ? void 0 : trade.route) === null || _a === void 0 ? void 0 : _a.pairs) === null || _b === void 0 ? void 0 : _b.some(pair => pair instanceof MockV1Pair);
    if (isV1)
        return useToggledVersion_1.Version.v1;
    if (isV1 === false)
        return useToggledVersion_1.Version.v2;
    return undefined;
}
exports.getTradeVersion = getTradeVersion;
// returns the v1 exchange against which a trade should be executed
function useV1TradeExchangeAddress(trade) {
    const tokenAddress = react_1.useMemo(() => {
        if (!trade)
            return undefined;
        const isV1 = getTradeVersion(trade) === useToggledVersion_1.Version.v1;
        if (!isV1)
            return undefined;
        return trade.inputAmount instanceof sdk_1.TokenAmount
            ? trade.inputAmount.token.address
            : trade.outputAmount instanceof sdk_1.TokenAmount
                ? trade.outputAmount.token.address
                : undefined;
    }, [trade]);
    return useV1ExchangeAddress(tokenAddress);
}
exports.useV1TradeExchangeAddress = useV1TradeExchangeAddress;
