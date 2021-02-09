"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkedTransaction = exports.finalizeTransaction = exports.clearAllTransactions = exports.addTransaction = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
exports.addTransaction = toolkit_1.createAction('transactions/addTransaction');
exports.clearAllTransactions = toolkit_1.createAction('transactions/clearAllTransactions');
exports.finalizeTransaction = toolkit_1.createAction('transactions/finalizeTransaction');
exports.checkedTransaction = toolkit_1.createAction('transactions/checkedTransaction');
