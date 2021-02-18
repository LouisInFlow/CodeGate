// TODO: Is a Gate a Promise<boolean>,
// or a function which returns a Promise<boolean>?
// The return type of BuildGate suggests the latter.
export type Gate = Promise<boolean>;

export type Short<P> = (params: P) => Gate;
export type Long<P> = {
  condition: (params: P) => Gate;
  allow?: number;
};
export type Rule<P> = Short<P> | Long<P>;

// Utility type for obtaining the type of
// the params expected by a single Rule
export type ExtractSingleRuleParams<T> = T extends Rule<infer P>
  ? P
  : never;

// Utility type for obtaining the type of
// the params expected by multiple Rules
export type ExtractMultipleRuleParams<T> = T extends Rule<infer P>[]
  ? P
  : never;

export type GateConfig<P> = {
  name: string;
  description: string;
  targeting: Rule<P>[];
};

// Utility type for obtaining the type of
// the params expected by a GateConfig
export type ExtractGateConfigParams<T extends GateConfig<any>> = ExtractMultipleRuleParams<T['targeting']>;
