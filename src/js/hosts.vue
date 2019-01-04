<template>
  <div id="root">
    <quick-add @add="onAdd"></quick-add>
    <hosts-filter @change="filterHosts"></hosts-filter>
    <list :data="hosts" @delete="onDelete" @toggle="onToggle" @alias="onAlias"></list>
  </div>
</template>

<script>
import {
  add,
  addPermission,
  get,
  isPermissionSet,
  remove,
  setAlias,
  toggleDisable
} from './service/HostsService'
import { hasPermission, prompt } from './secure/Permission'

import hostsFilter from './ui/hostsFilter'
import list from './ui/list'
import quickAdd from './ui/quickAdd'

export default {
  components: {
    hostsFilter,
    list,
    quickAdd
  },
  computed: {
    hosts() {
      return this.rawHosts.filter(h => {
        if (!this.filterTxt) {
          return true
        }
        if (h.alias && h.alias.includes(this.filterTxt)) {
          return true
        }
        if (h.ip.includes(this.filterTxt)) {
          return true
        }
        if (h.domain.includes(this.filterTxt)) {
          return true
        }
        return false
      })
    }
  },

  created() {
    hasPermission()
      .then(() => {}, e => prompt())
      .then(() => {
        if (!isPermissionSet()) {
          addPermission()
          require('electron')
            .remote.getCurrentWindow()
            .reload()
        }
      })
      .catch(e => {
        this.$alert(e.message, 'Warning')
      })

    this.fetchHosts()
  },

  data() {
    return {
      filterTxt: '',
      rawHosts: []
    }
  },

  methods: {
    acquirePermission() {
      return prompt()
        .then(() => {
          if (!isPermissionSet()) {
            addPermission()
          }
        })
        .then(this.fetchHosts)
        .catch(e => {
          this.fetchHosts()
          this.$alert(e.message, 'Warning')
        })
    },
    fetchHosts() {
      get().then(hosts => {
        this.rawHosts = hosts
      })
    },
    filterHosts(txt) {
      this.filterTxt = txt
    },
    onAdd(item) {
      add(item).then(this.fetchHosts, this.acquirePermission)
    },
    onAlias(data) {
      setAlias(data.alias, data.host).then(this.fetchHosts)
    },
    onDelete(item) {
      remove(item).then(this.fetchHosts, this.acquirePermission)
    },

    onToggle(item) {
      toggleDisable(item).then(this.fetchHosts, this.acquirePermission)
    }
  }
}
</script>

<style scoped>
#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
</style>
