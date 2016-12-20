<template>
    <div id="root">
       fucksdfsdfdsfs
    </div>
</template>

<script>
import {hasPermission, prompt} from './secure/Permission';
import {isPermissionSet, addPermission} from './service/HostsService';

export default {
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
    }
};

</script>

<style scoped>
    #root {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
        background-color: #f8f8f8;
    }
    
    #view {
        flex-grow: 10;
        display: flex;
        flex-direction: column;
    }
</style>