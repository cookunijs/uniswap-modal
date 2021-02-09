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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const polished_1 = require("polished");
const hooks_1 = require("../../state/wallet/hooks");
const CurrencySearchModal_1 = __importDefault(require("../SearchModal/CurrencySearchModal"));
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const DoubleLogo_1 = __importDefault(require("../DoubleLogo"));
const Row_1 = require("../Row");
const theme_1 = require("../../theme");
const NumericalInput_1 = require("../NumericalInput");
const dropdown_svg_1 = require("../../assets/images/dropdown.svg");
const hooks_2 = require("../../hooks");
const react_i18next_1 = require("react-i18next");
const useTheme_1 = __importDefault(require("../../hooks/useTheme"));
const InputRow = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`;
const CurrencySelect = styled_components_1.default.button `
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : polished_1.darken(0.05, theme.primary1))};
  }
`;
const LabelRow = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => polished_1.darken(0.2, theme.text2)};
  }
`;
const Aligner = styled_components_1.default.span `
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const StyledDropDown = styled_components_1.default(dropdown_svg_1.ReactComponent) `
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`;
const InputPanel = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`;
const Container = styled_components_1.default.div `
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`;
const StyledTokenName = styled_components_1.default.span `
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`;
const StyledBalanceMax = styled_components_1.default.button `
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall `
    margin-right: 0.5rem;
  `};
`;
function CurrencyInputPanel({ value, onUserInput, onMax, showMaxButton, label = 'Input', onCurrencySelect, currency, disableCurrencySelect = false, hideBalance = false, pair = null, // used for double token logo
hideInput = false, otherCurrency, id, showCommonBases, customBalanceText }) {
    const { t } = react_i18next_1.useTranslation();
    const [modalOpen, setModalOpen] = react_1.useState(false);
    const { account } = hooks_2.useActiveWeb3React();
    const selectedCurrencyBalance = hooks_1.useCurrencyBalance(account !== null && account !== void 0 ? account : undefined, currency !== null && currency !== void 0 ? currency : undefined);
    const theme = useTheme_1.default();
    const handleDismissSearch = react_1.useCallback(() => {
        setModalOpen(false);
    }, [setModalOpen]);
    return (react_1.default.createElement(InputPanel, { id: id },
        react_1.default.createElement(Container, { hideInput: hideInput },
            !hideInput && (react_1.default.createElement(LabelRow, null,
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(theme_1.TYPE.body, { color: theme.text2, fontWeight: 500, fontSize: 14 }, label),
                    account && (react_1.default.createElement(theme_1.TYPE.body, { onClick: onMax, color: theme.text2, fontWeight: 500, fontSize: 14, style: { display: 'inline', cursor: 'pointer' } }, !hideBalance && !!currency && selectedCurrencyBalance
                        ? (customBalanceText !== null && customBalanceText !== void 0 ? customBalanceText : 'Balance: ') + (selectedCurrencyBalance === null || selectedCurrencyBalance === void 0 ? void 0 : selectedCurrencyBalance.toSignificant(6))
                        : ' -'))))),
            react_1.default.createElement(InputRow, { style: hideInput ? { padding: '0', borderRadius: '8px' } : {}, selected: disableCurrencySelect },
                !hideInput && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(NumericalInput_1.Input, { className: "token-amount-input", value: value, onUserInput: val => {
                            onUserInput(val);
                        } }),
                    account && currency && showMaxButton && label !== 'To' && (react_1.default.createElement(StyledBalanceMax, { onClick: onMax }, "MAX")))),
                react_1.default.createElement(CurrencySelect, { selected: !!currency, className: "open-currency-select-button", onClick: () => {
                        if (!disableCurrencySelect) {
                            setModalOpen(true);
                        }
                    } },
                    react_1.default.createElement(Aligner, null,
                        pair ? (react_1.default.createElement(DoubleLogo_1.default, { currency0: pair.token0, currency1: pair.token1, size: 24, margin: true })) : currency ? (react_1.default.createElement(CurrencyLogo_1.default, { currency: currency, size: '24px' })) : null,
                        pair ? (react_1.default.createElement(StyledTokenName, { className: "pair-name-container" }, pair === null || pair === void 0 ? void 0 :
                            pair.token0.symbol,
                            ":", pair === null || pair === void 0 ? void 0 :
                            pair.token1.symbol)) : (react_1.default.createElement(StyledTokenName, { className: "token-symbol-container", active: Boolean(currency && currency.symbol) }, (currency && currency.symbol && currency.symbol.length > 20
                            ? currency.symbol.slice(0, 4) +
                                '...' +
                                currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                            : currency === null || currency === void 0 ? void 0 : currency.symbol) || t('selectToken'))),
                        !disableCurrencySelect && react_1.default.createElement(StyledDropDown, { selected: !!currency }))))),
        !disableCurrencySelect && onCurrencySelect && (react_1.default.createElement(CurrencySearchModal_1.default, { isOpen: modalOpen, onDismiss: handleDismissSearch, onCurrencySelect: onCurrencySelect, selectedCurrency: currency, otherSelectedCurrency: otherCurrency, showCommonBases: showCommonBases }))));
}
exports.default = CurrencyInputPanel;
