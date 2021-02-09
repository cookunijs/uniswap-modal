"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClaimCallback = exports.useUserUnclaimedAmount = exports.useUserHasAvailableClaim = exports.useUserClaimData = void 0;
const index_1 = require("./../../constants/index");
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const hooks_1 = require("../../hooks");
const useContract_1 = require("../../hooks/useContract");
const hooks_2 = require("../multicall/hooks");
const utils_1 = require("../../utils");
const hooks_3 = require("../transactions/hooks");
const CLAIM_PROMISES = {};
// returns the claim for the given address, or null if not valid
function fetchClaim(account, chainId) {
    var _a;
    const formatted = utils_1.isAddress(account);
    if (!formatted)
        return Promise.reject(new Error('Invalid address'));
    const key = `${chainId}:${account}`;
    return (CLAIM_PROMISES[key] = (_a = CLAIM_PROMISES[key]) !== null && _a !== void 0 ? _a : fetch(`https://gentle-frost-9e74.uniswap.workers.dev/${chainId}/${formatted}`)
        .then(res => {
        if (res.status === 200) {
            return res.json();
        }
        else {
            console.debug(`No claim for account ${formatted} on chain ID ${chainId}`);
            return null;
        }
    })
        .catch(error => {
        console.error('Failed to get claim data', error);
    }));
}
// parse distributorContract blob and detect if user has claim data
// null means we know it does not
function useUserClaimData(account) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const key = `${chainId}:${account}`;
    const [claimInfo, setClaimInfo] = react_1.useState({});
    react_1.useEffect(() => {
        if (!account || !chainId)
            return;
        fetchClaim(account, chainId).then(accountClaimInfo => setClaimInfo(claimInfo => {
            return Object.assign(Object.assign({}, claimInfo), { [key]: accountClaimInfo });
        }));
    }, [account, chainId, key]);
    return account && chainId ? claimInfo[key] : undefined;
}
exports.useUserClaimData = useUserClaimData;
// check if user is in blob and has not yet claimed UNI
function useUserHasAvailableClaim(account) {
    var _a;
    const userClaimData = useUserClaimData(account);
    const distributorContract = useContract_1.useMerkleDistributorContract();
    const isClaimedResult = hooks_2.useSingleCallResult(distributorContract, 'isClaimed', [userClaimData === null || userClaimData === void 0 ? void 0 : userClaimData.index]);
    // user is in blob and contract marks as unclaimed
    return Boolean(userClaimData && !isClaimedResult.loading && ((_a = isClaimedResult.result) === null || _a === void 0 ? void 0 : _a[0]) === false);
}
exports.useUserHasAvailableClaim = useUserHasAvailableClaim;
function useUserUnclaimedAmount(account) {
    const { chainId } = hooks_1.useActiveWeb3React();
    const userClaimData = useUserClaimData(account);
    const canClaim = useUserHasAvailableClaim(account);
    const uni = chainId ? index_1.UNI[chainId] : undefined;
    if (!uni)
        return undefined;
    if (!canClaim || !userClaimData) {
        return new sdk_1.TokenAmount(uni, sdk_1.JSBI.BigInt(0));
    }
    return new sdk_1.TokenAmount(uni, sdk_1.JSBI.BigInt(userClaimData.amount));
}
exports.useUserUnclaimedAmount = useUserUnclaimedAmount;
function useClaimCallback(account) {
    // get claim data for this account
    const { library, chainId } = hooks_1.useActiveWeb3React();
    const claimData = useUserClaimData(account);
    // used for popup summary
    const unClaimedAmount = useUserUnclaimedAmount(account);
    const addTransaction = hooks_3.useTransactionAdder();
    const distributorContract = useContract_1.useMerkleDistributorContract();
    const claimCallback = function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!claimData || !account || !library || !chainId || !distributorContract)
                return;
            const args = [claimData.index, account, claimData.amount, claimData.proof];
            return distributorContract.estimateGas['claim'](...args, {}).then(estimatedGasLimit => {
                return distributorContract
                    .claim(...args, { value: null, gasLimit: utils_1.calculateGasMargin(estimatedGasLimit) })
                    .then((response) => {
                    addTransaction(response, {
                        summary: `Claimed ${unClaimedAmount === null || unClaimedAmount === void 0 ? void 0 : unClaimedAmount.toSignificant(4)} UNI`,
                        claim: { recipient: account }
                    });
                    return response.hash;
                });
            });
        });
    };
    return { claimCallback };
}
exports.useClaimCallback = useClaimCallback;
