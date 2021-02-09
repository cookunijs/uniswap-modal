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
exports.LightQuestionHelper = void 0;
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const styled_components_1 = __importDefault(require("styled-components"));
const Tooltip_1 = __importDefault(require("../Tooltip"));
const QuestionWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text2};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;
const LightQuestionWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;
const QuestionMark = styled_components_1.default.span `
  font-size: 1rem;
`;
function QuestionHelper({ text }) {
    const [show, setShow] = react_1.useState(false);
    const open = react_1.useCallback(() => setShow(true), [setShow]);
    const close = react_1.useCallback(() => setShow(false), [setShow]);
    return (react_1.default.createElement("span", { style: { marginLeft: 4 } },
        react_1.default.createElement(Tooltip_1.default, { text: text, show: show },
            react_1.default.createElement(QuestionWrapper, { onClick: open, onMouseEnter: open, onMouseLeave: close },
                react_1.default.createElement(react_feather_1.HelpCircle, { size: 16 })))));
}
exports.default = QuestionHelper;
function LightQuestionHelper({ text }) {
    const [show, setShow] = react_1.useState(false);
    const open = react_1.useCallback(() => setShow(true), [setShow]);
    const close = react_1.useCallback(() => setShow(false), [setShow]);
    return (react_1.default.createElement("span", { style: { marginLeft: 4 } },
        react_1.default.createElement(Tooltip_1.default, { text: text, show: show },
            react_1.default.createElement(LightQuestionWrapper, { onClick: open, onMouseEnter: open, onMouseLeave: close },
                react_1.default.createElement(QuestionMark, null, "?")))));
}
exports.LightQuestionHelper = LightQuestionHelper;
