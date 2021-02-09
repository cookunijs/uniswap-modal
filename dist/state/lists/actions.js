"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVersionUpdate = exports.acceptListUpdate = exports.disableList = exports.enableList = exports.removeList = exports.addList = exports.fetchTokenList = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
exports.fetchTokenList = {
    pending: toolkit_1.createAction('lists/fetchTokenList/pending'),
    fulfilled: toolkit_1.createAction('lists/fetchTokenList/fulfilled'),
    rejected: toolkit_1.createAction('lists/fetchTokenList/rejected')
};
// add and remove from list options
exports.addList = toolkit_1.createAction('lists/addList');
exports.removeList = toolkit_1.createAction('lists/removeList');
// select which lists to search across from loaded lists
exports.enableList = toolkit_1.createAction('lists/enableList');
exports.disableList = toolkit_1.createAction('lists/disableList');
// versioning
exports.acceptListUpdate = toolkit_1.createAction('lists/acceptListUpdate');
exports.rejectVersionUpdate = toolkit_1.createAction('lists/rejectVersionUpdate');
