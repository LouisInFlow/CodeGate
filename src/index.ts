type Gate = Promise<boolean>;
type OverrideType = 'ip' | 'id' | 'subnet'; //cidr;

type Overrides = {
  ipAllow?: string[];
  ipDeny?: string[];
  idAllow?: string[];
  idDeny: string[];
};
interface InitializeCodeGateConfig {
  name?: string;
  description?: string;
  userId?: string;
  gates?: unknown[];
  overrides?: Overrides;
}

export default async function ({
  gates,
  overrides,
  userId,
  name,
  description,
}: InitializeCodeGateConfig): Promise<boolean> {
  const AllowUser = await checkAllowOverrides(userId, overrides); // OR
  const DenyUser = await checkDenyOverrides(userId, overrides); // NOT
  if (AllowUser && DenyUser) throw Error('Allows and Denies user');
  if (AllowUser) return true;
  if (DenyUser) return false;

  return await checkGates(userId, gates); // AND
}

function checkAllowOverrides(userId, overrides): Promise<boolean> {
  return Promise.resolve(false);
}
function checkDenyOverrides(userId, overrides): Promise<boolean> {
  return Promise.resolve(false);
}

function checkGates(userId, gates): Promise<boolean> {
  const promises = gates.map((gate) => () => gate(userId));
  return Promise.all(promises).then((resolvedPromises) =>
    resolvedPromises.every((a) => a)
  );
}
