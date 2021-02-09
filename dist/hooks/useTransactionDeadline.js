"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const useCurrentBlockTimestamp_1 = __importDefault(require("./useCurrentBlockTimestamp"));
// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
function useTransactionDeadline() {
    const ttl = react_redux_1.useSelector(state => state.user.userDeadline);
    const blockTimestamp = useCurrentBlockTimestamp_1.default();
    return react_1.useMemo(() => {
        if (blockTimestamp && ttl)
            return blockTimestamp.add(ttl);
        return undefined;
    }, [blockTimestamp, ttl]);
}
exports.default = useTransactionDeadline;
