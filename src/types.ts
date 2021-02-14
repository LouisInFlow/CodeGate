// TODO: Is a Gate a Promise<boolean>,
// or a function which returns a Promise<boolean>?
// The return type of BuildGate suggests the latter.
export type Gate = Promise<boolean>;

export type Short<F extends {}> = (facts: F) => Gate;
export type Long<F extends {}> = {
  condition: (facts: F) => Gate;
  allow?: number;
};
export type Rule<F extends {}> = Short<F> | Long<F>;

export type GateConfig<F extends {}> = {
  name: string;
  description: string;
  rules: Rule<F>[];
};

// Utility type for obtaining the type of
// the facts expected by a GateConfig
export type ExtractGateConfigFacts<T> =
  T extends GateConfig<infer F>
    ? F
    : never;
