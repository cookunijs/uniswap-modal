"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterWrapper = void 0;
const react_1 = __importDefault(require("react"));
const rebass_1 = require("rebass");
const styled_components_1 = __importDefault(require("styled-components"));
const Row_1 = require("../Row");
exports.FilterWrapper = styled_components_1.default(Row_1.RowFixed) `
  padding: 8px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`;
function SortButton({ toggleSortOrder, ascending }) {
    return (react_1.default.createElement(exports.FilterWrapper, { onClick: toggleSortOrder },
        react_1.default.createElement(rebass_1.Text, { fontSize: 14, fontWeight: 500 }, ascending ? '↑' : '↓')));
}
exports.default = SortButton;
