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
const react_redux_1 = require("react-redux");
const styled_components_1 = __importStar(require("styled-components"));
const hooks_1 = require("../../hooks");
const actions_1 = require("../../state/transactions/actions");
const utils_1 = require("../../utils");
const Row_1 = require("../Row");
const Copy_1 = __importDefault(require("./Copy"));
const Transaction_1 = __importDefault(require("./Transaction"));
const constants_1 = require("../../constants");
const x_svg_1 = require("../../assets/images/x.svg");
const utils_2 = require("../../utils");
const connectors_1 = require("../../connectors");
const coinbaseWalletIcon_svg_1 = __importDefault(require("../../assets/images/coinbaseWalletIcon.svg"));
const walletConnectIcon_svg_1 = __importDefault(require("../../assets/images/walletConnectIcon.svg"));
const fortmaticIcon_png_1 = __importDefault(require("../../assets/images/fortmaticIcon.png"));
const portisIcon_png_1 = __importDefault(require("../../assets/images/portisIcon.png"));
const Identicon_1 = __importDefault(require("../Identicon"));
const Button_1 = require("../Button");
const react_feather_1 = require("react-feather");
const theme_1 = require("../../theme");
const HeaderRow = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium `
    padding: 1rem;
  `};
`;
const UpperSection = styled_components_1.default.div `
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`;
const InfoCard = styled_components_1.default.div `
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`;
const AccountGroupingRow = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`;
const AccountSection = styled_components_1.default.div `
  background-color: ${({ theme }) => theme.bg1};
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium `padding: 0rem 1rem 1.5rem 1rem;`};
`;
const YourAccount = styled_components_1.default.div `
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`;
const LowerSection = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`;
const AccountControl = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const AddressLink = styled_components_1.default(theme_1.ExternalLink) `
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`;
const CloseIcon = styled_components_1.default.div `
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;
const CloseColor = styled_components_1.default(x_svg_1.ReactComponent) `
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`;
const WalletName = styled_components_1.default.div `
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`;
const IconWrapper = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium `
    align-items: flex-end;
  `};
`;
const TransactionListWrapper = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap};
`;
const WalletAction = styled_components_1.default(Button_1.ButtonSecondary) `
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const MainWalletAction = styled_components_1.default(WalletAction) `
  color: ${({ theme }) => theme.primary1};
`;
function renderTransactions(transactions) {
    return (react_1.default.createElement(TransactionListWrapper, null, transactions.map((hash, i) => {
        return react_1.default.createElement(Transaction_1.default, { key: i, hash: hash });
    })));
}
function AccountDetails({ toggleWalletModal, pendingTransactions, confirmedTransactions, ENSName, openOptions }) {
    const { chainId, account, connector } = hooks_1.useActiveWeb3React();
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const dispatch = react_redux_1.useDispatch();
    function formatConnectorName() {
        const { ethereum } = window;
        const isMetaMask = !!(ethereum && ethereum.isMetaMask);
        const name = Object.keys(constants_1.SUPPORTED_WALLETS)
            .filter(k => constants_1.SUPPORTED_WALLETS[k].connector === connector && (connector !== connectors_1.injected || isMetaMask === (k === 'METAMASK')))
            .map(k => constants_1.SUPPORTED_WALLETS[k].name)[0];
        return react_1.default.createElement(WalletName, null,
            "Connected with ",
            name);
    }
    function getStatusIcon() {
        if (connector === connectors_1.injected) {
            return (react_1.default.createElement(IconWrapper, { size: 16 },
                react_1.default.createElement(Identicon_1.default, null)));
        }
        else if (connector === connectors_1.walletconnect) {
            return (react_1.default.createElement(IconWrapper, { size: 16 },
                react_1.default.createElement("img", { src: walletConnectIcon_svg_1.default, alt: 'wallet connect logo' })));
        }
        else if (connector === connectors_1.walletlink) {
            return (react_1.default.createElement(IconWrapper, { size: 16 },
                react_1.default.createElement("img", { src: coinbaseWalletIcon_svg_1.default, alt: 'coinbase wallet logo' })));
        }
        else if (connector === connectors_1.fortmatic) {
            return (react_1.default.createElement(IconWrapper, { size: 16 },
                react_1.default.createElement("img", { src: fortmaticIcon_png_1.default, alt: 'fortmatic logo' })));
        }
        else if (connector === connectors_1.portis) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(IconWrapper, { size: 16 },
                    react_1.default.createElement("img", { src: portisIcon_png_1.default, alt: 'portis logo' }),
                    react_1.default.createElement(MainWalletAction, { onClick: () => {
                            connectors_1.portis.portis.showPortis();
                        } }, "Show Portis"))));
        }
        return null;
    }
    const clearAllTransactionsCallback = react_1.useCallback(() => {
        if (chainId)
            dispatch(actions_1.clearAllTransactions({ chainId }));
    }, [dispatch, chainId]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(UpperSection, null,
            react_1.default.createElement(CloseIcon, { onClick: toggleWalletModal },
                react_1.default.createElement(CloseColor, null)),
            react_1.default.createElement(HeaderRow, null, "Account"),
            react_1.default.createElement(AccountSection, null,
                react_1.default.createElement(YourAccount, null,
                    react_1.default.createElement(InfoCard, null,
                        react_1.default.createElement(AccountGroupingRow, null,
                            formatConnectorName(),
                            react_1.default.createElement("div", null,
                                connector !== connectors_1.injected && connector !== connectors_1.walletlink && (react_1.default.createElement(WalletAction, { style: { fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }, onClick: () => {
                                        ;
                                        connector.close();
                                    } }, "Disconnect")),
                                react_1.default.createElement(WalletAction, { style: { fontSize: '.825rem', fontWeight: 400 }, onClick: () => {
                                        openOptions();
                                    } }, "Change"))),
                        react_1.default.createElement(AccountGroupingRow, { id: "web3-account-identifier-row" },
                            react_1.default.createElement(AccountControl, null, ENSName ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("div", null,
                                    getStatusIcon(),
                                    react_1.default.createElement("p", null,
                                        " ",
                                        ENSName)))) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("div", null,
                                    getStatusIcon(),
                                    react_1.default.createElement("p", null,
                                        " ",
                                        account && utils_1.shortenAddress(account))))))),
                        react_1.default.createElement(AccountGroupingRow, null, ENSName ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(AccountControl, null,
                                react_1.default.createElement("div", null,
                                    account && (react_1.default.createElement(Copy_1.default, { toCopy: account },
                                        react_1.default.createElement("span", { style: { marginLeft: '4px' } }, "Copy Address"))),
                                    chainId && account && (react_1.default.createElement(AddressLink, { hasENS: !!ENSName, isENS: true, href: chainId && utils_2.getEtherscanLink(chainId, ENSName, 'address') },
                                        react_1.default.createElement(react_feather_1.ExternalLink, { size: 16 }),
                                        react_1.default.createElement("span", { style: { marginLeft: '4px' } }, "View on Etherscan"))))))) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(AccountControl, null,
                                react_1.default.createElement("div", null,
                                    account && (react_1.default.createElement(Copy_1.default, { toCopy: account },
                                        react_1.default.createElement("span", { style: { marginLeft: '4px' } }, "Copy Address"))),
                                    chainId && account && (react_1.default.createElement(AddressLink, { hasENS: !!ENSName, isENS: false, href: utils_2.getEtherscanLink(chainId, account, 'address') },
                                        react_1.default.createElement(react_feather_1.ExternalLink, { size: 16 }),
                                        react_1.default.createElement("span", { style: { marginLeft: '4px' } }, "View on Etherscan")))))))))))),
        !!pendingTransactions.length || !!confirmedTransactions.length ? (react_1.default.createElement(LowerSection, null,
            react_1.default.createElement(Row_1.AutoRow, { mb: '1rem', style: { justifyContent: 'space-between' } },
                react_1.default.createElement(theme_1.TYPE.body, null, "Recent Transactions"),
                react_1.default.createElement(theme_1.LinkStyledButton, { onClick: clearAllTransactionsCallback }, "(clear all)")),
            renderTransactions(pendingTransactions),
            renderTransactions(confirmedTransactions))) : (react_1.default.createElement(LowerSection, null,
            react_1.default.createElement(theme_1.TYPE.body, { color: theme.text1 }, "Your transactions will appear here...")))));
}
exports.default = AccountDetails;
