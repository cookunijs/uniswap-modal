"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDerivedMintInfo = exports.useMintActionHandlers = exports.useMintState = void 0;
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
const ZERO = sdk_1.JSBI.BigInt(0);
function useMintState() {
    return react_redux_1.useSelector(state => state.mint);
}
exports.useMintState = useMintState;
function useMintActionHandlers(noLiquidity) {
    const dispatch = react_redux_1.useDispatch();
    const onFieldAInput = react_1.useCallback((typedValue) => {
        dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }));
    }, [dispatch, noLiquidity]);
    const onFieldBInput = react_1.useCallback((typedValue) => {
        dispatch(actions_1.typeInput({ field: actions_1.Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }));
    }, [dispatch, noLiquidity]);
    return {
        onFieldAInput,
        onFieldBInput
    };
}
exports.useMintActionHandlers = useMintActionHandlers;
function useDerivedMintInfo(currencyA, currencyB) {
    var _a, _b, _c, _d;
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const { independentField, typedValue, otherTypedValue } = useMintState();
    const dependentField = independentField === actions_1.Field.CURRENCY_A ? actions_1.Field.CURRENCY_B : actions_1.Field.CURRENCY_A;
    // tokens
    const currencies = react_1.useMemo(() => ({
        [actions_1.Field.CURRENCY_A]: currencyA !== null && currencyA !== void 0 ? currencyA : undefined,
        [actions_1.Field.CURRENCY_B]: currencyB !== null && currencyB !== void 0 ? currencyB : undefined
    }), [currencyA, currencyB]);
    // pair
    const [pairState, pair] = Reserves_1.usePair(currencies[actions_1.Field.CURRENCY_A], currencies[actions_1.Field.CURRENCY_B]);
    const totalSupply = TotalSupply_1.useTotalSupply(pair === null || pair === void 0 ? void 0 : pair.liquidityToken);
    const noLiquidity = pairState === Reserves_1.PairState.NOT_EXISTS || Boolean(totalSupply && sdk_1.JSBI.equal(totalSupply.raw, ZERO));
    // balances
    const balances = hooks_3.useCurrencyBalances(account !== null && account !== void 0 ? account : undefined, [
        currencies[actions_1.Field.CURRENCY_A],
        currencies[actions_1.Field.CURRENCY_B]
    ]);
    const currencyBalances = {
        [actions_1.Field.CURRENCY_A]: balances[0],
        [actions_1.Field.CURRENCY_B]: balances[1]
    };
    // amounts
    const independentAmount = hooks_2.tryParseAmount(typedValue, currencies[independentField]);
    const dependentAmount = react_1.useMemo(() => {
        if (noLiquidity) {
            if (otherTypedValue && currencies[dependentField]) {
                return hooks_2.tryParseAmount(otherTypedValue, currencies[dependentField]);
            }
            return undefined;
        }
        else if (independentAmount) {
            // we wrap the currencies just to get the price in terms of the other token
            const wrappedIndependentAmount = wrappedCurrency_1.wrappedCurrencyAmount(independentAmount, chainId);
            const [tokenA, tokenB] = [wrappedCurrency_1.wrappedCurrency(currencyA, chainId), wrappedCurrency_1.wrappedCurrency(currencyB, chainId)];
            if (tokenA && tokenB && wrappedIndependentAmount && pair) {
                const dependentCurrency = dependentField === actions_1.Field.CURRENCY_B ? currencyB : currencyA;
                const dependentTokenAmount = dependentField === actions_1.Field.CURRENCY_B
                    ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
                    : pair.priceOf(tokenB).quote(wrappedIndependentAmount);
                return dependentCurrency === sdk_1.ETHER ? sdk_1.CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount;
            }
            return undefined;
        }
        else {
            return undefined;
        }
    }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, chainId, currencyB, pair]);
    const parsedAmounts = {
        [actions_1.Field.CURRENCY_A]: independentField === actions_1.Field.CURRENCY_A ? independentAmount : dependentAmount,
        [actions_1.Field.CURRENCY_B]: independentField === actions_1.Field.CURRENCY_A ? dependentAmount : independentAmount
    };
    const price = react_1.useMemo(() => {
        if (noLiquidity) {
            const { [actions_1.Field.CURRENCY_A]: currencyAAmount, [actions_1.Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;
            if (currencyAAmount && currencyBAmount) {
                return new sdk_1.Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw);
            }
            return undefined;
        }
        else {
            const wrappedCurrencyA = wrappedCurrency_1.wrappedCurrency(currencyA, chainId);
            return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined;
        }
    }, [chainId, currencyA, noLiquidity, pair, parsedAmounts]);
    // liquidity minted
    const liquidityMinted = react_1.useMemo(() => {
        const { [actions_1.Field.CURRENCY_A]: currencyAAmount, [actions_1.Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;
        const [tokenAmountA, tokenAmountB] = [
            wrappedCurrency_1.wrappedCurrencyAmount(currencyAAmount, chainId),
            wrappedCurrency_1.wrappedCurrencyAmount(currencyBAmount, chainId)
        ];
        if (pair && totalSupply && tokenAmountA && tokenAmountB) {
            return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
        }
        else {
            return undefined;
        }
    }, [parsedAmounts, chainId, pair, totalSupply]);
    const poolTokenPercentage = react_1.useMemo(() => {
        if (liquidityMinted && totalSupply) {
            return new sdk_1.Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw);
        }
        else {
            return undefined;
        }
    }, [liquidityMinted, totalSupply]);
    let error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (pairState === Reserves_1.PairState.INVALID) {
        error = error !== null && error !== void 0 ? error : 'Invalid pair';
    }
    if (!parsedAmounts[actions_1.Field.CURRENCY_A] || !parsedAmounts[actions_1.Field.CURRENCY_B]) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    const { [actions_1.Field.CURRENCY_A]: currencyAAmount, [actions_1.Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;
    if (currencyAAmount && ((_a = currencyBalances === null || currencyBalances === void 0 ? void 0 : currencyBalances[actions_1.Field.CURRENCY_A]) === null || _a === void 0 ? void 0 : _a.lessThan(currencyAAmount))) {
        error = 'Insufficient ' + ((_b = currencies[actions_1.Field.CURRENCY_A]) === null || _b === void 0 ? void 0 : _b.symbol) + ' balance';
    }
    if (currencyBAmount && ((_c = currencyBalances === null || currencyBalances === void 0 ? void 0 : currencyBalances[actions_1.Field.CURRENCY_B]) === null || _c === void 0 ? void 0 : _c.lessThan(currencyBAmount))) {
        error = 'Insufficient ' + ((_d = currencies[actions_1.Field.CURRENCY_B]) === null || _d === void 0 ? void 0 : _d.symbol) + ' balance';
    }
    return {
        dependentField,
        currencies,
        pair,
        pairState,
        currencyBalances,
        parsedAmounts,
        price,
        noLiquidity,
        liquidityMinted,
        poolTokenPercentage,
        error
    };
}
exports.useDerivedMintInfo = useDerivedMintInfo;
