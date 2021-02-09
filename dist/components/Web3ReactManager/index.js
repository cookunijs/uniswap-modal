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
const core_1 = require("@web3-react/core");
const styled_components_1 = __importDefault(require("styled-components"));
const react_i18next_1 = require("react-i18next");
const connectors_1 = require("../../connectors");
const hooks_1 = require("../../hooks");
const constants_1 = require("../../constants");
const Loader_1 = __importDefault(require("../Loader"));
const MessageWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`;
const Message = styled_components_1.default.h2 `
  color: ${({ theme }) => theme.secondary1};
`;
function Web3ReactManager({ children }) {
    const { t } = react_i18next_1.useTranslation();
    const { active } = core_1.useWeb3React();
    const { active: networkActive, error: networkError, activate: activateNetwork } = core_1.useWeb3React(constants_1.NetworkContextName);
    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = hooks_1.useEagerConnect();
    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    react_1.useEffect(() => {
        if (triedEager && !networkActive && !networkError && !active) {
            activateNetwork(connectors_1.network);
        }
    }, [triedEager, networkActive, networkError, activateNetwork, active]);
    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    hooks_1.useInactiveListener(!triedEager);
    // handle delayed loader state
    const [showLoader, setShowLoader] = react_1.useState(false);
    react_1.useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 600);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    // on page load, do nothing until we've tried to connect to the injected connector
    if (!triedEager) {
        return null;
    }
    // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
    if (!active && networkError) {
        return (react_1.default.createElement(MessageWrapper, null,
            react_1.default.createElement(Message, null, t('unknownError'))));
    }
    // if neither context is active, spin
    if (!active && !networkActive) {
        return showLoader ? (react_1.default.createElement(MessageWrapper, null,
            react_1.default.createElement(Loader_1.default, null))) : null;
    }
    return children;
}
exports.default = Web3ReactManager;
