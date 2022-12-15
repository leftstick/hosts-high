import { IAlias, IHost } from '@/IType';
import { getSysHosts, sortWithDisabledHosts } from '@/services';
import { useLocalStorageState } from 'ahooks';
import hostile from 'hostile';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ALIAS_PREFIX = 'hosts_alias';

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!key) {
    return defaultValue;
  }
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return defaultValue;
  }
  return JSON.parse(raw);
}

const DISABLED_HOSTS_KEY = `${ALIAS_PREFIX}_disabledHosts`;
const ALIAS_KEY = `${ALIAS_PREFIX}_aliases`;

function useHostsModel() {
  const [sysHosts, setSysHosts] = useState<IHost[]>([]);
  const [disabledHosts, setDisabledHosts] = useLocalStorageState<IHost[]>(
    DISABLED_HOSTS_KEY,
    {
      defaultValue: [],
    },
  );
  const [aliases, setAliases] = useLocalStorageState<IAlias>(ALIAS_KEY, {
    defaultValue: {},
  });

  const hosts = useMemo(
    () => sortWithDisabledHosts(sysHosts, disabledHosts),
    [sysHosts, disabledHosts],
  );

  const addDisabledHost = useCallback(
    (host: IHost) => {
      return new Promise<void>((resolve, reject) => {
        const disabledHosts = getFromStorage<IHost[]>(DISABLED_HOSTS_KEY, []);
        const isDefined = disabledHosts.some(
          (h) => h.ip === host.ip && h.domain === host.domain,
        );
        if (isDefined) {
          reject(`host [${host.ip} ${host.domain}] has been used`);
          return;
        }
        setDisabledHosts((disabledHosts) => [
          ...disabledHosts!,
          { ...host, disabled: true },
        ]);
        resolve();
        return;
      });
    },
    [setDisabledHosts],
  );

  const addSysHost = useCallback(
    (host: IHost) => {
      return new Promise<void>((resolve, reject) => {
        hostile.get(false, (err, lines) => {
          const isDefined = lines.some(
            (line) => line[0] === host.ip && line[1] === host.domain,
          );
          if (isDefined) {
            return reject(`host [${host.ip} ${host.domain}] has been used`);
          }

          hostile.set(host.ip, host.domain, (err) => {
            if (err) {
              return reject(
                `Failed to add [${host.ip} ${host.domain}]: ${err.message}`,
              );
            }
            setAliases({ ...aliases, [host.ip + host.domain]: host.alias });
            setSysHosts((sysHosts) => [
              ...sysHosts,
              {
                ...host,
                disabled: false,
                alias: aliases[host.ip + host.domain],
              },
            ]);
            resolve();
          });
        });
      });
    },
    [setSysHosts, setAliases, aliases],
  );

  const createHost = useCallback(
    (host: IHost) => {
      if (host.disabled) {
        return addDisabledHost(host);
      }
      return addSysHost(host);
    },
    [addDisabledHost, addSysHost],
  );

  const deleteDisabledHost = useCallback(
    (host: IHost) => {
      return new Promise<void>((resolve) => {
        setDisabledHosts((disabledHosts) =>
          disabledHosts!.filter(
            (h) => !(h.ip === host.ip && h.domain === host.domain),
          ),
        );
        resolve();
      });
    },
    [setDisabledHosts],
  );

  const deleteSysHost = useCallback(
    (host: IHost) => {
      return new Promise<void>((resolve, reject) => {
        hostile.remove(host.ip, host.domain, (err) => {
          if (err) {
            return reject(
              `Failed to delete [${host.ip} ${host.domain}]: ${err.message}`,
            );
          }
          setSysHosts((sysHosts) =>
            sysHosts.filter(
              (h) => !(h.ip === host.ip && h.domain === host.domain),
            ),
          );
          resolve();
        });
      });
    },
    [setSysHosts],
  );

  const removeHost = useCallback(
    (host: IHost) => {
      if (host.disabled) {
        return deleteDisabledHost(host);
      }
      return deleteSysHost(host);
    },
    [deleteDisabledHost, deleteSysHost],
  );

  const modifyHost = useCallback(
    (oldHost: IHost, newHost: IHost) => {
      return new Promise<void>((resolve, reject) => {
        if (
          newHost.ip === oldHost.ip &&
          newHost.domain === oldHost.domain &&
          newHost.alias === oldHost.alias
        ) {
          resolve();
          return;
        }

        if (newHost.ip !== oldHost.ip || newHost.domain !== oldHost.domain) {
          const foundExist = hosts.find(
            (h) => h.ip === newHost.ip && h.domain === newHost.domain,
          );
          if (foundExist) {
            reject('ip/domain/alias might be used by other host');
            return;
          }
        }

        if (newHost.disabled) {
          setDisabledHosts(
            disabledHosts.map((h) => {
              if (h.ip === oldHost.ip && h.domain === oldHost.domain) {
                return newHost;
              }
              return h;
            }),
          );
          resolve();
          return;
        }

        deleteSysHost(oldHost)
          .then(() => addSysHost(newHost))
          .then(resolve, reject);
      });
    },
    [setDisabledHosts, deleteSysHost, addSysHost, disabledHosts, hosts],
  );

  const toggleHostState = useCallback(
    (host: IHost) => {
      const newHost = { ...host, disabled: !host.disabled };
      return new Promise((resolve, reject) => {
        if (host.disabled) {
          deleteDisabledHost(host)
            .then(() => addSysHost(newHost))
            .then(resolve, reject);
          return;
        }
        deleteSysHost(host)
          .then(() => addDisabledHost(newHost))
          .then(resolve, reject);
      });
    },
    [deleteDisabledHost, addSysHost, deleteSysHost, addDisabledHost],
  );

  useEffect(() => {
    getSysHosts(aliases).then((sysHosts) => {
      setSysHosts(sysHosts);
    });
  }, [aliases]);

  return {
    hosts,
    createHost,
    toggleHostState,
    removeHost,
    modifyHost,
  };
}

export default useHostsModel;
