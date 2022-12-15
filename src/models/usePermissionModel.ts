import { useLocalStorageState } from 'ahooks';
import { access, constants } from 'node:fs/promises';
import { useCallback, useEffect } from 'react';
import sudo from 'sudo-prompt';

import { HOSTS, PERMISSION_CMD } from '@/utils';

const ALIAS_PREFIX = 'hosts_alias';

const { R_OK, W_OK } = constants;

function requestPermission() {
  const options = {
    name: 'Hosts Master',
  };
  return new Promise<void>(function (resolve, reject) {
    sudo.exec(PERMISSION_CMD, options, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function usePermissionModel() {
  const [acquired, setAcquired] = useLocalStorageState(
    `${ALIAS_PREFIX}_permission_acquired`,
    {
      defaultValue: false,
    },
  );

  const checkAcquired = useCallback(() => {
    return access(HOSTS, R_OK | W_OK)
      .then(() => {
        setAcquired(true);
        return true;
      })
      .catch(() => {
        setAcquired(false);
        return false;
      });
  }, [setAcquired]);

  useEffect(() => {
    checkAcquired();
  }, [checkAcquired]);

  const permissionAcquired = useCallback(() => {
    return checkAcquired().then((hasPermission) => {
      if (hasPermission) {
        return;
      }
      return requestPermission().then(
        () => {
          setAcquired(true);
          return true;
        },
        () => {
          setAcquired(false);
          return false;
        },
      );
    });
  }, [checkAcquired, setAcquired]);

  return {
    acquired,
    permissionAcquired,
  };
}

export default usePermissionModel;
