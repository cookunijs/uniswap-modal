"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAggregateUniBalance = exports.useAllTokenBalances = exports.useCurrencyBalance = exports.useCurrencyBalances = exports.useTokenBalance = exports.useTokenBalances = exports.useTokenBalancesWithLoadingIndicator = exports.useETHBalances = void 0;
const index_1 = require("./../../constants/index");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const erc20_1 = __importDefault(require("../../constants/abis/erc20"));
const Tokens_1 = require("../../hooks/Tokens");
const hooks_1 = require("../../hooks");
const useContract_1 = require("../../hooks/useContract");
const utils_1 = require("../../utils");
const hooks_2 = require("../multicall/hooks");
const hooks_3 = require("../claim/hooks");
const hooks_4 = require("../stake/hooks");
/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
function useETHBalances(uncheckedAddresses) {
    const multicallContract = useContract_1.useMulticallContract();
    const addresses = react_1.useMemo(() => uncheckedAddresses
        ? uncheckedAddresses
            .map(utils_1.isAddress)
            .filter((a) => a !== false)
            .sort()
        : [], [uncheckedAddresses]);
    const results = hooks_2.useSingleContractMultipleData(multicallContract, 'getEthBalance', addresses.map(address => [address]));
    return react_1.useMemo(() => addresses.reduce((memo, address, i) => {
        var _a, _b;
        const value = (_b = (_a = results === null || results === void 0 ? void 0 : results[i]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
        if (value)
            memo[address] = sdk_1.CurrencyAmount.ether(sdk_1.JSBI.BigInt(value.toString()));
        return memo;
    }, {}), [addresses, results]);
}
exports.useETHBalances = useETHBalances;
/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
function useTokenBalancesWithLoadingIndicator(address, tokens) {
    const validatedTokens = react_1.useMemo(() => { var _a; return (_a = tokens === null || tokens === void 0 ? void 0 : tokens.filter((t) => utils_1.isAddress(t === null || t === void 0 ? void 0 : t.address) !== false)) !== null && _a !== void 0 ? _a : []; }, [tokens]);
    const validatedTokenAddresses = react_1.useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens]);
    const balances = hooks_2.useMultipleContractSingleData(validatedTokenAddresses, erc20_1.default, 'balanceOf', [address]);
    const anyLoading = react_1.useMemo(() => balances.some(callState => callState.loading), [balances]);
    return [
        react_1.useMemo(() => address && validatedTokens.length > 0
            ? validatedTokens.reduce((memo, token, i) => {
                var _a, _b;
                const value = (_b = (_a = balances === null || balances === void 0 ? void 0 : balances[i]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
                const amount = value ? sdk_1.JSBI.BigInt(value.toString()) : undefined;
                if (amount) {
                    memo[token.address] = new sdk_1.TokenAmount(token, amount);
                }
                return memo;
            }, {})
            : {}, [address, validatedTokens, balances]),
        anyLoading
    ];
}
exports.useTokenBalancesWithLoadingIndicator = useTokenBalancesWithLoadingIndicator;
function useTokenBalances(address, tokens) {
    return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}
exports.useTokenBalances = useTokenBalances;
// get the balance for a single token/account combo
function useTokenBalance(account, token) {
    const tokenBalances = useTokenBalances(account, [token]);
    if (!token)
        return undefined;
    return tokenBalances[token.address];
}
exports.useTokenBalance = useTokenBalance;
function useCurrencyBalances(account, currencies) {
    const tokens = react_1.useMemo(() => { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.filter((currency) => currency instanceof sdk_1.Token)) !== null && _a !== void 0 ? _a : []; }, [
        currencies
    ]);
    const tokenBalances = useTokenBalances(account, tokens);
    const containsETH = react_1.useMemo(() => { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.some(currency => currency === sdk_1.ETHER)) !== null && _a !== void 0 ? _a : false; }, [currencies]);
    const ethBalance = useETHBalances(containsETH ? [account] : []);
    return react_1.useMemo(() => { var _a; return (_a = currencies === null || currencies === void 0 ? void 0 : currencies.map(currency => {
        if (!account || !currency)
            return undefined;
        if (currency instanceof sdk_1.Token)
            return tokenBalances[currency.address];
        if (currency === sdk_1.ETHER)
            return ethBalance[account];
        return undefined;
    })) !== null && _a !== void 0 ? _a : []; }, [account, currencies, ethBalance, tokenBalances]);
}
exports.useCurrencyBalances = useCurrencyBalances;
function useCurrencyBalance(account, currency) {
    return useCurrencyBalances(account, [currency])[0];
}
exports.useCurrencyBalance = useCurrencyBalance;
// mimics useAllBalances
function useAllTokenBalances() {
    const { account } = hooks_1.useActiveWeb3React();
    const allTokens = Tokens_1.useAllTokens();
    const allTokensArray = react_1.useMemo(() => Object.values(allTokens !== null && allTokens !== void 0 ? allTokens : {}), [allTokens]);
    const balances = useTokenBalances(account !== null && account !== void 0 ? account : undefined, allTokensArray);
    return balances !== null && balances !== void 0 ? balances : {};
}
exports.useAllTokenBalances = useAllTokenBalances;
// get the total owned, unclaimed, and unharvested UNI for account
function useAggregateUniBalance() {
    var _a, _b, _c;
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const uni = chainId ? index_1.UNI[chainId] : undefined;
    const uniBalance = useTokenBalance(account !== null && account !== void 0 ? account : undefined, uni);
    const uniUnclaimed = hooks_3.useUserUnclaimedAmount(account);
    const uniUnHarvested = hooks_4.useTotalUniEarned();
    if (!uni)
        return undefined;
    return new sdk_1.TokenAmount(uni, sdk_1.JSBI.add(sdk_1.JSBI.add((_a = uniBalance === null || uniBalance === void 0 ? void 0 : uniBalance.raw) !== null && _a !== void 0 ? _a : sdk_1.JSBI.BigInt(0), (_b = uniUnclaimed === null || uniUnclaimed === void 0 ? void 0 : uniUnclaimed.raw) !== null && _b !== void 0 ? _b : sdk_1.JSBI.BigInt(0)), (_c = uniUnHarvested === null || uniUnHarvested === void 0 ? void 0 : uniUnHarvested.raw) !== null && _c !== void 0 ? _c : sdk_1.JSBI.BigInt(0)));
}
exports.useAggregateUniBalance = useAggregateUniBalance;
