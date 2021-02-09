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
exports.useApproveCallbackFromTrade = exports.useApproveCallback = exports.ApprovalState = void 0;
const constants_1 = require("@ethersproject/constants");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const constants_2 = require("../constants");
const Allowances_1 = require("../data/Allowances");
const V1_1 = require("../data/V1");
const actions_1 = require("../state/swap/actions");
const hooks_1 = require("../state/transactions/hooks");
const prices_1 = require("../utils/prices");
const utils_1 = require("../utils");
const useContract_1 = require("./useContract");
const index_1 = require("./index");
const useToggledVersion_1 = require("./useToggledVersion");
var ApprovalState;
(function (ApprovalState) {
    ApprovalState[ApprovalState["UNKNOWN"] = 0] = "UNKNOWN";
    ApprovalState[ApprovalState["NOT_APPROVED"] = 1] = "NOT_APPROVED";
    ApprovalState[ApprovalState["PENDING"] = 2] = "PENDING";
    ApprovalState[ApprovalState["APPROVED"] = 3] = "APPROVED";
})(ApprovalState = exports.ApprovalState || (exports.ApprovalState = {}));
// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useApproveCallback(amountToApprove, spender) {
    const { account } = index_1.useActiveWeb3React();
    const token = amountToApprove instanceof sdk_1.TokenAmount ? amountToApprove.token : undefined;
    const currentAllowance = Allowances_1.useTokenAllowance(token, account !== null && account !== void 0 ? account : undefined, spender);
    const pendingApproval = hooks_1.useHasPendingApproval(token === null || token === void 0 ? void 0 : token.address, spender);
    // check the current approval status
    const approvalState = react_1.useMemo(() => {
        if (!amountToApprove || !spender)
            return ApprovalState.UNKNOWN;
        if (amountToApprove.currency === sdk_1.ETHER)
            return ApprovalState.APPROVED;
        // we might not have enough data to know whether or not we need to approve
        if (!currentAllowance)
            return ApprovalState.UNKNOWN;
        // amountToApprove will be defined if currentAllowance is
        return currentAllowance.lessThan(amountToApprove)
            ? pendingApproval
                ? ApprovalState.PENDING
                : ApprovalState.NOT_APPROVED
            : ApprovalState.APPROVED;
    }, [amountToApprove, currentAllowance, pendingApproval, spender]);
    const tokenContract = useContract_1.useTokenContract(token === null || token === void 0 ? void 0 : token.address);
    const addTransaction = hooks_1.useTransactionAdder();
    const approve = react_1.useCallback(() => __awaiter(this, void 0, void 0, function* () {
        if (approvalState !== ApprovalState.NOT_APPROVED) {
            console.error('approve was called unnecessarily');
            return;
        }
        if (!token) {
            console.error('no token');
            return;
        }
        if (!tokenContract) {
            console.error('tokenContract is null');
            return;
        }
        if (!amountToApprove) {
            console.error('missing amount to approve');
            return;
        }
        if (!spender) {
            console.error('no spender');
            return;
        }
        let useExact = false;
        const estimatedGas = yield tokenContract.estimateGas.approve(spender, constants_1.MaxUint256).catch(() => {
            // general fallback for tokens who restrict approval amounts
            useExact = true;
            return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString());
        });
        return tokenContract
            .approve(spender, useExact ? amountToApprove.raw.toString() : constants_1.MaxUint256, {
            gasLimit: utils_1.calculateGasMargin(estimatedGas)
        })
            .then((response) => {
            addTransaction(response, {
                summary: 'Approve ' + amountToApprove.currency.symbol,
                approval: { tokenAddress: token.address, spender: spender }
            });
        })
            .catch((error) => {
            console.debug('Failed to approve token', error);
            throw error;
        });
    }), [approvalState, token, tokenContract, amountToApprove, spender, addTransaction]);
    return [approvalState, approve];
}
exports.useApproveCallback = useApproveCallback;
// wraps useApproveCallback in the context of a swap
function useApproveCallbackFromTrade(trade, allowedSlippage = 0) {
    const amountToApprove = react_1.useMemo(() => (trade ? prices_1.computeSlippageAdjustedAmounts(trade, allowedSlippage)[actions_1.Field.INPUT] : undefined), [trade, allowedSlippage]);
    const tradeIsV1 = V1_1.getTradeVersion(trade) === useToggledVersion_1.Version.v1;
    const v1ExchangeAddress = V1_1.useV1TradeExchangeAddress(trade);
    return useApproveCallback(amountToApprove, tradeIsV1 ? v1ExchangeAddress : constants_2.ROUTER_ADDRESS);
}
exports.useApproveCallbackFromTrade = useApproveCallbackFromTrade;
