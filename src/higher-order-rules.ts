import BuildGate from './index';
import { ExtractMultipleRuleParams, GateConfig, Rule } from './types';
import { makeParamEvaluator } from './utils';

export function passesGate<P>(gateConfig: GateConfig<P>) {
  return async function (params: P): Promise<boolean> {
    const nestedGate = await BuildGate(gateConfig);
    const passedNestedGate = await nestedGate(params);

    return passedNestedGate;
  };
}

export function satisfiesAllOf<T extends Rule<any>[]>(...rules: T) {
  return async function satisfiesAllSubRules(params: ExtractMultipleRuleParams<T>) {
    const paramEvaluator = makeParamEvaluator(params);

    const subRuleResults = await Promise.all(rules.map(paramEvaluator));

    return subRuleResults.every(result => result === true);
  }
}

export function satisfiesAnyOf<T extends Rule<any>[]>(...rules: T) {
  return async function satisfiesAnySubRule(params: ExtractMultipleRuleParams<T>) {
    const paramEvaluator = makeParamEvaluator(params);

    const subRuleResults = await Promise.all(rules.map(paramEvaluator));

    return subRuleResults.some(result => result === true);
  }
}

export function doesNotSatisfy<P>(rule: Rule<P>) {
  return async function doesNotSatisfySubRule(params: P) {
    const paramEvaluator = makeParamEvaluator(params);

    const subRuleResult = await paramEvaluator(rule);

    return !subRuleResult;
  };
}
