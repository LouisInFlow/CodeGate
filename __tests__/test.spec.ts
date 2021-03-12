import BuildGate from '../src/index';
import {
  doesNotSatisfy,
  passesGate,
  satisfiesAllOf,
  satisfiesAnyOf,
} from '../src/higher-order-rules';
import {
  canPassArgumentsToRule,
  isAnyUser,
  isPastStartTime,
} from '../src/rules';

test('Can pass arguments to rule', async () => {
  const useNewFeature = await BuildGate({
    name: 'canPassArgumentsToRule',
    description: 'testing canPassArgumentsToRule',
    targeting: [canPassArgumentsToRule],
  });
  expect(await useNewFeature({ userId: 'louis' })).toBe(true);
});

test('Can build gates with multiple correctly enforced rules', async () => {
  const useNewFeature = await BuildGate({
    name: 'canPassArgumentsToRule',
    description: 'testing canPassArgumentsToRule',
    targeting: [canPassArgumentsToRule, isPastStartTime],
  });
  expect(
    await useNewFeature({ userId: 'jamie', startTime: Date.now() + 10000 })
  ).toBe(false);
  expect(
    await useNewFeature({ userId: 'jamie', startTime: Date.now() - 1 })
  ).toBe(true);
  expect(
    await useNewFeature({ userId: 'louis', startTime: Date.now() + 10000 })
  ).toBe(true);
  expect(
    await useNewFeature({ userId: 'louis', startTime: Date.now() - 1 })
  ).toBe(true);
});

test('Can use gate as rule', async () => {
  const gateAsRuleGate = await BuildGate({
    name: 'canUseGateAsRule',
    description: 'tests that nesting gates works as expected',
    targeting: [
      passesGate({
        name: 'isAnyUser',
        description: '',
        targeting: [isAnyUser],
      }),
    ],
  });

  expect(await gateAsRuleGate({})).toBe(true);

  // should also be able to call gateAsRuleGate without any params, because none
  // are required.
  expect(await gateAsRuleGate()).toBe(true);
});

test('Can use higher-order rules', async () => {
  const ComplexGate1 = await BuildGate({
    name: 'satisfiesAllOf',
    description: 'testing satisfiesAllOf',
    targeting: [satisfiesAllOf(isAnyUser, canPassArgumentsToRule)]
  });

  const ComplexGate2 = await BuildGate({
    name: 'satisfiesAnyOf',
    description: 'testing satisfiesAnyOf',
    targeting: [satisfiesAnyOf(isAnyUser, canPassArgumentsToRule)]
  });

  const ComplexGate3 = await BuildGate({
    name: 'doesNotSatisfy',
    description: 'testing doesNotSatisfy',
    targeting: [doesNotSatisfy(canPassArgumentsToRule)]
  });

  expect(await ComplexGate1({ userId: 'louis' })).toBe(true);
  expect(await ComplexGate1({ userId: 'jamie' })).toBe(false);

  expect(await ComplexGate2({ userId: 'louis' })).toBe(true);
  expect(await ComplexGate2({ userId: 'jamie' })).toBe(true);

  expect(await ComplexGate3({ userId: 'louis' })).toBe(false);
  expect(await ComplexGate3({ userId: 'jamie' })).toBe(true);
});

// isPastStartTime
// returns true if past time
// returns false if before time
// allow parameter
// returns true with 100 allow
// returns false with 0 allow
// do statistcal method to test gate certain percentage
// isAnyUser
// returns true
// short rule works
// long rule works
// sequencing rules works
