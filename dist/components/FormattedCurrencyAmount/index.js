"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const sdk_1 = require("@uniswap/sdk");
const CURRENCY_AMOUNT_MIN = new sdk_1.Fraction(sdk_1.JSBI.BigInt(1), sdk_1.JSBI.BigInt(1000000));
function FormattedCurrencyAmount({ currencyAmount, significantDigits = 4 }) {
    return (react_1.default.createElement(react_1.default.Fragment, null, currencyAmount.equalTo(sdk_1.JSBI.BigInt(0))
        ? '0'
        : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
            ? currencyAmount.toSignificant(significantDigits)
            : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`));
}
exports.default = FormattedCurrencyAmount;
