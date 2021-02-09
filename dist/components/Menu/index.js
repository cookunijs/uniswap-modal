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
const react_feather_1 = require("react-feather");
const styled_components_1 = __importDefault(require("styled-components"));
const menu_svg_1 = require("../../assets/images/menu.svg");
const hooks_1 = require("../../hooks");
const useOnClickOutside_1 = require("../../hooks/useOnClickOutside");
const actions_1 = require("../../state/application/actions");
const hooks_2 = require("../../state/application/hooks");
const theme_1 = require("../../theme");
const Button_1 = require("../Button");
const StyledMenuIcon = styled_components_1.default(menu_svg_1.ReactComponent) `
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`;
const StyledMenuButton = styled_components_1.default.button `
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

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
`;
const StyledMenu = styled_components_1.default.div `
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`;
const MenuFlyout = styled_components_1.default.span `
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium `
    top: -17.25rem;
  `};
`;
const MenuItem = styled_components_1.default(theme_1.ExternalLink) `
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`;
const CODE_LINK = 'https://github.com/Uniswap/uniswap-interface';
function Menu() {
    const { account } = hooks_1.useActiveWeb3React();
    const node = react_1.useRef();
    const open = hooks_2.useModalOpen(actions_1.ApplicationModal.MENU);
    const toggle = hooks_2.useToggleModal(actions_1.ApplicationModal.MENU);
    useOnClickOutside_1.useOnClickOutside(node, open ? toggle : undefined);
    const openClaimModal = hooks_2.useToggleModal(actions_1.ApplicationModal.ADDRESS_CLAIM);
    return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    react_1.default.createElement(StyledMenu, { ref: node },
        react_1.default.createElement(StyledMenuButton, { onClick: toggle },
            react_1.default.createElement(StyledMenuIcon, null)),
        open && (react_1.default.createElement(MenuFlyout, null,
            react_1.default.createElement(MenuItem, { id: "link", href: "https://uniswap.org/" },
                react_1.default.createElement(react_feather_1.Info, { size: 14 }),
                "About"),
            react_1.default.createElement(MenuItem, { id: "link", href: "https://uniswap.org/docs/v2" },
                react_1.default.createElement(react_feather_1.BookOpen, { size: 14 }),
                "Docs"),
            react_1.default.createElement(MenuItem, { id: "link", href: CODE_LINK },
                react_1.default.createElement(react_feather_1.Code, { size: 14 }),
                "Code"),
            react_1.default.createElement(MenuItem, { id: "link", href: "https://discord.gg/EwFs3Pp" },
                react_1.default.createElement(react_feather_1.MessageCircle, { size: 14 }),
                "Discord"),
            react_1.default.createElement(MenuItem, { id: "link", href: "https://uniswap.info/" },
                react_1.default.createElement(react_feather_1.PieChart, { size: 14 }),
                "Analytics"),
            account && (react_1.default.createElement(Button_1.ButtonPrimary, { onClick: openClaimModal, padding: "8px 16px", width: "100%", borderRadius: "12px", mt: "0.5rem" }, "Claim UNI"))))));
}
exports.default = Menu;
