import BuildGate from '../src/index';
import {
  canPassArgumentsToRule,
  isAnyUser,
  isPastStartTime,
  passesGate
} from '../src/rules';

test('Can pass arguments to rule', async () => {
  const useNewFeature = await BuildGate({
    name: 'canPassArgumentsToRule',
    description: 'testing canPassArgumentsToRule',
    rules: [canPassArgumentsToRule],
  });
  expect(await useNewFeature({ userId: 'louis' })).toBe(true);
});

test('Can build gates with multiple correctly enforced rules', async () => {
  const useNewFeature = await BuildGate({
    name: 'canPassArgumentsToRule',
    description: 'testing canPassArgumentsToRule',
    rules: [canPassArgumentsToRule, isPastStartTime],
  });
  expect(await useNewFeature({ userId: 'jamie', startTime: Date.now() + 10000 })).toBe(false)
  expect(await useNewFeature({ userId: 'jamie', startTime: Date.now() - 1 })).toBe(true);
  expect(await useNewFeature({ userId: 'louis', startTime: Date.now() + 10000 })).toBe(true);
  expect(await useNewFeature({ userId: 'louis', startTime: Date.now() - 1 })).toBe(true);
});

test('Can use gate as rule', async () => {
  const gateAsRuleGate = await BuildGate({
    name: 'canUseGateAsRule',
    description: 'tests that nesting gates works as expected',
    rules: [
      passesGate({ name: 'isAnyUser', description: '', rules: [isAnyUser] }),
    ],
  });
  expect(await gateAsRuleGate({})).toBe(true);
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
