import { IHost } from '@/IType';
import {
  changeHostField,
  createHost,
  getAllHosts,
  removeHost,
} from '@/services';

import { useCallback, useEffect, useState } from 'react';

function useHostsModel() {
  const [hosts, setHosts] = useState<IHost[]>([]);

  const addHost = useCallback(
    async (host: IHost) => {
      const data = await createHost(host);
      setHosts(data);
      return data;
    },
    [setHosts],
  );

  const delHost = useCallback(
    async (host: IHost) => {
      const data = await removeHost(host);
      setHosts(data);
      return data;
    },
    [setHosts],
  );

  const modifyHostField = useCallback(
    async (
      fieldName: keyof IHost,
      value: string | boolean,
      originalHost: IHost,
    ) => {
      const data = await changeHostField(fieldName, value, originalHost);
      setHosts(data);
    },
    [setHosts],
  );

  useEffect(() => {
    getAllHosts().then((data) => {
      setHosts(data);
    });
  }, [setHosts]);

  return {
    hosts,
    addHost,
    delHost,
    modifyHostField,
  };
}

export default useHostsModel;
