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
const core_1 = require("@web3-react/core");
const polished_1 = require("polished");
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const react_i18next_1 = require("react-i18next");
const styled_components_1 = __importStar(require("styled-components"));
const coinbaseWalletIcon_svg_1 = __importDefault(require("../../assets/images/coinbaseWalletIcon.svg"));
const fortmaticIcon_png_1 = __importDefault(require("../../assets/images/fortmaticIcon.png"));
const portisIcon_png_1 = __importDefault(require("../../assets/images/portisIcon.png"));
const walletConnectIcon_svg_1 = __importDefault(require("../../assets/images/walletConnectIcon.svg"));
const connectors_1 = require("../../connectors");
const constants_1 = require("../../constants");
const useENSName_1 = __importDefault(require("../../hooks/useENSName"));
const useSocksBalance_1 = require("../../hooks/useSocksBalance");
const hooks_1 = require("../../state/application/hooks");
const hooks_2 = require("../../state/transactions/hooks");
const utils_1 = require("../../utils");
const Button_1 = require("../Button");
const Identicon_1 = __importDefault(require("../Identicon"));
const Loader_1 = __importDefault(require("../Loader"));
const Row_1 = require("../Row");
const WalletModal_1 = __importDefault(require("../WalletModal"));
const IconWrapper = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;
const Web3StatusGeneric = styled_components_1.default(Button_1.ButtonSecondary) `
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`;
const Web3StatusError = styled_components_1.default(Web3StatusGeneric) `
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => polished_1.darken(0.1, theme.red1)};
  }
`;
const Web3StatusConnect = styled_components_1.default(Web3StatusGeneric) `
  background-color: ${({ theme }) => theme.primary4};
  border: none;
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${({ theme }) => polished_1.darken(0.05, theme.primary4)};
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ faded }) => faded &&
    styled_components_1.css `
      background-color: ${({ theme }) => theme.primary5};
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${({ theme }) => polished_1.darken(0.05, theme.primary4)};
        color: ${({ theme }) => polished_1.darken(0.05, theme.primaryText1)};
      }
    `}
`;
const Web3StatusConnected = styled_components_1.default(Web3StatusGeneric) `
  background-color: ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg2)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg3)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ pending, theme }) => (pending ? polished_1.darken(0.05, theme.primary1) : polished_1.lighten(0.05, theme.bg2))};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? polished_1.darken(0.1, theme.primary1) : polished_1.darken(0.1, theme.bg3))};
    }
  }
`;
const Text = styled_components_1.default.p `
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`;
const NetworkIcon = styled_components_1.default(react_feather_1.Activity) `
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;
// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a, b) {
    return b.addedTime - a.addedTime;
}
const SOCK = (react_1.default.createElement("span", { role: "img", "aria-label": "has socks emoji", style: { marginTop: -4, marginBottom: -4 } }, "\uD83E\uDDE6"));
// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }) {
    if (connector === connectors_1.injected) {
        return react_1.default.createElement(Identicon_1.default, null);
    }
    else if (connector === connectors_1.walletconnect) {
        return (react_1.default.createElement(IconWrapper, { size: 16 },
            react_1.default.createElement("img", { src: walletConnectIcon_svg_1.default, alt: '' })));
    }
    else if (connector === connectors_1.walletlink) {
        return (react_1.default.createElement(IconWrapper, { size: 16 },
            react_1.default.createElement("img", { src: coinbaseWalletIcon_svg_1.default, alt: '' })));
    }
    else if (connector === connectors_1.fortmatic) {
        return (react_1.default.createElement(IconWrapper, { size: 16 },
            react_1.default.createElement("img", { src: fortmaticIcon_png_1.default, alt: '' })));
    }
    else if (connector === connectors_1.portis) {
        return (react_1.default.createElement(IconWrapper, { size: 16 },
            react_1.default.createElement("img", { src: portisIcon_png_1.default, alt: '' })));
    }
    return null;
}
function Web3StatusInner() {
    const { t } = react_i18next_1.useTranslation();
    const { account, connector, error } = core_1.useWeb3React();
    const { ENSName } = useENSName_1.default(account !== null && account !== void 0 ? account : undefined);
    const allTransactions = hooks_2.useAllTransactions();
    const sortedRecentTransactions = react_1.useMemo(() => {
        const txs = Object.values(allTransactions);
        return txs.filter(hooks_2.isTransactionRecent).sort(newTransactionsFirst);
    }, [allTransactions]);
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash);
    const hasPendingTransactions = !!pending.length;
    const hasSocks = useSocksBalance_1.useHasSocks();
    const toggleWalletModal = hooks_1.useWalletModalToggle();
    if (account) {
        return (react_1.default.createElement(Web3StatusConnected, { id: "web3-status-connected", onClick: toggleWalletModal, pending: hasPendingTransactions },
            hasPendingTransactions ? (react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Text, null, pending === null || pending === void 0 ? void 0 :
                    pending.length,
                    " Pending"),
                " ",
                react_1.default.createElement(Loader_1.default, { stroke: "white" }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                hasSocks ? SOCK : null,
                react_1.default.createElement(Text, null, ENSName || utils_1.shortenAddress(account)))),
            !hasPendingTransactions && connector && react_1.default.createElement(StatusIcon, { connector: connector })));
    }
    else if (error) {
        return (react_1.default.createElement(Web3StatusError, { onClick: toggleWalletModal },
            react_1.default.createElement(NetworkIcon, null),
            react_1.default.createElement(Text, null, error instanceof core_1.UnsupportedChainIdError ? 'Wrong Network' : 'Error')));
    }
    else {
        return (react_1.default.createElement(Web3StatusConnect, { id: "connect-wallet", onClick: toggleWalletModal, faded: !account },
            react_1.default.createElement(Text, null, t('Connect to a wallet'))));
    }
}
function Web3Status() {
    const { active, account } = core_1.useWeb3React();
    const contextNetwork = core_1.useWeb3React(constants_1.NetworkContextName);
    const { ENSName } = useENSName_1.default(account !== null && account !== void 0 ? account : undefined);
    const allTransactions = hooks_2.useAllTransactions();
    const sortedRecentTransactions = react_1.useMemo(() => {
        const txs = Object.values(allTransactions);
        return txs.filter(hooks_2.isTransactionRecent).sort(newTransactionsFirst);
    }, [allTransactions]);
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash);
    const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash);
    if (!contextNetwork.active && !active) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Web3StatusInner, null),
        react_1.default.createElement(WalletModal_1.default, { ENSName: ENSName !== null && ENSName !== void 0 ? ENSName : undefined, pendingTransactions: pending, confirmedTransactions: confirmed })));
}
exports.default = Web3Status;
