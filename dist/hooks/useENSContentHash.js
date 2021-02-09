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
/**
 * Does a lookup for an ENS name to find its contenthash.
 */
function useENSContentHash(ensName) {
    var _a, _b, _c;
    const ensNodeArgument = react_1.useMemo(() => {
        if (!ensName)
            return [undefined];
        try {
            return ensName ? [utils_1.namehash(ensName)] : [undefined];
        }
        catch (error) {
            return [undefined];
        }
    }, [ensName]);
    const registrarContract = useContract_1.useENSRegistrarContract(false);
    const resolverAddressResult = hooks_1.useSingleCallResult(registrarContract, 'resolver', ensNodeArgument);
    const resolverAddress = (_a = resolverAddressResult.result) === null || _a === void 0 ? void 0 : _a[0];
    const resolverContract = useContract_1.useENSResolverContract(resolverAddress && isZero_1.default(resolverAddress) ? undefined : resolverAddress, false);
    const contenthash = hooks_1.useSingleCallResult(resolverContract, 'contenthash', ensNodeArgument);
    return {
        contenthash: (_c = (_b = contenthash.result) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
        loading: resolverAddressResult.loading || contenthash.loading
    };
}
exports.default = useENSContentHash;
