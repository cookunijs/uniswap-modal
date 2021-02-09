"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const hooks_1 = require("../../hooks");
const useDebounce_1 = __importDefault(require("../../hooks/useDebounce"));
const useIsWindowVisible_1 = __importDefault(require("../../hooks/useIsWindowVisible"));
const actions_1 = require("./actions");
const react_redux_1 = require("react-redux");
function Updater() {
    const { library, chainId } = hooks_1.useActiveWeb3React();
    const dispatch = react_redux_1.useDispatch();
    const windowVisible = useIsWindowVisible_1.default();
    const [state, setState] = react_1.useState({
        chainId,
        blockNumber: null
    });
    const blockNumberCallback = react_1.useCallback((blockNumber) => {
        setState(state => {
            if (chainId === state.chainId) {
                if (typeof state.blockNumber !== 'number')
                    return { chainId, blockNumber };
                return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) };
            }
            return state;
        });
    }, [chainId, setState]);
    // attach/detach listeners
    react_1.useEffect(() => {
        if (!library || !chainId || !windowVisible)
            return undefined;
        setState({ chainId, blockNumber: null });
        library
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error));
        library.on('block', blockNumberCallback);
        return () => {
            library.removeListener('block', blockNumberCallback);
        };
    }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);
    const debouncedState = useDebounce_1.default(state, 100);
    react_1.useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible)
            return;
        dispatch(actions_1.updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);
    return null;
}
exports.default = Updater;
