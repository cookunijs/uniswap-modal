"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePopup = exports.addPopup = exports.setOpenModal = exports.updateBlockNumber = exports.ApplicationModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
var ApplicationModal;
(function (ApplicationModal) {
    ApplicationModal[ApplicationModal["WALLET"] = 0] = "WALLET";
    ApplicationModal[ApplicationModal["SETTINGS"] = 1] = "SETTINGS";
    ApplicationModal[ApplicationModal["SELF_CLAIM"] = 2] = "SELF_CLAIM";
    ApplicationModal[ApplicationModal["ADDRESS_CLAIM"] = 3] = "ADDRESS_CLAIM";
    ApplicationModal[ApplicationModal["CLAIM_POPUP"] = 4] = "CLAIM_POPUP";
    ApplicationModal[ApplicationModal["MENU"] = 5] = "MENU";
    ApplicationModal[ApplicationModal["DELEGATE"] = 6] = "DELEGATE";
    ApplicationModal[ApplicationModal["VOTE"] = 7] = "VOTE";
})(ApplicationModal = exports.ApplicationModal || (exports.ApplicationModal = {}));
exports.updateBlockNumber = toolkit_1.createAction('application/updateBlockNumber');
exports.setOpenModal = toolkit_1.createAction('application/setOpenModal');
exports.addPopup = toolkit_1.createAction('application/addPopup');
exports.removePopup = toolkit_1.createAction('application/removePopup');
