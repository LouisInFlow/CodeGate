import type { Result } from './types';

export async function canPassArgumentsToRule(params: {
  userId: string;
}): Result {
  const allowList = ['louis'];
  return allowList.includes(params.userId);
}

export async function isAnyUser(): Result {
  return true;
}

export async function isPastStartTime(params: { startTime: number }): Result {
  return params.startTime <= Date.now();
}
