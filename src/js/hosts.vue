<template>
    <div id="root">
       <quick-add @add="onAdd"></quick-add>
       <hosts-filter @change="filterHosts"></hosts-filter>
       <list :data="hosts" @delete="onDelete" @toggle="onToggle" @alias="onAlias"></list>
    </div>
</template>

<script>
import {hasPermission, prompt} from './secure/Permission';
import {isPermissionSet, addPermission, get, add, remove, toggleDisable, setAlias} from './service/HostsService';

import quickAdd from './ui/quickAdd';
import hostsFilter from './ui/hostsFilter';
import list from './ui/list';

export default {
    data() {
        return {
            rawHosts: [],
            filterTxt: ''
        };
    },
    computed: {
        hosts() {
            return this.rawHosts.filter(h => {
                if (!this.filterTxt) {
                    return true;
                }
                if (h.alias && h.alias.includes(this.filterTxt)) {
                    return true;
                }
                if (h.ip.includes(this.filterTxt)) {
                    return true;
                }
                if (h.domain.includes(this.filterTxt)) {
                    return true;
                }
                return false;
            });
        }
    },
    created() {
        hasPermission()
            .then(() => {}, e => prompt())
            .then(() => {
                if (!isPermissionSet()) {
                    addPermission();
                    require('electron').remote.getCurrentWindow().reload();
                }
            })
            .catch(e => {
                this.$alert(e.message, 'Warning');
            });
        
        this.fetchHosts();
    },

    methods: {
        acquirePermission() {
            return prompt()
                .then(() => {
                    if (!isPermissionSet()) {
                        addPermission();
                    }
                })
                .then(this.fetchHosts)
                .catch((e) => {
                    this.fetchHosts();
                    this.$alert(e.message, 'Warning');
                });
        },
        fetchHosts() {
            get()
                .then(hosts => {
                    this.rawHosts = hosts;
                });
        },
        onAdd(item) {
            add(item)
                .then(this.fetchHosts, this.acquirePermission);
        },
        onDelete(item) {
            remove(item)
                .then(this.fetchHosts, this.acquirePermission);
        },
        onToggle(item) {
            toggleDisable(item)
                .then(this.fetchHosts, this.acquirePermission);
        },
        onAlias(data) {
            setAlias(data.alias, data.host)
                .then(this.fetchHosts);
            
        },
        filterHosts(txt) {
            this.filterTxt = txt;
        }
    },

    components: {
        quickAdd,
        hostsFilter,
        list
    }
};

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