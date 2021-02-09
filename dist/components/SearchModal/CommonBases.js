"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const rebass_1 = require("rebass");
const sdk_1 = require("@uniswap/sdk");
const styled_components_1 = __importDefault(require("styled-components"));
const constants_1 = require("../../constants");
const Column_1 = require("../Column");
const QuestionHelper_1 = __importDefault(require("../QuestionHelper"));
const Row_1 = require("../Row");
const CurrencyLogo_1 = __importDefault(require("../CurrencyLogo"));
const BaseWrapper = styled_components_1.default.div `
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`;
function CommonBases({ chainId, onSelect, selectedCurrency }) {
    return (react_1.default.createElement(Column_1.AutoColumn, { gap: "md" },
        react_1.default.createElement(Row_1.AutoRow, null,
            react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 14 }, "Common bases"),
            react_1.default.createElement(QuestionHelper_1.default, { text: "These tokens are commonly paired with other tokens." })),
        react_1.default.createElement(Row_1.AutoRow, { gap: "4px" },
            react_1.default.createElement(BaseWrapper, { onClick: () => {
                    if (!selectedCurrency || !sdk_1.currencyEquals(selectedCurrency, sdk_1.ETHER)) {
                        onSelect(sdk_1.ETHER);
                    }
                }, disable: selectedCurrency === sdk_1.ETHER },
                react_1.default.createElement(CurrencyLogo_1.default, { currency: sdk_1.ETHER, style: { marginRight: 8 } }),
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 16 }, "ETH")),
            (chainId ? constants_1.SUGGESTED_BASES[chainId] : []).map((token) => {
                const selected = selectedCurrency instanceof sdk_1.Token && selectedCurrency.address === token.address;
                return (react_1.default.createElement(BaseWrapper, { onClick: () => !selected && onSelect(token), disable: selected, key: token.address },
                    react_1.default.createElement(CurrencyLogo_1.default, { currency: token, style: { marginRight: 8 } }),
                    react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 16 }, token.symbol)));
            }))));
}
exports.default = CommonBases;
