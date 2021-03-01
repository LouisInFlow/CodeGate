import { Long, Rule, Short } from './types';

export function isShortRule<P>(rule: Rule<P>): rule is Short<P> {
  return typeof rule === 'function';
}

export function isLongRule<P>(rule: Rule<P>): rule is Long<P> {
  return 'condition' in rule;
}

export function makeParamEvaluator<P>(params: P) {
  return function paramEvaluator(rule: Rule<P>) {
    return isShortRule(rule)
      ? rule(params)
      : rule.condition(params);
  }
}
