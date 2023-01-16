import {
  addNewSysHost,
  deleteSysHosts,
  getSysHosts,
  modifySysHost,
} from '@/native';

import { ALIAS_KEY, DISABLED_HOSTS_KEY } from '@/constants';
import { IAlias, IHost } from '@/IType';
import { getFromStorage, saveToStorage } from '@/utils';

export function getDisabledHosts() {
  const disabledHosts: IHost[] = getFromStorage<IHost[]>(
    DISABLED_HOSTS_KEY,
    [],
  );
  return disabledHosts;
}

export async function getAllHosts() {
  const alias = getFromStorage<IAlias>(ALIAS_KEY, {});
  const disabledHosts = getDisabledHosts();
  const osHosts = await getSysHosts();
  // apply alias
  osHosts.forEach((host) => {
    host.alias = alias[host.ip + host.domain] || '';
  });
  const hosts = [...osHosts, ...disabledHosts];
  hosts.sort((a, b) => a.domain.localeCompare(b.domain));
  return hosts;
}

export async function createHost(host: IHost) {
  const osHosts = await getSysHosts();
  if (
    osHosts.some(
      (h) =>
        (h.ip.includes(host.ip) || host.ip.includes(h.ip)) &&
        host.domain === h.domain,
    )
  ) {
    throw new Error(`Host has been used`);
  }
  await addNewSysHost(host);
  return getAllHosts();
}

export async function removeHost(host: IHost) {
  if (host.disabled) {
    const disabledHosts: IHost[] = getFromStorage<IHost[]>(
      DISABLED_HOSTS_KEY,
      [],
    );
    const nextHosts = disabledHosts.filter(
      (h) => h.ip !== host.ip && h.domain !== host.domain,
    );
    saveToStorage(DISABLED_HOSTS_KEY, nextHosts);
    return getAllHosts();
  }

  await deleteSysHosts(host);
  return getAllHosts();
}

export async function changeHostField(
  fieldName: keyof IHost,
  value: string | boolean,
  originalHost: IHost,
) {
  if (fieldName === 'alias') {
    const alias = getFromStorage<IAlias>(ALIAS_KEY, {});
    saveToStorage(ALIAS_KEY, {
      ...alias,
      [originalHost.ip + originalHost.domain]: value,
    });
    if (originalHost.disabled) {
      const disabledHosts = getDisabledHosts();
      saveToStorage(
        DISABLED_HOSTS_KEY,
        disabledHosts.map((h) => {
          if (h.ip === originalHost.ip && h.domain === originalHost.domain) {
            return {
              ...originalHost,
              alias: value,
            };
          }
          return h;
        }),
      );
    }
    return getAllHosts();
  }

  if (fieldName === 'disabled') {
    if (value === true) {
      const disabledHosts = getDisabledHosts();
      // add to dis
      saveToStorage(DISABLED_HOSTS_KEY, [
        ...disabledHosts,
        { ...originalHost, disabled: true },
      ]);
      // del from sys
      await deleteSysHosts(originalHost);
      return getAllHosts();
    }
    if (value === false) {
      const disabledHosts = getDisabledHosts();
      // del from dis
      saveToStorage(
        DISABLED_HOSTS_KEY,
        disabledHosts.filter(
          (h) => h.ip !== originalHost.ip || h.domain !== originalHost.domain,
        ),
      );
      // add to sys
      await createHost({ ...originalHost, disabled: false });
      return getAllHosts();
    }
    throw new Error(`Unexpected value for disabled`);
  }

  if (fieldName === 'domain' && originalHost.disabled) {
    const disabledHosts = getDisabledHosts();
    const nextHosts = disabledHosts.map((h) => {
      if (h.ip === originalHost.ip && h.domain === originalHost.domain) {
        return {
          ...originalHost,
          domain: value,
        };
      }
      return h;
    });
    saveToStorage(DISABLED_HOSTS_KEY, nextHosts);
    return getAllHosts();
  }
  if (fieldName === 'domain' && !originalHost.disabled) {
    await modifySysHost(fieldName, value as string, originalHost);
    return getAllHosts();
  }
  if (fieldName === 'ip' && originalHost.disabled) {
    const disabledHosts = getDisabledHosts();
    const nextHosts = disabledHosts.map((h) => {
      if (h.ip === originalHost.ip && h.domain === originalHost.domain) {
        return {
          ...originalHost,
          ip: value,
        };
      }
      return h;
    });
    saveToStorage(DISABLED_HOSTS_KEY, nextHosts);
    return getAllHosts();
  }
  if (fieldName === 'ip' && !originalHost.disabled) {
    await modifySysHost(fieldName, value as string, originalHost);
    return getAllHosts();
  }
  throw new Error(`Unexpected fieldName of ${fieldName}`);
}
