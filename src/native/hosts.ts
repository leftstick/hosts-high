import { HOSTS } from '@/constants';
import { IHost, IPCResponse } from '@/IType';
import { ipcRenderer } from 'electron';
import process from 'process';

const isWindows = process.platform === 'win32';

export async function getSysHosts(): Promise<IHost[]> {
  const response: IPCResponse<IHost[]> = await ipcRenderer.invoke(
    'read_hosts',
    {
      filePath: HOSTS,
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
}

export async function saveHostsFile(hosts: IHost[]): Promise<IHost[]> {
  const content = hosts
    .map((h) => {
      if (h.invalid) {
        return h.ip;
      }
      return `${h.ip} ${h.domain}`;
    })
    .join('\n');

  const response: IPCResponse<null> = await ipcRenderer.invoke('write_hosts', {
    filePath: HOSTS,
    content: content,
  });

  if (!response.success) {
    throw new Error(response.message);
  }

  return getSysHosts();
}

export async function deleteSysHosts(host: IHost): Promise<IHost[]> {
  const osHosts = await getSysHosts();
  const nextHosts = osHosts.filter(
    (h) => h.ip !== host.ip || h.domain !== host.domain,
  );

  return saveHostsFile(nextHosts);
}

export async function addNewSysHost(host: IHost): Promise<IHost[]> {
  const osHosts = await getSysHosts();
  const nextHosts = [...osHosts, host];

  return saveHostsFile(nextHosts);
}

export async function modifySysHost(
  fieldName: keyof IHost,
  value: string,
  from: IHost,
): Promise<IHost[]> {
  const osHosts = await getSysHosts();

  const nextHosts = osHosts.map((h) => {
    if (from.ip === h.ip && from.domain === h.domain) {
      return {
        ...from,
        [fieldName]: value,
      };
    }
    return h;
  });

  return saveHostsFile(nextHosts);
}

export async function isHostFileReadonly() {
  const response: IPCResponse<boolean> = await ipcRenderer.invoke(
    'is_file_readonly',
    { filePath: HOSTS },
  );

  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}

export async function changeHostWritable(password: string): Promise<boolean> {
  const response: IPCResponse<boolean> = await ipcRenderer.invoke(
    'change_file_writable',
    {
      filePath: HOSTS,
      password,
      isWindows,
    },
  );

  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
}
