import { useState, useMemo, useEffect, useCallback } from 'react'
import { createModel } from 'hox'
import { useLocalStorageState } from '@umijs/hooks'
import hostile from 'hostile'

const ALIAS_PREFIX = 'hosts_alias'

function useHostsModel() {
  const [sysHosts, setSysHosts] = useState([])
  const [disabledHosts, setDisabledHosts] = useLocalStorageState(`${ALIAS_PREFIX}_disabledHosts`, [])
  const [aliases, setAliases] = useLocalStorageState(`${ALIAS_PREFIX}_aliases`, {})

  const hosts = useMemo(() => sortWithDisabledHosts(sysHosts, disabledHosts), [sysHosts, disabledHosts])

  const addDisabledHost = useCallback(
    host => {
      return new Promise((resolve, reject) => {
        const isDefined = disabledHosts.some(h => h.ip === host.ip && h.domain === host.domain)
        if (isDefined) {
          return reject(`host [${host.ip} ${host.domain}] has been used`)
        }
        const temp = [...disabledHosts, { ...host, disabled: true }]
        setDisabledHosts(temp)
        return resolve(temp)
      })
    },
    [disabledHosts, setDisabledHosts]
  )

  const addSysHost = useCallback(
    (host, realSysHosts) => {
      return new Promise((resolve, reject) => {
        const neededSysHosts = realSysHosts || sysHosts
        const isDefined = neededSysHosts.some(h => h.ip === host.ip && h.domain === host.domain)
        if (isDefined) {
          return reject(`host [${host.ip} ${host.domain}] has been used`)
        }
        hostile.set(host.ip, host.domain, err => {
          if (err) {
            return reject(`Failed to add [${host.ip} ${host.domain}]: ${err.message}`)
          }
          if (host.alias) {
            setAliases({ ...aliases, [host.ip + host.domain]: host.alias })
          }
          const temp = [...neededSysHosts, { ...host, disabled: false }]
          setSysHosts(temp)
          resolve(temp)
        })
      })
    },
    [sysHosts, setSysHosts, setAliases, aliases]
  )

  const createHost = useCallback(
    host => {
      if (host.disabled) {
        return addDisabledHost(host)
      }
      return addSysHost(host)
    },
    [addDisabledHost, addSysHost]
  )

  const deleteDisabledHost = useCallback(
    host => {
      return new Promise(resolve => {
        const temp = disabledHosts.filter(h => !(h.ip === host.ip && h.domain === host.domain))
        setDisabledHosts(temp)
        return resolve(temp)
      })
    },
    [disabledHosts, setDisabledHosts]
  )

  const deleteSysHost = useCallback(
    host => {
      return new Promise((resolve, reject) => {
        hostile.remove(host.ip, host.domain, err => {
          if (err) {
            return reject(`Failed to delete [${host.ip} ${host.domain}]: ${err.message}`)
          }
          const temp = sysHosts.filter(h => !(h.ip === host.ip && h.domain === host.domain))
          setSysHosts(temp)
          resolve(temp)
        })
      })
    },
    [sysHosts, setSysHosts]
  )

  const removeHost = useCallback(
    host => {
      if (host.disabled) {
        return deleteDisabledHost(host)
      }
      return deleteSysHost(host)
    },
    [deleteDisabledHost, deleteSysHost]
  )

  const modifyHost = useCallback(
    (oldHost, newHost) => {
      return new Promise((resolve, reject) => {
        if (newHost.ip === oldHost.ip && newHost.domain === oldHost.domain && newHost.alias === oldHost.alias) {
          return resolve()
        }

        if (newHost.ip !== oldHost.ip || newHost.domain !== oldHost.domain) {
          const foundExist = hosts.find(h => h.ip === newHost.ip && h.domain === newHost.domain)
          if (foundExist) {
            return reject('ip/domain/alias might be used by other host')
          }
        }

        if (newHost.disabled) {
          setDisabledHosts(
            disabledHosts.map(h => {
              if (h.ip === oldHost.ip && h.domain === oldHost.domain) {
                return newHost
              }
              return h
            })
          )
          return resolve()
        }

        deleteSysHost(oldHost)
          .then(realSysHosts => addSysHost(newHost, realSysHosts))
          .then(resolve, reject)
      })
    },
    [setDisabledHosts, deleteSysHost, addSysHost, disabledHosts, hosts]
  )

  const toggleHostState = useCallback(
    host => {
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
    getSysHosts(aliases).then(sysHosts => {
      setSysHosts(sysHosts)
    })
  }, [aliases])

  return {
    hosts,
    createHost,
    toggleHostState,
    removeHost,
    modifyHost
  }
}

export default createModel(useHostsModel)

function getSysHosts(aliases) {
  return new Promise(function(resolve, reject) {
    hostile.get(false, function(error, lines) {
      if (error) {
        return reject(error.message)
      }
      const sysHosts = lines.map(line => {
        const ip = line[0]
        const domain = line[1]
        return {
          ip: ip,
          domain: domain,
          disabled: false,
          alias: aliases[ip + domain] || ''
        }
      })

      resolve(sysHosts)
    })
  })
}

function sortWithDisabledHosts(sysHosts, disabledHosts) {
  const hosts = [...sysHosts, ...disabledHosts]
  hosts.sort((a, b) => {
    const aa = a.ip.split('.')
    const bb = b.ip.split('.')
    return (
      aa[0] * 0x1000000 +
      aa[1] * 0x10000 +
      aa[2] * 0x100 +
      aa[3] * 1 -
      (bb[0] * 0x1000000 + bb[1] * 0x10000 + bb[2] * 0x100 + bb[3] * 1)
    )
  })
  return hosts
}
