"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const Wrapper = styled_components_1.default.div `
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`;
const HigherLogo = styled_components_1.default(CurrencyLogo_1.default) `
  z-index: 2;
`;
const CoveredLogo = styled_components_1.default(CurrencyLogo_1.default) `
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
`;
function DoubleCurrencyLogo({ currency0, currency1, size = 16, margin = false }) {
    return (react_1.default.createElement(Wrapper, { sizeraw: size, margin: margin },
        currency0 && react_1.default.createElement(HigherLogo, { currency: currency0, size: size.toString() + 'px' }),
        currency1 && react_1.default.createElement(CoveredLogo, { currency: currency1, size: size.toString() + 'px', sizeraw: size })));
}
exports.default = DoubleCurrencyLogo;
