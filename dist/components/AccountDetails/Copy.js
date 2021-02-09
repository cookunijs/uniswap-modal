"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useCopyClipboard_1 = __importDefault(require("../../hooks/useCopyClipboard"));
const theme_1 = require("../../theme");
const react_feather_1 = require("react-feather");
const CopyIcon = styled_components_1.default(theme_1.LinkStyledButton) `
  color: ${({ theme }) => theme.text3};
  flex-shrink: 0;
  display: flex;
  text-decoration: none;
  font-size: 0.825rem;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`;
const TransactionStatusText = styled_components_1.default.span `
  margin-left: 0.25rem;
  font-size: 0.825rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`;
function CopyHelper(props) {
    const [isCopied, setCopied] = useCopyClipboard_1.default();
    return (react_1.default.createElement(CopyIcon, { onClick: () => setCopied(props.toCopy) },
        isCopied ? (react_1.default.createElement(TransactionStatusText, null,
            react_1.default.createElement(react_feather_1.CheckCircle, { size: '16' }),
            react_1.default.createElement(TransactionStatusText, null, "Copied"))) : (react_1.default.createElement(TransactionStatusText, null,
            react_1.default.createElement(react_feather_1.Copy, { size: '16' }))),
        isCopied ? '' : props.children));
}
exports.default = CopyHelper;
