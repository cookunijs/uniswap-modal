"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const TransactionConfirmationModal_1 = __importStar(require("../TransactionConfirmationModal"));
const SwapModalFooter_1 = __importDefault(require("./SwapModalFooter"));
const SwapModalHeader_1 = __importDefault(require("./SwapModalHeader"));
/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA, tradeB) {
    return (tradeA.tradeType !== tradeB.tradeType ||
        !sdk_1.currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
        !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
        !sdk_1.currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
        !tradeA.outputAmount.equalTo(tradeB.outputAmount));
}
function ConfirmSwapModal({ trade, originalTrade, onAcceptChanges, allowedSlippage, onConfirm, onDismiss, recipient, swapErrorMessage, isOpen, attemptingTxn, txHash }) {
    var _a, _b, _c, _d, _e, _f;
    const showAcceptChanges = react_1.useMemo(() => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)), [originalTrade, trade]);
    const modalHeader = react_1.useCallback(() => {
        return trade ? (react_1.default.createElement(SwapModalHeader_1.default, { trade: trade, allowedSlippage: allowedSlippage, recipient: recipient, showAcceptChanges: showAcceptChanges, onAcceptChanges: onAcceptChanges })) : null;
    }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade]);
    const modalBottom = react_1.useCallback(() => {
        return trade ? (react_1.default.createElement(SwapModalFooter_1.default, { onConfirm: onConfirm, trade: trade, disabledConfirm: showAcceptChanges, swapErrorMessage: swapErrorMessage, allowedSlippage: allowedSlippage })) : null;
    }, [allowedSlippage, onConfirm, showAcceptChanges, swapErrorMessage, trade]);
    // text to show while loading
    const pendingText = `Swapping ${(_a = trade === null || trade === void 0 ? void 0 : trade.inputAmount) === null || _a === void 0 ? void 0 : _a.toSignificant(6)} ${(_c = (_b = trade === null || trade === void 0 ? void 0 : trade.inputAmount) === null || _b === void 0 ? void 0 : _b.currency) === null || _c === void 0 ? void 0 : _c.symbol} for ${(_d = trade === null || trade === void 0 ? void 0 : trade.outputAmount) === null || _d === void 0 ? void 0 : _d.toSignificant(6)} ${(_f = (_e = trade === null || trade === void 0 ? void 0 : trade.outputAmount) === null || _e === void 0 ? void 0 : _e.currency) === null || _f === void 0 ? void 0 : _f.symbol}`;
    const confirmationContent = react_1.useCallback(() => swapErrorMessage ? (react_1.default.createElement(TransactionConfirmationModal_1.TransactionErrorContent, { onDismiss: onDismiss, message: swapErrorMessage })) : (react_1.default.createElement(TransactionConfirmationModal_1.ConfirmationModalContent, { title: "Confirm Swap", onDismiss: onDismiss, topContent: modalHeader, bottomContent: modalBottom })), [onDismiss, modalBottom, modalHeader, swapErrorMessage]);
    return (react_1.default.createElement(TransactionConfirmationModal_1.default, { isOpen: isOpen, onDismiss: onDismiss, attemptingTxn: attemptingTxn, hash: txHash, content: confirmationContent, pendingText: pendingText }));
}
exports.default = ConfirmSwapModal;
