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
const styled_components_1 = __importDefault(require("styled-components"));
const AddressClaimModal_1 = __importDefault(require("./components/claim/AddressClaimModal"));
const URLWarning_1 = __importDefault(require("./components/Header/URLWarning"));
const Popups_1 = __importDefault(require("./components/Popups"));
const Web3ReactManager_1 = __importDefault(require("./components/Web3ReactManager"));
const actions_1 = require("./state/application/actions");
const hooks_1 = require("./state/application/hooks");
const Swap_1 = __importDefault(require("./pages/Swap"));
const AppWrapper = styled_components_1.default.div `
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;
const BodyWrapper = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`;
function TopLevelModals() {
    const open = hooks_1.useModalOpen(actions_1.ApplicationModal.ADDRESS_CLAIM);
    const toggle = hooks_1.useToggleModal(actions_1.ApplicationModal.ADDRESS_CLAIM);
    return react_1.default.createElement(AddressClaimModal_1.default, { isOpen: open, onDismiss: toggle });
}
function App() {
    return (react_1.default.createElement(react_1.Suspense, { fallback: null },
        react_1.default.createElement(AppWrapper, null,
            react_1.default.createElement(URLWarning_1.default, null),
            react_1.default.createElement(BodyWrapper, null,
                react_1.default.createElement(Popups_1.default, null),
                react_1.default.createElement(TopLevelModals, null),
                react_1.default.createElement(Web3ReactManager_1.default, null,
                    react_1.default.createElement(Swap_1.default, null))))));
}
exports.default = App;
