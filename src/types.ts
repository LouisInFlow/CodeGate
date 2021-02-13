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
