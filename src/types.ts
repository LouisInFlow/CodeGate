export type Short = (...args: unknown[]) => Promise<boolean>;
export type Long = {
  condition: (...args: unknown[]) => Promise<boolean>; // examples rules include: isEmployee, isBronzeTier, isInUSACanada
  allow?: number; // default 100% allow if func returns true
};

export type Gate = {
  name: string;
  description: string;
  rules: (Short | Long)[];
};
