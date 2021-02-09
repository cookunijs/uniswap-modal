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
exports.ClickableText = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const react_ga_1 = __importDefault(require("react-ga"));
const rebass_1 = require("rebass");
const styled_components_1 = __importStar(require("styled-components"));
const AddressInputPanel_1 = __importDefault(require("../components/AddressInputPanel"));
const Button_1 = require("../components/Button");
const Card_1 = __importStar(require("../components/Card"));
const Column_1 = __importStar(require("../components/Column"));
const ConfirmSwapModal_1 = __importDefault(require("../components/swap/ConfirmSwapModal"));
const CurrencyInputPanel_1 = __importDefault(require("../components/CurrencyInputPanel"));
const NavigationTabs_1 = require("../components/NavigationTabs");
const Row_1 = require("../components/Row");
const AdvancedSwapDetailsDropdown_1 = __importDefault(require("../components/swap/AdvancedSwapDetailsDropdown"));
const BetterTradeLink_1 = __importStar(require("../components/swap/BetterTradeLink"));
const confirmPriceImpactWithoutFee_1 = __importDefault(require("../components/swap/confirmPriceImpactWithoutFee"));
const styleds_1 = require("../components/swap/styleds");
const TradePrice_1 = __importDefault(require("../components/swap/TradePrice"));
const TokenWarningModal_1 = __importDefault(require("../components/TokenWarningModal"));
const ProgressSteps_1 = __importDefault(require("../components/ProgressSteps"));
const SwapHeader_1 = __importDefault(require("../components/swap/SwapHeader"));
const constants_1 = require("../constants");
const V1_1 = require("../data/V1");
const hooks_1 = require("../hooks");
const Tokens_1 = require("../hooks/Tokens");
const useApproveCallback_1 = require("../hooks/useApproveCallback");
const useENSAddress_1 = __importDefault(require("../hooks/useENSAddress"));
const useSwapCallback_1 = require("../hooks/useSwapCallback");
const useToggledVersion_1 = __importStar(require("../hooks/useToggledVersion"));
const useWrapCallback_1 = __importStar(require("../hooks/useWrapCallback"));
const hooks_2 = require("../state/application/hooks");
const actions_1 = require("../state/swap/actions");
const hooks_3 = require("../state/swap/hooks");
const hooks_4 = require("../state/user/hooks");
const theme_1 = require("../theme");
const maxAmountSpend_1 = require("../utils/maxAmountSpend");
const prices_1 = require("../utils/prices");
const AppBody_1 = __importDefault(require("../AppBody"));
const Loader_1 = __importDefault(require("../components/Loader"));
const Trades_1 = require("hooks/Trades");
const UnsupportedCurrencyFooter_1 = __importDefault(require("components/swap/UnsupportedCurrencyFooter"));
const trades_1 = require("utils/trades");
const sdk_2 = require("@uniswap/sdk");
// import { useTranslation } from 'react-i18next'
const hooks_5 = require("../state/wallet/hooks");
const Card_2 = require("../components/Card");
const Web3Status_1 = __importDefault(require("../components/Web3Status"));
const Web3Controls = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  padding: 12px 1rem 0px 1rem;
  margin-bottom: 2px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`;
const Web3Element = styled_components_1.default.div `
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;
const AccountElement = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`;
const NetworkCard = styled_components_1.default(Card_2.YellowCard) `
  border-radius: 12px;
  padding: 8px 12px;
`;
const BalanceText = styled_components_1.default(rebass_1.Text) `
  ${({ theme }) => theme.mediaWidth.upToExtraSmall `
    display: none;
  `};
`;
exports.ClickableText = styled_components_1.default(rebass_1.Text) `
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`;
const NETWORK_LABELS = {
    [sdk_2.ChainId.RINKEBY]: 'Rinkeby',
    [sdk_2.ChainId.ROPSTEN]: 'Ropsten',
    [sdk_2.ChainId.GÖRLI]: 'Görli',
    [sdk_2.ChainId.KOVAN]: 'Kovan'
};
function Swap() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const loadedUrlParams = hooks_3.useDefaultsFromURLSearch();
    // token warning stuff
    const [loadedInputCurrency, loadedOutputCurrency] = [
        Tokens_1.useCurrency(loadedUrlParams === null || loadedUrlParams === void 0 ? void 0 : loadedUrlParams.inputCurrencyId),
        Tokens_1.useCurrency(loadedUrlParams === null || loadedUrlParams === void 0 ? void 0 : loadedUrlParams.outputCurrencyId)
    ];
    const [dismissTokenWarning, setDismissTokenWarning] = react_1.useState(false);
    const urlLoadedTokens = react_1.useMemo(() => { var _a, _b; return (_b = (_a = [loadedInputCurrency, loadedOutputCurrency]) === null || _a === void 0 ? void 0 : _a.filter((c) => c instanceof sdk_1.Token)) !== null && _b !== void 0 ? _b : []; }, [loadedInputCurrency, loadedOutputCurrency]);
    const handleConfirmTokenWarning = react_1.useCallback(() => {
        setDismissTokenWarning(true);
    }, []);
    // dismiss warning if all imported tokens are in active lists
    const defaultTokens = Tokens_1.useAllTokens();
    const importTokensNotInDefault = urlLoadedTokens &&
        urlLoadedTokens.filter((token) => {
            return !Boolean(token.address in defaultTokens);
        });
    const { account, chainId } = hooks_1.useActiveWeb3React();
    // const { t } = useTranslation()
    const userEthBalance = (_a = hooks_5.useETHBalances(account ? [account] : [])) === null || _a === void 0 ? void 0 : _a[account !== null && account !== void 0 ? account : ''];
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    // toggle wallet when disconnected
    // for expert mode
    const toggleSettings = hooks_2.useToggleSettingsMenu();
    const [isExpertMode] = hooks_4.useExpertModeManager();
    // get custom setting values for user
    const [allowedSlippage] = hooks_4.useUserSlippageTolerance();
    // swap state
    const { independentField, typedValue, recipient } = hooks_3.useSwapState();
    const { v1Trade, v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = hooks_3.useDerivedSwapInfo();
    const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback_1.default(currencies[actions_1.Field.INPUT], currencies[actions_1.Field.OUTPUT], typedValue);
    const showWrap = wrapType !== useWrapCallback_1.WrapType.NOT_APPLICABLE;
    const { address: recipientAddress } = useENSAddress_1.default(recipient);
    const toggledVersion = useToggledVersion_1.default();
    const tradesByVersion = {
        [useToggledVersion_1.Version.v1]: v1Trade,
        [useToggledVersion_1.Version.v2]: v2Trade
    };
    const trade = showWrap ? undefined : tradesByVersion[toggledVersion];
    const defaultTrade = showWrap ? undefined : tradesByVersion[useToggledVersion_1.DEFAULT_VERSION];
    const betterTradeLinkV2 = toggledVersion === useToggledVersion_1.Version.v1 && trades_1.isTradeBetter(v1Trade, v2Trade) ? useToggledVersion_1.Version.v2 : undefined;
    const parsedAmounts = showWrap
        ? {
            [actions_1.Field.INPUT]: parsedAmount,
            [actions_1.Field.OUTPUT]: parsedAmount
        }
        : {
            [actions_1.Field.INPUT]: independentField === actions_1.Field.INPUT ? parsedAmount : trade === null || trade === void 0 ? void 0 : trade.inputAmount,
            [actions_1.Field.OUTPUT]: independentField === actions_1.Field.OUTPUT ? parsedAmount : trade === null || trade === void 0 ? void 0 : trade.outputAmount
        };
    const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = hooks_3.useSwapActionHandlers();
    const isValid = !swapInputError;
    const dependentField = independentField === actions_1.Field.INPUT ? actions_1.Field.OUTPUT : actions_1.Field.INPUT;
    const handleTypeInput = react_1.useCallback((value) => {
        onUserInput(actions_1.Field.INPUT, value);
    }, [onUserInput]);
    const handleTypeOutput = react_1.useCallback((value) => {
        onUserInput(actions_1.Field.OUTPUT, value);
    }, [onUserInput]);
    // modal and loading
    const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = react_1.useState({
        showConfirm: false,
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined
    });
    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: showWrap
            ? (_c = (_b = parsedAmounts[independentField]) === null || _b === void 0 ? void 0 : _b.toExact()) !== null && _c !== void 0 ? _c : '' : (_e = (_d = parsedAmounts[dependentField]) === null || _d === void 0 ? void 0 : _d.toSignificant(6)) !== null && _e !== void 0 ? _e : ''
    };
    const route = trade === null || trade === void 0 ? void 0 : trade.route;
    const userHasSpecifiedInputOutput = Boolean(currencies[actions_1.Field.INPUT] && currencies[actions_1.Field.OUTPUT] && ((_f = parsedAmounts[independentField]) === null || _f === void 0 ? void 0 : _f.greaterThan(sdk_1.JSBI.BigInt(0))));
    const noRoute = !route;
    // check whether the user has approved the router on the input token
    const [approval, approveCallback] = useApproveCallback_1.useApproveCallbackFromTrade(trade, allowedSlippage);
    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = react_1.useState(false);
    // mark when a user has submitted an approval, reset onTokenSelection for input field
    react_1.useEffect(() => {
        if (approval === useApproveCallback_1.ApprovalState.PENDING) {
            setApprovalSubmitted(true);
        }
    }, [approval, approvalSubmitted]);
    const maxAmountInput = maxAmountSpend_1.maxAmountSpend(currencyBalances[actions_1.Field.INPUT]);
    const atMaxAmountInput = Boolean(maxAmountInput && ((_g = parsedAmounts[actions_1.Field.INPUT]) === null || _g === void 0 ? void 0 : _g.equalTo(maxAmountInput)));
    // the callback to execute the swap
    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback_1.useSwapCallback(trade, allowedSlippage, recipient);
    const { priceImpactWithoutFee } = prices_1.computeTradePriceBreakdown(trade);
    const [singleHopOnly] = hooks_4.useUserSingleHopOnly();
    const handleSwap = react_1.useCallback(() => {
        if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee_1.default(priceImpactWithoutFee)) {
            return;
        }
        if (!swapCallback) {
            return;
        }
        setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });
        swapCallback()
            .then(hash => {
            var _a, _b, _c, _d;
            setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash });
            react_ga_1.default.event({
                category: 'Swap',
                action: recipient === null
                    ? 'Swap w/o Send'
                    : (recipientAddress !== null && recipientAddress !== void 0 ? recipientAddress : recipient) === account
                        ? 'Swap w/o Send + recipient'
                        : 'Swap w/ Send',
                label: [
                    (_b = (_a = trade === null || trade === void 0 ? void 0 : trade.inputAmount) === null || _a === void 0 ? void 0 : _a.currency) === null || _b === void 0 ? void 0 : _b.symbol,
                    (_d = (_c = trade === null || trade === void 0 ? void 0 : trade.outputAmount) === null || _c === void 0 ? void 0 : _c.currency) === null || _d === void 0 ? void 0 : _d.symbol,
                    V1_1.getTradeVersion(trade)
                ].join('/')
            });
            react_ga_1.default.event({
                category: 'Routing',
                action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
            });
        })
            .catch(error => {
            setSwapState({
                attemptingTxn: false,
                tradeToConfirm,
                showConfirm,
                swapErrorMessage: error.message,
                txHash: undefined
            });
        });
    }, [
        priceImpactWithoutFee,
        swapCallback,
        tradeToConfirm,
        showConfirm,
        recipient,
        recipientAddress,
        account,
        trade,
        singleHopOnly
    ]);
    // errors
    const [showInverted, setShowInverted] = react_1.useState(false);
    // warnings on slippage
    const priceImpactSeverity = prices_1.warningSeverity(priceImpactWithoutFee);
    // show approve flow when: no error on inputs, not approved or pending, or approved in current session
    // never show if price impact is above threshold in non expert mode
    const showApproveFlow = !swapInputError &&
        (approval === useApproveCallback_1.ApprovalState.NOT_APPROVED ||
            approval === useApproveCallback_1.ApprovalState.PENDING ||
            (approvalSubmitted && approval === useApproveCallback_1.ApprovalState.APPROVED)) &&
        !(priceImpactSeverity > 3 && !isExpertMode);
    const handleConfirmDismiss = react_1.useCallback(() => {
        setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
        // if there was a tx hash, we want to clear the input
        if (txHash) {
            onUserInput(actions_1.Field.INPUT, '');
        }
    }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);
    const handleAcceptChanges = react_1.useCallback(() => {
        setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm });
    }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);
    const handleInputSelect = react_1.useCallback(inputCurrency => {
        setApprovalSubmitted(false); // reset 2 step UI for approvals
        onCurrencySelection(actions_1.Field.INPUT, inputCurrency);
    }, [onCurrencySelection]);
    const handleMaxInput = react_1.useCallback(() => {
        maxAmountInput && onUserInput(actions_1.Field.INPUT, maxAmountInput.toExact());
    }, [maxAmountInput, onUserInput]);
    const handleOutputSelect = react_1.useCallback(outputCurrency => onCurrencySelection(actions_1.Field.OUTPUT, outputCurrency), [
        onCurrencySelection
    ]);
    const swapIsUnsupported = Trades_1.useIsTransactionUnsupported(currencies === null || currencies === void 0 ? void 0 : currencies.INPUT, currencies === null || currencies === void 0 ? void 0 : currencies.OUTPUT);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TokenWarningModal_1.default, { isOpen: importTokensNotInDefault.length > 0 && !dismissTokenWarning, tokens: importTokensNotInDefault, onConfirm: handleConfirmTokenWarning }),
        react_1.default.createElement(NavigationTabs_1.SwapPoolTabs, { active: 'swap' }),
        react_1.default.createElement(AppBody_1.default, null,
            react_1.default.createElement(SwapHeader_1.default, null),
            react_1.default.createElement(Web3Controls, null,
                react_1.default.createElement(Web3Element, null,
                    chainId && NETWORK_LABELS[chainId] && (react_1.default.createElement(NetworkCard, { title: NETWORK_LABELS[chainId] }, NETWORK_LABELS[chainId])),
                    react_1.default.createElement(AccountElement, { active: !!account, style: { pointerEvents: 'auto' } },
                        account && userEthBalance ? (react_1.default.createElement(BalanceText, { style: { flexShrink: 0 }, pl: "0.75rem", pr: "0.5rem", fontWeight: 500 }, userEthBalance === null || userEthBalance === void 0 ? void 0 :
                            userEthBalance.toSignificant(4),
                            " ETH")) : null,
                        react_1.default.createElement(Web3Status_1.default, null)))),
            react_1.default.createElement(styleds_1.Wrapper, { id: "swap-page" },
                react_1.default.createElement(ConfirmSwapModal_1.default, { isOpen: showConfirm, trade: trade, originalTrade: tradeToConfirm, onAcceptChanges: handleAcceptChanges, attemptingTxn: attemptingTxn, txHash: txHash, recipient: recipient, allowedSlippage: allowedSlippage, onConfirm: handleSwap, swapErrorMessage: swapErrorMessage, onDismiss: handleConfirmDismiss }),
                react_1.default.createElement(Column_1.AutoColumn, { gap: 'md' },
                    react_1.default.createElement(CurrencyInputPanel_1.default, { label: independentField === actions_1.Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From', value: formattedAmounts[actions_1.Field.INPUT], showMaxButton: !atMaxAmountInput, currency: currencies[actions_1.Field.INPUT], onUserInput: handleTypeInput, onMax: handleMaxInput, onCurrencySelect: handleInputSelect, otherCurrency: currencies[actions_1.Field.OUTPUT], id: "swap-currency-input" }),
                    react_1.default.createElement(Column_1.AutoColumn, { justify: "space-between" },
                        react_1.default.createElement(Row_1.AutoRow, { justify: isExpertMode ? 'space-between' : 'center', style: { padding: '0 1rem' } },
                            react_1.default.createElement(styleds_1.ArrowWrapper, { clickable: true },
                                react_1.default.createElement(react_feather_1.ArrowDown, { size: "16", onClick: () => {
                                        setApprovalSubmitted(false); // reset 2 step UI for approvals
                                        onSwitchTokens();
                                    }, color: currencies[actions_1.Field.INPUT] && currencies[actions_1.Field.OUTPUT] ? theme.primary1 : theme.text2 })),
                            recipient === null && !showWrap && isExpertMode ? (react_1.default.createElement(theme_1.LinkStyledButton, { id: "add-recipient-button", onClick: () => onChangeRecipient('') }, "+ Add a send (optional)")) : null)),
                    react_1.default.createElement(CurrencyInputPanel_1.default, { value: formattedAmounts[actions_1.Field.OUTPUT], onUserInput: handleTypeOutput, label: independentField === actions_1.Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To', showMaxButton: false, currency: currencies[actions_1.Field.OUTPUT], onCurrencySelect: handleOutputSelect, otherCurrency: currencies[actions_1.Field.INPUT], id: "swap-currency-output" }),
                    recipient !== null && !showWrap ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Row_1.AutoRow, { justify: "space-between", style: { padding: '0 1rem' } },
                            react_1.default.createElement(styleds_1.ArrowWrapper, { clickable: false },
                                react_1.default.createElement(react_feather_1.ArrowDown, { size: "16", color: theme.text2 })),
                            react_1.default.createElement(theme_1.LinkStyledButton, { id: "remove-recipient-button", onClick: () => onChangeRecipient(null) }, "- Remove send")),
                        react_1.default.createElement(AddressInputPanel_1.default, { id: "recipient", value: recipient, onChange: onChangeRecipient }))) : null,
                    showWrap ? null : (react_1.default.createElement(Card_1.default, { padding: showWrap ? '.25rem 1rem 0 1rem' : '0px', borderRadius: '20px' },
                        react_1.default.createElement(Column_1.AutoColumn, { gap: "8px", style: { padding: '0 16px' } },
                            Boolean(trade) && (react_1.default.createElement(Row_1.RowBetween, { align: "center" },
                                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 14, color: theme.text2 }, "Price"),
                                react_1.default.createElement(TradePrice_1.default, { price: trade === null || trade === void 0 ? void 0 : trade.executionPrice, showInverted: showInverted, setShowInverted: setShowInverted }))),
                            allowedSlippage !== constants_1.INITIAL_ALLOWED_SLIPPAGE && (react_1.default.createElement(Row_1.RowBetween, { align: "center" },
                                react_1.default.createElement(exports.ClickableText, { fontWeight: 500, fontSize: 14, color: theme.text2, onClick: toggleSettings }, "Slippage Tolerance"),
                                react_1.default.createElement(exports.ClickableText, { fontWeight: 500, fontSize: 14, color: theme.text2, onClick: toggleSettings },
                                    allowedSlippage / 100,
                                    "%"))))))),
                react_1.default.createElement(styleds_1.BottomGrouping, null,
                    swapIsUnsupported ? (react_1.default.createElement(Button_1.ButtonPrimary, { disabled: true },
                        react_1.default.createElement(theme_1.TYPE.main, { mb: "4px" }, "Unsupported Asset"))) : showWrap ? (react_1.default.createElement(Button_1.ButtonPrimary, { disabled: Boolean(wrapInputError), onClick: onWrap }, wrapInputError !== null && wrapInputError !== void 0 ? wrapInputError : (wrapType === useWrapCallback_1.WrapType.WRAP ? 'Wrap' : wrapType === useWrapCallback_1.WrapType.UNWRAP ? 'Unwrap' : null))) : noRoute && userHasSpecifiedInputOutput ? (react_1.default.createElement(Card_1.GreyCard, { style: { textAlign: 'center' } },
                        react_1.default.createElement(theme_1.TYPE.main, { mb: "4px" }, "Insufficient liquidity for this trade."),
                        singleHopOnly && react_1.default.createElement(theme_1.TYPE.main, { mb: "4px" }, "Try enabling multi-hop trades."))) : showApproveFlow ? (react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(Button_1.ButtonConfirmed, { onClick: approveCallback, disabled: approval !== useApproveCallback_1.ApprovalState.NOT_APPROVED || approvalSubmitted, width: "48%", altDisabledStyle: approval === useApproveCallback_1.ApprovalState.PENDING, confirmed: approval === useApproveCallback_1.ApprovalState.APPROVED }, approval === useApproveCallback_1.ApprovalState.PENDING ? (react_1.default.createElement(Row_1.AutoRow, { gap: "6px", justify: "center" },
                            "Approving ",
                            react_1.default.createElement(Loader_1.default, { stroke: "white" }))) : approvalSubmitted && approval === useApproveCallback_1.ApprovalState.APPROVED ? ('Approved') : ('Approve ' + ((_h = currencies[actions_1.Field.INPUT]) === null || _h === void 0 ? void 0 : _h.symbol))),
                        react_1.default.createElement(Button_1.ButtonError, { onClick: () => {
                                if (isExpertMode) {
                                    handleSwap();
                                }
                                else {
                                    setSwapState({
                                        tradeToConfirm: trade,
                                        attemptingTxn: false,
                                        swapErrorMessage: undefined,
                                        showConfirm: true,
                                        txHash: undefined
                                    });
                                }
                            }, width: "48%", id: "swap-button", disabled: !isValid || approval !== useApproveCallback_1.ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode), error: isValid && priceImpactSeverity > 2 },
                            react_1.default.createElement(rebass_1.Text, { fontSize: 16, fontWeight: 500 }, priceImpactSeverity > 3 && !isExpertMode
                                ? `Price Impact High`
                                : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`)))) : (react_1.default.createElement(Button_1.ButtonError, { onClick: () => {
                            if (isExpertMode) {
                                handleSwap();
                            }
                            else {
                                setSwapState({
                                    tradeToConfirm: trade,
                                    attemptingTxn: false,
                                    swapErrorMessage: undefined,
                                    showConfirm: true,
                                    txHash: undefined
                                });
                            }
                        }, id: "swap-button", disabled: !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError, error: isValid && priceImpactSeverity > 2 && !swapCallbackError },
                        react_1.default.createElement(rebass_1.Text, { fontSize: 20, fontWeight: 500 }, swapInputError
                            ? swapInputError
                            : priceImpactSeverity > 3 && !isExpertMode
                                ? `Price Impact Too High`
                                : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`))),
                    showApproveFlow && (react_1.default.createElement(Column_1.default, { style: { marginTop: '1rem' } },
                        react_1.default.createElement(ProgressSteps_1.default, { steps: [approval === useApproveCallback_1.ApprovalState.APPROVED] }))),
                    isExpertMode && swapErrorMessage ? react_1.default.createElement(styleds_1.SwapCallbackError, { error: swapErrorMessage }) : null,
                    betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === useToggledVersion_1.Version.v1 ? (react_1.default.createElement(BetterTradeLink_1.default, { version: betterTradeLinkV2 })) : toggledVersion !== useToggledVersion_1.DEFAULT_VERSION && defaultTrade ? (react_1.default.createElement(BetterTradeLink_1.DefaultVersionLink, null)) : null))),
        !swapIsUnsupported ? (react_1.default.createElement(AdvancedSwapDetailsDropdown_1.default, { trade: trade })) : (react_1.default.createElement(UnsupportedCurrencyFooter_1.default, { show: swapIsUnsupported, currencies: [currencies.INPUT, currencies.OUTPUT] }))));
}
exports.default = Swap;
