import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocalStorageState } from '@umijs/hooks'
import hostile from 'hostile'
import { IHost, IAlias } from '@/IType'

const ALIAS_PREFIX = 'hosts_alias'

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!key) {
    return defaultValue
  }
  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return defaultValue
  }
  return JSON.parse(raw)
}

const DISABLED_HOSTS_KEY = `${ALIAS_PREFIX}_disabledHosts`
const ALIAS_KEY = `${ALIAS_PREFIX}_aliases`

function useHostsModel() {
  const [sysHosts, setSysHosts] = useState<IHost[]>([])
  const [disabledHosts, setDisabledHosts] = useLocalStorageState<IHost[]>(DISABLED_HOSTS_KEY, [])
  const [aliases, setAliases] = useLocalStorageState<IAlias>(ALIAS_KEY, {})

  const hosts = useMemo(() => sortWithDisabledHosts(sysHosts, disabledHosts), [sysHosts, disabledHosts])

  const addDisabledHost = useCallback(
    (host: IHost) => {
      return new Promise((resolve, reject) => {
        const disabledHosts = getFromStorage<IHost[]>(DISABLED_HOSTS_KEY, [])
        const isDefined = disabledHosts.some((h) => h.ip === host.ip && h.domain === host.domain)
        if (isDefined) {
          return reject(`host [${host.ip} ${host.domain}] has been used`)
        }
        setDisabledHosts((disabledHosts) => [...disabledHosts!, { ...host, disabled: true }])
        return resolve()
      })
    },
    [setDisabledHosts]
  )

  const addSysHost = useCallback(
    (host: IHost) => {
      return new Promise((resolve, reject) => {
        hostile.get(false, (err, lines) => {
          const isDefined = lines.some((line) => line[0] === host.ip && line[1] === host.domain)
          if (isDefined) {
            return reject(`host [${host.ip} ${host.domain}] has been used`)
          }

          hostile.set(host.ip, host.domain, (err) => {
            if (err) {
              return reject(`Failed to add [${host.ip} ${host.domain}]: ${err.message}`)
            }
            setAliases({ ...aliases, [host.ip + host.domain]: host.alias })
            setSysHosts((sysHosts) => [
              ...sysHosts,
              { ...host, disabled: false, alias: aliases[host.ip + host.domain] },
            ])
            resolve()
          })
        })
      })
    },
    [setSysHosts, setAliases, aliases]
  )

  const createHost = useCallback(
    (host: IHost) => {
      if (host.disabled) {
        return addDisabledHost(host)
      }
      return addSysHost(host)
    },
    [addDisabledHost, addSysHost]
  )

  const deleteDisabledHost = useCallback(
    (host: IHost) => {
      return new Promise((resolve) => {
        setDisabledHosts((disabledHosts) =>
          disabledHosts!.filter((h) => !(h.ip === host.ip && h.domain === host.domain))
        )
        return resolve()
      })
    },
    [setDisabledHosts]
  )

  const deleteSysHost = useCallback(
    (host: IHost) => {
      return new Promise((resolve, reject) => {
        hostile.remove(host.ip, host.domain, (err) => {
          if (err) {
            return reject(`Failed to delete [${host.ip} ${host.domain}]: ${err.message}`)
          }
          setSysHosts((sysHosts) => sysHosts.filter((h) => !(h.ip === host.ip && h.domain === host.domain)))
          resolve()
        })
      })
    },
    [setSysHosts]
  )

  const removeHost = useCallback(
    (host: IHost) => {
      if (host.disabled) {
        return deleteDisabledHost(host)
      }
      return deleteSysHost(host)
    },
    [deleteDisabledHost, deleteSysHost]
  )

  const modifyHost = useCallback(
    (oldHost: IHost, newHost: IHost) => {
      return new Promise((resolve, reject) => {
        if (newHost.ip === oldHost.ip && newHost.domain === oldHost.domain && newHost.alias === oldHost.alias) {
          return resolve()
        }

        if (newHost.ip !== oldHost.ip || newHost.domain !== oldHost.domain) {
          const foundExist = hosts.find((h) => h.ip === newHost.ip && h.domain === newHost.domain)
          if (foundExist) {
            return reject('ip/domain/alias might be used by other host')
          }
        }

        if (newHost.disabled) {
          setDisabledHosts(
            disabledHosts.map((h) => {
              if (h.ip === oldHost.ip && h.domain === oldHost.domain) {
                return newHost
              }
              return h
            })
          )
          return resolve()
        }

        deleteSysHost(oldHost)
          .then((realSysHosts) => addSysHost(newHost))
          .then(resolve, reject)
      })
    },
    [setDisabledHosts, deleteSysHost, addSysHost, disabledHosts, hosts]
  )

  const toggleHostState = useCallback(
    (host: IHost) => {
      const newHost = { ...host, disabled: !host.disabled }
      return new Promise((resolve, reject) => {
        if (host.disabled) {
          return deleteDisabledHost(host)
            .then(() => addSysHost(newHost))
            .then(resolve, reject)
        }
        deleteSysHost(host)
          .then(() => addDisabledHost(newHost))
          .then(resolve, reject)
      })
    },
    [deleteDisabledHost, addSysHost, deleteSysHost, addDisabledHost]
  )

  useEffect(() => {
    getSysHosts(aliases).then((sysHosts) => {
      setSysHosts(sysHosts)
    })
  }, [aliases])

  return {
    hosts,
    createHost,
    toggleHostState,
    removeHost,
    modifyHost,
  }
}

export default useHostsModel

function getSysHosts(aliases: IAlias): Promise<IHost[]> {
  return new Promise(function (resolve, reject) {
    hostile.get(false, function (error, lines) {
      if (error) {
        return reject(error.message)
      }
      const sysHosts = lines.map((line) => {
        const ip = line[0]
        const domain = line[1]
        return {
          ip: ip,
          domain: domain,
          disabled: false,
          alias: aliases[ip + domain] || '',
        }
      })

      resolve(sysHosts)
    })
  })
}

function sortWithDisabledHosts(sysHosts: IHost[], disabledHosts: IHost[]) {
  const hosts = [...sysHosts, ...disabledHosts]
  hosts.sort((a, b) => {
    const aip = a.ip.split('.').map((i) => parseInt(i))
    const bip = b.ip.split('.').map((i) => parseInt(i))
    for (let i = 0; i < aip.length; i++) {
      if (aip[i] < bip[i]) {
        return -1
      } else if (aip[i] > bip[i]) {
        return 1
      }
    }
    return 0
  })
  return hosts
}
