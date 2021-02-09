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
exports.StyledMenuButton = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = __importStar(require("react"));
const rebass_1 = require("rebass");
const react_router_dom_1 = require("react-router-dom");
const polished_1 = require("polished");
const react_i18next_1 = require("react-i18next");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../hooks");
const hooks_2 = require("../../state/wallet/hooks");
const Card_1 = require("../Card");
const Row_1 = __importStar(require("../Row"));
const Web3Status_1 = __importDefault(require("../Web3Status"));
const ClaimModal_1 = __importDefault(require("../claim/ClaimModal"));
const Modal_1 = __importDefault(require("../Modal"));
const UniBalanceContent_1 = __importDefault(require("./UniBalanceContent"));
const HeaderFrame = styled_components_1.default.div `
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium `
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall `
        padding: 0.5rem 1rem;
  `}
`;
const HeaderControls = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium `
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`;
const HeaderElement = styled_components_1.default.div `
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium `
   flex-direction: row-reverse;
    align-items: center;
  `};
`;
const HeaderRow = styled_components_1.default(Row_1.RowFixed) `
  ${({ theme }) => theme.mediaWidth.upToMedium `
   width: 100%;
  `};
`;
const HeaderLinks = styled_components_1.default(Row_1.default) `
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium `
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`;
const AccountElement = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`;
const HideSmall = styled_components_1.default.span `
  ${({ theme }) => theme.mediaWidth.upToSmall `
    display: none;
  `};
`;
const NetworkCard = styled_components_1.default(Card_1.YellowCard) `
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall `
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;
const BalanceText = styled_components_1.default(rebass_1.Text) `
  ${({ theme }) => theme.mediaWidth.upToExtraSmall `
    display: none;
  `};
`;
const activeClassName = 'ACTIVE';
const StyledNavLink = styled_components_1.default(react_router_dom_1.NavLink).attrs({
    activeClassName
}) `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => polished_1.darken(0.1, theme.text1)};
  }
`;
exports.StyledMenuButton = styled_components_1.default.button `
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;
const NETWORK_LABELS = {
    [sdk_1.ChainId.RINKEBY]: 'Rinkeby',
    [sdk_1.ChainId.ROPSTEN]: 'Ropsten',
    [sdk_1.ChainId.GÖRLI]: 'Görli',
    [sdk_1.ChainId.KOVAN]: 'Kovan'
};
function Header() {
    var _a;
    const { account, chainId } = hooks_1.useActiveWeb3React();
    const { t } = react_i18next_1.useTranslation();
    const userEthBalance = (_a = hooks_2.useETHBalances(account ? [account] : [])) === null || _a === void 0 ? void 0 : _a[account !== null && account !== void 0 ? account : ''];
    const [showUniBalanceModal, setShowUniBalanceModal] = react_1.useState(false);
    return (react_1.default.createElement(HeaderFrame, null,
        react_1.default.createElement(ClaimModal_1.default, null),
        react_1.default.createElement(Modal_1.default, { isOpen: showUniBalanceModal, onDismiss: () => setShowUniBalanceModal(false) },
            react_1.default.createElement(UniBalanceContent_1.default, { setShowUniBalanceModal: setShowUniBalanceModal })),
        react_1.default.createElement(HeaderRow, null,
            react_1.default.createElement(HeaderLinks, null,
                react_1.default.createElement(StyledNavLink, { id: `swap-nav-link`, to: '/swap' }, t('swap')))),
        react_1.default.createElement(HeaderControls, null,
            react_1.default.createElement(HeaderElement, null,
                react_1.default.createElement(HideSmall, null, chainId && NETWORK_LABELS[chainId] && (react_1.default.createElement(NetworkCard, { title: NETWORK_LABELS[chainId] }, NETWORK_LABELS[chainId]))),
                react_1.default.createElement(AccountElement, { active: !!account, style: { pointerEvents: 'auto' } },
                    account && userEthBalance ? (react_1.default.createElement(BalanceText, { style: { flexShrink: 0 }, pl: "0.75rem", pr: "0.5rem", fontWeight: 500 }, userEthBalance === null || userEthBalance === void 0 ? void 0 :
                        userEthBalance.toSignificant(4),
                        " ETH")) : null,
                    react_1.default.createElement(Web3Status_1.default, null))))));
}
exports.default = Header;
