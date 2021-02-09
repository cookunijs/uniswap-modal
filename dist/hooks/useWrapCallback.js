"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapType = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const hooks_1 = require("../state/swap/hooks");
const hooks_2 = require("../state/transactions/hooks");
const hooks_3 = require("../state/wallet/hooks");
const index_1 = require("./index");
const useContract_1 = require("./useContract");
var WrapType;
(function (WrapType) {
    WrapType[WrapType["NOT_APPLICABLE"] = 0] = "NOT_APPLICABLE";
    WrapType[WrapType["WRAP"] = 1] = "WRAP";
    WrapType[WrapType["UNWRAP"] = 2] = "UNWRAP";
})(WrapType = exports.WrapType || (exports.WrapType = {}));
const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
function useWrapCallback(inputCurrency, outputCurrency, typedValue) {
    const { chainId, account } = index_1.useActiveWeb3React();
    const wethContract = useContract_1.useWETHContract();
    const balance = hooks_3.useCurrencyBalance(account !== null && account !== void 0 ? account : undefined, inputCurrency);
    // we can always parse the amount typed as the input currency, since wrapping is 1:1
    const inputAmount = react_1.useMemo(() => hooks_1.tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue]);
    const addTransaction = hooks_2.useTransactionAdder();
    return react_1.useMemo(() => {
        if (!wethContract || !chainId || !inputCurrency || !outputCurrency)
            return NOT_APPLICABLE;
        const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);
        if (inputCurrency === sdk_1.ETHER && sdk_1.currencyEquals(sdk_1.WETH[chainId], outputCurrency)) {
            return {
                wrapType: WrapType.WRAP,
                execute: sufficientBalance && inputAmount
                    ? () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const txReceipt = yield wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` });
                            addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to WETH` });
                        }
                        catch (error) {
                            console.error('Could not deposit', error);
                        }
                    })
                    : undefined,
                inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
            };
        }
        else if (sdk_1.currencyEquals(sdk_1.WETH[chainId], inputCurrency) && outputCurrency === sdk_1.ETHER) {
            return {
                wrapType: WrapType.UNWRAP,
                execute: sufficientBalance && inputAmount
                    ? () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const txReceipt = yield wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`);
                            addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WETH to ETH` });
                        }
                        catch (error) {
                            console.error('Could not withdraw', error);
                        }
                    })
                    : undefined,
                inputError: sufficientBalance ? undefined : 'Insufficient WETH balance'
            };
        }
        else {
            return NOT_APPLICABLE;
        }
    }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction]);
}
exports.default = useWrapCallback;
