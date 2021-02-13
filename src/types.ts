export type Gate = Promise<boolean>;
export type Short = (facts: Facts) => Gate;
export type Long = {
  condition: (facts: Facts) => Gate;
  allow?: number;
};

export type GateConfig = {
  name: string;
  description: string;
  rules: (Short | Long)[];
};

export type Facts = {
  startTime?: number;
  userId?: string;
  gate?: GateConfig;
};
