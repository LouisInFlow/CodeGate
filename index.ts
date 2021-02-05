type GateType = 'geofence' | 'ip' | 'subnet' | 'custom' | 'time' | 'percentage';
type DefaultBehavior = 'allow' | 'deny';

type GateConfig = {
  gateType: GateType;
  customFunction?: Function;
  allow?: string[];
  deny?: string[];
  percentAllowed?: Number;
};

type Config = {
  defaultBehavior: DefaultBehavior;
  gates: GateConfig[];
};

type Gate = {};

export default function (config: Config): Promise<Object> {
  const gates: Gate[] = config.gates.map((gateConfig) =>
    handleGate(gateConfig, config.defaultBehavior)
  );

  return new Promise(() => {});
}

function handleGate(
  gateConfig: GateConfig,
  defaultBehavior: 'allow' | 'deny' = 'deny'
): Gate {
  switch (gateConfig.gateType) {
    case 'geofence':
      return BuildGeoFence(gateConfig.allow, gateConfig.deny, defaultBehavior);
    case 'ip':
      return BuildIPGate(gateConfig.allow, gateConfig.deny, defaultBehavior);
    case 'custom':
    case 'time':
    case 'percentage':
      return BuildPercentageGate(gateConfig.percentAllowed);
    default:
      throw Error('Please set a valid gateType');
  }
}

function BuildPercentageGate(percentAllowed: Number): Gate {
  return function () {
    return Math.random() * 100 <= percentAllowed;
  };
}
