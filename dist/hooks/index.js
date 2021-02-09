"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInactiveListener = exports.useEagerConnect = exports.useActiveWeb3React = void 0;
const core_1 = require("@web3-react/core");
const react_1 = require("react");
const react_device_detect_1 = require("react-device-detect");
const connectors_1 = require("../connectors");
const constants_1 = require("../constants");
function useActiveWeb3React() {
    const context = core_1.useWeb3React();
    const contextNetwork = core_1.useWeb3React(constants_1.NetworkContextName);
    return context.active ? context : contextNetwork;
}
exports.useActiveWeb3React = useActiveWeb3React;
function useEagerConnect() {
    const { activate, active } = core_1.useWeb3React(); // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = react_1.useState(false);
    react_1.useEffect(() => {
        connectors_1.injected.isAuthorized().then(isAuthorized => {
            if (isAuthorized) {
                activate(connectors_1.injected, undefined, true).catch(() => {
                    setTried(true);
                });
            }
            else {
                if (react_device_detect_1.isMobile && window.ethereum) {
                    activate(connectors_1.injected, undefined, true).catch(() => {
                        setTried(true);
                    });
                }
                else {
                    setTried(true);
                }
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))
    // if the connection worked, wait until we get confirmation of that to flip the flag
    react_1.useEffect(() => {
        if (active) {
            setTried(true);
        }
    }, [active]);
    return tried;
}
exports.useEagerConnect = useEagerConnect;
/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
function useInactiveListener(suppress = false) {
    const { active, error, activate } = core_1.useWeb3React(); // specifically using useWeb3React because of what this hook does
    react_1.useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = () => {
                // eat errors
                activate(connectors_1.injected, undefined, true).catch(error => {
                    console.error('Failed to activate after chain changed', error);
                });
            };
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    // eat errors
                    activate(connectors_1.injected, undefined, true).catch(error => {
                        console.error('Failed to activate after accounts changed', error);
                    });
                }
            };
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
        return undefined;
    }, [active, error, suppress, activate]);
}
exports.useInactiveListener = useInactiveListener;
