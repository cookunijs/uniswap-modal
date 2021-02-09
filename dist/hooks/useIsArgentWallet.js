"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("../state/multicall/hooks");
const index_1 = require("./index");
const useContract_1 = require("./useContract");
function useIsArgentWallet() {
    var _a, _b;
    const { account } = index_1.useActiveWeb3React();
    const argentWalletDetector = useContract_1.useArgentWalletDetectorContract();
    const call = hooks_1.useSingleCallResult(argentWalletDetector, 'isArgentWallet', [account !== null && account !== void 0 ? account : undefined], hooks_1.NEVER_RELOAD);
    return (_b = (_a = call === null || call === void 0 ? void 0 : call.result) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : false;
}
exports.default = useIsArgentWallet;
