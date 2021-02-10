const RuleEngine = require('node-rules');

type Condition = Function;
type Gate = {
  name: string;
  description: string;
  rules: {
    // can add property for layering gate
    condition: Condition; // examples rules include: isEmployee, isBronzeTier, isInUSACanada
    allow: number; // default 100% allow if func returns true
  }[];
};

export default async function BuildGate(gate: Gate): Promise<Function> {
  const rules = await Promise.all(
    gate.rules.map(async (rule) => {
      const match = await rule.condition(this);
      return {
        condition: function (R) {
          R.when(match);
        },
        consequence: function (R) {
          this.pass = Math.random() * 100 < rule.allow;
          R.stop();
        },
      };
    })
  );

  return (facts) => {
    return new Promise((resolve, reject) => {
      try {
        var R = new RuleEngine(rules);
        R.execute({ ...facts, pass: false }, function (result) {
          resolve(result.pass);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
