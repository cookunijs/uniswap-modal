"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowFixed = exports.AutoRow = exports.RowFlat = exports.RowBetween = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
const styled_components_2 = require("rebass/styled-components");
const Row = styled_components_1.default(styled_components_2.Box) `
  width: ${({ width }) => width !== null && width !== void 0 ? width : '100%'};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align !== null && align !== void 0 ? align : 'center'};
  justify-content: ${({ justify }) => justify !== null && justify !== void 0 ? justify : 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
exports.RowBetween = styled_components_1.default(Row) `
  justify-content: space-between;
`;
exports.RowFlat = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
`;
exports.AutoRow = styled_components_1.default(Row) `
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;
exports.RowFixed = styled_components_1.default(Row) `
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`;
exports.default = Row;
