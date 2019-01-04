<template>
  <div class="hosts-filter">
    <el-input placeholder="Type anything as filter..." @change="change"></el-input>
  </div>
</template>

<script>
import { debounce } from '../util/method'

export default {
  methods: {
    change: debounce(function(txt) {
      this.$emit('change', txt)
    }, 300)
  }
}
</script>

<style scoped>
.hosts-filter {
  flex-shrink: 0;
}
</style>
