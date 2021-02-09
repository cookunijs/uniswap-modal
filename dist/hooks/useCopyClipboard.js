"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const react_1 = require("react");
function useCopyClipboard(timeout = 500) {
    const [isCopied, setIsCopied] = react_1.useState(false);
    const staticCopy = react_1.useCallback(text => {
        const didCopy = copy_to_clipboard_1.default(text);
        setIsCopied(didCopy);
    }, []);
    react_1.useEffect(() => {
        if (isCopied) {
            const hide = setTimeout(() => {
                setIsCopied(false);
            }, timeout);
            return () => {
                clearTimeout(hide);
            };
        }
        return undefined;
    }, [isCopied, setIsCopied, timeout]);
    return [isCopied, staticCopy];
}
exports.default = useCopyClipboard;
