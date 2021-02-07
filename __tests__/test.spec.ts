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
