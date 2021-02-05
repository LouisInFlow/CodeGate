const CodeGate = require('./index');

test('percentage gateType, allow 0', async () => {
  const gate = CodeGate({
    gates: [{ gateType: 'percentage', percentAllowed: 0, allow: [], deny: [] }],
  });
  expect(await gate.then((pass) => expect(pass).toBe(false)));
});

test('percentage gateType, allow 100', async () => {
  const gate = CodeGate({
    gates: [
      { gateType: 'percentage', percentAllowed: 100, allow: [], deny: [] },
    ],
  });
  expect(await gate.then((pass) => expect(pass).toBe(true)));
});
