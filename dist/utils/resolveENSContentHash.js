"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("@ethersproject/contracts");
const utils_1 = require("ethers/lib/utils");
const REGISTRAR_ABI = [
    {
        constant: true,
        inputs: [
            {
                name: 'node',
                type: 'bytes32'
            }
        ],
        name: 'resolver',
        outputs: [
            {
                name: 'resolverAddress',
                type: 'address'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
const REGISTRAR_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const RESOLVER_ABI = [
    {
        constant: true,
        inputs: [
            {
                internalType: 'bytes32',
                name: 'node',
                type: 'bytes32'
            }
        ],
        name: 'contenthash',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
// cache the resolver contracts since most of them are the public resolver
function resolverContract(resolverAddress, provider) {
    return new contracts_1.Contract(resolverAddress, RESOLVER_ABI, provider);
}
/**
 * Fetches and decodes the result of an ENS contenthash lookup on mainnet to a URI
 * @param ensName to resolve
 * @param provider provider to use to fetch the data
 */
function resolveENSContentHash(ensName, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const ensRegistrarContract = new contracts_1.Contract(REGISTRAR_ADDRESS, REGISTRAR_ABI, provider);
        const hash = utils_1.namehash(ensName);
        const resolverAddress = yield ensRegistrarContract.resolver(hash);
        return resolverContract(resolverAddress, provider).contenthash(hash);
    });
}
exports.default = resolveENSContentHash;
