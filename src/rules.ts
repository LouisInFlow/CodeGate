interface Facts {
  startTime?: number;
  userId?: string;
}

export async function isEmployee(facts: Facts): Promise<boolean> {
  const allowList = ['louis'];
  return Promise.resolve(allowList.includes(facts.userId));
}

export async function isAnyUser(): Promise<boolean> {
  return Promise.resolve(true);
}

export async function isPastStartTime(facts: Facts): Promise<boolean> {
  return Promise.resolve(facts.startTime <= Date.now());
}

export async function passesGate(facts: Facts): Promise<boolean> {
  return Promise.resolve(facts.startTime <= Date.now());
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
