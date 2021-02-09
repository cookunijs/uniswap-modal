"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueCard = exports.PinkCard = exports.YellowCard = exports.OutlineCard = exports.GreyCard = exports.LightCard = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const rebass_1 = require("rebass");
const styled_components_2 = require("rebass/styled-components");
const Card = styled_components_1.default(styled_components_2.Box) `
  width: ${({ width }) => width !== null && width !== void 0 ? width : '100%'};
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
exports.default = Card;
exports.LightCard = styled_components_1.default(Card) `
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`;
exports.GreyCard = styled_components_1.default(Card) `
  background-color: ${({ theme }) => theme.bg3};
`;
exports.OutlineCard = styled_components_1.default(Card) `
  border: 1px solid ${({ theme }) => theme.bg3};
`;
exports.YellowCard = styled_components_1.default(Card) `
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`;
exports.PinkCard = styled_components_1.default(Card) `
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`;
const BlueCardStyled = styled_components_1.default(Card) `
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primary1};
  border-radius: 12px;
  width: fit-content;
`;
exports.BlueCard = (_a) => {
    var { children } = _a, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(BlueCardStyled, Object.assign({}, rest),
        react_1.default.createElement(rebass_1.Text, { fontWeight: 500, color: "#2172E5" }, children)));
};
