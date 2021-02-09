"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDerivedUnstakeInfo = exports.useDerivedStakeInfo = exports.useTotalUniEarned = exports.useStakingInfo = exports.STAKING_REWARDS_INFO = exports.REWARDS_DURATION_DAYS = exports.STAKING_GENESIS = void 0;
const sdk_1 = require("@uniswap/sdk");
const react_1 = require("react");
const constants_1 = require("../../constants");
const staking_rewards_1 = require("../../constants/abis/staking-rewards");
const hooks_1 = require("../../hooks");
const hooks_2 = require("../multicall/hooks");
const hooks_3 = require("../swap/hooks");
const useCurrentBlockTimestamp_1 = __importDefault(require("hooks/useCurrentBlockTimestamp"));
exports.STAKING_GENESIS = 1600387200;
exports.REWARDS_DURATION_DAYS = 60;
// TODO add staking rewards addresses here
exports.STAKING_REWARDS_INFO = {
    [sdk_1.ChainId.MAINNET]: [
        {
            tokens: [sdk_1.WETH[sdk_1.ChainId.MAINNET], constants_1.DAI],
            stakingRewardAddress: '0xa1484C3aa22a66C62b77E0AE78E15258bd0cB711'
        },
        {
            tokens: [sdk_1.WETH[sdk_1.ChainId.MAINNET], constants_1.USDC],
            stakingRewardAddress: '0x7FBa4B8Dc5E7616e59622806932DBea72537A56b'
        },
        {
            tokens: [sdk_1.WETH[sdk_1.ChainId.MAINNET], constants_1.USDT],
            stakingRewardAddress: '0x6C3e4cb2E96B01F4b866965A91ed4437839A121a'
        },
        {
            tokens: [sdk_1.WETH[sdk_1.ChainId.MAINNET], constants_1.WBTC],
            stakingRewardAddress: '0xCA35e32e7926b96A9988f61d510E038108d8068e'
        }
    ]
};
// gets the staking info from the network for the active chain id
function useStakingInfo(pairToFilterBy) {
    const { chainId, account } = hooks_1.useActiveWeb3React();
    // detect if staking is ended
    const currentBlockTimestamp = useCurrentBlockTimestamp_1.default();
    const info = react_1.useMemo(() => {
        var _a, _b;
        return chainId
            ? (_b = (_a = exports.STAKING_REWARDS_INFO[chainId]) === null || _a === void 0 ? void 0 : _a.filter(stakingRewardInfo => pairToFilterBy === undefined
                ? true
                : pairToFilterBy === null
                    ? false
                    : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                        pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1]))) !== null && _b !== void 0 ? _b : [] : [];
    }, [chainId, pairToFilterBy]);
    const uni = chainId ? constants_1.UNI[chainId] : undefined;
    const rewardsAddresses = react_1.useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info]);
    const accountArg = react_1.useMemo(() => [account !== null && account !== void 0 ? account : undefined], [account]);
    // get all the info from the staking rewards contracts
    const balances = hooks_2.useMultipleContractSingleData(rewardsAddresses, staking_rewards_1.STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg);
    const earnedAmounts = hooks_2.useMultipleContractSingleData(rewardsAddresses, staking_rewards_1.STAKING_REWARDS_INTERFACE, 'earned', accountArg);
    const totalSupplies = hooks_2.useMultipleContractSingleData(rewardsAddresses, staking_rewards_1.STAKING_REWARDS_INTERFACE, 'totalSupply');
    // tokens per second, constants
    const rewardRates = hooks_2.useMultipleContractSingleData(rewardsAddresses, staking_rewards_1.STAKING_REWARDS_INTERFACE, 'rewardRate', undefined, hooks_2.NEVER_RELOAD);
    const periodFinishes = hooks_2.useMultipleContractSingleData(rewardsAddresses, staking_rewards_1.STAKING_REWARDS_INTERFACE, 'periodFinish', undefined, hooks_2.NEVER_RELOAD);
    return react_1.useMemo(() => {
        if (!chainId || !uni)
            return [];
        return rewardsAddresses.reduce((memo, rewardsAddress, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            // these two are dependent on account
            const balanceState = balances[index];
            const earnedAmountState = earnedAmounts[index];
            // these get fetched regardless of account
            const totalSupplyState = totalSupplies[index];
            const rewardRateState = rewardRates[index];
            const periodFinishState = periodFinishes[index];
            if (
            // these may be undefined if not logged in
            !(balanceState === null || balanceState === void 0 ? void 0 : balanceState.loading) &&
                !(earnedAmountState === null || earnedAmountState === void 0 ? void 0 : earnedAmountState.loading) &&
                // always need these
                totalSupplyState &&
                !totalSupplyState.loading &&
                rewardRateState &&
                !rewardRateState.loading &&
                periodFinishState &&
                !periodFinishState.loading) {
                if ((balanceState === null || balanceState === void 0 ? void 0 : balanceState.error) || (earnedAmountState === null || earnedAmountState === void 0 ? void 0 : earnedAmountState.error) ||
                    totalSupplyState.error ||
                    rewardRateState.error ||
                    periodFinishState.error) {
                    console.error('Failed to load staking rewards info');
                    return memo;
                }
                // get the LP token
                const tokens = info[index].tokens;
                const dummyPair = new sdk_1.Pair(new sdk_1.TokenAmount(tokens[0], '0'), new sdk_1.TokenAmount(tokens[1], '0'));
                // check for account, if no account set to 0
                const stakedAmount = new sdk_1.TokenAmount(dummyPair.liquidityToken, sdk_1.JSBI.BigInt((_b = (_a = balanceState === null || balanceState === void 0 ? void 0 : balanceState.result) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0));
                const totalStakedAmount = new sdk_1.TokenAmount(dummyPair.liquidityToken, sdk_1.JSBI.BigInt((_c = totalSupplyState.result) === null || _c === void 0 ? void 0 : _c[0]));
                const totalRewardRate = new sdk_1.TokenAmount(uni, sdk_1.JSBI.BigInt((_d = rewardRateState.result) === null || _d === void 0 ? void 0 : _d[0]));
                const getHypotheticalRewardRate = (stakedAmount, totalStakedAmount, totalRewardRate) => {
                    return new sdk_1.TokenAmount(uni, sdk_1.JSBI.greaterThan(totalStakedAmount.raw, sdk_1.JSBI.BigInt(0))
                        ? sdk_1.JSBI.divide(sdk_1.JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
                        : sdk_1.JSBI.BigInt(0));
                };
                const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate);
                const periodFinishSeconds = (_f = (_e = periodFinishState.result) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.toNumber();
                const periodFinishMs = periodFinishSeconds * 1000;
                // compare period end timestamp vs current block timestamp (in seconds)
                const active = periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true;
                memo.push({
                    stakingRewardAddress: rewardsAddress,
                    tokens: info[index].tokens,
                    periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
                    earnedAmount: new sdk_1.TokenAmount(uni, sdk_1.JSBI.BigInt((_h = (_g = earnedAmountState === null || earnedAmountState === void 0 ? void 0 : earnedAmountState.result) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 0)),
                    rewardRate: individualRewardRate,
                    totalRewardRate: totalRewardRate,
                    stakedAmount: stakedAmount,
                    totalStakedAmount: totalStakedAmount,
                    getHypotheticalRewardRate,
                    active
                });
            }
            return memo;
        }, []);
    }, [
        balances,
        chainId,
        currentBlockTimestamp,
        earnedAmounts,
        info,
        periodFinishes,
        rewardRates,
        rewardsAddresses,
        totalSupplies,
        uni
    ]);
}
exports.useStakingInfo = useStakingInfo;
function useTotalUniEarned() {
    const { chainId } = hooks_1.useActiveWeb3React();
    const uni = chainId ? constants_1.UNI[chainId] : undefined;
    const stakingInfos = useStakingInfo();
    return react_1.useMemo(() => {
        var _a;
        if (!uni)
            return undefined;
        return ((_a = stakingInfos === null || stakingInfos === void 0 ? void 0 : stakingInfos.reduce((accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount), new sdk_1.TokenAmount(uni, '0'))) !== null && _a !== void 0 ? _a : new sdk_1.TokenAmount(uni, '0'));
    }, [stakingInfos, uni]);
}
exports.useTotalUniEarned = useTotalUniEarned;
// based on typed value
function useDerivedStakeInfo(typedValue, stakingToken, userLiquidityUnstaked) {
    const { account } = hooks_1.useActiveWeb3React();
    const parsedInput = hooks_3.tryParseAmount(typedValue, stakingToken);
    const parsedAmount = parsedInput && userLiquidityUnstaked && sdk_1.JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
        ? parsedInput
        : undefined;
    let error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (!parsedAmount) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    return {
        parsedAmount,
        error
    };
}
exports.useDerivedStakeInfo = useDerivedStakeInfo;
// based on typed value
function useDerivedUnstakeInfo(typedValue, stakingAmount) {
    const { account } = hooks_1.useActiveWeb3React();
    const parsedInput = hooks_3.tryParseAmount(typedValue, stakingAmount.token);
    const parsedAmount = parsedInput && sdk_1.JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined;
    let error;
    if (!account) {
        error = 'Connect Wallet';
    }
    if (!parsedAmount) {
        error = error !== null && error !== void 0 ? error : 'Enter an amount';
    }
    return {
        parsedAmount,
        error
    };
}
exports.useDerivedUnstakeInfo = useDerivedUnstakeInfo;
