"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const contenthashToUri_1 = __importDefault(require("../utils/contenthashToUri"));
const parseENSAddress_1 = require("../utils/parseENSAddress");
const uriToHttp_1 = __importDefault(require("../utils/uriToHttp"));
const useENSContentHash_1 = __importDefault(require("./useENSContentHash"));
function useHttpLocations(uri) {
    const ens = react_1.useMemo(() => (uri ? parseENSAddress_1.parseENSAddress(uri) : undefined), [uri]);
    const resolvedContentHash = useENSContentHash_1.default(ens === null || ens === void 0 ? void 0 : ens.ensName);
    return react_1.useMemo(() => {
        if (ens) {
            return resolvedContentHash.contenthash ? uriToHttp_1.default(contenthashToUri_1.default(resolvedContentHash.contenthash)) : [];
        }
        else {
            return uri ? uriToHttp_1.default(uri) : [];
        }
    }, [ens, resolvedContentHash.contenthash, uri]);
}
exports.default = useHttpLocations;
