import BuildGate from './index';
import {
  ExtractGateConfigParams,
  ExtractMultipleRuleParams,
  ExtractSingleRuleParams,
  GateConfig,
  Result,
  Rule
} from './types';
import { makeParamEvaluator } from './utils';

export function passesGate<T extends GateConfig<{}>>(
  gateConfig: T
): (params?: ExtractGateConfigParams<T>) => Result;
export function passesGate<T extends GateConfig<any>>(
  gateConfig: T
): (params: ExtractGateConfigParams<T>) => Result;
export function passesGate(gateConfig) {
  return async function (params) {
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

export function doesNotSatisfy<T extends Rule<any>>(rule: T) {
  return async function doesNotSatisfySubRule(params: ExtractSingleRuleParams<T>) {
    const paramEvaluator = makeParamEvaluator(params);

    const subRuleResult = await paramEvaluator(rule);

    return !subRuleResult;
  };
}
