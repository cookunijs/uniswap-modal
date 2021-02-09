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
exports.useVoteCallback = exports.useDelegateCallback = exports.useUserVotesAsOfBlock = exports.useUserVotes = exports.useUserDelegatee = exports.useProposalData = exports.useAllProposalData = exports.useDataFromEventLogs = exports.useProposalCount = void 0;
const index_1 = require("./../../constants/index");
const sdk_1 = require("@uniswap/sdk");
const utils_1 = require("ethers/lib/utils");
const useContract_1 = require("../../hooks/useContract");
const hooks_1 = require("../multicall/hooks");
const hooks_2 = require("../../hooks");
const ethers_1 = require("ethers");
const utils_2 = require("../../utils");
const hooks_3 = require("../transactions/hooks");
const react_1 = require("react");
const GovernorAlpha_json_1 = require("@uniswap/governance/build/GovernorAlpha.json");
const enumerateProposalState = (state) => {
    const proposalStates = ['pending', 'active', 'canceled', 'defeated', 'succeeded', 'queued', 'expired', 'executed'];
    return proposalStates[state];
};
// get count of all proposals made
function useProposalCount() {
    const gov = useContract_1.useGovernanceContract();
    const res = hooks_1.useSingleCallResult(gov, 'proposalCount');
    if (res.result && !res.loading) {
        return parseInt(res.result[0]);
    }
    return undefined;
}
exports.useProposalCount = useProposalCount;
/**
 * Need proposal events to get description data emitted from
 * new proposal event.
 */
function useDataFromEventLogs() {
    var _a;
    const { library } = hooks_2.useActiveWeb3React();
    const [formattedEvents, setFormattedEvents] = react_1.useState();
    const govContract = useContract_1.useGovernanceContract();
    // create filter for these specific events
    const filter = Object.assign(Object.assign({}, (_a = govContract === null || govContract === void 0 ? void 0 : govContract.filters) === null || _a === void 0 ? void 0 : _a['ProposalCreated']()), { fromBlock: 0, toBlock: 'latest' });
    const eventParser = new ethers_1.ethers.utils.Interface(GovernorAlpha_json_1.abi);
    react_1.useEffect(() => {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function* () {
                const pastEvents = yield (library === null || library === void 0 ? void 0 : library.getLogs(filter));
                // reverse events to get them from newest to odlest
                const formattedEventData = pastEvents === null || pastEvents === void 0 ? void 0 : pastEvents.map(event => {
                    const eventParsed = eventParser.parseLog(event).args;
                    return {
                        description: eventParsed.description,
                        details: eventParsed.targets.map((target, i) => {
                            const signature = eventParsed.signatures[i];
                            const [name, types] = signature.substr(0, signature.length - 1).split('(');
                            const calldata = eventParsed.calldatas[i];
                            const decoded = ethers_1.utils.defaultAbiCoder.decode(types.split(','), calldata);
                            return {
                                target,
                                functionSig: name,
                                callData: decoded.join(', ')
                            };
                        })
                    };
                }).reverse();
                setFormattedEvents(formattedEventData);
            });
        }
        if (!formattedEvents) {
            fetchData();
        }
    }, [eventParser, filter, library, formattedEvents]);
    return formattedEvents;
}
exports.useDataFromEventLogs = useDataFromEventLogs;
// get data for all past and active proposals
function useAllProposalData() {
    const proposalCount = useProposalCount();
    const govContract = useContract_1.useGovernanceContract();
    const proposalIndexes = [];
    for (let i = 1; i <= (proposalCount !== null && proposalCount !== void 0 ? proposalCount : 0); i++) {
        proposalIndexes.push([i]);
    }
    // get metadata from past events
    const formattedEvents = useDataFromEventLogs();
    // get all proposal entities
    const allProposals = hooks_1.useSingleContractMultipleData(govContract, 'proposals', proposalIndexes);
    // get all proposal states
    const allProposalStates = hooks_1.useSingleContractMultipleData(govContract, 'state', proposalIndexes);
    if (formattedEvents && allProposals && allProposalStates) {
        allProposals.reverse();
        allProposalStates.reverse();
        return allProposals
            .filter((p, i) => {
            var _a;
            return Boolean(p.result) && Boolean((_a = allProposalStates[i]) === null || _a === void 0 ? void 0 : _a.result) && Boolean(formattedEvents[i]);
        })
            .map((p, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            const description = index_1.PRELOADED_PROPOSALS.get(allProposals.length - i - 1) || formattedEvents[i].description;
            const formattedProposal = {
                id: (_b = (_a = allProposals[i]) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.id.toString(),
                title: (description === null || description === void 0 ? void 0 : description.split(/# |\n/g)[1]) || 'Untitled',
                description: description || 'No description.',
                proposer: (_d = (_c = allProposals[i]) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.proposer,
                status: (_g = enumerateProposalState((_f = (_e = allProposalStates[i]) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f[0])) !== null && _g !== void 0 ? _g : 'Undetermined',
                forCount: parseFloat(ethers_1.ethers.utils.formatUnits((_j = (_h = allProposals[i]) === null || _h === void 0 ? void 0 : _h.result) === null || _j === void 0 ? void 0 : _j.forVotes.toString(), 18)),
                againstCount: parseFloat(ethers_1.ethers.utils.formatUnits((_l = (_k = allProposals[i]) === null || _k === void 0 ? void 0 : _k.result) === null || _l === void 0 ? void 0 : _l.againstVotes.toString(), 18)),
                startBlock: parseInt((_p = (_o = (_m = allProposals[i]) === null || _m === void 0 ? void 0 : _m.result) === null || _o === void 0 ? void 0 : _o.startBlock) === null || _p === void 0 ? void 0 : _p.toString()),
                endBlock: parseInt((_s = (_r = (_q = allProposals[i]) === null || _q === void 0 ? void 0 : _q.result) === null || _r === void 0 ? void 0 : _r.endBlock) === null || _s === void 0 ? void 0 : _s.toString()),
                details: formattedEvents[i].details
            };
            return formattedProposal;
        });
    }
    else {
        return [];
    }
}
exports.useAllProposalData = useAllProposalData;
function useProposalData(id) {
    const allProposalData = useAllProposalData();
    return allProposalData === null || allProposalData === void 0 ? void 0 : allProposalData.find(p => p.id === id);
}
exports.useProposalData = useProposalData;
// get the users delegatee if it exists
function useUserDelegatee() {
    var _a;
    const { account } = hooks_2.useActiveWeb3React();
    const uniContract = useContract_1.useUniContract();
    const { result } = hooks_1.useSingleCallResult(uniContract, 'delegates', [account !== null && account !== void 0 ? account : undefined]);
    return (_a = result === null || result === void 0 ? void 0 : result[0]) !== null && _a !== void 0 ? _a : undefined;
}
exports.useUserDelegatee = useUserDelegatee;
// gets the users current votes
function useUserVotes() {
    var _a, _b;
    const { account, chainId } = hooks_2.useActiveWeb3React();
    const uniContract = useContract_1.useUniContract();
    // check for available votes
    const uni = chainId ? index_1.UNI[chainId] : undefined;
    const votes = (_b = (_a = hooks_1.useSingleCallResult(uniContract, 'getCurrentVotes', [account !== null && account !== void 0 ? account : undefined])) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
    return votes && uni ? new sdk_1.TokenAmount(uni, votes) : undefined;
}
exports.useUserVotes = useUserVotes;
// fetch available votes as of block (usually proposal start block)
function useUserVotesAsOfBlock(block) {
    var _a, _b;
    const { account, chainId } = hooks_2.useActiveWeb3React();
    const uniContract = useContract_1.useUniContract();
    // check for available votes
    const uni = chainId ? index_1.UNI[chainId] : undefined;
    const votes = (_b = (_a = hooks_1.useSingleCallResult(uniContract, 'getPriorVotes', [account !== null && account !== void 0 ? account : undefined, block !== null && block !== void 0 ? block : undefined])) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0];
    return votes && uni ? new sdk_1.TokenAmount(uni, votes) : undefined;
}
exports.useUserVotesAsOfBlock = useUserVotesAsOfBlock;
function useDelegateCallback() {
    const { account, chainId, library } = hooks_2.useActiveWeb3React();
    const addTransaction = hooks_3.useTransactionAdder();
    const uniContract = useContract_1.useUniContract();
    return react_1.useCallback((delegatee) => {
        if (!library || !chainId || !account || !utils_1.isAddress(delegatee !== null && delegatee !== void 0 ? delegatee : ''))
            return undefined;
        const args = [delegatee];
        if (!uniContract)
            throw new Error('No UNI Contract!');
        return uniContract.estimateGas.delegate(...args, {}).then(estimatedGasLimit => {
            return uniContract
                .delegate(...args, { value: null, gasLimit: utils_2.calculateGasMargin(estimatedGasLimit) })
                .then((response) => {
                addTransaction(response, {
                    summary: `Delegated votes`
                });
                return response.hash;
            });
        });
    }, [account, addTransaction, chainId, library, uniContract]);
}
exports.useDelegateCallback = useDelegateCallback;
function useVoteCallback() {
    const { account } = hooks_2.useActiveWeb3React();
    const govContract = useContract_1.useGovernanceContract();
    const addTransaction = hooks_3.useTransactionAdder();
    const voteCallback = react_1.useCallback((proposalId, support) => {
        if (!account || !govContract || !proposalId)
            return;
        const args = [proposalId, support];
        return govContract.estimateGas.castVote(...args, {}).then(estimatedGasLimit => {
            return govContract
                .castVote(...args, { value: null, gasLimit: utils_2.calculateGasMargin(estimatedGasLimit) })
                .then((response) => {
                addTransaction(response, {
                    summary: `Voted ${support ? 'for ' : 'against'} proposal ${proposalId}`
                });
                return response.hash;
            });
        });
    }, [account, addTransaction, govContract]);
    return { voteCallback };
}
exports.useVoteCallback = useVoteCallback;
