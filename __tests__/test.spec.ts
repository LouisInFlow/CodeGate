import BuildGate from '../src/index';
import { isSilverTier, isEmployee } from '../src/gates';

const gate = {
  name: 'featureA',
  description:
    'featureA is our new d3 based implementation we hope will replace our canvas implementation',
  rules: [
    { condition: isEmployee, allow: 0 },
    { condition: isSilverTier, allow: 100 },
  ],
};

test('Basic Custom Function', async () => {
  const useNewFeature = await BuildGate(gate);
  expect(await useNewFeature({ userId: 'jamie' })).toBe(false);
});
