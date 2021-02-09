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
const rebass_1 = require("rebass");
const styled_components_1 = __importStar(require("styled-components"));
const useOnClickOutside_1 = require("../../hooks/useOnClickOutside");
const actions_1 = require("../../state/application/actions");
const hooks_1 = require("../../state/application/hooks");
const hooks_2 = require("../../state/user/hooks");
const theme_1 = require("../../theme");
const Button_1 = require("../Button");
const Column_1 = require("../Column");
const Modal_1 = __importDefault(require("../Modal"));
const QuestionHelper_1 = __importDefault(require("../QuestionHelper"));
const Row_1 = require("../Row");
const Toggle_1 = __importDefault(require("../Toggle"));
const TransactionSettings_1 = __importDefault(require("../TransactionSettings"));
const StyledMenuIcon = styled_components_1.default(react_feather_1.Settings) `
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`;
const StyledCloseIcon = styled_components_1.default(react_feather_1.X) `
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;
const StyledMenuButton = styled_components_1.default.button `
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`;
const EmojiWrapper = styled_components_1.default.div `
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
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
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium `
    min-width: 18.125rem;
  `};
`;
const Break = styled_components_1.default.div `
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`;
const ModalContentWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`;
function SettingsTab() {
    const node = react_1.useRef();
    const open = hooks_1.useModalOpen(actions_1.ApplicationModal.SETTINGS);
    const toggle = hooks_1.useToggleSettingsMenu();
    const theme = react_1.useContext(styled_components_1.ThemeContext);
    const [userSlippageTolerance, setUserslippageTolerance] = hooks_2.useUserSlippageTolerance();
    const [ttl, setTtl] = hooks_2.useUserTransactionTTL();
    const [expertMode, toggleExpertMode] = hooks_2.useExpertModeManager();
    const [singleHopOnly, setSingleHopOnly] = hooks_2.useUserSingleHopOnly();
    // show confirmation view before turning on
    const [showConfirmation, setShowConfirmation] = react_1.useState(false);
    useOnClickOutside_1.useOnClickOutside(node, open ? toggle : undefined);
    return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    react_1.default.createElement(StyledMenu, { ref: node },
        react_1.default.createElement(Modal_1.default, { isOpen: showConfirmation, onDismiss: () => setShowConfirmation(false), maxHeight: 100 },
            react_1.default.createElement(ModalContentWrapper, null,
                react_1.default.createElement(Column_1.AutoColumn, { gap: "lg" },
                    react_1.default.createElement(Row_1.RowBetween, { style: { padding: '0 2rem' } },
                        react_1.default.createElement("div", null),
                        react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Are you sure?"),
                        react_1.default.createElement(StyledCloseIcon, { onClick: () => setShowConfirmation(false) })),
                    react_1.default.createElement(Break, null),
                    react_1.default.createElement(Column_1.AutoColumn, { gap: "lg", style: { padding: '0 2rem' } },
                        react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result in bad rates and lost funds."),
                        react_1.default.createElement(rebass_1.Text, { fontWeight: 600, fontSize: 20 }, "ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING."),
                        react_1.default.createElement(Button_1.ButtonError, { error: true, padding: '12px', onClick: () => {
                                if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                                    toggleExpertMode();
                                    setShowConfirmation(false);
                                }
                            } },
                            react_1.default.createElement(rebass_1.Text, { fontSize: 20, fontWeight: 500, id: "confirm-expert-mode" }, "Turn On Expert Mode")))))),
        react_1.default.createElement(StyledMenuButton, { onClick: toggle, id: "open-settings-dialog-button" },
            react_1.default.createElement(StyledMenuIcon, null),
            expertMode ? (react_1.default.createElement(EmojiWrapper, null,
                react_1.default.createElement("span", { role: "img", "aria-label": "wizard-icon" }, "\uD83E\uDDD9"))) : null),
        open && (react_1.default.createElement(MenuFlyout, null,
            react_1.default.createElement(Column_1.AutoColumn, { gap: "md", style: { padding: '1rem' } },
                react_1.default.createElement(rebass_1.Text, { fontWeight: 600, fontSize: 14 }, "Transaction Settings"),
                react_1.default.createElement(TransactionSettings_1.default, { rawSlippage: userSlippageTolerance, setRawSlippage: setUserslippageTolerance, deadline: ttl, setDeadline: setTtl }),
                react_1.default.createElement(rebass_1.Text, { fontWeight: 600, fontSize: 14 }, "Interface Settings"),
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(theme_1.TYPE.black, { fontWeight: 400, fontSize: 14, color: theme.text2 }, "Toggle Expert Mode"),
                        react_1.default.createElement(QuestionHelper_1.default, { text: "Bypasses confirmation modals and allows high slippage trades. Use at your own risk." })),
                    react_1.default.createElement(Toggle_1.default, { id: "toggle-expert-mode-button", isActive: expertMode, toggle: expertMode
                            ? () => {
                                toggleExpertMode();
                                setShowConfirmation(false);
                            }
                            : () => {
                                toggle();
                                setShowConfirmation(true);
                            } })),
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(theme_1.TYPE.black, { fontWeight: 400, fontSize: 14, color: theme.text2 }, "Disable Multihops"),
                        react_1.default.createElement(QuestionHelper_1.default, { text: "Restricts swaps to direct pairs only." })),
                    react_1.default.createElement(Toggle_1.default, { id: "toggle-disable-multihop-button", isActive: singleHopOnly, toggle: () => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true)) })))))));
}
exports.default = SettingsTab;
