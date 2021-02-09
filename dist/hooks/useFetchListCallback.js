"use strict";
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
exports.useFetchListCallback = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const connectors_1 = require("../connectors");
const actions_1 = require("../state/lists/actions");
const getTokenList_1 = __importDefault(require("../utils/getTokenList"));
const resolveENSContentHash_1 = __importDefault(require("../utils/resolveENSContentHash"));
const index_1 = require("./index");
function useFetchListCallback() {
    const { chainId, library } = index_1.useActiveWeb3React();
    const dispatch = react_redux_1.useDispatch();
    const ensResolver = react_1.useCallback((ensName) => {
        if (!library || chainId !== sdk_1.ChainId.MAINNET) {
            if (connectors_1.NETWORK_CHAIN_ID === sdk_1.ChainId.MAINNET) {
                const networkLibrary = connectors_1.getNetworkLibrary();
                if (networkLibrary) {
                    return resolveENSContentHash_1.default(ensName, networkLibrary);
                }
            }
            throw new Error('Could not construct mainnet ENS resolver');
        }
        return resolveENSContentHash_1.default(ensName, library);
    }, [chainId, library]);
    // note: prevent dispatch if using for list search or unsupported list
    return react_1.useCallback((listUrl, sendDispatch = true) => __awaiter(this, void 0, void 0, function* () {
        const requestId = toolkit_1.nanoid();
        sendDispatch && dispatch(actions_1.fetchTokenList.pending({ requestId, url: listUrl }));
        return getTokenList_1.default(listUrl, ensResolver)
            .then(tokenList => {
            sendDispatch && dispatch(actions_1.fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }));
            return tokenList;
        })
            .catch(error => {
            console.debug(`Failed to get list at url ${listUrl}`, error);
            sendDispatch && dispatch(actions_1.fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }));
            throw error;
        });
    }), [dispatch, ensResolver]);
}
exports.useFetchListCallback = useFetchListCallback;
