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
exports.CurrencyModalView = void 0;
const react_1 = __importStar(require("react"));
const useLast_1 = __importDefault(require("../../hooks/useLast"));
const Modal_1 = __importDefault(require("../Modal"));
const CurrencySearch_1 = require("./CurrencySearch");
const ImportToken_1 = require("./ImportToken");
const usePrevious_1 = __importDefault(require("hooks/usePrevious"));
const Manage_1 = __importDefault(require("./Manage"));
const ImportList_1 = require("./ImportList");
var CurrencyModalView;
(function (CurrencyModalView) {
    CurrencyModalView[CurrencyModalView["search"] = 0] = "search";
    CurrencyModalView[CurrencyModalView["manage"] = 1] = "manage";
    CurrencyModalView[CurrencyModalView["importToken"] = 2] = "importToken";
    CurrencyModalView[CurrencyModalView["importList"] = 3] = "importList";
})(CurrencyModalView = exports.CurrencyModalView || (exports.CurrencyModalView = {}));
function CurrencySearchModal({ isOpen, onDismiss, onCurrencySelect, selectedCurrency, otherSelectedCurrency, showCommonBases = false }) {
    const [modalView, setModalView] = react_1.useState(CurrencyModalView.manage);
    const lastOpen = useLast_1.default(isOpen);
    react_1.useEffect(() => {
        if (isOpen && !lastOpen) {
            setModalView(CurrencyModalView.search);
        }
    }, [isOpen, lastOpen]);
    const handleCurrencySelect = react_1.useCallback((currency) => {
        onCurrencySelect(currency);
        onDismiss();
    }, [onDismiss, onCurrencySelect]);
    // for token import view
    const prevView = usePrevious_1.default(modalView);
    // used for import token flow
    const [importToken, setImportToken] = react_1.useState();
    // used for import list
    const [importList, setImportList] = react_1.useState();
    const [listURL, setListUrl] = react_1.useState();
    // change min height if not searching
    const minHeight = modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList ? 40 : 80;
    return (react_1.default.createElement(Modal_1.default, { isOpen: isOpen, onDismiss: onDismiss, maxHeight: 80, minHeight: minHeight }, modalView === CurrencyModalView.search ? (react_1.default.createElement(CurrencySearch_1.CurrencySearch, { isOpen: isOpen, onDismiss: onDismiss, onCurrencySelect: handleCurrencySelect, selectedCurrency: selectedCurrency, otherSelectedCurrency: otherSelectedCurrency, showCommonBases: showCommonBases, showImportView: () => setModalView(CurrencyModalView.importToken), setImportToken: setImportToken, showManageView: () => setModalView(CurrencyModalView.manage) })) : modalView === CurrencyModalView.importToken && importToken ? (react_1.default.createElement(ImportToken_1.ImportToken, { tokens: [importToken], onDismiss: onDismiss, onBack: () => setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search), handleCurrencySelect: handleCurrencySelect })) : modalView === CurrencyModalView.importList && importList && listURL ? (react_1.default.createElement(ImportList_1.ImportList, { list: importList, listURL: listURL, onDismiss: onDismiss, setModalView: setModalView })) : modalView === CurrencyModalView.manage ? (react_1.default.createElement(Manage_1.default, { onDismiss: onDismiss, setModalView: setModalView, setImportToken: setImportToken, setImportList: setImportList, setListUrl: setListUrl })) : ('')));
}
exports.default = CurrencySearchModal;
