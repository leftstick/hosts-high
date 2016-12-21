<template>
    <div class="quick-add">
        <el-form ref="quickAdd" :inline="true" :model="item" :rules="rule" @keyup.native.enter.stop.prevent="onSubmit" @submit.native.prevent>
            <el-form-item prop="alias">
                <el-input v-model="item.alias" placeholder="Alias"></el-input>
            </el-form-item>
            <el-form-item prop="ip">
                <el-input v-model="item.ip" placeholder="IP Address"></el-input>
            </el-form-item>
            <el-form-item class="domain" prop="domain">
                <el-input v-model="item.domain" placeholder="Domain names"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="default" icon="plus" @click="onSubmit"></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {eraseGetter} from '../util/object';

export default {
    data() {
        return {
            item: {
                alias: '',
                ip: '',
                domain: ''
            },
            rule: {
                alias: [{
                    validator: (rule, value, cb) => {
                        if (!/^\w{0,15}$/.test(value)) {
                            return cb(new Error('Invalid alias'));
                        }
                        cb();
                    }
                }],
                ip: [{
                    validator: (rule, value, cb) => {
                        if (!/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
                            return cb(new Error('Invalid ip address'));
                        }
                        cb();
                    }
                }],
                domain: [{
                    validator: (rule, value, cb) => {
                        if (!/^[\w-\.\s]{1,50}$/.test(value)) {
                            return cb(new Error('Invalid domain names, should be space-separated list'));
                        }
                        cb();
                    }
                }]
            }
        };
    },

    methods: {
        onSubmit() {
            this.$refs.quickAdd.validate(valid => {
                if (!valid) {
                    return false;
                }
                this.$emit('add', eraseGetter(this.item));
                this.$refs.quickAdd.resetFields();
            });
        }
    }
};

</script>

<style scoped>
    .quick-add {
        width: 100%;
        display: flex;
        justify-content: start;
        flex-shrink: 0;
    }
    .domain {
        width: 260px;
    }
</style>