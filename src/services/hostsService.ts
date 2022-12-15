import hostile from 'hostile';

import { IAlias, IHost } from '@/IType';

export function sortWithDisabledHosts(
  sysHosts: IHost[],
  disabledHosts: IHost[],
) {
  const hosts = [...sysHosts, ...disabledHosts];
  hosts.sort((a, b) => a.domain.localeCompare(b.domain));
  return hosts;
}

export function getSysHosts(aliases: IAlias): Promise<IHost[]> {
  return new Promise(function (resolve, reject) {
    hostile.get(false, function (error, lines) {
      if (error) {
        return reject(error.message);
      }
      const sysHosts = lines.map((line) => {
        const ip = line[0];
        const domain = line[1];
        return {
          ip: ip,
          domain: domain,
          disabled: false,
          alias: aliases[ip + domain] || '',
        };
      });

      resolve(sysHosts);
    });
  });
}
