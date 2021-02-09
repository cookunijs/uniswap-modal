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
exports.ChangesList = void 0;
const token_lists_1 = require("@uniswap/token-lists");
const react_1 = __importStar(require("react"));
const react_ga_1 = __importDefault(require("react-ga"));
const react_redux_1 = require("react-redux");
const rebass_1 = require("rebass");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../state/application/hooks");
const actions_1 = require("../../state/lists/actions");
const theme_1 = require("../../theme");
const listVersionLabel_1 = __importDefault(require("../../utils/listVersionLabel"));
const Button_1 = require("../Button");
const Column_1 = require("../Column");
const Row_1 = require("../Row");
exports.ChangesList = styled_components_1.default.ul `
  max-height: 400px;
  overflow: auto;
`;
function ListUpdatePopup({ popKey, listUrl, oldList, newList, auto }) {
    const removePopup = hooks_1.useRemovePopup();
    const removeThisPopup = react_1.useCallback(() => removePopup(popKey), [popKey, removePopup]);
    const dispatch = react_redux_1.useDispatch();
    const handleAcceptUpdate = react_1.useCallback(() => {
        if (auto)
            return;
        react_ga_1.default.event({
            category: 'Lists',
            action: 'Update List from Popup',
            label: listUrl
        });
        dispatch(actions_1.acceptListUpdate(listUrl));
        removeThisPopup();
    }, [auto, dispatch, listUrl, removeThisPopup]);
    const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = react_1.useMemo(() => {
        return token_lists_1.diffTokenLists(oldList.tokens, newList.tokens);
    }, [newList.tokens, oldList.tokens]);
    const numTokensChanged = react_1.useMemo(() => Object.keys(tokensChanged).reduce((memo, chainId) => memo + Object.keys(tokensChanged[chainId]).length, 0), [tokensChanged]);
    return (react_1.default.createElement(Row_1.AutoRow, null,
        react_1.default.createElement(Column_1.AutoColumn, { style: { flex: '1' }, gap: "8px" }, auto ? (react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500 },
            "The token list \"",
            oldList.name,
            "\" has been updated to",
            ' ',
            react_1.default.createElement("strong", null, listVersionLabel_1.default(newList.version)),
            ".")) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", null,
                react_1.default.createElement(rebass_1.Text, null,
                    "An update is available for the token list \"",
                    oldList.name,
                    "\" (",
                    listVersionLabel_1.default(oldList.version),
                    " to ",
                    listVersionLabel_1.default(newList.version),
                    ")."),
                react_1.default.createElement(exports.ChangesList, null,
                    tokensAdded.length > 0 ? (react_1.default.createElement("li", null,
                        tokensAdded.map((token, i) => (react_1.default.createElement(react_1.default.Fragment, { key: `${token.chainId}-${token.address}` },
                            react_1.default.createElement("strong", { title: token.address }, token.symbol),
                            i === tokensAdded.length - 1 ? null : ', '))),
                        ' ',
                        "added")) : null,
                    tokensRemoved.length > 0 ? (react_1.default.createElement("li", null,
                        tokensRemoved.map((token, i) => (react_1.default.createElement(react_1.default.Fragment, { key: `${token.chainId}-${token.address}` },
                            react_1.default.createElement("strong", { title: token.address }, token.symbol),
                            i === tokensRemoved.length - 1 ? null : ', '))),
                        ' ',
                        "removed")) : null,
                    numTokensChanged > 0 ? react_1.default.createElement("li", null,
                        numTokensChanged,
                        " tokens updated") : null)),
            react_1.default.createElement(Row_1.AutoRow, null,
                react_1.default.createElement("div", { style: { flexGrow: 1, marginRight: 12 } },
                    react_1.default.createElement(Button_1.ButtonSecondary, { onClick: handleAcceptUpdate }, "Accept update")),
                react_1.default.createElement("div", { style: { flexGrow: 1 } },
                    react_1.default.createElement(Button_1.ButtonSecondary, { onClick: removeThisPopup }, "Dismiss"))))))));
}
exports.default = ListUpdatePopup;
