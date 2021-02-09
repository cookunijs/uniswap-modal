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
const styleds_1 = require("./styleds");
const Row_1 = require("components/Row");
const react_feather_1 = require("react-feather");
const rebass_1 = require("rebass");
const theme_1 = require("theme");
const styled_components_1 = __importDefault(require("styled-components"));
const ManageLists_1 = require("./ManageLists");
const ManageTokens_1 = __importDefault(require("./ManageTokens"));
const CurrencySearchModal_1 = require("./CurrencySearchModal");
const Wrapper = styled_components_1.default.div `
  width: 100%;
  position: relative;
  padding-bottom: 80px;
`;
const ToggleWrapper = styled_components_1.default(Row_1.RowBetween) `
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 6px;
`;
const ToggleOption = styled_components_1.default.div `
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg3)};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;
function Manage({ onDismiss, setModalView, setImportList, setImportToken, setListUrl }) {
    // toggle between tokens and lists
    const [showLists, setShowLists] = react_1.useState(true);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(styleds_1.PaddedColumn, null,
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(react_feather_1.ArrowLeft, { style: { cursor: 'pointer' }, onClick: () => setModalView(CurrencySearchModal_1.CurrencyModalView.search) }),
                react_1.default.createElement(rebass_1.Text, { fontWeight: 500, fontSize: 20 }, "Manage"),
                react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss }))),
        react_1.default.createElement(styleds_1.Separator, null),
        react_1.default.createElement(styleds_1.PaddedColumn, { style: { paddingBottom: 0 } },
            react_1.default.createElement(ToggleWrapper, null,
                react_1.default.createElement(ToggleOption, { onClick: () => setShowLists(!showLists), active: showLists }, "Lists"),
                react_1.default.createElement(ToggleOption, { onClick: () => setShowLists(!showLists), active: !showLists }, "Tokens"))),
        showLists ? (react_1.default.createElement(ManageLists_1.ManageLists, { setModalView: setModalView, setImportList: setImportList, setListUrl: setListUrl })) : (react_1.default.createElement(ManageTokens_1.default, { setModalView: setModalView, setImportToken: setImportToken }))));
}
exports.default = Manage;
