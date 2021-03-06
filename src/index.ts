const RuleEngine = require('./node-rules');
import { ExtractGateConfigParams, GateConfig, Result } from './types';

export default async function BuildGate<T extends GateConfig<{}>>(
  gateConfig: T
): Promise<(params?: ExtractGateConfigParams<T>) => Result>;
export default async function BuildGate<T extends GateConfig<any>>(
  gateConfig: T
): Promise<(params: ExtractGateConfigParams<T>) => Result>;
export default async function BuildGate(gateConfig) {
  const rules = await Promise.all(
    gateConfig.targeting.map(async (rule) => {
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
        R.execute(params ?? {}, function (result) {
          resolve(result.pass ?? false);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
}
