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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@web3-react/core");
const walletconnect_connector_1 = require("@web3-react/walletconnect-connector");
const react_1 = __importStar(require("react"));
const react_device_detect_1 = require("react-device-detect");
const react_ga_1 = __importDefault(require("react-ga"));
const styled_components_1 = __importDefault(require("styled-components"));
const metamask_png_1 = __importDefault(require("../../assets/images/metamask.png"));
const x_svg_1 = require("../../assets/images/x.svg");
const connectors_1 = require("../../connectors");
const Fortmatic_1 = require("../../connectors/Fortmatic");
const constants_1 = require("../../constants");
const usePrevious_1 = __importDefault(require("../../hooks/usePrevious"));
const actions_1 = require("../../state/application/actions");
const hooks_1 = require("../../state/application/hooks");
const theme_1 = require("../../theme");
const AccountDetails_1 = __importDefault(require("../AccountDetails"));
const Modal_1 = __importDefault(require("../Modal"));
const Option_1 = __importDefault(require("./Option"));
const PendingView_1 = __importDefault(require("./PendingView"));
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
const Wrapper = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`;
const HeaderRow = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium `
    padding: 1rem;
  `};
`;
const ContentWrapper = styled_components_1.default.div `
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium `padding: 1rem`};
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
const Blurb = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium `
    margin: 1rem;
    font-size: 12px;
  `};
`;
const OptionGrid = styled_components_1.default.div `
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium `
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`;
const HoverText = styled_components_1.default.div `
  :hover {
    cursor: pointer;
  }
`;
const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending'
};
function WalletModal({ pendingTransactions, confirmedTransactions, ENSName }) {
    // important that these are destructed from the account-specific web3-react context
    const { active, account, connector, activate, error } = core_1.useWeb3React();
    const [walletView, setWalletView] = react_1.useState(WALLET_VIEWS.ACCOUNT);
    const [pendingWallet, setPendingWallet] = react_1.useState();
    const [pendingError, setPendingError] = react_1.useState();
    const walletModalOpen = hooks_1.useModalOpen(actions_1.ApplicationModal.WALLET);
    const toggleWalletModal = hooks_1.useWalletModalToggle();
    const previousAccount = usePrevious_1.default(account);
    // close on connection, when logged out before
    react_1.useEffect(() => {
        if (account && !previousAccount && walletModalOpen) {
            toggleWalletModal();
        }
    }, [account, previousAccount, toggleWalletModal, walletModalOpen]);
    // always reset to account view
    react_1.useEffect(() => {
        if (walletModalOpen) {
            setPendingError(false);
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [walletModalOpen]);
    // close modal when a connection is successful
    const activePrevious = usePrevious_1.default(active);
    const connectorPrevious = usePrevious_1.default(connector);
    react_1.useEffect(() => {
        if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
            setWalletView(WALLET_VIEWS.ACCOUNT);
        }
    }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious]);
    const tryActivation = (connector) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let name = '';
        Object.keys(constants_1.SUPPORTED_WALLETS).map(key => {
            if (connector === constants_1.SUPPORTED_WALLETS[key].connector) {
                return (name = constants_1.SUPPORTED_WALLETS[key].name);
            }
            return true;
        });
        // log selected wallet
        react_ga_1.default.event({
            category: 'Wallet',
            action: 'Change Wallet',
            label: name
        });
        setPendingWallet(connector); // set wallet for pending view
        setWalletView(WALLET_VIEWS.PENDING);
        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof walletconnect_connector_1.WalletConnectConnector && ((_b = (_a = connector.walletConnectProvider) === null || _a === void 0 ? void 0 : _a.wc) === null || _b === void 0 ? void 0 : _b.uri)) {
            connector.walletConnectProvider = undefined;
        }
        connector &&
            activate(connector, undefined, true).catch(error => {
                if (error instanceof core_1.UnsupportedChainIdError) {
                    activate(connector); // a little janky...can't use setError because the connector isn't set
                }
                else {
                    setPendingError(true);
                }
            });
    });
    // close wallet modal if fortmatic modal is active
    react_1.useEffect(() => {
        connectors_1.fortmatic.on(Fortmatic_1.OVERLAY_READY, () => {
            toggleWalletModal();
        });
    }, [toggleWalletModal]);
    // get wallets user can switch too, depending on device/browser
    function getOptions() {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask;
        return Object.keys(constants_1.SUPPORTED_WALLETS).map(key => {
            const option = constants_1.SUPPORTED_WALLETS[key];
            // check for mobile options
            if (react_device_detect_1.isMobile) {
                //disable portis on mobile for now
                if (option.connector === connectors_1.portis) {
                    return null;
                }
                if (!window.web3 && !window.ethereum && option.mobile) {
                    return (react_1.default.createElement(Option_1.default, { onClick: () => {
                            option.connector !== connector && !option.href && tryActivation(option.connector);
                        }, id: `connect-${key}`, key: key, active: option.connector && option.connector === connector, color: option.color, link: option.href, header: option.name, subheader: null, icon: require('../../assets/images/' + option.iconName) }));
                }
                return null;
            }
            // overwrite injected when needed
            if (option.connector === connectors_1.injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return (react_1.default.createElement(Option_1.default, { id: `connect-${key}`, key: key, color: '#E8831D', header: 'Install Metamask', subheader: null, link: 'https://metamask.io/', icon: metamask_png_1.default }));
                    }
                    else {
                        return null; //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === 'MetaMask' && !isMetamask) {
                    return null;
                }
                // likewise for generic
                else if (option.name === 'Injected' && isMetamask) {
                    return null;
                }
            }
            // return rest of options
            return (!react_device_detect_1.isMobile &&
                !option.mobileOnly && (react_1.default.createElement(Option_1.default, { id: `connect-${key}`, onClick: () => {
                    option.connector === connector
                        ? setWalletView(WALLET_VIEWS.ACCOUNT)
                        : !option.href && tryActivation(option.connector);
                }, key: key, active: option.connector === connector, color: option.color, link: option.href, header: option.name, subheader: null, icon: require('../../assets/images/' + option.iconName) })));
        });
    }
    function getModalContent() {
        if (error) {
            return (react_1.default.createElement(UpperSection, null,
                react_1.default.createElement(CloseIcon, { onClick: toggleWalletModal },
                    react_1.default.createElement(CloseColor, null)),
                react_1.default.createElement(HeaderRow, null, error instanceof core_1.UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'),
                react_1.default.createElement(ContentWrapper, null, error instanceof core_1.UnsupportedChainIdError ? (react_1.default.createElement("h5", null, "Please connect to the appropriate Ethereum network.")) : ('Error connecting. Try refreshing the page.'))));
        }
        if (account && walletView === WALLET_VIEWS.ACCOUNT) {
            return (react_1.default.createElement(AccountDetails_1.default, { toggleWalletModal: toggleWalletModal, pendingTransactions: pendingTransactions, confirmedTransactions: confirmedTransactions, ENSName: ENSName, openOptions: () => setWalletView(WALLET_VIEWS.OPTIONS) }));
        }
        return (react_1.default.createElement(UpperSection, null,
            react_1.default.createElement(CloseIcon, { onClick: toggleWalletModal },
                react_1.default.createElement(CloseColor, null)),
            walletView !== WALLET_VIEWS.ACCOUNT ? (react_1.default.createElement(HeaderRow, { color: "blue" },
                react_1.default.createElement(HoverText, { onClick: () => {
                        setPendingError(false);
                        setWalletView(WALLET_VIEWS.ACCOUNT);
                    } }, "Back"))) : (react_1.default.createElement(HeaderRow, null,
                react_1.default.createElement(HoverText, null, "Connect to a wallet"))),
            react_1.default.createElement(ContentWrapper, null,
                walletView === WALLET_VIEWS.PENDING ? (react_1.default.createElement(PendingView_1.default, { connector: pendingWallet, error: pendingError, setPendingError: setPendingError, tryActivation: tryActivation })) : (react_1.default.createElement(OptionGrid, null, getOptions())),
                walletView !== WALLET_VIEWS.PENDING && (react_1.default.createElement(Blurb, null,
                    react_1.default.createElement("span", null, "New to Ethereum? \u00A0"),
                    ' ',
                    react_1.default.createElement(theme_1.ExternalLink, { href: "https://ethereum.org/wallets/" }, "Learn more about wallets"))))));
    }
    return (react_1.default.createElement(Modal_1.default, { isOpen: walletModalOpen, onDismiss: toggleWalletModal, minHeight: false, maxHeight: 90 },
        react_1.default.createElement(Wrapper, null, getModalContent())));
}
exports.default = WalletModal;
