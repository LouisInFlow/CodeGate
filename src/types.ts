export type Result = Promise<boolean>;

export type Short<P> = (params: P) => Result;
export type Long<P> = {
  condition: (params: P) => Result;
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
