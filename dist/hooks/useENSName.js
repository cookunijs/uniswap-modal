"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const react_1 = require("react");
const hooks_1 = require("../state/multicall/hooks");
const utils_2 = require("../utils");
const isZero_1 = __importDefault(require("../utils/isZero"));
const useContract_1 = require("./useContract");
const useDebounce_1 = __importDefault(require("./useDebounce"));
/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
function useENSName(address) {
    var _a, _b, _c;
    const debouncedAddress = useDebounce_1.default(address, 200);
    const ensNodeArgument = react_1.useMemo(() => {
        if (!debouncedAddress || !utils_2.isAddress(debouncedAddress))
            return [undefined];
        try {
            return debouncedAddress ? [utils_1.namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [debouncedAddress]);
    const registrarContract = useContract_1.useENSRegistrarContract(false);
    const resolverAddress = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    const resolverAddressResult = (_a = resolverAddress.result) === null || _a === void 0 ? void 0 : _a[0];
    const resolverContract = useContract_1.useENSResolverContract(resolverAddressResult && !isZero_1.default(resolverAddressResult) ? resolverAddressResult : undefined, false);
    const name = hooks_1.useSingleCallResult(resolverContract, 'name', ensNodeArgument);
    const changed = debouncedAddress !== address;
    return {
        ENSName: changed ? null : (_c = (_b = name.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: changed || resolverAddress.loading || name.loading
    };
}
exports.default = useENSName;
