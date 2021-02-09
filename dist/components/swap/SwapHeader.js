"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Settings_1 = __importDefault(require("../Settings"));
const Row_1 = require("../Row");
const theme_1 = require("../../theme");
const StyledSwapHeader = styled_components_1.default.div `
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`;
function SwapHeader() {
    return (react_1.default.createElement(StyledSwapHeader, null,
        react_1.default.createElement(Row_1.RowBetween, null,
            react_1.default.createElement(theme_1.TYPE.black, { fontWeight: 500 }, "Swap"),
            react_1.default.createElement(Settings_1.default, null))));
}
exports.default = SwapHeader;
