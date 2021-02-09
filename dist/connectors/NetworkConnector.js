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
exports.NetworkConnector = void 0;
const abstract_connector_1 = require("@web3-react/abstract-connector");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
class RequestError extends Error {
    constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
class MiniRpcProvider {
    constructor(chainId, url, batchWaitTimeMs) {
        this.isMetaMask = false;
        this.nextId = 1;
        this.batchTimeoutId = null;
        this.batch = [];
        this.clearBatch = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            console.debug('Clearing batch', this.batch);
            const batch = this.batch;
            this.batch = [];
            this.batchTimeoutId = null;
            let response;
            try {
                response = yield fetch(this.url, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json', accept: 'application/json' },
                    body: JSON.stringify(batch.map(item => item.request))
                });
            }
            catch (error) {
                batch.forEach(({ reject }) => reject(new Error('Failed to send batch call')));
                return;
            }
            if (!response.ok) {
                batch.forEach(({ reject }) => reject(new RequestError(`${response.status}: ${response.statusText}`, -32000)));
                return;
            }
            let json;
            try {
                json = yield response.json();
            }
            catch (error) {
                batch.forEach(({ reject }) => reject(new Error('Failed to parse JSON response')));
                return;
            }
            const byKey = batch.reduce((memo, current) => {
                memo[current.request.id] = current;
                return memo;
            }, {});
            for (const result of json) {
                const { resolve, reject, request: { method } } = byKey[result.id];
                if (resolve && reject) {
                    if ('error' in result) {
                        reject(new RequestError((_a = result === null || result === void 0 ? void 0 : result.error) === null || _a === void 0 ? void 0 : _a.message, (_b = result === null || result === void 0 ? void 0 : result.error) === null || _b === void 0 ? void 0 : _b.code, (_c = result === null || result === void 0 ? void 0 : result.error) === null || _c === void 0 ? void 0 : _c.data));
                    }
                    else if ('result' in result) {
                        resolve(result.result);
                    }
                    else {
                        reject(new RequestError(`Received unexpected JSON-RPC response to ${method} request.`, -32000, result));
                    }
                }
            }
        });
        this.sendAsync = (request, callback) => {
            this.request(request.method, request.params)
                .then(result => callback(null, { jsonrpc: '2.0', id: request.id, result }))
                .catch(error => callback(error, null));
        };
        this.request = (method, params) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            if (typeof method !== 'string') {
                return this.request(method.method, method.params);
            }
            if (method === 'eth_chainId') {
                return `0x${this.chainId.toString(16)}`;
            }
            const promise = new Promise((resolve, reject) => {
                this.batch.push({
                    request: {
                        jsonrpc: '2.0',
                        id: this.nextId++,
                        method,
                        params
                    },
                    resolve,
                    reject
                });
            });
            this.batchTimeoutId = (_d = this.batchTimeoutId) !== null && _d !== void 0 ? _d : setTimeout(this.clearBatch, this.batchWaitTimeMs);
            return promise;
        });
        this.chainId = chainId;
        this.url = url;
        const parsed = new URL(url);
        this.host = parsed.host;
        this.path = parsed.pathname;
        // how long to wait to batch calls
        this.batchWaitTimeMs = batchWaitTimeMs !== null && batchWaitTimeMs !== void 0 ? batchWaitTimeMs : 50;
    }
}
class NetworkConnector extends abstract_connector_1.AbstractConnector {
    constructor({ urls, defaultChainId }) {
        tiny_invariant_1.default(defaultChainId || Object.keys(urls).length === 1, 'defaultChainId is a required argument with >1 url');
        super({ supportedChainIds: Object.keys(urls).map((k) => Number(k)) });
        this.currentChainId = defaultChainId || Number(Object.keys(urls)[0]);
        this.providers = Object.keys(urls).reduce((accumulator, chainId) => {
            accumulator[Number(chainId)] = new MiniRpcProvider(Number(chainId), urls[Number(chainId)]);
            return accumulator;
        }, {});
    }
    get provider() {
        return this.providers[this.currentChainId];
    }
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            return { provider: this.providers[this.currentChainId], chainId: this.currentChainId, account: null };
        });
    }
    getProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.providers[this.currentChainId];
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.currentChainId;
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    deactivate() {
        return;
    }
}
exports.NetworkConnector = NetworkConnector;
