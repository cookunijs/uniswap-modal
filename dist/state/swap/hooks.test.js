"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = require("qs");
const actions_1 = require("./actions");
const hooks_1 = require("./hooks");
describe('hooks', () => {
    describe('#queryParametersToSwapState', () => {
        test('ETH to DAI', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?inputCurrency=ETH&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual({
                [actions_1.Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
                [actions_1.Field.INPUT]: { currencyId: 'ETH' },
                typedValue: '20.5',
                independentField: actions_1.Field.OUTPUT,
                recipient: null
            });
        });
        test('does not duplicate eth for invalid output token', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=invalid', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual({
                [actions_1.Field.INPUT]: { currencyId: '' },
                [actions_1.Field.OUTPUT]: { currencyId: 'ETH' },
                typedValue: '',
                independentField: actions_1.Field.INPUT,
                recipient: null
            });
        });
        test('output ETH only', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual({
                [actions_1.Field.OUTPUT]: { currencyId: 'ETH' },
                [actions_1.Field.INPUT]: { currencyId: '' },
                typedValue: '20.5',
                independentField: actions_1.Field.INPUT,
                recipient: null
            });
        });
        test('invalid recipient', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=abc', { parseArrays: false, ignoreQueryPrefix: true }))).toEqual({
                [actions_1.Field.OUTPUT]: { currencyId: 'ETH' },
                [actions_1.Field.INPUT]: { currencyId: '' },
                typedValue: '20.5',
                independentField: actions_1.Field.INPUT,
                recipient: null
            });
        });
        test('valid recipient', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5', {
                parseArrays: false,
                ignoreQueryPrefix: true
            }))).toEqual({
                [actions_1.Field.OUTPUT]: { currencyId: 'ETH' },
                [actions_1.Field.INPUT]: { currencyId: '' },
                typedValue: '20.5',
                independentField: actions_1.Field.INPUT,
                recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5'
            });
        });
        test('accepts any recipient', () => {
            expect(hooks_1.queryParametersToSwapState(qs_1.parse('?outputCurrency=eth&exactAmount=20.5&recipient=bob.argent.xyz', {
                parseArrays: false,
                ignoreQueryPrefix: true
            }))).toEqual({
                [actions_1.Field.OUTPUT]: { currencyId: 'ETH' },
                [actions_1.Field.INPUT]: { currencyId: '' },
                typedValue: '20.5',
                independentField: actions_1.Field.INPUT,
                recipient: 'bob.argent.xyz'
            });
        });
    });
});
