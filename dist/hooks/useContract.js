"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSocksController = exports.useStakingContract = exports.useUniContract = exports.useGovernanceContract = exports.useMerkleDistributorContract = exports.useMulticallContract = exports.usePairContract = exports.useBytes32TokenContract = exports.useENSResolverContract = exports.useENSRegistrarContract = exports.useArgentWalletDetectorContract = exports.useWETHContract = exports.useTokenContract = exports.useV1ExchangeContract = exports.useV2MigratorContract = exports.useV1FactoryContract = void 0;
const GovernorAlpha_json_1 = require("@uniswap/governance/build/GovernorAlpha.json");
const Uni_json_1 = require("@uniswap/governance/build/Uni.json");
const StakingRewards_json_1 = require("@uniswap/liquidity-staker/build/StakingRewards.json");
const MerkleDistributor_json_1 = require("@uniswap/merkle-distributor/build/MerkleDistributor.json");
const sdk_1 = require("@uniswap/sdk");
const IUniswapV2Pair_json_1 = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const react_1 = require("react");
const constants_1 = require("../constants");
const argent_wallet_detector_1 = require("../constants/abis/argent-wallet-detector");
const ens_public_resolver_json_1 = __importDefault(require("../constants/abis/ens-public-resolver.json"));
const ens_registrar_json_1 = __importDefault(require("../constants/abis/ens-registrar.json"));
const erc20_1 = require("../constants/abis/erc20");
const erc20_json_1 = __importDefault(require("../constants/abis/erc20.json"));
const migrator_1 = require("../constants/abis/migrator");
const unisocks_json_1 = __importDefault(require("../constants/abis/unisocks.json"));
const weth_json_1 = __importDefault(require("../constants/abis/weth.json"));
const multicall_1 = require("../constants/multicall");
const v1_1 = require("../constants/v1");
const utils_1 = require("../utils");
const index_1 = require("./index");
// returns null on errors
function useContract(address, ABI, withSignerIfPossible = true) {
    const { library, account } = index_1.useActiveWeb3React();
    return react_1.useMemo(() => {
        if (!address || !ABI || !library)
            return null;
        try {
            return utils_1.getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
        }
        catch (error) {
            console.error('Failed to get contract', error);
            return null;
        }
    }, [address, ABI, library, withSignerIfPossible, account]);
}
function useV1FactoryContract() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId && v1_1.V1_FACTORY_ADDRESSES[chainId], v1_1.V1_FACTORY_ABI, false);
}
exports.useV1FactoryContract = useV1FactoryContract;
function useV2MigratorContract() {
    return useContract(migrator_1.MIGRATOR_ADDRESS, migrator_1.MIGRATOR_ABI, true);
}
exports.useV2MigratorContract = useV2MigratorContract;
function useV1ExchangeContract(address, withSignerIfPossible) {
    return useContract(address, v1_1.V1_EXCHANGE_ABI, withSignerIfPossible);
}
exports.useV1ExchangeContract = useV1ExchangeContract;
function useTokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, erc20_json_1.default, withSignerIfPossible);
}
exports.useTokenContract = useTokenContract;
function useWETHContract(withSignerIfPossible) {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId ? sdk_1.WETH[chainId].address : undefined, weth_json_1.default, withSignerIfPossible);
}
exports.useWETHContract = useWETHContract;
function useArgentWalletDetectorContract() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId === sdk_1.ChainId.MAINNET ? argent_wallet_detector_1.ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined, argent_wallet_detector_1.ARGENT_WALLET_DETECTOR_ABI, false);
}
exports.useArgentWalletDetectorContract = useArgentWalletDetectorContract;
function useENSRegistrarContract(withSignerIfPossible) {
    const { chainId } = index_1.useActiveWeb3React();
    let address;
    if (chainId) {
        switch (chainId) {
            case sdk_1.ChainId.MAINNET:
            case sdk_1.ChainId.GÖRLI:
            case sdk_1.ChainId.ROPSTEN:
            case sdk_1.ChainId.RINKEBY:
                address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
                break;
        }
    }
    return useContract(address, ens_registrar_json_1.default, withSignerIfPossible);
}
exports.useENSRegistrarContract = useENSRegistrarContract;
function useENSResolverContract(address, withSignerIfPossible) {
    return useContract(address, ens_public_resolver_json_1.default, withSignerIfPossible);
}
exports.useENSResolverContract = useENSResolverContract;
function useBytes32TokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, erc20_1.ERC20_BYTES32_ABI, withSignerIfPossible);
}
exports.useBytes32TokenContract = useBytes32TokenContract;
function usePairContract(pairAddress, withSignerIfPossible) {
    return useContract(pairAddress, IUniswapV2Pair_json_1.abi, withSignerIfPossible);
}
exports.usePairContract = usePairContract;
function useMulticallContract() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId && multicall_1.MULTICALL_NETWORKS[chainId], multicall_1.MULTICALL_ABI, false);
}
exports.useMulticallContract = useMulticallContract;
function useMerkleDistributorContract() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId ? constants_1.MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MerkleDistributor_json_1.abi, true);
}
exports.useMerkleDistributorContract = useMerkleDistributorContract;
function useGovernanceContract() {
    return useContract(constants_1.GOVERNANCE_ADDRESS, GovernorAlpha_json_1.abi, true);
}
exports.useGovernanceContract = useGovernanceContract;
function useUniContract() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId ? constants_1.UNI[chainId].address : undefined, Uni_json_1.abi, true);
}
exports.useUniContract = useUniContract;
function useStakingContract(stakingAddress, withSignerIfPossible) {
    return useContract(stakingAddress, StakingRewards_json_1.abi, withSignerIfPossible);
}
exports.useStakingContract = useStakingContract;
function useSocksController() {
    const { chainId } = index_1.useActiveWeb3React();
    return useContract(chainId === sdk_1.ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined, unisocks_json_1.default, false);
}
exports.useSocksController = useSocksController;
