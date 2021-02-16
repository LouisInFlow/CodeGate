// TODO: Is a Gate a Promise<boolean>,
// or a function which returns a Promise<boolean>?
// The return type of BuildGate suggests the latter.
export type Gate = Promise<boolean>;

export type Short<F> = (facts: F) => Gate;
export type Long<F> = {
  condition: (facts: F) => Gate;
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
