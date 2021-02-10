import BuildGate from '../src/index';
import { isSilverTier, isEmployee } from '../src/gates';

const gate = {
  name: 'featureA',
  description:
    'featureA is our new d3 based implementation we hope will replace our canvas implementation',
  rules: [isEmployee, { condition: isSilverTier, allow: 100 }],
};

test('Basic Custom Function', async () => {
  const useNewFeature = await BuildGate(gate);
  expect(await useNewFeature({ userId: 'louis' })).toBe(true);
});
