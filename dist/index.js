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
const core_1 = require("@web3-react/core");
require("inter-ui");
const react_1 = __importStar(require("react"));
// import ReactDOM from 'react-dom'
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const Blocklist_1 = __importDefault(require("./components/Blocklist"));
const constants_1 = require("./constants");
require("./i18n");
const App_1 = __importDefault(require("./App"));
const state_1 = __importDefault(require("./state"));
const updater_1 = __importDefault(require("./state/application/updater"));
const updater_2 = __importDefault(require("./state/lists/updater"));
const updater_3 = __importDefault(require("./state/multicall/updater"));
const updater_4 = __importDefault(require("./state/transactions/updater"));
const updater_5 = __importDefault(require("./state/user/updater"));
const theme_1 = __importStar(require("./theme"));
const getLibrary_1 = __importDefault(require("./utils/getLibrary"));
const Web3ProviderNetwork = core_1.createWeb3ReactRoot(constants_1.NetworkContextName);
if (!!window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
}
function Updaters() {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(updater_2.default, null),
        react_1.default.createElement(updater_5.default, null),
        react_1.default.createElement(updater_1.default, null),
        react_1.default.createElement(updater_4.default, null),
        react_1.default.createElement(updater_3.default, null)));
}
function Modal() {
    return (react_1.default.createElement(react_1.StrictMode, null,
        react_1.default.createElement(theme_1.FixedGlobalStyle, null),
        react_1.default.createElement(core_1.Web3ReactProvider, { getLibrary: getLibrary_1.default },
            react_1.default.createElement(Web3ProviderNetwork, { getLibrary: getLibrary_1.default },
                react_1.default.createElement(Blocklist_1.default, null,
                    react_1.default.createElement(react_redux_1.Provider, { store: state_1.default },
                        react_1.default.createElement(Updaters, null),
                        react_1.default.createElement(theme_1.default, null,
                            react_1.default.createElement(react_router_dom_1.HashRouter, null,
                                react_1.default.createElement(App_1.default, null)))))))));
}
exports.default = Modal;
// ReactDOM.render(
//   ,
//   document.getElementById('root')
// )
