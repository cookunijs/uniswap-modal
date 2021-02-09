"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const useENSAddress_1 = __importDefault(require("./useENSAddress"));
const useENSName_1 = __importDefault(require("./useENSName"));
/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
function useENS(nameOrAddress) {
    const validated = utils_1.isAddress(nameOrAddress);
    const reverseLookup = useENSName_1.default(validated ? validated : undefined);
    const lookup = useENSAddress_1.default(nameOrAddress);
    return {
        loading: reverseLookup.loading || lookup.loading,
        address: validated ? validated : lookup.address,
        name: reverseLookup.ENSName ? reverseLookup.ENSName : !validated && lookup.address ? nameOrAddress || null : null
    };
}
exports.default = useENS;
