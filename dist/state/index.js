"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const redux_localstorage_simple_1 = require("redux-localstorage-simple");
const reducer_1 = __importDefault(require("./application/reducer"));
const actions_1 = require("./global/actions");
const reducer_2 = __importDefault(require("./user/reducer"));
const reducer_3 = __importDefault(require("./transactions/reducer"));
const reducer_4 = __importDefault(require("./swap/reducer"));
const reducer_5 = __importDefault(require("./mint/reducer"));
const reducer_6 = __importDefault(require("./lists/reducer"));
const reducer_7 = __importDefault(require("./burn/reducer"));
const reducer_8 = __importDefault(require("./multicall/reducer"));
const PERSISTED_KEYS = ['user', 'transactions', 'lists'];
const store = toolkit_1.configureStore({
    reducer: {
        application: reducer_1.default,
        user: reducer_2.default,
        transactions: reducer_3.default,
        swap: reducer_4.default,
        mint: reducer_5.default,
        burn: reducer_7.default,
        multicall: reducer_8.default,
        lists: reducer_6.default
    },
    middleware: [...toolkit_1.getDefaultMiddleware({ thunk: false }), redux_localstorage_simple_1.save({ states: PERSISTED_KEYS })],
    preloadedState: redux_localstorage_simple_1.load({ states: PERSISTED_KEYS })
});
store.dispatch(actions_1.updateVersion());
exports.default = store;
