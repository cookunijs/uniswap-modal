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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../hooks");
const jazzicon_1 = __importDefault(require("jazzicon"));
const StyledIdenticonContainer = styled_components_1.default.div `
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.bg4};
`;
function Identicon() {
    const ref = react_1.useRef();
    const { account } = hooks_1.useActiveWeb3React();
    react_1.useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = '';
            ref.current.appendChild(jazzicon_1.default(16, parseInt(account.slice(2, 10), 16)));
        }
    }, [account]);
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    return react_1.default.createElement(StyledIdenticonContainer, { ref: ref });
}
exports.default = Identicon;
