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

  const createHost = useCallback(
    host => {
      return new Promise((resolve, reject) => {
        const isDefined = hosts.some(h => h.ip === host.ip && h.domain === host.domain && h.disabled === host.disabled)
        if (isDefined) {
          return reject(`host [${host.ip} ${host.domain}] has been used`)
        }
        if (host.disabled) {
          setDisabledHosts([...disabledHosts, host])
          return resolve()
        }
        hostile.set(host.ip, host.domain, err => {
          if (err) {
            return reject(`Failed to add [${host.ip} ${host.domain}]: ${err.message}`)
          }
          if (host.alias) {
            setAliases({ ...aliases, [host.ip + host.domain]: host.alias })
          }
          setSysHosts([...sysHosts, host])
          resolve()
        })
      })
    },
    [disabledHosts, sysHosts, aliases, setAliases, hosts, setDisabledHosts]
  )

  const removeHost = useCallback(
    host => {
      return new Promise((resolve, reject) => {
        if (host.disabled) {
          setDisabledHosts(disabledHosts.filter(h => h.ip !== host.ip && h.domain !== host.domain))
          return resolve()
        }
        hostile.remove(host.ip, host.domain, err => {
          if (err) {
            return reject(`Failed to delete [${host.ip} ${host.domain}]: ${err.message}`)
          }
          setSysHosts(sysHosts.filter(h => !(h.ip === host.ip && h.domain === host.domain)))
          resolve()
        })
      })
    },
    [disabledHosts, setDisabledHosts, sysHosts]
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
              if (h.ip === newHost.ip && h.domain === newHost.domain) {
                return newHost
              }
              return h
            })
          )
          return resolve()
        }

        removeHost(oldHost)
          .then(() => createHost(newHost))
          .then(resolve, reject)
      })
    },
    [disabledHosts, setDisabledHosts, createHost, hosts, removeHost]
  )

  const toggleHostState = useCallback(
    host => {
      const newHost = { ...host, disabled: !host.disabled }
      return new Promise((resolve, reject) => {
        if (host.disabled) {
          setDisabledHosts(disabledHosts.filter(h => h.ip !== host.ip && h.domain !== host.domain))
          return createHost(newHost).then(resolve, reject)
        }
        removeHost(host).then(() => {
          setDisabledHosts([...disabledHosts, newHost])
          resolve()
        }, reject)
      })
    },
    [disabledHosts, createHost, removeHost, setDisabledHosts]
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
