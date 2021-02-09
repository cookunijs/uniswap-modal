"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Option_1 = __importDefault(require("./Option"));
const constants_1 = require("../../constants");
const connectors_1 = require("../../connectors");
const polished_1 = require("polished");
const Loader_1 = __importDefault(require("../Loader"));
const PendingSection = styled_components_1.default.div `
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
  & > * {
    width: 100%;
  }
`;
const StyledLoader = styled_components_1.default(Loader_1.default) `
  margin-right: 1rem;
`;
const LoadingMessage = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
  border-radius: 12px;
  margin-bottom: 20px;
  color: ${({ theme, error }) => (error ? theme.red1 : 'inherit')};
  border: 1px solid ${({ theme, error }) => (error ? theme.red1 : theme.text4)};

  & > * {
    padding: 1rem;
  }
`;
const ErrorGroup = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: flex-start;
`;
const ErrorButton = styled_components_1.default.div `
  border-radius: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg4};
  margin-left: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => polished_1.darken(0.1, theme.text4)};
  }
`;
const LoadingWrapper = styled_components_1.default.div `
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  justify-content: center;
`;
function PendingView({ connector, error = false, setPendingError, tryActivation }) {
    var _a;
    const isMetamask = (_a = window === null || window === void 0 ? void 0 : window.ethereum) === null || _a === void 0 ? void 0 : _a.isMetaMask;
    return (react_1.default.createElement(PendingSection, null,
        react_1.default.createElement(LoadingMessage, { error: error },
            react_1.default.createElement(LoadingWrapper, null, error ? (react_1.default.createElement(ErrorGroup, null,
                react_1.default.createElement("div", null, "Error connecting."),
                react_1.default.createElement(ErrorButton, { onClick: () => {
                        setPendingError(false);
                        connector && tryActivation(connector);
                    } }, "Try Again"))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(StyledLoader, null),
                "Initializing...")))),
        Object.keys(constants_1.SUPPORTED_WALLETS).map(key => {
            const option = constants_1.SUPPORTED_WALLETS[key];
            if (option.connector === connector) {
                if (option.connector === connectors_1.injected) {
                    if (isMetamask && option.name !== 'MetaMask') {
                        return null;
                    }
                    if (!isMetamask && option.name === 'MetaMask') {
                        return null;
                    }
                }
                return (react_1.default.createElement(Option_1.default, { id: `connect-${key}`, key: key, clickable: false, color: option.color, header: option.name, subheader: option.description, icon: require('../../assets/images/' + option.iconName) }));
            }
            return null;
        })));
}
exports.default = PendingView;
