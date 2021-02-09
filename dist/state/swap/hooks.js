"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDefaultsFromURLSearch = exports.queryParametersToSwapState = exports.useDerivedSwapInfo = exports.tryParseAmount = exports.useSwapActionHandlers = exports.useSwapState = void 0;
const useENS_1 = __importDefault(require("../../hooks/useENS"));
const useToggledVersion_1 = require("../../hooks/useToggledVersion");
const units_1 = require("@ethersproject/units");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const V1_1 = require("../../data/V1");
const hooks_1 = require("../../hooks");
const Tokens_1 = require("../../hooks/Tokens");
const Trades_1 = require("../../hooks/Trades");
const useParsedQueryString_1 = __importDefault(require("../../hooks/useParsedQueryString"));
const utils_1 = require("../../utils");
const hooks_2 = require("../wallet/hooks");
const actions_1 = require("./actions");
const useToggledVersion_2 = __importDefault(require("../../hooks/useToggledVersion"));
const hooks_3 = require("../user/hooks");
const prices_1 = require("../../utils/prices");
function useSwapState() {
    return react_redux_1.useSelector(state => state.swap);
}
exports.useSwapState = useSwapState;
function useSwapActionHandlers() {
    const dispatch = react_redux_1.useDispatch();
    const onCurrencySelection = react_1.useCallback((field, currency) => {
        dispatch(actions_1.selectCurrency({
            field,
            currencyId: currency instanceof sdk_1.Token ? currency.address : currency === sdk_1.ETHER ? 'ETH' : ''
        }));
    }, [dispatch]);
    const onSwitchTokens = react_1.useCallback(() => {
        dispatch(actions_1.switchCurrencies());
    }, [dispatch]);
    const onUserInput = react_1.useCallback((field, typedValue) => {
        dispatch(actions_1.typeInput({ field, typedValue }));
    }, [dispatch]);
    const onChangeRecipient = react_1.useCallback((recipient) => {
        dispatch(actions_1.setRecipient({ recipient }));
    }, [dispatch]);
    return {
        onSwitchTokens,
        onCurrencySelection,
        onUserInput,
        onChangeRecipient
    };
}
exports.useSwapActionHandlers = useSwapActionHandlers;
// try to parse a user entered amount for a given token
function tryParseAmount(value, currency) {
    if (!value || !currency) {
        return undefined;
    }
    try {
        const typedValueParsed = units_1.parseUnits(value, currency.decimals).toString();
        if (typedValueParsed !== '0') {
            return currency instanceof sdk_1.Token
                ? new sdk_1.TokenAmount(currency, sdk_1.JSBI.BigInt(typedValueParsed))
                : sdk_1.CurrencyAmount.ether(sdk_1.JSBI.BigInt(typedValueParsed));
        }
    }
    catch (error) {
        // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
        console.debug(`Failed to parse input amount: "${value}"`, error);
    }
    // necessary for all paths to return a value
    return undefined;
}
exports.tryParseAmount = tryParseAmount;
const BAD_RECIPIENT_ADDRESSES = [
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' // v2 router 02
];
/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade, checksummedAddress) {
    return (trade.route.path.some(token => token.address === checksummedAddress) ||
        trade.route.pairs.some(pair => pair.liquidityToken.address === checksummedAddress));
}
// from the current swap inputs, compute the best trade and return it.
function useDerivedSwapInfo() {
    var _a, _b;
    const { account } = hooks_1.useActiveWeb3React();
    const toggledVersion = useToggledVersion_2.default();
    const { independentField, typedValue, [actions_1.Field.INPUT]: { currencyId: inputCurrencyId }, [actions_1.Field.OUTPUT]: { currencyId: outputCurrencyId }, recipient } = useSwapState();
    const inputCurrency = Tokens_1.useCurrency(inputCurrencyId);
    const outputCurrency = Tokens_1.useCurrency(outputCurrencyId);
    const recipientLookup = useENS_1.default(recipient !== null && recipient !== void 0 ? recipient : undefined);
    const to = (_a = (recipient === null ? account : recipientLookup.address)) !== null && _a !== void 0 ? _a : null;
    const relevantTokenBalances = hooks_2.useCurrencyBalances(account !== null && account !== void 0 ? account : undefined, [
        inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined,
        outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined
    ]);
    const isExactIn = independentField === actions_1.Field.INPUT;
    const parsedAmount = tryParseAmount(typedValue, (_b = (isExactIn ? inputCurrency : outputCurrency)) !== null && _b !== void 0 ? _b : undefined);
    const bestTradeExactIn = Trades_1.useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined);
    const bestTradeExactOut = Trades_1.useTradeExactOut(inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined, !isExactIn ? parsedAmount : undefined);
    const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;
    const currencyBalances = {
        [actions_1.Field.INPUT]: relevantTokenBalances[0],
        [actions_1.Field.OUTPUT]: relevantTokenBalances[1]
    };
    const currencies = {
        [actions_1.Field.INPUT]: inputCurrency !== null && inputCurrency !== void 0 ? inputCurrency : undefined,
        [actions_1.Field.OUTPUT]: outputCurrency !== null && outputCurrency !== void 0 ? outputCurrency : undefined
    };
    // get link to trade on v1, if a better rate exists
    const v1Trade = V1_1.useV1Trade(isExactIn, currencies[actions_1.Field.INPUT], currencies[actions_1.Field.OUTPUT], parsedAmount);
    let inputError;
    if (!account) {
        inputError = 'Connect Wallet';
    }
    if (!parsedAmount) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Enter an amount';
    }
    if (!currencies[actions_1.Field.INPUT] || !currencies[actions_1.Field.OUTPUT]) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Select a token';
    }
    const formattedTo = utils_1.isAddress(to);
    if (!to || !formattedTo) {
        inputError = inputError !== null && inputError !== void 0 ? inputError : 'Enter a recipient';
    }
    else {
        if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
            (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
            (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))) {
            inputError = inputError !== null && inputError !== void 0 ? inputError : 'Invalid recipient';
        }
    }
    const [allowedSlippage] = hooks_3.useUserSlippageTolerance();
    const slippageAdjustedAmounts = v2Trade && allowedSlippage && prices_1.computeSlippageAdjustedAmounts(v2Trade, allowedSlippage);
    const slippageAdjustedAmountsV1 = v1Trade && allowedSlippage && prices_1.computeSlippageAdjustedAmounts(v1Trade, allowedSlippage);
    // compare input balance to max input based on version
    const [balanceIn, amountIn] = [
        currencyBalances[actions_1.Field.INPUT],
        toggledVersion === useToggledVersion_1.Version.v1
            ? slippageAdjustedAmountsV1
                ? slippageAdjustedAmountsV1[actions_1.Field.INPUT]
                : null
            : slippageAdjustedAmounts
                ? slippageAdjustedAmounts[actions_1.Field.INPUT]
                : null
    ];
    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
        inputError = 'Insufficient ' + amountIn.currency.symbol + ' balance';
    }
    return {
        currencies,
        currencyBalances,
        parsedAmount,
        v2Trade: v2Trade !== null && v2Trade !== void 0 ? v2Trade : undefined,
        inputError,
        v1Trade
    };
}
exports.useDerivedSwapInfo = useDerivedSwapInfo;
function parseCurrencyFromURLParameter(urlParam) {
    var _a;
    if (typeof urlParam === 'string') {
        const valid = utils_1.isAddress(urlParam);
        if (valid)
            return valid;
        if (urlParam.toUpperCase() === 'ETH')
            return 'ETH';
        if (valid === false)
            return 'ETH';
    }
    return (_a = 'ETH') !== null && _a !== void 0 ? _a : '';
}
function parseTokenAmountURLParameter(urlParam) {
    return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : '';
}
function parseIndependentFieldURLParameter(urlParam) {
    return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? actions_1.Field.OUTPUT : actions_1.Field.INPUT;
}
const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient) {
    if (typeof recipient !== 'string')
        return null;
    const address = utils_1.isAddress(recipient);
    if (address)
        return address;
    if (ENS_NAME_REGEX.test(recipient))
        return recipient;
    if (ADDRESS_REGEX.test(recipient))
        return recipient;
    return null;
}
function queryParametersToSwapState(parsedQs) {
    let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency);
    let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency);
    if (inputCurrency === outputCurrency) {
        if (typeof parsedQs.outputCurrency === 'string') {
            inputCurrency = '';
        }
        else {
            outputCurrency = '';
        }
    }
    const recipient = validatedRecipient(parsedQs.recipient);
    return {
        [actions_1.Field.INPUT]: {
            currencyId: inputCurrency
        },
        [actions_1.Field.OUTPUT]: {
            currencyId: outputCurrency
        },
        typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
        independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
        recipient
    };
}
exports.queryParametersToSwapState = queryParametersToSwapState;
// updates the swap state to use the defaults for a given network
function useDefaultsFromURLSearch() {
    const { chainId } = hooks_1.useActiveWeb3React();
    const dispatch = react_redux_1.useDispatch();
    const parsedQs = useParsedQueryString_1.default();
    const [result, setResult] = react_1.useState();
    react_1.useEffect(() => {
        if (!chainId)
            return;
        const parsed = queryParametersToSwapState(parsedQs);
        dispatch(actions_1.replaceSwapState({
            typedValue: parsed.typedValue,
            field: parsed.independentField,
            inputCurrencyId: parsed[actions_1.Field.INPUT].currencyId,
            outputCurrencyId: parsed[actions_1.Field.OUTPUT].currencyId,
            recipient: parsed.recipient
        }));
        setResult({ inputCurrencyId: parsed[actions_1.Field.INPUT].currencyId, outputCurrencyId: parsed[actions_1.Field.OUTPUT].currencyId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, chainId]);
    return result;
}
exports.useDefaultsFromURLSearch = useDefaultsFromURLSearch;
