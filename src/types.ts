export type Short<F> = (facts: F) => Promise<boolean>;
export type Long<F> = {
  condition: (facts: F) => Promise<boolean>;
  allow?: number;
};
export type Rule<F> = Short<F> | Long<F>;

export type GateConfig<F> = {
  name: string;
  description: string;
  targeting: Rule<F>[];
};

// Utility type for obtaining the type of
// the facts expected by a GateConfig
export type ExtractGateConfigParams<T> = T extends GateConfig<infer F>
  ? F
  : never;
