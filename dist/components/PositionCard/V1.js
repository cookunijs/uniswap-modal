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
const react_router_dom_1 = require("react-router-dom");
const sdk_1 = require("@uniswap/sdk");
const rebass_1 = require("rebass");
const Column_1 = require("../Column");
const Button_1 = require("../Button");
const Row_1 = require("../Row");
const index_1 = require("./index");
const DoubleLogo_1 = __importDefault(require("../DoubleLogo"));
const hooks_1 = require("../../hooks");
const styled_components_1 = require("styled-components");
function V1PositionCard({ token, V1LiquidityBalance }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const { chainId } = hooks_1.useActiveWeb3React();
    return (react_1.default.createElement(index_1.HoverCard, null,
        react_1.default.createElement(Column_1.AutoColumn, { gap: "12px" },
            react_1.default.createElement(index_1.FixedHeightRow, null,
                react_1.default.createElement(Row_1.RowFixed, null,
                    react_1.default.createElement(DoubleLogo_1.default, { currency0: token, margin: true, size: 20 }),
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20, style: { marginLeft: '' } }, `${chainId && token.equals(sdk_1.WETH[chainId]) ? 'WETH' : token.symbol}/ETH`),
                    react_1.default.createElement(rebass_1.Text, { fontSize: 12, fontWeight: 500, ml: "0.5rem", px: "0.75rem", py: "0.25rem", style: { borderRadius: '1rem' }, backgroundColor: theme.yellow1, color: 'black' }, "V1"))),
            react_1.default.createElement(Column_1.AutoColumn, { gap: "8px" },
                react_1.default.createElement(Row_1.RowBetween, { marginTop: "10px" },
                    react_1.default.createElement(Button_1.ButtonSecondary, { width: "68%", as: react_router_dom_1.Link, to: `/migrate/v1/${V1LiquidityBalance.token.address}` }, "Migrate"),
                    react_1.default.createElement(Button_1.ButtonSecondary, { style: { backgroundColor: 'transparent' }, width: "28%", as: react_router_dom_1.Link, to: `/remove/v1/${V1LiquidityBalance.token.address}` }, "Remove"))))));
}
exports.default = react_router_dom_1.withRouter(V1PositionCard);
