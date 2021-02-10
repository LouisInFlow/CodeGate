import InitializeCodeGate from '../src/index';
import { isSilverTier, needsArgs } from '../src/gates';

test('Basic Custom Function', async () => {
  const useNewFeature = InitializeCodeGate({
    gates: [isSilverTier],
    userId: 'louislo',
  });

  expect(await useNewFeature).toBe(true);
});

test('Custom Function that takes args', async () => {
  const useNewFeature = InitializeCodeGate({
    gates: [() => needsArgs(1, 2, 3)],
    userId: 'louislo',
  });

  expect(await useNewFeature).toBe(true);
});

// All employees, 30% USA, 60% France, Deny these 5 users
// All employees, deny this subnet
// 10% of users, deny these 3 userIds, allow these 7 users
// Allow these 7 users only
// Allow these subnet but deny these 8 users
// 80% users, allow these 7, deny these 8
