"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBurnActionHandlers = exports.useDerivedBurnInfo = exports.useBurnState = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const Reserves_1 = require("../../data/Reserves");
const TotalSupply_1 = require("../../data/TotalSupply");
const hooks_1 = require("../../hooks");
const wrappedCurrency_1 = require("../../utils/wrappedCurrency");
const hooks_2 = require("../swap/hooks");
const hooks_3 = require("../wallet/hooks");
const actions_1 = require("./actions");
function useBurnState() {
    return react_redux_1.useSelector(state => state.burn);
}
exports.useBurnState = useBurnState;
function useDerivedBurnInfo(currencyA, currencyB) {
    var _a, _b;
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const { independentField, typedValue } = useBurnState();
    // pair + totalsupply
    const [, pair] = Reserves_1.usePair(currencyA, currencyB);
    // balances
    const relevantTokenBalances = hooks_3.useTokenBalances(account !== null && account !== void 0 ? account : undefined, [pair === null || pair === void 0 ? void 0 : pair.liquidityToken]);
    const userLiquidity = relevantTokenBalances === null || relevantTokenBalances === void 0 ? void 0 : relevantTokenBalances[(_b = (_a = pair === null || pair === void 0 ? void 0 : pair.liquidityToken) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : ''];
    const [tokenA, tokenB] = [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)];
    const tokens = {
        [actions_1.Field.CURRENCY_A]: tokenA,
        [actions_1.Field.CURRENCY_B]: tokenB,
        [actions_1.Field.LIQUIDITY]: pair === null || pair === void 0 ? void 0 : pair.liquidityToken
    };
    // liquidity values
    const totalSupply = TotalSupply_1.useTotalSupply(pair === null || pair === void 0 ? void 0 : pair.liquidityToken);
    const liquidityValueA = pair &&
        totalSupply &&
        userLiquidity &&
        tokenA &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
        ? new sdk_1.TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
        : undefined;
    const liquidityValueB = pair &&
        totalSupply &&
        userLiquidity &&
        tokenB &&
        // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
        sdk_1.JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
        ? new sdk_1.TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
        : undefined;
    const liquidityValues = {
        [actions_1.Field.CURRENCY_A]: liquidityValueA,
        [actions_1.Field.CURRENCY_B]: liquidityValueB
    };
    let percentToRemove = new sdk_1.Percent('0', '100');
    // user specified a %
    if (independentField === actions_1.Field.LIQUIDITY_PERCENT) {
        percentToRemove = new sdk_1.Percent(typedValue, '100');
    }
    // user specified a specific amount of liquidity tokens
    else if (independentField === actions_1.Field.LIQUIDITY) {
        if (pair === null || pair === void 0 ? void 0 : pair.liquidityToken) {
            const independentAmount = hooks_2.tryParseAmount(typedValue, pair.liquidityToken);
            if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
                percentToRemove = new sdk_1.Percent(independentAmount.raw, userLiquidity.raw);
            }
        }
    }
    // user specified a specific amount of token a or b
    else {
        if (tokens[independentField]) {
            const independentAmount = hooks_2.tryParseAmount(typedValue, tokens[independentField]);
            const liquidityValue = liquidityValues[independentField];
            if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
                percentToRemove = new sdk_1.Percent(independentAmount.raw, liquidityValue.raw);
            }
        }
    }
    const parsedAmounts = {
        [actions_1.Field.LIQUIDITY_PERCENT]: percentToRemove,
        [actions_1.Field.LIQUIDITY]: userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
            ? new sdk_1.TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
            : undefined,
        [actions_1.Field.CURRENCY_A]: tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
            ? new sdk_1.TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
            : undefined,
        [actions_1.Field.CURRENCY_B]: tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
            ? new sdk_1.TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
            : undefined
    };
    let error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (!parsedAmounts[actions_1.Field.LIQUIDITY] || !parsedAmounts[actions_1.Field.CURRENCY_A] || !parsedAmounts[actions_1.Field.CURRENCY_B]) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    return { pair, parsedAmounts, error };
}
exports.useDerivedBurnInfo = useDerivedBurnInfo;
function useBurnActionHandlers() {
    const dispatch = react_redux_1.useDispatch();
    const onUserInput = react_1.useCallback((field, typedValue) => {
        dispatch(actions_1.typeInput({ field, typedValue }));
    }, [dispatch]);
    return {
        onUserInput
    };
}
exports.useBurnActionHandlers = useBurnActionHandlers;
