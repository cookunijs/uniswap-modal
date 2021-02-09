"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackedTokenPairs = exports.toV2LiquidityToken = exports.useURLWarningToggle = exports.useURLWarningVisible = exports.usePairAdder = exports.useUserAddedTokens = exports.useRemoveUserAddedToken = exports.useAddUserToken = exports.useUserTransactionTTL = exports.useUserSlippageTolerance = exports.useUserSingleHopOnly = exports.useExpertModeManager = exports.useIsExpertMode = exports.useDarkModeManager = exports.useIsDarkMode = void 0;
const sdk_1 = require("@uniswap/sdk");
const lodash_flatmap_1 = __importDefault(require("lodash.flatmap"));
const react_ga_1 = __importDefault(require("react-ga"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const constants_1 = require("../../constants");
const hooks_1 = require("../../hooks");
const Tokens_1 = require("../../hooks/Tokens");
const actions_1 = require("./actions");
function serializeToken(token) {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name
    };
}
function deserializeToken(serializedToken) {
    return new sdk_1.Token(serializedToken.chainId, serializedToken.address, serializedToken.decimals, serializedToken.symbol, serializedToken.name);
}
function useIsDarkMode() {
    const { userDarkMode, matchesDarkMode } = react_redux_1.useSelector(({ user: { matchesDarkMode, userDarkMode } }) => ({
        userDarkMode,
        matchesDarkMode
    }), react_redux_1.shallowEqual);
    return userDarkMode === null ? matchesDarkMode : userDarkMode;
}
exports.useIsDarkMode = useIsDarkMode;
function useDarkModeManager() {
    const dispatch = react_redux_1.useDispatch();
    const darkMode = useIsDarkMode();
    const toggleSetDarkMode = react_1.useCallback(() => {
        dispatch(actions_1.updateUserDarkMode({ userDarkMode: !darkMode }));
    }, [darkMode, dispatch]);
    return [darkMode, toggleSetDarkMode];
}
exports.useDarkModeManager = useDarkModeManager;
function useIsExpertMode() {
    return react_redux_1.useSelector(state => state.user.userExpertMode);
}
exports.useIsExpertMode = useIsExpertMode;
function useExpertModeManager() {
    const dispatch = react_redux_1.useDispatch();
    const expertMode = useIsExpertMode();
    const toggleSetExpertMode = react_1.useCallback(() => {
        dispatch(actions_1.updateUserExpertMode({ userExpertMode: !expertMode }));
    }, [expertMode, dispatch]);
    return [expertMode, toggleSetExpertMode];
}
exports.useExpertModeManager = useExpertModeManager;
function useUserSingleHopOnly() {
    const dispatch = react_redux_1.useDispatch();
    const singleHopOnly = react_redux_1.useSelector(state => state.user.userSingleHopOnly);
    const setSingleHopOnly = react_1.useCallback((newSingleHopOnly) => {
        react_ga_1.default.event({
            category: 'Routing',
            action: newSingleHopOnly ? 'enable single hop' : 'disable single hop'
        });
        dispatch(actions_1.updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }));
    }, [dispatch]);
    return [singleHopOnly, setSingleHopOnly];
}
exports.useUserSingleHopOnly = useUserSingleHopOnly;
function useUserSlippageTolerance() {
    const dispatch = react_redux_1.useDispatch();
    const userSlippageTolerance = react_redux_1.useSelector(state => {
        return state.user.userSlippageTolerance;
    });
    const setUserSlippageTolerance = react_1.useCallback((userSlippageTolerance) => {
        dispatch(actions_1.updateUserSlippageTolerance({ userSlippageTolerance }));
    }, [dispatch]);
    return [userSlippageTolerance, setUserSlippageTolerance];
}
exports.useUserSlippageTolerance = useUserSlippageTolerance;
function useUserTransactionTTL() {
    const dispatch = react_redux_1.useDispatch();
    const userDeadline = react_redux_1.useSelector(state => {
        return state.user.userDeadline;
    });
    const setUserDeadline = react_1.useCallback((userDeadline) => {
        dispatch(actions_1.updateUserDeadline({ userDeadline }));
    }, [dispatch]);
    return [userDeadline, setUserDeadline];
}
exports.useUserTransactionTTL = useUserTransactionTTL;
function useAddUserToken() {
    const dispatch = react_redux_1.useDispatch();
    return react_1.useCallback((token) => {
        dispatch(actions_1.addSerializedToken({ serializedToken: serializeToken(token) }));
    }, [dispatch]);
}
exports.useAddUserToken = useAddUserToken;
function useRemoveUserAddedToken() {
    const dispatch = react_redux_1.useDispatch();
    return react_1.useCallback((chainId, address) => {
        dispatch(actions_1.removeSerializedToken({ chainId, address }));
    }, [dispatch]);
}
exports.useRemoveUserAddedToken = useRemoveUserAddedToken;
function useUserAddedTokens() {
    const { chainId } = hooks_1.useActiveWeb3React();
    const serializedTokensMap = react_redux_1.useSelector(({ user: { tokens } }) => tokens);
    return react_1.useMemo(() => {
        var _a;
        if (!chainId)
            return [];
        return Object.values((_a = serializedTokensMap[chainId]) !== null && _a !== void 0 ? _a : {}).map(deserializeToken);
    }, [serializedTokensMap, chainId]);
}
exports.useUserAddedTokens = useUserAddedTokens;
function serializePair(pair) {
    return {
        token0: serializeToken(pair.token0),
        token1: serializeToken(pair.token1)
    };
}
function usePairAdder() {
    const dispatch = react_redux_1.useDispatch();
    return react_1.useCallback((pair) => {
        dispatch(actions_1.addSerializedPair({ serializedPair: serializePair(pair) }));
    }, [dispatch]);
}
exports.usePairAdder = usePairAdder;
function useURLWarningVisible() {
    return react_redux_1.useSelector((state) => state.user.URLWarningVisible);
}
exports.useURLWarningVisible = useURLWarningVisible;
function useURLWarningToggle() {
    const dispatch = react_redux_1.useDispatch();
    return react_1.useCallback(() => dispatch(actions_1.toggleURLWarning()), [dispatch]);
}
exports.useURLWarningToggle = useURLWarningToggle;
/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
function toV2LiquidityToken([tokenA, tokenB]) {
    return new sdk_1.Token(tokenA.chainId, sdk_1.Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2');
}
exports.toV2LiquidityToken = toV2LiquidityToken;
/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
function useTrackedTokenPairs() {
    const { chainId } = hooks_1.useActiveWeb3React();
    const tokens = Tokens_1.useAllTokens();
    // pinned pairs
    const pinnedPairs = react_1.useMemo(() => { var _a; return (chainId ? (_a = constants_1.PINNED_PAIRS[chainId]) !== null && _a !== void 0 ? _a : [] : []); }, [chainId]);
    // pairs for every token against every base
    const generatedPairs = react_1.useMemo(() => chainId
        ? lodash_flatmap_1.default(Object.keys(tokens), tokenAddress => {
            var _a;
            const token = tokens[tokenAddress];
            // for each token on the current chain,
            return (
            // loop though all bases on the current chain
            ((_a = constants_1.BASES_TO_TRACK_LIQUIDITY_FOR[chainId]) !== null && _a !== void 0 ? _a : [])
                // to construct pairs of the given token with each base
                .map(base => {
                if (base.address === token.address) {
                    return null;
                }
                else {
                    return [base, token];
                }
            })
                .filter((p) => p !== null));
        })
        : [], [tokens, chainId]);
    // pairs saved by users
    const savedSerializedPairs = react_redux_1.useSelector(({ user: { pairs } }) => pairs);
    const userPairs = react_1.useMemo(() => {
        if (!chainId || !savedSerializedPairs)
            return [];
        const forChain = savedSerializedPairs[chainId];
        if (!forChain)
            return [];
        return Object.keys(forChain).map(pairId => {
            return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)];
        });
    }, [savedSerializedPairs, chainId]);
    const combinedList = react_1.useMemo(() => userPairs.concat(generatedPairs).concat(pinnedPairs), [
        generatedPairs,
        pinnedPairs,
        userPairs
    ]);
    return react_1.useMemo(() => {
        // dedupes pairs of tokens in the combined list
        const keyed = combinedList.reduce((memo, [tokenA, tokenB]) => {
            const sorted = tokenA.sortsBefore(tokenB);
            const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`;
            if (memo[key])
                return memo;
            memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
            return memo;
        }, {});
        return Object.keys(keyed).map(key => keyed[key]);
    }, [combinedList]);
}
exports.useTrackedTokenPairs = useTrackedTokenPairs;
