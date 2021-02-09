"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FortmaticConnector = exports.OVERLAY_READY = void 0;
const sdk_1 = require("@uniswap/sdk");
const fortmatic_connector_1 = require("@web3-react/fortmatic-connector");
exports.OVERLAY_READY = 'OVERLAY_READY';
const CHAIN_ID_NETWORK_ARGUMENT = {
    [sdk_1.ChainId.MAINNET]: undefined,
    [sdk_1.ChainId.ROPSTEN]: 'ropsten',
    [sdk_1.ChainId.RINKEBY]: 'rinkeby',
    [sdk_1.ChainId.KOVAN]: 'kovan'
};
class FortmaticConnector extends fortmatic_connector_1.FortmaticConnector {
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fortmatic) {
                const { default: Fortmatic } = yield Promise.resolve().then(() => __importStar(require('fortmatic')));
                const { apiKey, chainId } = this;
                if (chainId in CHAIN_ID_NETWORK_ARGUMENT) {
                    this.fortmatic = new Fortmatic(apiKey, CHAIN_ID_NETWORK_ARGUMENT[chainId]);
                }
                else {
                    throw new Error(`Unsupported network ID: ${chainId}`);
                }
            }
            const provider = this.fortmatic.getProvider();
            const pollForOverlayReady = new Promise(resolve => {
                const interval = setInterval(() => {
                    if (provider.overlayReady) {
                        clearInterval(interval);
                        this.emit(exports.OVERLAY_READY);
                        resolve();
                    }
                }, 200);
            });
            const [account] = yield Promise.all([
                provider.enable().then((accounts) => accounts[0]),
                pollForOverlayReady
            ]);
            return { provider: this.fortmatic.getProvider(), chainId: this.chainId, account };
        });
    }
}
exports.FortmaticConnector = FortmaticConnector;
