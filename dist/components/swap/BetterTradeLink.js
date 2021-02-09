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
exports.DefaultVersionLink = void 0;
const qs_1 = require("qs");
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const rebass_1 = require("rebass");
const styled_components_1 = require("styled-components");
const useParsedQueryString_1 = __importDefault(require("../../hooks/useParsedQueryString"));
const useToggledVersion_1 = __importStar(require("../../hooks/useToggledVersion"));
const theme_1 = require("../../theme");
const Card_1 = require("../Card");
const Column_1 = require("../Column");
function VersionLinkContainer({ children }) {
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    return (react_1.default.createElement(Card_1.YellowCard, { style: { marginTop: '12px', padding: '0.5rem 0.5rem' } },
        react_1.default.createElement(Column_1.AutoColumn, { gap: "sm", justify: "center", style: { alignItems: 'center', textAlign: 'center' } },
            react_1.default.createElement(rebass_1.Text, { lineHeight: "145.23%;", fontSize: 14, fontWeight: 400, color: theme.text1 }, children))));
}
function BetterTradeLink({ version }) {
    const location = react_router_1.useLocation();
    const search = useParsedQueryString_1.default();
    const linkDestination = react_1.useMemo(() => {
        return Object.assign(Object.assign({}, location), { search: `?${qs_1.stringify(Object.assign(Object.assign({}, search), { use: version !== useToggledVersion_1.DEFAULT_VERSION ? version : undefined }))}` });
    }, [location, search, version]);
    return (react_1.default.createElement(VersionLinkContainer, null,
        "There is a better price for this trade on",
        ' ',
        react_1.default.createElement(theme_1.StyledInternalLink, { to: linkDestination },
            react_1.default.createElement("b", null,
                "Uniswap ",
                version.toUpperCase(),
                " \u2197"))));
}
exports.default = BetterTradeLink;
function DefaultVersionLink() {
    const location = react_router_1.useLocation();
    const search = useParsedQueryString_1.default();
    const version = useToggledVersion_1.default();
    const linkDestination = react_1.useMemo(() => {
        return Object.assign(Object.assign({}, location), { search: `?${qs_1.stringify(Object.assign(Object.assign({}, search), { use: useToggledVersion_1.DEFAULT_VERSION }))}` });
    }, [location, search]);
    return (react_1.default.createElement(VersionLinkContainer, null,
        "Showing ",
        version.toUpperCase(),
        " price.",
        ' ',
        react_1.default.createElement(theme_1.StyledInternalLink, { to: linkDestination },
            react_1.default.createElement("b", null,
                "Switch to Uniswap ",
                useToggledVersion_1.DEFAULT_VERSION.toUpperCase(),
                " \u2197"))));
}
exports.DefaultVersionLink = DefaultVersionLink;
