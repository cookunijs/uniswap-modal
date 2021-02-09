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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const theme_1 = require("../../theme");
const hooks_1 = require("../../state/application/hooks");
const utils_1 = require("../../utils");
const hooks_2 = require("../../hooks");
const StyledPolling = styled_components_1.default.div `
  position: fixed;
  display: flex;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.green1};
  :hover {
    opacity: 1;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium `
    display: none;
  `}
`;
const StyledPollingDot = styled_components_1.default.div `
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.green1};
`;
const rotate360 = styled_components_1.keyframes `
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const Spinner = styled_components_1.default.div `
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`;
function Polling() {
    const { chainId } = hooks_2.useActiveWeb3React();
    const blockNumber = hooks_1.useBlockNumber();
    const [isMounted, setIsMounted] = react_1.useState(true);
    react_1.useEffect(() => {
        const timer1 = setTimeout(() => setIsMounted(true), 1000);
        // this will clear Timeout when component unmount like in willComponentUnmount
        return () => {
            setIsMounted(false);
            clearTimeout(timer1);
        };
    }, [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
    );
    return (react_1.default.createElement(theme_1.ExternalLink, { href: chainId && blockNumber ? utils_1.getEtherscanLink(chainId, blockNumber.toString(), 'block') : '' },
        react_1.default.createElement(StyledPolling, null,
            react_1.default.createElement(theme_1.TYPE.small, { style: { opacity: isMounted ? '0.2' : '0.6' } }, blockNumber),
            react_1.default.createElement(StyledPollingDot, null, !isMounted && react_1.default.createElement(Spinner, null)))));
}
exports.default = Polling;
