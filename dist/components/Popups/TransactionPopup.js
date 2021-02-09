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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const styled_components_1 = __importStar(require("styled-components"));
const hooks_1 = require("../../hooks");
const theme_1 = require("../../theme");
const components_1 = require("../../theme/components");
const utils_1 = require("../../utils");
const Column_1 = require("../Column");
const Row_1 = require("../Row");
const RowNoFlex = styled_components_1.default(Row_1.AutoRow) `
  flex-wrap: nowrap;
`;
function TransactionPopup({ hash, success, summary }) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(RowNoFlex, null,
        react_1.default.createElement("div", { style: { paddingRight: 16 } }, success ? react_1.default.createElement(react_feather_1.CheckCircle, { color: theme.green1, size: 24 }) : react_1.default.createElement(react_feather_1.AlertCircle, { color: theme.red1, size: 24 })),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "8px" },
            react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500 }, summary !== null && summary !== void 0 ? summary : 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)),
            chainId && (react_1.default.createElement(components_1.ExternalLink, { href: utils_1.getEtherscanLink(chainId, hash, 'transaction') }, "View on Etherscan")))));
}
exports.default = TransactionPopup;
