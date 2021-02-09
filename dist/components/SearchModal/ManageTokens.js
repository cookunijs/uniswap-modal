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
const Column_1 = __importDefault(require("components/Column"));
const styleds_1 = require("./styleds");
const Row_1 = __importStar(require("components/Row"));
const theme_1 = require("theme");
const Tokens_1 = require("hooks/Tokens");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("state/user/hooks");
const CurrencyLogo_1 = __importDefault(require("components/CurrencyLogo"));
const utils_1 = require("utils");
const hooks_2 = require("hooks");
const Card_1 = __importDefault(require("components/Card"));
const ImportRow_1 = __importDefault(require("./ImportRow"));
const useTheme_1 = __importDefault(require("../../hooks/useTheme"));
const CurrencySearchModal_1 = require("./CurrencySearchModal");
const Wrapper = styled_components_1.default.div `
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`;
const Footer = styled_components_1.default.div `
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.bg3};
  padding: 20px;
  text-align: center;
`;
function ManageTokens({ setModalView, setImportToken }) {
    const { chainId } = hooks_2.useActiveWeb3React();
    const [searchQuery, setSearchQuery] = react_1.useState('');
    const theme = useTheme_1.default();
    // manage focus on modal show
    const inputRef = react_1.useRef();
    const handleInput = react_1.useCallback(event => {
        const input = event.target.value;
        const checksummedInput = utils_1.isAddress(input);
        setSearchQuery(checksummedInput || input);
    }, []);
    // if they input an address, use it
    const isAddressSearch = utils_1.isAddress(searchQuery);
    const searchToken = Tokens_1.useToken(searchQuery);
    // all tokens for local lisr
    const userAddedTokens = hooks_1.useUserAddedTokens();
    const removeToken = hooks_1.useRemoveUserAddedToken();
    const handleRemoveAll = react_1.useCallback(() => {
        if (chainId && userAddedTokens) {
            userAddedTokens.map(token => {
                return removeToken(chainId, token.address);
            });
        }
    }, [removeToken, userAddedTokens, chainId]);
    const tokenList = react_1.useMemo(() => {
        return (chainId &&
            userAddedTokens.map(token => (react_1.default.createElement(Row_1.RowBetween, { key: token.address, width: "100%" },
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(CurrencyLogo_1.default, { currency: token, size: '20px' }),
                    react_1.default.createElement(theme_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, token.address, 'address') },
                        react_1.default.createElement(theme_1.TYPE.main, { ml: '10px', fontWeight: 600 }, token.symbol))),
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(theme_1.TrashIcon, { onClick: () => removeToken(chainId, token.address) }),
                    react_1.default.createElement(theme_1.ExternalLinkIcon, { href: utils_1.getEtherscanLink(chainId, token.address, 'address') }))))));
    }, [userAddedTokens, chainId, removeToken]);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Column_1.default, { style: { width: '100%', flex: '1 1' } },
            react_1.default.createElement(styleds_1.PaddedColumn, { gap: "14px" },
                react_1.default.createElement(Row_1.default, null,
                    react_1.default.createElement(styleds_1.SearchInput, { type: "text", id: "token-search-input", placeholder: '0x0000', value: searchQuery, autoComplete: "off", ref: inputRef, onChange: handleInput })),
                searchQuery !== '' && !isAddressSearch && react_1.default.createElement(theme_1.TYPE.error, { error: true }, "Enter valid token address"),
                searchToken && (react_1.default.createElement(Card_1.default, { backgroundColor: theme.bg2, padding: "10px 0" },
                    react_1.default.createElement(ImportRow_1.default, { token: searchToken, showImportView: () => setModalView(CurrencySearchModal_1.CurrencyModalView.importToken), setImportToken: setImportToken, style: { height: 'fit-content' } })))),
            react_1.default.createElement(styleds_1.Separator, null),
            react_1.default.createElement(styleds_1.PaddedColumn, { gap: "lg" },
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(theme_1.TYPE.main, { fontWeight: 600 }, userAddedTokens === null || userAddedTokens === void 0 ? void 0 :
                        userAddedTokens.length,
                        " Custom ",
                        userAddedTokens.length === 1 ? 'Token' : 'Tokens'),
                    userAddedTokens.length > 0 && (react_1.default.createElement(theme_1.ButtonText, { onClick: handleRemoveAll },
                        react_1.default.createElement(theme_1.TYPE.blue, null, "Clear all")))),
                tokenList)),
        react_1.default.createElement(Footer, null,
            react_1.default.createElement(theme_1.TYPE.darkGray, null, "Tip: Custom tokens are stored locally in your browser"))));
}
exports.default = ManageTokens;
