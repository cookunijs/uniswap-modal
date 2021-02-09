"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useInterval(callback, delay, leading = true) {
    const savedCallback = react_1.useRef();
    // Remember the latest callback.
    react_1.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    react_1.useEffect(() => {
        function tick() {
            const current = savedCallback.current;
            current && current();
        }
        if (delay !== null) {
            if (leading)
                tick();
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
        return undefined;
    }, [delay, leading]);
}
exports.default = useInterval;
