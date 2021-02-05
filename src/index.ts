const RuleEngine = require('./node-rules');

type Short = Promise<boolean>;
type Long = {
  condition: Function; // examples rules include: isEmployee, isBronzeTier, isInUSACanada
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
          if (rule.condition) {
            R.when(await rule.condition(this));
          } else {
            R.when(await rule(this));
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
