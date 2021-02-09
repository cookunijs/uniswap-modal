"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsListActive = exports.useUnsupportedTokenList = exports.useDefaultTokenList = exports.useCombinedInactiveList = exports.useCombinedActiveList = exports.useInactiveListUrls = exports.useActiveListUrls = exports.useAllLists = exports.listToTokenMap = exports.WrappedTokenInfo = void 0;
const lists_1 = require("./../../constants/lists");
const default_token_list_1 = __importDefault(require("@uniswap/default-token-list"));
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const listSort_1 = __importDefault(require("utils/listSort"));
const uniswap_v2_unsupported_tokenlist_json_1 = __importDefault(require("../../constants/tokenLists/uniswap-v2-unsupported.tokenlist.json"));
/**
 * Token instances created from token info.
 */
class WrappedTokenInfo extends sdk_1.Token {
    constructor(tokenInfo, tags) {
        super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name);
        this.tokenInfo = tokenInfo;
        this.tags = tags;
    }
    get logoURI() {
        return this.tokenInfo.logoURI;
    }
}
exports.WrappedTokenInfo = WrappedTokenInfo;
/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST = {
    [sdk_1.ChainId.KOVAN]: {},
    [sdk_1.ChainId.RINKEBY]: {},
    [sdk_1.ChainId.ROPSTEN]: {},
    [sdk_1.ChainId.GÖRLI]: {},
    [sdk_1.ChainId.MAINNET]: {}
};
const listCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function listToTokenMap(list) {
    const result = listCache === null || listCache === void 0 ? void 0 : listCache.get(list);
    if (result)
        return result;
    const map = list.tokens.reduce((tokenMap, tokenInfo) => {
        var _a, _b, _c;
        const tags = (_c = (_b = (_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.map(tagId => {
            var _a;
            if (!((_a = list.tags) === null || _a === void 0 ? void 0 : _a[tagId]))
                return undefined;
            return Object.assign(Object.assign({}, list.tags[tagId]), { id: tagId });
        })) === null || _b === void 0 ? void 0 : _b.filter((x) => Boolean(x))) !== null && _c !== void 0 ? _c : [];
        const token = new WrappedTokenInfo(tokenInfo, tags);
        if (tokenMap[token.chainId][token.address] !== undefined)
            throw Error('Duplicate tokens.');
        return Object.assign(Object.assign({}, tokenMap), { [token.chainId]: Object.assign(Object.assign({}, tokenMap[token.chainId]), { [token.address]: {
                    token,
                    list: list
                } }) });
    }, Object.assign({}, EMPTY_LIST));
    listCache === null || listCache === void 0 ? void 0 : listCache.set(list, map);
    return map;
}
exports.listToTokenMap = listToTokenMap;
function useAllLists() {
    return react_redux_1.useSelector(state => state.lists.byUrl);
}
exports.useAllLists = useAllLists;
function combineMaps(map1, map2) {
    return {
        1: Object.assign(Object.assign({}, map1[1]), map2[1]),
        3: Object.assign(Object.assign({}, map1[3]), map2[3]),
        4: Object.assign(Object.assign({}, map1[4]), map2[4]),
        5: Object.assign(Object.assign({}, map1[5]), map2[5]),
        42: Object.assign(Object.assign({}, map1[42]), map2[42])
    };
}
// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls) {
    const lists = useAllLists();
    return react_1.useMemo(() => {
        if (!urls)
            return EMPTY_LIST;
        return (urls
            .slice()
            // sort by priority so top priority goes last
            .sort(listSort_1.default)
            .reduce((allTokens, currentUrl) => {
            var _a;
            const current = (_a = lists[currentUrl]) === null || _a === void 0 ? void 0 : _a.current;
            if (!current)
                return allTokens;
            try {
                const newTokens = Object.assign(listToTokenMap(current));
                return combineMaps(allTokens, newTokens);
            }
            catch (error) {
                console.error('Could not show token list due to error', error);
                return allTokens;
            }
        }, EMPTY_LIST));
    }, [lists, urls]);
}
// filter out unsupported lists
function useActiveListUrls() {
    var _a;
    return (_a = react_redux_1.useSelector(state => state.lists.activeListUrls)) === null || _a === void 0 ? void 0 : _a.filter(url => !lists_1.UNSUPPORTED_LIST_URLS.includes(url));
}
exports.useActiveListUrls = useActiveListUrls;
function useInactiveListUrls() {
    const lists = useAllLists();
    const allActiveListUrls = useActiveListUrls();
    return Object.keys(lists).filter(url => !(allActiveListUrls === null || allActiveListUrls === void 0 ? void 0 : allActiveListUrls.includes(url)) && !lists_1.UNSUPPORTED_LIST_URLS.includes(url));
}
exports.useInactiveListUrls = useInactiveListUrls;
// get all the tokens from active lists, combine with local default tokens
function useCombinedActiveList() {
    const activeListUrls = useActiveListUrls();
    const activeTokens = useCombinedTokenMapFromUrls(activeListUrls);
    const defaultTokenMap = listToTokenMap(default_token_list_1.default);
    return combineMaps(activeTokens, defaultTokenMap);
}
exports.useCombinedActiveList = useCombinedActiveList;
// all tokens from inactive lists
function useCombinedInactiveList() {
    const allInactiveListUrls = useInactiveListUrls();
    return useCombinedTokenMapFromUrls(allInactiveListUrls);
}
exports.useCombinedInactiveList = useCombinedInactiveList;
// used to hide warnings on import for default tokens
function useDefaultTokenList() {
    return listToTokenMap(default_token_list_1.default);
}
exports.useDefaultTokenList = useDefaultTokenList;
// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
function useUnsupportedTokenList() {
    // get hard coded unsupported tokens
    const localUnsupportedListMap = listToTokenMap(uniswap_v2_unsupported_tokenlist_json_1.default);
    // get any loaded unsupported tokens
    const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(lists_1.UNSUPPORTED_LIST_URLS);
    // format into one token address map
    return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap);
}
exports.useUnsupportedTokenList = useUnsupportedTokenList;
function useIsListActive(url) {
    const activeListUrls = useActiveListUrls();
    return Boolean(activeListUrls === null || activeListUrls === void 0 ? void 0 : activeListUrls.includes(url));
}
exports.useIsListActive = useIsListActive;
