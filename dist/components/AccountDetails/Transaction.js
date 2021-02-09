"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_feather_1 = require("react-feather");
const hooks_1 = require("../../hooks");
const utils_1 = require("../../utils");
const theme_1 = require("../../theme");
const hooks_2 = require("../../state/transactions/hooks");
const Row_1 = require("../Row");
const Loader_1 = __importDefault(require("../Loader"));
const TransactionWrapper = styled_components_1.default.div ``;
const TransactionStatusText = styled_components_1.default.div `
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`;
const TransactionState = styled_components_1.default(theme_1.ExternalLink) `
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.primary1};
`;
const IconWrapper = styled_components_1.default.div `
  color: ${({ pending, success, theme }) => (pending ? theme.primary1 : success ? theme.green1 : theme.red1)};
`;
function Transaction({ hash }) {
    var _a, _b;
    const { chainId } = hooks_1.useActiveWeb3React();
    const allTransactions = hooks_2.useAllTransactions();
    const tx = allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions[hash];
    const summary = tx === null || tx === void 0 ? void 0 : tx.summary;
    const pending = !(tx === null || tx === void 0 ? void 0 : tx.receipt);
    const success = !pending && tx && (((_a = tx.receipt) === null || _a === void 0 ? void 0 : _a.status) === 1 || typeof ((_b = tx.receipt) === null || _b === void 0 ? void 0 : _b.status) === 'undefined');
    if (!chainId)
        return null;
    return (react_1.default.createElement(TransactionWrapper, null,
        react_1.default.createElement(TransactionState, { href: utils_1.getEtherscanLink(chainId, hash, 'transaction'), pending: pending, success: success },
            react_1.default.createElement(Row_1.RowFixed, null,
                react_1.default.createElement(TransactionStatusText, null, summary !== null && summary !== void 0 ? summary : hash,
                    " \u2197")),
            react_1.default.createElement(IconWrapper, { pending: pending, success: success }, pending ? react_1.default.createElement(Loader_1.default, null) : success ? react_1.default.createElement(react_feather_1.CheckCircle, { size: "16" }) : react_1.default.createElement(react_feather_1.Triangle, { size: "16" })))));
}
exports.default = Transaction;
