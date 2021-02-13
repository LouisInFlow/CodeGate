const RuleEngine = require('./node-rules');
import { GateConfig, Gate } from './types';

export default async function BuildGate<F extends {}>(
  gate: GateConfig<F>
): Promise<(facts?: F) => Gate> {
  const rules = await Promise.all(
    gate.rules.map(async (rule) => {
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

  return function Gate(facts: F = {} as F): Promise<boolean> {
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
