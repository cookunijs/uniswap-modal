"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
function getLibrary(provider) {
    const library = new providers_1.Web3Provider(provider, 'any');
    library.pollingInterval = 15000;
    return library;
}
exports.default = getLibrary;
