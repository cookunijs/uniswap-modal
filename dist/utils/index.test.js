"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_1 = require("@ethersproject/bignumber");
const constants_1 = require("@ethersproject/constants");
const sdk_1 = require("@uniswap/sdk");
const _1 = require(".");
describe('utils', () => {
    describe('#getEtherscanLink', () => {
        it('correct for tx', () => {
            expect(_1.getEtherscanLink(1, 'abc', 'transaction')).toEqual('https://etherscan.io/tx/abc');
        });
        it('correct for token', () => {
            expect(_1.getEtherscanLink(1, 'abc', 'token')).toEqual('https://etherscan.io/token/abc');
        });
        it('correct for address', () => {
            expect(_1.getEtherscanLink(1, 'abc', 'address')).toEqual('https://etherscan.io/address/abc');
        });
        it('unrecognized chain id defaults to mainnet', () => {
            expect(_1.getEtherscanLink(2, 'abc', 'address')).toEqual('https://etherscan.io/address/abc');
        });
        it('ropsten', () => {
            expect(_1.getEtherscanLink(3, 'abc', 'address')).toEqual('https://ropsten.etherscan.io/address/abc');
        });
        it('enum', () => {
            expect(_1.getEtherscanLink(sdk_1.ChainId.RINKEBY, 'abc', 'address')).toEqual('https://rinkeby.etherscan.io/address/abc');
        });
    });
    describe('#calculateSlippageAmount', () => {
        it('bounds are correct', () => {
            const tokenAmount = new sdk_1.TokenAmount(new sdk_1.Token(sdk_1.ChainId.MAINNET, constants_1.AddressZero, 0), '100');
            expect(() => _1.calculateSlippageAmount(tokenAmount, -1)).toThrow();
            expect(_1.calculateSlippageAmount(tokenAmount, 0).map(bound => bound.toString())).toEqual(['100', '100']);
            expect(_1.calculateSlippageAmount(tokenAmount, 100).map(bound => bound.toString())).toEqual(['99', '101']);
            expect(_1.calculateSlippageAmount(tokenAmount, 200).map(bound => bound.toString())).toEqual(['98', '102']);
            expect(_1.calculateSlippageAmount(tokenAmount, 10000).map(bound => bound.toString())).toEqual(['0', '200']);
            expect(() => _1.calculateSlippageAmount(tokenAmount, 10001)).toThrow();
        });
    });
    describe('#isAddress', () => {
        it('returns false if not', () => {
            expect(_1.isAddress('')).toBe(false);
            expect(_1.isAddress('0x0000')).toBe(false);
            expect(_1.isAddress(1)).toBe(false);
            expect(_1.isAddress({})).toBe(false);
            expect(_1.isAddress(undefined)).toBe(false);
        });
        it('returns the checksummed address', () => {
            expect(_1.isAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a');
            expect(_1.isAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a');
        });
        it('succeeds even without prefix', () => {
            expect(_1.isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a');
        });
        it('fails if too long', () => {
            expect(_1.isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0')).toBe(false);
        });
    });
    describe('#shortenAddress', () => {
        it('throws on invalid address', () => {
            expect(() => _1.shortenAddress('abc')).toThrow("Invalid 'address'");
        });
        it('truncates middle characters', () => {
            expect(_1.shortenAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164...b92a');
        });
        it('truncates middle characters even without prefix', () => {
            expect(_1.shortenAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe('0xf164...b92a');
        });
        it('renders checksummed address', () => {
            expect(_1.shortenAddress('0x2E1b342132A67Ea578e4E3B814bae2107dc254CC'.toLowerCase())).toBe('0x2E1b...54CC');
        });
    });
    describe('#calculateGasMargin', () => {
        it('adds 10%', () => {
            expect(_1.calculateGasMargin(bignumber_1.BigNumber.from(1000)).toString()).toEqual('1100');
            expect(_1.calculateGasMargin(bignumber_1.BigNumber.from(50)).toString()).toEqual('55');
        });
    });
    describe('#basisPointsToPercent', () => {
        it('converts basis points numbers to percents', () => {
            expect(_1.basisPointsToPercent(100).equalTo(new sdk_1.Percent(sdk_1.JSBI.BigInt(1), sdk_1.JSBI.BigInt(100)))).toBeTruthy();
            expect(_1.basisPointsToPercent(500).equalTo(new sdk_1.Percent(sdk_1.JSBI.BigInt(5), sdk_1.JSBI.BigInt(100)))).toBeTruthy();
            expect(_1.basisPointsToPercent(50).equalTo(new sdk_1.Percent(sdk_1.JSBI.BigInt(5), sdk_1.JSBI.BigInt(1000)))).toBeTruthy();
        });
    });
});
