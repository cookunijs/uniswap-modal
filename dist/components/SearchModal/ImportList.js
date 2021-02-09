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
exports.ImportList = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_ga_1 = __importDefault(require("react-ga"));
const theme_1 = require("theme");
const Card_1 = __importDefault(require("components/Card"));
const Column_1 = require("components/Column");
const Row_1 = require("components/Row");
const react_feather_1 = require("react-feather");
const useTheme_1 = __importDefault(require("hooks/useTheme"));
const polished_1 = require("polished");
const Button_1 = require("components/Button");
const styleds_1 = require("components/swap/styleds");
const components_1 = require("../../theme/components");
const ListLogo_1 = __importDefault(require("components/ListLogo"));
const styleds_2 = require("./styleds");
const react_redux_1 = require("react-redux");
const useFetchListCallback_1 = require("hooks/useFetchListCallback");
const actions_1 = require("state/lists/actions");
const CurrencySearchModal_1 = require("./CurrencySearchModal");
const hooks_1 = require("state/lists/hooks");
const Wrapper = styled_components_1.default.div `
  position: relative;
  width: 100%;
  overflow: auto;
`;
function ImportList({ listURL, list, setModalView, onDismiss }) {
    var _a;
    const theme = useTheme_1.default();
    const dispatch = react_redux_1.useDispatch();
    // user must accept
    const [confirmed, setConfirmed] = react_1.useState(false);
    const lists = hooks_1.useAllLists();
    const fetchList = useFetchListCallback_1.useFetchListCallback();
    // monitor is list is loading
    const adding = Boolean((_a = lists[listURL]) === null || _a === void 0 ? void 0 : _a.loadingRequestId);
    const [addError, setAddError] = react_1.useState(null);
    const handleAddList = react_1.useCallback(() => {
        if (adding)
            return;
        setAddError(null);
        fetchList(listURL)
            .then(() => {
            react_ga_1.default.event({
                category: 'Lists',
                action: 'Add List',
                label: listURL
            });
            // turn list on
            dispatch(actions_1.enableList(listURL));
            // go back to lists
            setModalView(CurrencySearchModal_1.CurrencyModalView.manage);
        })
            .catch(error => {
            react_ga_1.default.event({
                category: 'Lists',
                action: 'Add List Failed',
                label: listURL
            });
            setAddError(error.message);
            dispatch(actions_1.removeList(listURL));
        });
    }, [adding, dispatch, fetchList, listURL, setModalView]);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(styleds_2.PaddedColumn, { gap: "14px", style: { width: '100%', flex: '1 1' } },
            react_1.default.createElement(Row_1.RowBetween, null,
                react_1.default.createElement(react_feather_1.ArrowLeft, { style: { cursor: 'pointer' }, onClick: () => setModalView(CurrencySearchModal_1.CurrencyModalView.manage) }),
                react_1.default.createElement(theme_1.TYPE.mediumHeader, null, "Import List"),
                react_1.default.createElement(theme_1.CloseIcon, { onClick: onDismiss }))),
        react_1.default.createElement(styleds_1.SectionBreak, null),
        react_1.default.createElement(styleds_2.PaddedColumn, { gap: "md" },
            react_1.default.createElement(Column_1.AutoColumn, { gap: "md" },
                react_1.default.createElement(Card_1.default, { backgroundColor: theme.bg2, padding: "12px 20px" },
                    react_1.default.createElement(Row_1.RowBetween, null,
                        react_1.default.createElement(Row_1.RowFixed, null,
                            list.logoURI && react_1.default.createElement(ListLogo_1.default, { logoURI: list.logoURI, size: "40px" }),
                            react_1.default.createElement(Column_1.AutoColumn, { gap: "sm", style: { marginLeft: '20px' } },
                                react_1.default.createElement(Row_1.RowFixed, null,
                                    react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 600, mr: "6px" }, list.name),
                                    react_1.default.createElement(styleds_2.TextDot, null),
                                    react_1.default.createElement(theme_1.TYPE.main, { fontSize: '16px', ml: "6px" },
                                        list.tokens.length,
                                        " tokens")),
                                react_1.default.createElement(components_1.ExternalLink, { href: `https://tokenlists.org/token-list?url=${listURL}` },
                                    react_1.default.createElement(theme_1.TYPE.main, { fontSize: '12px', color: theme.blue1 }, listURL)))))),
                react_1.default.createElement(Card_1.default, { style: { backgroundColor: polished_1.transparentize(0.8, theme.red1) } },
                    react_1.default.createElement(Column_1.AutoColumn, { justify: "center", style: { textAlign: 'center', gap: '16px', marginBottom: '12px' } },
                        react_1.default.createElement(react_feather_1.AlertTriangle, { stroke: theme.red1, size: 32 }),
                        react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500, fontSize: 20, color: theme.red1 },
                            "Import at your own risk",
                            ' ')),
                    react_1.default.createElement(Column_1.AutoColumn, { style: { textAlign: 'center', gap: '16px', marginBottom: '12px' } },
                        react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 500, color: theme.red1 }, "By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one."),
                        react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 600, color: theme.red1 }, "If you purchase a token from this list, you may not be able to sell it back.")),
                    react_1.default.createElement(Row_1.AutoRow, { justify: "center", style: { cursor: 'pointer' }, onClick: () => setConfirmed(!confirmed) },
                        react_1.default.createElement(styleds_2.Checkbox, { name: "confirmed", type: "checkbox", checked: confirmed, onChange: () => setConfirmed(!confirmed) }),
                        react_1.default.createElement(theme_1.TYPE.body, { ml: "10px", fontSize: "16px", color: theme.red1, fontWeight: 500 }, "I understand"))),
                react_1.default.createElement(Button_1.ButtonPrimary, { disabled: !confirmed, altDisabledStyle: true, borderRadius: "20px", padding: "10px 1rem", onClick: handleAddList }, "Import"),
                addError ? (react_1.default.createElement(theme_1.TYPE.error, { title: addError, style: { textOverflow: 'ellipsis', overflow: 'hidden' }, error: true }, addError)) : null))));
}
exports.ImportList = ImportList;
