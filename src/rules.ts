import { GateConfig } from './types';
import BuildGate from '../src/index';

export async function canPassArgumentsToRule(facts: {
  userId: string;
}): Promise<boolean> {
  const allowList = ['louis'];
  return Promise.resolve(allowList.includes(facts.userId));
}

export async function isAnyUser(): Promise<boolean> {
  return Promise.resolve(true);
}

export async function isPastStartTime(facts: { startTime: number }): Promise<boolean> {
  return Promise.resolve(facts.startTime <= Date.now());
}

export function passesGate<F>(gateConfig: GateConfig<F>) {
  return async function (facts: F): Promise<boolean> {
    const nestedGate = await BuildGate(gateConfig);
    const passedNestedGate = await nestedGate(facts);

    return passedNestedGate;
  };
}

// async function getGeo() {
//   return await fetch('https://www.cloudflare.com/cdn-cgi/trace')
//     .then((response) => response.text())
//     .then((text) => {
//       const colo = /^(?:colo)=(.*)$/gm.exec(text)[1];
//       const loc = /^(?:loc)=(.*)$/gm.exec(text)[1];
//       return { country: loc, city: colo };
//     });
// }

// async function getIP() {
//   return await fetch('https://www.cloudflare.com/cdn-cgi/trace')
//     .then((response) => response.text())
//     .then((text) => {
//       return /^(?:ip)=(.*)$/gm.exec(text)[1];
//     });
// }
