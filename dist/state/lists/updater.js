"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("state/lists/hooks");
const token_lists_1 = require("@uniswap/token-lists");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const hooks_2 = require("../../hooks");
const useFetchListCallback_1 = require("../../hooks/useFetchListCallback");
const useInterval_1 = __importDefault(require("../../hooks/useInterval"));
const useIsWindowVisible_1 = __importDefault(require("../../hooks/useIsWindowVisible"));
const actions_1 = require("./actions");
const hooks_3 = require("./hooks");
const Tokens_1 = require("hooks/Tokens");
function Updater() {
    const { library } = hooks_2.useActiveWeb3React();
    const dispatch = react_redux_1.useDispatch();
    const isWindowVisible = useIsWindowVisible_1.default();
    // get all loaded lists, and the active urls
    const lists = hooks_1.useAllLists();
    const activeListUrls = hooks_3.useActiveListUrls();
    // initiate loading
    Tokens_1.useAllInactiveTokens();
    const fetchList = useFetchListCallback_1.useFetchListCallback();
    const fetchAllListsCallback = react_1.useCallback(() => {
        if (!isWindowVisible)
            return;
        Object.keys(lists).forEach(url => fetchList(url).catch(error => console.debug('interval list fetching error', error)));
    }, [fetchList, isWindowVisible, lists]);
    // fetch all lists every 10 minutes, but only after we initialize library
    useInterval_1.default(fetchAllListsCallback, library ? 1000 * 60 * 10 : null);
    // whenever a list is not loaded and not loading, try again to load it
    react_1.useEffect(() => {
        Object.keys(lists).forEach(listUrl => {
            const list = lists[listUrl];
            if (!list.current && !list.loadingRequestId && !list.error) {
                fetchList(listUrl).catch(error => console.debug('list added fetching error', error));
            }
        });
    }, [dispatch, fetchList, library, lists]);
    // automatically update lists if versions are minor/patch
    react_1.useEffect(() => {
        Object.keys(lists).forEach(listUrl => {
            const list = lists[listUrl];
            if (list.current && list.pendingUpdate) {
                const bump = token_lists_1.getVersionUpgrade(list.current.version, list.pendingUpdate.version);
                switch (bump) {
                    case token_lists_1.VersionUpgrade.NONE:
                        throw new Error('unexpected no version bump');
                    case token_lists_1.VersionUpgrade.PATCH:
                    case token_lists_1.VersionUpgrade.MINOR:
                        const min = token_lists_1.minVersionBump(list.current.tokens, list.pendingUpdate.tokens);
                        // automatically update minor/patch as long as bump matches the min update
                        if (bump >= min) {
                            dispatch(actions_1.acceptListUpdate(listUrl));
                        }
                        else {
                            console.error(`List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`);
                        }
                        break;
                    // update any active or inactive lists
                    case token_lists_1.VersionUpgrade.MAJOR:
                        dispatch(actions_1.acceptListUpdate(listUrl));
                }
            }
        });
    }, [dispatch, lists, activeListUrls]);
    return null;
}
exports.default = Updater;
