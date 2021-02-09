"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRemoveTabs = exports.FindPoolTabs = exports.SwapPoolTabs = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const polished_1 = require("polished");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const react_feather_1 = require("react-feather");
const Row_1 = require("../Row");
// import QuestionHelper from '../QuestionHelper'
const Settings_1 = __importDefault(require("../Settings"));
const react_redux_1 = require("react-redux");
const actions_1 = require("state/mint/actions");
const Tabs = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;
const activeClassName = 'ACTIVE';
const StyledNavLink = styled_components_1.default(react_router_dom_1.NavLink).attrs({
    activeClassName
}) `
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => polished_1.darken(0.1, theme.text1)};
  }
`;
const ActiveText = styled_components_1.default.div `
  font-weight: 500;
  font-size: 20px;
`;
const StyledArrowLeft = styled_components_1.default(react_feather_1.ArrowLeft) `
  color: ${({ theme }) => theme.text1};
`;
function SwapPoolTabs({ active }) {
    const { t } = react_i18next_1.useTranslation();
    return (react_1.default.createElement(Tabs, { style: { marginBottom: '20px', display: 'none' } },
        react_1.default.createElement(StyledNavLink, { id: `swap-nav-link`, to: '/swap', isActive: () => active === 'swap' }, t('swap')),
        react_1.default.createElement(StyledNavLink, { id: `pool-nav-link`, to: '/pool', isActive: () => active === 'pool' }, t('pool'))));
}
exports.SwapPoolTabs = SwapPoolTabs;
function FindPoolTabs() {
    return (react_1.default.createElement(Tabs, null,
        react_1.default.createElement(Row_1.RowBetween, { style: { padding: '1rem 1rem 0 1rem' } },
            react_1.default.createElement(react_router_dom_1.Link, { to: "/pool" },
                react_1.default.createElement(StyledArrowLeft, null)),
            react_1.default.createElement(ActiveText, null, "Import Pool"),
            react_1.default.createElement(Settings_1.default, null))));
}
exports.FindPoolTabs = FindPoolTabs;
function AddRemoveTabs({ adding, creating }) {
    // reset states on back
    const dispatch = react_redux_1.useDispatch();
    return (react_1.default.createElement(Tabs, null,
        react_1.default.createElement(Row_1.RowBetween, { style: { padding: '1rem 1rem 0 1rem' } },
            react_1.default.createElement(react_router_dom_1.Link, { to: "/pool", onClick: () => {
                    adding && dispatch(actions_1.resetMintState());
                } },
                react_1.default.createElement(StyledArrowLeft, null)),
            react_1.default.createElement(ActiveText, null, creating ? 'Create a pair' : adding ? 'Add Liquidity' : 'Remove Liquidity'),
            react_1.default.createElement(Settings_1.default, null))));
}
exports.AddRemoveTabs = AddRemoveTabs;
