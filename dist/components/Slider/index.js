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
const styled_components_1 = __importDefault(require("styled-components"));
const StyledRangeInput = styled_components_1.default.input `
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    border: none;
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
    background-color: #565a69;
    border-radius: 100%;
    color: ${({ theme }) => theme.bg1};

    &:hover,
    &:focus {
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(90deg, ${({ theme }) => theme.bg5}, ${({ theme }) => theme.bg3});
    height: 2px;
  }

  &::-moz-range-track {
    background: linear-gradient(90deg, ${({ theme }) => theme.bg5}, ${({ theme }) => theme.bg3});
    height: 2px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: ${({ theme }) => theme.bg5};
    height: 2px;
  }
  &::-ms-fill-lower {
    background: ${({ theme }) => theme.bg5};
  }
  &::-ms-fill-upper {
    background: ${({ theme }) => theme.bg3};
  }
`;
function Slider({ value, onChange, min = 0, step = 1, max = 100, size = 28 }) {
    const changeCallback = react_1.useCallback(e => {
        onChange(parseInt(e.target.value));
    }, [onChange]);
    return (react_1.default.createElement(StyledRangeInput, { size: size, type: "range", value: value, style: { width: '90%', marginLeft: 15, marginRight: 15, padding: '15px 0' }, onChange: changeCallback, "aria-labelledby": "input slider", step: step, min: min, max: max }));
}
exports.default = Slider;
