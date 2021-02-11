const RuleEngine = require('./node-rules');

type Short = (...args: unknown[]) => Promise<boolean>;

type Long = {
  condition: (...args: unknown[]) => Promise<boolean>; // examples rules include: isEmployee, isBronzeTier, isInUSACanada
  allow: number; // default 100% allow if func returns true
};

type Gate = {
  name: string;
  description: string;
  rules: (Short | Long)[];
};

export default async function BuildGate(gate: Gate): Promise<Function> {
  const rules = await Promise.all(
    gate.rules.map(async (rule) => {
      console.log(rule);
      return {
        condition: async function (R) {
          if (typeof rule === 'function') {
            R.when(await rule(this));
          } else {
            R.when(await rule.condition(this));
          }
        },
        consequence: function (R) {
          this.pass = Math.random() * 100 < (this.allow ?? 100);
          R.stop();
        },
      };
    })
  );

  return (facts): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        var R = new RuleEngine(rules);
        R.execute(facts, function (result) {
          resolve(result.pass ?? false);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
