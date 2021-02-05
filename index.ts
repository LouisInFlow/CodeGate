type Gate = Promise<boolean>;
type GateType = 'geofence' | 'ip' | 'subnet' | 'custom' | 'time' | 'percentage';
type DefaultBehavior = 'allow' | 'deny';

type GateConfig = {
  gateType: GateType;
  customFunction?: Function;
  allow?: string[];
  deny?: string[];
  percentAllowed?: Number;
};

type BuildGateConfig = {
  defaultBehavior?: DefaultBehavior;
  gates: GateConfig[];
};

module.exports = function (config: BuildGateConfig): Gate {
  const gates: Gate[] = config.gates.map((gateConfig) =>
    handleGate(gateConfig, (config.defaultBehavior = 'deny'))
  );

  return new Promise<boolean>((resolve) => {
    resolve(
      gates.reduce((p: Gate, gate: Gate) => {
        return p.then((allow) => (allow ? gate.then() : false));
      }, Promise.resolve(true))
    );
  });
};

function handleGate(
  gateConfig: GateConfig,
  defaultBehavior: 'allow' | 'deny' = 'deny'
): Gate {
  switch (gateConfig.gateType) {
    case 'geofence':
    case 'ip':
    case 'subnet':
    case 'custom':
    case 'time':
    case 'percentage':
      return BuildPercentageGate(gateConfig.percentAllowed);
    default:
      throw Error('Please set a valid gateType');
  }
}

function BuildPercentageGate(percentAllowed: Number): Gate {
  return new Promise((resolve) => {
    Math.random() * 100 <= percentAllowed ? resolve(true) : resolve(false);
  });
}

// function BuildCustomGate(allow, deny, customFunction, defaultBehavior) {
//   return new Promise((resolve, reject) => {
//     customFunction.arguments;
//   });
// }
