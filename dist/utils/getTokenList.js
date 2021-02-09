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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenlist_schema_json_1 = __importDefault(require("@uniswap/token-lists/src/tokenlist.schema.json"));
const ajv_1 = __importDefault(require("ajv"));
const contenthashToUri_1 = __importDefault(require("./contenthashToUri"));
const parseENSAddress_1 = require("./parseENSAddress");
const uriToHttp_1 = __importDefault(require("./uriToHttp"));
const tokenListValidator = new ajv_1.default({ allErrors: true }).compile(tokenlist_schema_json_1.default);
/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
function getTokenList(listUrl, resolveENSContentHash) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const parsedENS = parseENSAddress_1.parseENSAddress(listUrl);
        let urls;
        if (parsedENS) {
            let contentHashUri;
            try {
                contentHashUri = yield resolveENSContentHash(parsedENS.ensName);
            }
            catch (error) {
                console.debug(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
                throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
            }
            let translatedUri;
            try {
                translatedUri = contenthashToUri_1.default(contentHashUri);
            }
            catch (error) {
                console.debug('Failed to translate contenthash to URI', contentHashUri);
                throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`);
            }
            urls = uriToHttp_1.default(`${translatedUri}${(_a = parsedENS.ensPath) !== null && _a !== void 0 ? _a : ''}`);
        }
        else {
            urls = uriToHttp_1.default(listUrl);
        }
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const isLast = i === urls.length - 1;
            let response;
            try {
                response = yield fetch(url);
            }
            catch (error) {
                console.debug('Failed to fetch list', listUrl, error);
                if (isLast)
                    throw new Error(`Failed to download list ${listUrl}`);
                continue;
            }
            if (!response.ok) {
                if (isLast)
                    throw new Error(`Failed to download list ${listUrl}`);
                continue;
            }
            const json = yield response.json();
            if (!tokenListValidator(json)) {
                const validationErrors = (_c = (_b = tokenListValidator.errors) === null || _b === void 0 ? void 0 : _b.reduce((memo, error) => {
                    var _a;
                    const add = `${error.dataPath} ${(_a = error.message) !== null && _a !== void 0 ? _a : ''}`;
                    return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
                }, '')) !== null && _c !== void 0 ? _c : 'unknown error';
                throw new Error(`Token list failed validation: ${validationErrors}`);
            }
            return json;
        }
        throw new Error('Unrecognized list URL protocol.');
    });
}
exports.default = getTokenList;
