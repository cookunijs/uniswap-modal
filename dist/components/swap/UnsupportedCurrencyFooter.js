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
const theme_1 = require("theme");
const Button_1 = require("components/Button");
const Modal_1 = __importDefault(require("components/Modal"));
const Card_1 = __importStar(require("components/Card"));
const Row_1 = require("components/Row");
const Column_1 = require("components/Column");
const CurrencyLogo_1 = __importDefault(require("components/CurrencyLogo"));
const hooks_1 = require("hooks");
const utils_1 = require("utils");
const wrappedCurrency_1 = require("utils/wrappedCurrency");
const Tokens_1 = require("../../hooks/Tokens");
const DetailsFooter = styled_components_1.default.div `
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  text-align: center;
`;
const AddressText = styled_components_1.default(theme_1.TYPE.blue) `
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    font-size: 10px;
`}
`;
function UnsupportedCurrencyFooter({ show, currencies }) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const [showDetails, setShowDetails] = react_1.useState(false);
    const tokens = chainId && currencies
        ? currencies.map(currency => {
            return wrappedCurrency_1.wrappedCurrency(currency, chainId);
        })
        : [];
    const unsupportedTokens = Tokens_1.useUnsupportedTokens();
    return (react_1.default.createElement(DetailsFooter, { show: show },
        react_1.default.createElement(Modal_1.default, { isOpen: showDetails, onDismiss: () => setShowDetails(false) },
            react_1.default.createElement(Card_1.default, { padding: "2rem" },
                react_1.default.createElement(Column_1.AutoColumn, { gap: "lg" },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(theme_1.TYPE.mediumHeader, null, "Unsupported Assets"),
                        react_1.default.createElement(theme_1.CloseIcon, { onClick: () => setShowDetails(false) })),
                    tokens.map(token => {
                        var _a;
                        return (token &&
                            unsupportedTokens &&
                            Object.keys(unsupportedTokens).includes(token.address) && (react_1.default.createElement(Card_1.OutlineCard, { key: (_a = token.address) === null || _a === void 0 ? void 0 : _a.concat('not-supported') },
                            react_1.default.createElement(Column_1.AutoColumn, { gap: "10px" },
                                react_1.default.createElement(Row_1.AutoRow, { gap: "5px", align: "center" },
                                    react_1.default.createElement(CurrencyLogo_1.default, { currency: token, size: '24px' }),
                                    react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500 }, token.symbol)),
                                chainId && (react_1.default.createElement(theme_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, token.address, 'address') },
                                    react_1.default.createElement(AddressText, null, token.address)))))));
                    }),
                    react_1.default.createElement(Column_1.AutoColumn, { gap: "lg" },
                        react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500 }, "Some assets are not available through this interface because they may not work well with our smart contract or we are unable to allow trading for legal reasons."))))),
        react_1.default.createElement(Button_1.ButtonEmpty, { padding: '0', onClick: () => setShowDetails(true) },
            react_1.default.createElement(theme_1.TYPE.blue, null, "Read more about unsupported assets"))));
}
exports.default = UnsupportedCurrencyFooter;
