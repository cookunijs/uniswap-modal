"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const constants_1 = require("../../constants");
const prices_1 = require("../../utils/prices");
const styleds_1 = require("./styleds");
/**
 * Formatted version of price impact text with warning colors
 */
function FormattedPriceImpact({ priceImpact }) {
    return (react_1.default.createElement(styleds_1.ErrorText, { fontWeight: 500, fontSize: 14, severity: prices_1.warningSeverity(priceImpact) }, priceImpact ? (priceImpact.lessThan(constants_1.ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'));
}
exports.default = FormattedPriceImpact;
