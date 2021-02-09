"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldCheck = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const hooks_1 = require("../../hooks");
const hooks_2 = require("../application/hooks");
const actions_1 = require("./actions");
function shouldCheck(lastBlockNumber, tx) {
    if (tx.receipt)
        return false;
    if (!tx.lastCheckedBlockNumber)
        return true;
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
    if (blocksSinceCheck < 1)
        return false;
    const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return blocksSinceCheck > 9;
    }
    else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2;
    }
    else {
        // otherwise every block
        return true;
    }
}
exports.shouldCheck = shouldCheck;
function Updater() {
    var _a;
    const { chainId, library } = hooks_1.useActiveWeb3React();
    const lastBlockNumber = hooks_2.useBlockNumber();
    const dispatch = react_redux_1.useDispatch();
    const state = react_redux_1.useSelector(state => state.transactions);
    const transactions = chainId ? (_a = state[chainId]) !== null && _a !== void 0 ? _a : {} : {};
    // show popup on confirm
    const addPopup = hooks_2.useAddPopup();
    react_1.useEffect(() => {
        if (!chainId || !library || !lastBlockNumber)
            return;
        Object.keys(transactions)
            .filter(hash => shouldCheck(lastBlockNumber, transactions[hash]))
            .forEach(hash => {
            library
                .getTransactionReceipt(hash)
                .then(receipt => {
                var _a;
                if (receipt) {
                    dispatch(actions_1.finalizeTransaction({
                        chainId,
                        hash,
                        receipt: {
                            blockHash: receipt.blockHash,
                            blockNumber: receipt.blockNumber,
                            contractAddress: receipt.contractAddress,
                            from: receipt.from,
                            status: receipt.status,
                            to: receipt.to,
                            transactionHash: receipt.transactionHash,
                            transactionIndex: receipt.transactionIndex
                        }
                    }));
                    addPopup({
                        txn: {
                            hash,
                            success: receipt.status === 1,
                            summary: (_a = transactions[hash]) === null || _a === void 0 ? void 0 : _a.summary
                        }
                    }, hash);
                }
                else {
                    dispatch(actions_1.checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }));
                }
            })
                .catch(error => {
                console.error(`failed to check transaction hash: ${hash}`, error);
            });
        });
    }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup]);
    return null;
}
exports.default = Updater;
