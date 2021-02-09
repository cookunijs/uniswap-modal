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
exports.SubmittedView = exports.LoadingView = void 0;
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../hooks");
const Column_1 = require("../Column");
const styled_components_1 = __importStar(require("styled-components"));
const Row_1 = require("../Row");
const theme_1 = require("../../theme");
const react_feather_1 = require("react-feather");
const blue_loader_svg_1 = __importDefault(require("../../assets/images/blue-loader.svg"));
const utils_1 = require("../../utils");
const components_1 = require("../../theme/components");
const ConfirmOrLoadingWrapper = styled_components_1.default.div `
  width: 100%;
  padding: 24px;
`;
const ConfirmedIcon = styled_components_1.default(Column_1.ColumnCenter) `
  padding: 60px 0;
`;
function LoadingView({ children, onDismiss }) {
    return (react_1.default.createElement(ConfirmOrLoadingWrapper, null,
        react_1.default.createElement(Row_1.RowBetween, null,
            react_1.default.createElement("div", null),
            react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss })),
        react_1.default.createElement(ConfirmedIcon, null,
            react_1.default.createElement(theme_1.CustomLightSpinner, { src: blue_loader_svg_1.default, alt: "loader", size: '90px' })),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "100px", justify: 'center' },
            children,
            react_1.default.createElement(theme_1.TYPE.subHeader, null, "Confirm this transaction in your wallet"))));
}
exports.LoadingView = LoadingView;
function SubmittedView({ children, onDismiss, hash }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const { chainId } = hooks_1.useActiveWeb3React();
    return (react_1.default.createElement(ConfirmOrLoadingWrapper, null,
        react_1.default.createElement(Row_1.RowBetween, null,
            react_1.default.createElement("div", null),
            react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss })),
        react_1.default.createElement(ConfirmedIcon, null,
            react_1.default.createElement(react_feather_1.ArrowUpCircle, { strokeWidth: 0.5, size: 90, color: theme.primary1 })),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "100px", justify: 'center' },
            children,
            chainId && hash && (react_1.default.createElement(components_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, hash, 'transaction'), style: { marginLeft: '4px' } },
                react_1.default.createElement(theme_1.TYPE.subHeader, null, "View transaction on Etherscan"))))));
}
exports.SubmittedView = SubmittedView;
