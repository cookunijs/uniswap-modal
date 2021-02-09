"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHasSocks = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const hooks_1 = require("../state/multicall/hooks");
const index_1 = require("./index");
const useContract_1 = require("./useContract");
function useSocksBalance() {
    const { account } = index_1.useActiveWeb3React();
    const socksContract = useContract_1.useSocksController();
    const { result } = hooks_1.useSingleCallResult(socksContract, 'balanceOf', [account !== null && account !== void 0 ? account : undefined], hooks_1.NEVER_RELOAD);
    const data = result === null || result === void 0 ? void 0 : result[0];
    return data ? sdk_1.JSBI.BigInt(data.toString()) : undefined;
}
exports.default = useSocksBalance;
function useHasSocks() {
    const balance = useSocksBalance();
    return react_1.useMemo(() => balance && sdk_1.JSBI.greaterThan(balance, sdk_1.JSBI.BigInt(0)), [balance]);
}
exports.useHasSocks = useHasSocks;
