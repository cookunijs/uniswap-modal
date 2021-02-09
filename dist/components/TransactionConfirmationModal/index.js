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
exports.TransactionErrorContent = exports.ConfirmationModalContent = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const Modal_1 = __importDefault(require("../Modal"));
const theme_1 = require("../../theme");
const rebass_1 = require("rebass");
const components_1 = require("../../theme/components");
const Row_1 = require("../Row");
const react_feather_1 = require("react-feather");
const Button_1 = require("../Button");
const Column_1 = require("../Column");
const blue_loader_svg_1 = __importDefault(require("../../assets/images/blue-loader.svg"));
const utils_1 = require("../../utils");
const hooks_1 = require("../../hooks");
const Wrapper = styled_components_1.default.div `
  width: 100%;
`;
const Section = styled_components_1.default(Column_1.AutoColumn) `
  padding: 24px;
`;
const BottomSection = styled_components_1.default(Section) `
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const ConfirmedIcon = styled_components_1.default(Column_1.ColumnCenter) `
  padding: 60px 0;
`;
function ConfirmationPendingContent({ onDismiss, pendingText }) {
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Section, null,
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement("div", null),
                react_1.default.createElement(components_1.CloseIcon, { onClick: onDismiss })),
            react_1.default.createElement(ConfirmedIcon, null,
                react_1.default.createElement(components_1.CustomLightSpinner, { src: blue_loader_svg_1.default, alt: "loader", size: '90px' })),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "12px", justify: 'center' },
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Waiting For Confirmation"),
                react_1.default.createElement(Column_1.AutoColumn, { gap: "12px", justify: 'center' },
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 600, fontSize: 14, color: "", textAlign: "center" }, pendingText)),
                react_1.default.createElement(rebass_1.Text, { fontSize: 12, color: "#565A69", textAlign: "center" }, "Confirm this transaction in your wallet")))));
}
function TransactionSubmittedContent({ onDismiss, chainId, hash }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Section, null,
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement("div", null),
                react_1.default.createElement(components_1.CloseIcon, { onClick: onDismiss })),
            react_1.default.createElement(ConfirmedIcon, null,
                react_1.default.createElement(react_feather_1.ArrowUpCircle, { strokeWidth: 0.5, size: 90, color: theme.primary1 })),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "12px", justify: 'center' },
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Transaction Submitted"),
                chainId && hash && (react_1.default.createElement(theme_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, hash, 'transaction') },
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 14, color: theme.primary1 }, "View on Etherscan"))),
                react_1.default.createElement(Button_1.ButtonPrimary, { onClick: onDismiss, style: { margin: '20px 0 0 0' } },
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Close"))))));
}
function ConfirmationModalContent({ title, bottomContent, onDismiss, topContent }) {
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Section, null,
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, title),
                react_1.default.createElement(components_1.CloseIcon, { onClick: onDismiss })),
            topContent()),
        react_1.default.createElement(BottomSection, { gap: "12px" }, bottomContent())));
}
exports.ConfirmationModalContent = ConfirmationModalContent;
function TransactionErrorContent({ message, onDismiss }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Section, null,
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Error"),
                react_1.default.createElement(components_1.CloseIcon, { onClick: onDismiss })),
            react_1.default.createElement(Column_1.AutoColumn, { style: { marginTop: 20, padding: '2rem 0' }, gap: "24px", justify: "center" },
                react_1.default.createElement(react_feather_1.AlertTriangle, { color: theme.red1, style: { strokeWidth: 1.5 }, size: 64 }),
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 16, color: theme.red1, style: { textAlign: 'center', width: '85%' } }, message))),
        react_1.default.createElement(BottomSection, { gap: "12px" },
            react_1.default.createElement(Button_1.ButtonPrimary, { onClick: onDismiss }, "Dismiss"))));
}
exports.TransactionErrorContent = TransactionErrorContent;
function TransactionConfirmationModal({ isOpen, onDismiss, attemptingTxn, hash, pendingText, content }) {
    const { chainId } = hooks_1.useActiveWeb3React();
    if (!chainId)
        return null;
    // confirmation screen
    return (react_1.default.createElement(Modal_1.default, { isOpen: isOpen, onDismiss: onDismiss, maxHeight: 90 }, attemptingTxn ? (react_1.default.createElement(ConfirmationPendingContent, { onDismiss: onDismiss, pendingText: pendingText })) : hash ? (react_1.default.createElement(TransactionSubmittedContent, { chainId: chainId, hash: hash, onDismiss: onDismiss })) : (content())));
}
exports.default = TransactionConfirmationModal;
