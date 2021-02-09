"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const react_1 = require("react");
const hooks_1 = require("../state/multicall/hooks");
const isZero_1 = __importDefault(require("../utils/isZero"));
const useContract_1 = require("./useContract");
const useDebounce_1 = __importDefault(require("./useDebounce"));
/**
 * Does a lookup for an ENS name to find its address.
 */
function useENSAddress(ensName) {
    var _a, _b, _c;
    const debouncedName = useDebounce_1.default(ensName, 200);
    const ensNodeArgument = react_1.useMemo(() => {
        if (!debouncedName)
            return [undefined];
        try {
            return debouncedName ? [utils_1.namehash(debouncedName)] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [debouncedName]);
    const registrarContract = useContract_1.useENSRegistrarContract(false);
    const resolverAddress = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    const resolverAddressResult = (_a = resolverAddress.result) === null || _a === void 0 ? void 0 : _a[0];
    const resolverContract = useContract_1.useENSResolverContract(resolverAddressResult && !isZero_1.default(resolverAddressResult) ? resolverAddressResult : undefined, false);
    const addr = hooks_1.useSingleCallResult(resolverContract, 'addr', ensNodeArgument);
    const changed = debouncedName !== ensName;
    return {
        address: changed ? null : (_c = (_b = addr.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: changed || resolverAddress.loading || addr.loading
    };
}
exports.default = useENSAddress;
