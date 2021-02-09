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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageLists = void 0;
const react_1 = __importStar(require("react"));
const react_feather_1 = require("react-feather");
const react_ga_1 = __importDefault(require("react-ga"));
const react_popper_1 = require("react-popper");
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const useFetchListCallback_1 = require("../../hooks/useFetchListCallback");
const useOnClickOutside_1 = require("../../hooks/useOnClickOutside");
const useToggle_1 = __importDefault(require("../../hooks/useToggle"));
const actions_1 = require("../../state/lists/actions");
const hooks_1 = require("../../state/lists/hooks");
const theme_1 = require("../../theme");
const listVersionLabel_1 = __importDefault(require("../../utils/listVersionLabel"));
const parseENSAddress_1 = require("../../utils/parseENSAddress");
const uriToHttp_1 = __importDefault(require("../../utils/uriToHttp"));
const Button_1 = require("../Button");
const Column_1 = __importStar(require("../Column"));
const ListLogo_1 = __importDefault(require("../ListLogo"));
const Row_1 = __importStar(require("../Row"));
const styleds_1 = require("./styleds");
const useColor_1 = require("hooks/useColor");
const useTheme_1 = __importDefault(require("../../hooks/useTheme"));
const ListToggle_1 = __importDefault(require("../Toggle/ListToggle"));
const Card_1 = __importDefault(require("components/Card"));
const CurrencySearchModal_1 = require("./CurrencySearchModal");
const lists_1 = require("constants/lists");
const Wrapper = styled_components_1.default(Column_1.default) `
  width: 100%;
  height: 100%;
`;
const UnpaddedLinkStyledButton = styled_components_1.default(theme_1.LinkStyledButton) `
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`;
const PopoverContainer = styled_components_1.default.div `
  z-index: 100;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`;
const StyledMenu = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`;
const StyledTitleText = styled_components_1.default.div `
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`;
const StyledListUrlText = styled_components_1.default(theme_1.TYPE.main) `
  font-size: 12px;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`;
const RowWrapper = styled_components_1.default(Row_1.default) `
  background-color: ${({ bgColor, active, theme }) => (active ? bgColor !== null && bgColor !== void 0 ? bgColor : 'transparent' : theme.bg2)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`;
function listUrlRowHTMLId(listUrl) {
    return `list-row-${listUrl.replace(/\./g, '-')}`;
}
const ListRow = react_1.memo(function ListRow({ listUrl }) {
    const listsByUrl = react_redux_1.useSelector(state => state.lists.byUrl);
    const dispatch = react_redux_1.useDispatch();
    const { current: list, pendingUpdate: pending } = listsByUrl[listUrl];
    const theme = useTheme_1.default();
    const listColor = useColor_1.useListColor(list === null || list === void 0 ? void 0 : list.logoURI);
    const isActive = hooks_1.useIsListActive(listUrl);
    const [open, toggle] = useToggle_1.default(false);
    const node = react_1.useRef();
    const [referenceElement, setReferenceElement] = react_1.useState();
    const [popperElement, setPopperElement] = react_1.useState();
    const { styles, attributes } = react_popper_1.usePopper(referenceElement, popperElement, {
        placement: 'auto',
        strategy: 'fixed',
        modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
    });
    useOnClickOutside_1.useOnClickOutside(node, open ? toggle : undefined);
    const handleAcceptListUpdate = react_1.useCallback(() => {
        if (!pending)
            return;
        react_ga_1.default.event({
            category: 'Lists',
            action: 'Update List from List Select',
            label: listUrl
        });
        dispatch(actions_1.acceptListUpdate(listUrl));
    }, [dispatch, listUrl, pending]);
    const handleRemoveList = react_1.useCallback(() => {
        react_ga_1.default.event({
            category: 'Lists',
            action: 'Start Remove List',
            label: listUrl
        });
        if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
            react_ga_1.default.event({
                category: 'Lists',
                action: 'Confirm Remove List',
                label: listUrl
            });
            dispatch(actions_1.removeList(listUrl));
        }
    }, [dispatch, listUrl]);
    const handleEnableList = react_1.useCallback(() => {
        react_ga_1.default.event({
            category: 'Lists',
            action: 'Enable List',
            label: listUrl
        });
        dispatch(actions_1.enableList(listUrl));
    }, [dispatch, listUrl]);
    const handleDisableList = react_1.useCallback(() => {
        react_ga_1.default.event({
            category: 'Lists',
            action: 'Disable List',
            label: listUrl
        });
        dispatch(actions_1.disableList(listUrl));
    }, [dispatch, listUrl]);
    if (!list)
        return null;
    return (react_1.default.createElement(RowWrapper, { active: isActive, bgColor: listColor, key: listUrl, id: listUrlRowHTMLId(listUrl) },
        list.logoURI ? (react_1.default.createElement(ListLogo_1.default, { size: "40px", style: { marginRight: '1rem' }, logoURI: list.logoURI, alt: `${list.name} list logo` })) : (react_1.default.createElement("div", { style: { width: '24px', height: '24px', marginRight: '1rem' } })),
        react_1.default.createElement(Column_1.default, { style: { flex: '1' } },
            react_1.default.createElement(Row_1.default, null,
                react_1.default.createElement(StyledTitleText, { active: isActive }, list.name)),
            react_1.default.createElement(Row_1.RowFixed, { mt: "4px" },
                react_1.default.createElement(StyledListUrlText, { active: isActive, mr: "6px" },
                    list.tokens.length,
                    " tokens"),
                react_1.default.createElement(StyledMenu, { ref: node },
                    react_1.default.createElement(Button_1.ButtonEmpty, { onClick: toggle, ref: setReferenceElement, padding: "0" },
                        react_1.default.createElement(react_feather_1.Settings, { stroke: isActive ? theme.bg1 : theme.text1, size: 12 })),
                    open && (react_1.default.createElement(PopoverContainer, Object.assign({ show: true, ref: setPopperElement, style: styles.popper }, attributes.popper),
                        react_1.default.createElement("div", null, list && listVersionLabel_1.default(list.version)),
                        react_1.default.createElement(styleds_1.SeparatorDark, null),
                        react_1.default.createElement(theme_1.ExternalLink, { href: `https://tokenlists.org/token-list?url=${listUrl}` }, "View list"),
                        react_1.default.createElement(UnpaddedLinkStyledButton, { onClick: handleRemoveList, disabled: Object.keys(listsByUrl).length === 1 }, "Remove list"),
                        pending && (react_1.default.createElement(UnpaddedLinkStyledButton, { onClick: handleAcceptListUpdate }, "Update list"))))))),
        react_1.default.createElement(ListToggle_1.default, { isActive: isActive, bgColor: listColor, toggle: () => {
                isActive ? handleDisableList() : handleEnableList();
            } })));
});
const ListContainer = styled_components_1.default.div `
  padding: 1rem;
  height: 100%;
  overflow: auto;
  padding-bottom: 80px;
`;
function ManageLists({ setModalView, setImportList, setListUrl }) {
    const theme = useTheme_1.default();
    const [listUrlInput, setListUrlInput] = react_1.useState('');
    const lists = hooks_1.useAllLists();
    // sort by active but only if not visible
    const activeListUrls = hooks_1.useActiveListUrls();
    const [activeCopy, setActiveCopy] = react_1.useState();
    react_1.useEffect(() => {
        if (!activeCopy && activeListUrls) {
            setActiveCopy(activeListUrls);
        }
    }, [activeCopy, activeListUrls]);
    const handleInput = react_1.useCallback(e => {
        setListUrlInput(e.target.value);
    }, []);
    const fetchList = useFetchListCallback_1.useFetchListCallback();
    const validUrl = react_1.useMemo(() => {
        return uriToHttp_1.default(listUrlInput).length > 0 || Boolean(parseENSAddress_1.parseENSAddress(listUrlInput));
    }, [listUrlInput]);
    const sortedLists = react_1.useMemo(() => {
        const listUrls = Object.keys(lists);
        return listUrls
            .filter(listUrl => {
            // only show loaded lists, hide unsupported lists
            return Boolean(lists[listUrl].current) && !Boolean(lists_1.UNSUPPORTED_LIST_URLS.includes(listUrl));
        })
            .sort((u1, u2) => {
            const { current: l1 } = lists[u1];
            const { current: l2 } = lists[u2];
            // first filter on active lists
            if ((activeCopy === null || activeCopy === void 0 ? void 0 : activeCopy.includes(u1)) && !(activeCopy === null || activeCopy === void 0 ? void 0 : activeCopy.includes(u2))) {
                return -1;
            }
            if (!(activeCopy === null || activeCopy === void 0 ? void 0 : activeCopy.includes(u1)) && (activeCopy === null || activeCopy === void 0 ? void 0 : activeCopy.includes(u2))) {
                return 1;
            }
            if (l1 && l2) {
                return l1.name.toLowerCase() < l2.name.toLowerCase()
                    ? -1
                    : l1.name.toLowerCase() === l2.name.toLowerCase()
                        ? 0
                        : 1;
            }
            if (l1)
                return -1;
            if (l2)
                return 1;
            return 0;
        });
    }, [lists, activeCopy]);
    // temporary fetched list for import flow
    const [tempList, setTempList] = react_1.useState();
    const [addError, setAddError] = react_1.useState();
    react_1.useEffect(() => {
        function fetchTempList() {
            return __awaiter(this, void 0, void 0, function* () {
                fetchList(listUrlInput, false)
                    .then(list => setTempList(list))
                    .catch(() => setAddError('Error importing list'));
            });
        }
        // if valid url, fetch details for card
        if (validUrl) {
            fetchTempList();
        }
        else {
            setTempList(undefined);
            listUrlInput !== '' && setAddError('Enter valid list location');
        }
        // reset error
        if (listUrlInput === '') {
            setAddError(undefined);
        }
    }, [fetchList, listUrlInput, validUrl]);
    // check if list is already imported
    const isImported = Object.keys(lists).includes(listUrlInput);
    // set list values and have parent modal switch to import list view
    const handleImport = react_1.useCallback(() => {
        if (!tempList)
            return;
        setImportList(tempList);
        setModalView(CurrencySearchModal_1.CurrencyModalView.importList);
        setListUrl(listUrlInput);
    }, [listUrlInput, setImportList, setListUrl, setModalView, tempList]);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(styleds_1.PaddedColumn, { gap: "14px" },
            react_1.default.createElement(Row_1.default, null,
                react_1.default.createElement(styleds_1.SearchInput, { type: "text", id: "list-add-input", placeholder: "https:// or ipfs:// or ENS name", value: listUrlInput, onChange: handleInput })),
            addError ? (react_1.default.createElement(theme_1.TYPE.error, { title: addError, style: { textOverflow: 'ellipsis', overflow: 'hidden' }, error: true }, addError)) : null),
        tempList && (react_1.default.createElement(styleds_1.PaddedColumn, { style: { paddingTop: 0 } },
            react_1.default.createElement(Card_1.default, { backgroundColor: theme.bg2, padding: "12px 20px" },
                react_1.default.createElement(Row_1.RowBetween, null,
                    react_1.default.createElement(Row_1.RowFixed, null,
                        tempList.logoURI && react_1.default.createElement(ListLogo_1.default, { logoURI: tempList.logoURI, size: "40px" }),
                        react_1.default.createElement(Column_1.AutoColumn, { gap: "4px", style: { marginLeft: '20px' } },
                            react_1.default.createElement(theme_1.TYPE.body, { fontWeight: 600 }, tempList.name),
                            react_1.default.createElement(theme_1.TYPE.main, { fontSize: '12px' },
                                tempList.tokens.length,
                                " tokens"))),
                    isImported ? (react_1.default.createElement(Row_1.RowFixed, null,
                        react_1.default.createElement(theme_1.IconWrapper, { stroke: theme.text2, size: "16px", marginRight: '10px' },
                            react_1.default.createElement(react_feather_1.CheckCircle, null)),
                        react_1.default.createElement(theme_1.TYPE.body, { color: theme.text2 }, "Loaded"))) : (react_1.default.createElement(Button_1.ButtonPrimary, { style: { fontSize: '14px' }, padding: "6px 8px", width: "fit-content", onClick: handleImport }, "Import")))))),
        react_1.default.createElement(styleds_1.Separator, null),
        react_1.default.createElement(ListContainer, null,
            react_1.default.createElement(Column_1.AutoColumn, { gap: "md" }, sortedLists.map(listUrl => (react_1.default.createElement(ListRow, { key: listUrl, listUrl: listUrl })))))));
}
exports.ManageLists = ManageLists;
