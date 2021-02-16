const RuleEngine = require('./node-rules');
import { ExtractGateConfigParams, Gate, GateConfig } from './types';

export default async function BuildGate<T extends GateConfig<any>>(
  gate: T
): Promise<(facts: ExtractGateConfigParams<T>) => Gate> {
  const rules = await Promise.all(
    gate.targeting.map(async (rule) => {
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

  return function Gate(params) {
    return new Promise((resolve, reject) => {
      try {
        var R = new RuleEngine(rules);
        R.execute(params, function (result) {
          resolve(result.pass ?? false);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
