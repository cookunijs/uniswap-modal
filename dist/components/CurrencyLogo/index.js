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
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ethereum_logo_png_1 = __importDefault(require("../../assets/images/ethereum-logo.png"));
const useHttpLocations_1 = __importDefault(require("../../hooks/useHttpLocations"));
const hooks_1 = require("../../state/lists/hooks");
const Logo_1 = __importDefault(require("../Logo"));
const getTokenLogoURL = (address) => `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
const StyledEthereumLogo = styled_components_1.default.img `
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`;
const StyledLogo = styled_components_1.default(Logo_1.default) `
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`;
function CurrencyLogo({ currency, size = '24px', style }) {
    var _a;
    const uriLocations = useHttpLocations_1.default(currency instanceof hooks_1.WrappedTokenInfo ? currency.logoURI : undefined);
    const srcs = react_1.useMemo(() => {
        if (currency === sdk_1.ETHER)
            return [];
        if (currency instanceof sdk_1.Token) {
            if (currency instanceof hooks_1.WrappedTokenInfo) {
                return [...uriLocations, getTokenLogoURL(currency.address)];
            }
            return [getTokenLogoURL(currency.address)];
        }
        return [];
    }, [currency, uriLocations]);
    if (currency === sdk_1.ETHER) {
        return react_1.default.createElement(StyledEthereumLogo, { src: ethereum_logo_png_1.default, size: size, style: style });
    }
    return react_1.default.createElement(StyledLogo, { size: size, srcs: srcs, alt: `${(_a = currency === null || currency === void 0 ? void 0 : currency.symbol) !== null && _a !== void 0 ? _a : 'token'} logo`, style: style });
}
exports.default = CurrencyLogo;
