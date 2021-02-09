"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrency = exports.useToken = exports.useIsUserAddedToken = exports.useFoundOnInactiveList = exports.useIsTokenActive = exports.useUnsupportedTokens = exports.useAllInactiveTokens = exports.useAllTokens = exports.useDefaultTokens = void 0;
const hooks_1 = require("./../state/lists/hooks");
const strings_1 = require("@ethersproject/strings");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const hooks_2 = require("../state/lists/hooks");
const hooks_3 = require("../state/multicall/hooks");
const hooks_4 = require("../state/user/hooks");
const utils_1 = require("../utils");
const index_1 = require("./index");
const useContract_1 = require("./useContract");
const filtering_1 = require("../components/SearchModal/filtering");
const utils_2 = require("ethers/lib/utils");
// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap, includeUserAdded) {
    const { chainId } = index_1.useActiveWeb3React();
    const userAddedTokens = hooks_4.useUserAddedTokens();
    return react_1.useMemo(() => {
        if (!chainId)
            return {};
        // reduce to just tokens
        const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce((newMap, address) => {
            newMap[address] = tokenMap[chainId][address].token;
            return newMap;
        }, {});
        if (includeUserAdded) {
            return (userAddedTokens
                // reduce into all ALL_TOKENS filtered by the current chain
                .reduce((tokenMap, token) => {
                tokenMap[token.address] = token;
                return tokenMap;
            }, Object.assign({}, mapWithoutUrls)));
        }
        return mapWithoutUrls;
    }, [chainId, userAddedTokens, tokenMap, includeUserAdded]);
}
function useDefaultTokens() {
    const defaultList = hooks_1.useDefaultTokenList();
    return useTokensFromMap(defaultList, false);
}
exports.useDefaultTokens = useDefaultTokens;
function useAllTokens() {
    const allTokens = hooks_2.useCombinedActiveList();
    return useTokensFromMap(allTokens, true);
}
exports.useAllTokens = useAllTokens;
function useAllInactiveTokens() {
    // get inactive tokens
    const inactiveTokensMap = hooks_2.useCombinedInactiveList();
    const inactiveTokens = useTokensFromMap(inactiveTokensMap, false);
    // filter out any token that are on active list
    const activeTokensAddresses = Object.keys(useAllTokens());
    const filteredInactive = activeTokensAddresses
        ? Object.keys(inactiveTokens).reduce((newMap, address) => {
            if (!activeTokensAddresses.includes(address)) {
                newMap[address] = inactiveTokens[address];
            }
            return newMap;
        }, {})
        : inactiveTokens;
    return filteredInactive;
}
exports.useAllInactiveTokens = useAllInactiveTokens;
function useUnsupportedTokens() {
    const unsupportedTokensMap = hooks_1.useUnsupportedTokenList();
    return useTokensFromMap(unsupportedTokensMap, false);
}
exports.useUnsupportedTokens = useUnsupportedTokens;
function useIsTokenActive(token) {
    const activeTokens = useAllTokens();
    if (!activeTokens || !token) {
        return false;
    }
    return !!activeTokens[token.address];
}
exports.useIsTokenActive = useIsTokenActive;
// used to detect extra search results
function useFoundOnInactiveList(searchQuery) {
    const { chainId } = index_1.useActiveWeb3React();
    const inactiveTokens = useAllInactiveTokens();
    return react_1.useMemo(() => {
        if (!chainId || searchQuery === '') {
            return undefined;
        }
        else {
            const tokens = filtering_1.filterTokens(Object.values(inactiveTokens), searchQuery);
            return tokens;
        }
    }, [chainId, inactiveTokens, searchQuery]);
}
exports.useFoundOnInactiveList = useFoundOnInactiveList;
// Check if currency is included in custom list from user storage
function useIsUserAddedToken(currency) {
    const userAddedTokens = hooks_4.useUserAddedTokens();
    if (!currency) {
        return false;
    }
    return !!userAddedTokens.find(token => sdk_1.currencyEquals(currency, token));
}
exports.useIsUserAddedToken = useIsUserAddedToken;
// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;
function parseStringOrBytes32(str, bytes32, defaultValue) {
    return str && str.length > 0
        ? str
        : // need to check for proper bytes string and valid terminator
            bytes32 && BYTES32_REGEX.test(bytes32) && utils_2.arrayify(bytes32)[31] === 0
                ? strings_1.parseBytes32String(bytes32)
                : defaultValue;
}
// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
function useToken(tokenAddress) {
    const { chainId } = index_1.useActiveWeb3React();
    const tokens = useAllTokens();
    const address = utils_1.isAddress(tokenAddress);
    const tokenContract = useContract_1.useTokenContract(address ? address : undefined, false);
    const tokenContractBytes32 = useContract_1.useBytes32TokenContract(address ? address : undefined, false);
    const token = address ? tokens[address] : undefined;
    const tokenName = hooks_3.useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, hooks_3.NEVER_RELOAD);
    const tokenNameBytes32 = hooks_3.useSingleCallResult(token ? undefined : tokenContractBytes32, 'name', undefined, hooks_3.NEVER_RELOAD);
    const symbol = hooks_3.useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, hooks_3.NEVER_RELOAD);
    const symbolBytes32 = hooks_3.useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, hooks_3.NEVER_RELOAD);
    const decimals = hooks_3.useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, hooks_3.NEVER_RELOAD);
    return react_1.useMemo(() => {
        var _a, _b, _c, _d;
        if (token)
            return token;
        if (!chainId || !address)
            return undefined;
        if (decimals.loading || symbol.loading || tokenName.loading)
            return null;
        if (decimals.result) {
            return new sdk_1.Token(chainId, address, decimals.result[0], parseStringOrBytes32((_a = symbol.result) === null || _a === void 0 ? void 0 : _a[0], (_b = symbolBytes32.result) === null || _b === void 0 ? void 0 : _b[0], 'UNKNOWN'), parseStringOrBytes32((_c = tokenName.result) === null || _c === void 0 ? void 0 : _c[0], (_d = tokenNameBytes32.result) === null || _d === void 0 ? void 0 : _d[0], 'Unknown Token'));
        }
        return undefined;
    }, [
        address,
        chainId,
        decimals.loading,
        decimals.result,
        symbol.loading,
        symbol.result,
        symbolBytes32.result,
        token,
        tokenName.loading,
        tokenName.result,
        tokenNameBytes32.result
    ]);
}
exports.useToken = useToken;
function useCurrency(currencyId) {
    const isETH = (currencyId === null || currencyId === void 0 ? void 0 : currencyId.toUpperCase()) === 'ETH';
    const token = useToken(isETH ? undefined : currencyId);
    return isETH ? sdk_1.ETHER : token;
}
exports.useCurrency = useCurrency;
