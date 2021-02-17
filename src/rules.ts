import { GateConfig } from './types';
import BuildGate from '../src/index';

export async function canPassArgumentsToRule(params: {
  userId: string;
}): Promise<boolean> {
  const allowList = ['louis'];
  return Promise.resolve(allowList.includes(params.userId));
}

export async function isAnyUser(): Promise<boolean> {
  return Promise.resolve(true);
}

export async function isPastStartTime(params: { startTime: number }): Promise<boolean> {
  return Promise.resolve(params.startTime <= Date.now());
}

export function passesGate<P>(gateConfig: GateConfig<P>) {
  return async function (params: P): Promise<boolean> {
    const nestedGate = await BuildGate(gateConfig);
    const passedNestedGate = await nestedGate(params);

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
