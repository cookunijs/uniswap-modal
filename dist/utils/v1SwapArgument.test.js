"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@uniswap/sdk");
const constants_1 = require("../constants");
const V1_1 = require("../data/V1");
const v1SwapArguments_1 = __importDefault(require("./v1SwapArguments"));
describe('v1SwapArguments', () => {
    const USDC_WETH = new V1_1.MockV1Pair('1000000', new sdk_1.TokenAmount(constants_1.USDC, '1000000'));
    const DAI_WETH = new V1_1.MockV1Pair('1000000', new sdk_1.TokenAmount(constants_1.DAI, '1000000'));
    // just some random address
    const TEST_RECIPIENT_ADDRESS = USDC_WETH.liquidityToken.address;
    it('exact eth to token', () => {
        const trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH], sdk_1.ETHER), sdk_1.CurrencyAmount.ether('100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 20 * 60
        });
        expect(result.methodName).toEqual('ethToTokenTransferInput');
        expect(result.args).toEqual(['0x62', '0x4b0', TEST_RECIPIENT_ADDRESS]);
        expect(result.value).toEqual('0x64');
    });
    it('exact token to eth', () => {
        const trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH], constants_1.USDC, sdk_1.ETHER), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 40 * 60
        });
        expect(result.methodName).toEqual('tokenToEthTransferInput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x62');
        expect(result.args[2]).toEqual('0x960');
        expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x0');
    });
    it('exact token to token', () => {
        const trade = sdk_1.Trade.exactIn(new sdk_1.Route([USDC_WETH, DAI_WETH], constants_1.USDC), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToTokenTransferInput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x61');
        expect(result.args[2]).toEqual('0x1');
        expect(result.args[3]).toEqual('0x4b0');
        expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.args[5]).toEqual(constants_1.DAI.address);
        expect(result.value).toEqual('0x0');
    });
    it('eth to exact token', () => {
        const trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH], sdk_1.ETHER), new sdk_1.TokenAmount(constants_1.USDC, '100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 20 * 60
        });
        expect(result.methodName).toEqual('ethToTokenTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x4b0');
        expect(result.args[2]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x66');
    });
    it('token to exact eth', () => {
        const trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH], constants_1.USDC, sdk_1.ETHER), sdk_1.CurrencyAmount.ether('100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToEthTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x66');
        expect(result.args[2]).toEqual('0x4b0');
        expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.value).toEqual('0x0');
    });
    it('token to exact token', () => {
        const trade = sdk_1.Trade.exactOut(new sdk_1.Route([USDC_WETH, DAI_WETH], constants_1.USDC), new sdk_1.TokenAmount(constants_1.DAI, '100'));
        const result = v1SwapArguments_1.default(trade, {
            recipient: TEST_RECIPIENT_ADDRESS,
            allowedSlippage: new sdk_1.Percent('1', '100'),
            deadline: 20 * 60
        });
        expect(result.methodName).toEqual('tokenToTokenTransferOutput');
        expect(result.args[0]).toEqual('0x64');
        expect(result.args[1]).toEqual('0x67');
        expect(result.args[2]).toEqual(`0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`);
        expect(result.args[3]).toEqual('0x4b0');
        expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS);
        expect(result.args[5]).toEqual(constants_1.DAI.address);
        expect(result.value).toEqual('0x0');
    });
});
