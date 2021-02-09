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
const styled_components_1 = __importStar(require("styled-components"));
const QuestionHelper_1 = __importDefault(require("../QuestionHelper"));
const theme_1 = require("../../theme");
const Column_1 = require("../Column");
const Row_1 = require("../Row");
const polished_1 = require("polished");
var SlippageError;
(function (SlippageError) {
    SlippageError["InvalidInput"] = "InvalidInput";
    SlippageError["RiskyLow"] = "RiskyLow";
    SlippageError["RiskyHigh"] = "RiskyHigh";
})(SlippageError || (SlippageError = {}));
var DeadlineError;
(function (DeadlineError) {
    DeadlineError["InvalidInput"] = "InvalidInput";
})(DeadlineError || (DeadlineError = {}));
const FancyButton = styled_components_1.default.button `
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
`;
const Option = styled_components_1.default(FancyButton) `
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
  background-color: ${({ active, theme }) => active && theme.primary1};
  color: ${({ active, theme }) => (active ? theme.white : theme.text1)};
`;
const Input = styled_components_1.default.input `
  background: ${({ theme }) => theme.bg1};
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text1)};
  text-align: right;
`;
const OptionCustom = styled_components_1.default(FancyButton) `
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  :hover {
    border: ${({ theme, active, warning }) => active && `1px solid ${warning ? polished_1.darken(0.1, theme.red1) : polished_1.darken(0.1, theme.primary1)}`};
  }

  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`;
const SlippageEmojiContainer = styled_components_1.default.span `
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall `
    display: none;  
  `}
`;
function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const inputRef = react_1.useRef();
    const [slippageInput, setSlippageInput] = react_1.useState('');
    const [deadlineInput, setDeadlineInput] = react_1.useState('');
    const slippageInputIsValid = slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);
    const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput;
    let slippageError;
    if (slippageInput !== '' && !slippageInputIsValid) {
        slippageError = SlippageError.InvalidInput;
    }
    else if (slippageInputIsValid && rawSlippage < 50) {
        slippageError = SlippageError.RiskyLow;
    }
    else if (slippageInputIsValid && rawSlippage > 500) {
        slippageError = SlippageError.RiskyHigh;
    }
    else {
        slippageError = undefined;
    }
    let deadlineError;
    if (deadlineInput !== '' && !deadlineInputIsValid) {
        deadlineError = DeadlineError.InvalidInput;
    }
    else {
        deadlineError = undefined;
    }
    function parseCustomSlippage(value) {
        setSlippageInput(value);
        try {
            const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
            if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
                setRawSlippage(valueAsIntFromRoundedFloat);
            }
        }
        catch (_a) { }
    }
    function parseCustomDeadline(value) {
        setDeadlineInput(value);
        try {
            const valueAsInt = Number.parseInt(value) * 60;
            if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
                setDeadline(valueAsInt);
            }
        }
        catch (_a) { }
    }
    return (react_1.default.createElement(Column_1.AutoColumn, { gap: "md" },
        react_1.default.createElement(Column_1.AutoColumn, { gap: "sm" },
            react_1.default.createElement(Row_1.RowFixed, null,
                react_1.default.createElement(theme_1.TYPE.black, { fontWeight: 400, fontSize: 14, color: theme.text2 }, "Slippage tolerance"),
                react_1.default.createElement(QuestionHelper_1.default, { text: "Your transaction will revert if the price changes unfavorably by more than this percentage." })),
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(Option, { onClick: () => {
                        setSlippageInput('');
                        setRawSlippage(10);
                    }, active: rawSlippage === 10 }, "0.1%"),
                react_1.default.createElement(Option, { onClick: () => {
                        setSlippageInput('');
                        setRawSlippage(50);
                    }, active: rawSlippage === 50 }, "0.5%"),
                react_1.default.createElement(Option, { onClick: () => {
                        setSlippageInput('');
                        setRawSlippage(100);
                    }, active: rawSlippage === 100 }, "1%"),
                react_1.default.createElement(OptionCustom, { active: ![10, 50, 100].includes(rawSlippage), warning: !slippageInputIsValid, tabIndex: -1 },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        !!slippageInput &&
                            (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (react_1.default.createElement(SlippageEmojiContainer, null,
                            react_1.default.createElement("span", { role: "img", "aria-label": "warning" }, "\u26A0\uFE0F"))) : null,
                        react_1.default.createElement(Input, { ref: inputRef, placeholder: (rawSlippage / 100).toFixed(2), value: slippageInput, onBlur: () => {
                                parseCustomSlippage((rawSlippage / 100).toFixed(2));
                            }, onChange: e => parseCustomSlippage(e.target.value), color: !slippageInputIsValid ? 'red' : '' }),
                        "%"))),
            !!slippageError && (react_1.default.createElement(Row_1.RowBetween, { style: {
                    fontSize: '14px',
                    paddingTop: '7px',
                    color: slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'
                } }, slippageError === SlippageError.InvalidInput
                ? 'Enter a valid slippage percentage'
                : slippageError === SlippageError.RiskyLow
                    ? 'Your transaction may fail'
                    : 'Your transaction may be frontrun'))),
        react_1.default.createElement(Column_1.AutoColumn, { gap: "sm" },
            react_1.default.createElement(Row_1.RowFixed, null,
                react_1.default.createElement(theme_1.TYPE.black, { fontSize: 14, fontWeight: 400, color: theme.text2 }, "Transaction deadline"),
                react_1.default.createElement(QuestionHelper_1.default, { text: "Your transaction will revert if it is pending for more than this long." })),
            react_1.default.createElement(Row_1.RowFixed, null,
                react_1.default.createElement(OptionCustom, { style: { width: '80px' }, tabIndex: -1 },
                    react_1.default.createElement(Input, { color: !!deadlineError ? 'red' : undefined, onBlur: () => {
                            parseCustomDeadline((deadline / 60).toString());
                        }, placeholder: (deadline / 60).toString(), value: deadlineInput, onChange: e => parseCustomDeadline(e.target.value) })),
                react_1.default.createElement(theme_1.TYPE.body, { style: { paddingLeft: '8px' }, fontSize: 14 }, "minutes")))));
}
exports.default = SlippageTabs;
