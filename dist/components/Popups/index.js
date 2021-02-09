"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../state/application/hooks");
const Column_1 = require("../Column");
const PopupItem_1 = __importDefault(require("./PopupItem"));
const ClaimPopup_1 = __importDefault(require("./ClaimPopup"));
const hooks_2 = require("../../state/user/hooks");
const MobilePopupWrapper = styled_components_1.default.div `
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}};

  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall `
    display: block;
  `};
`;
const MobilePopupInner = styled_components_1.default.div `
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const FixedPopupColumn = styled_components_1.default(Column_1.AutoColumn) `
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? '108px' : '88px')};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 3;

  ${({ theme }) => theme.mediaWidth.upToSmall `
    display: none;
  `};
`;
function Popups() {
    // get all popups
    const activePopups = hooks_1.useActivePopups();
    const urlWarningActive = hooks_2.useURLWarningVisible();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(FixedPopupColumn, { gap: "20px", extraPadding: urlWarningActive },
            react_1.default.createElement(ClaimPopup_1.default, null),
            activePopups.map(item => (react_1.default.createElement(PopupItem_1.default, { key: item.key, content: item.content, popKey: item.key, removeAfterMs: item.removeAfterMs })))),
        react_1.default.createElement(MobilePopupWrapper, { height: (activePopups === null || activePopups === void 0 ? void 0 : activePopups.length) > 0 ? 'fit-content' : 0 },
            react_1.default.createElement(MobilePopupInner, null, activePopups // reverse so new items up front
                .slice(0)
                .reverse()
                .map(item => (react_1.default.createElement(PopupItem_1.default, { key: item.key, content: item.content, popKey: item.key, removeAfterMs: item.removeAfterMs })))))));
}
exports.default = Popups;
