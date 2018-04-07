<template>
    <div class="list">
        <el-table :data="list"
                  border
                  style="width: 100%"
                  @row-dblclick="handleDoubleClick"
                  :height="listHeight">
            <el-table-column label="Alias"
                             width="100"
                             :context="_self">
              <template slot-scope="scope">
                <div class="alias">
                    <div v-if="!scope.row.editable">{{ scope.row.alias || '' }}</div>
                    <el-input v-if="scope.row.editable"
                              autofocus
                              :value="scope.row.alias"
                              @blur="updateAlias(arguments[0].target.value, scope.row, arguments[0].target)"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ip"
                             label="IP Address"
                             width="180"></el-table-column>
            <el-table-column prop="domain"
                             label="Domain"></el-table-column>
            <el-table-column :context="_self"
                             label="Oper"
                             width="130">
              <template slot-scope="scope">
                <div class="oper">
                 <el-switch :width="40"
                               v-model="scope.row.enabled"
                               on-color="#13ce66"
                               off-color="#ff4949"
                               on-text=""
                               off-text=""
                               @change="toggle(arguments[0], scope.row)"></el-switch>
                    <el-button size="medium" 
                               type="text"
                               icon="el-icon-delete"
                               @click="deleteItem(scope.row)"></el-button>
                </div>
              </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { eraseGetter } from '../util/object'

const getCell = function(event) {
  let cell = event.target

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (cell.tagName.toUpperCase() === 'TD') {
      return cell
    }
    cell = cell.parentNode
  }

  return null
}

export default {
  beforeDestroy() {
    window.removeEventListener('resize')
  },
  data() {
    return {
      list: this.getList(),
      listHeight: window.innerHeight - 30 - 60 - 36
    }
  },
  methods: {
    copyText(cell) {
      const txt = cell.querySelector('.cell').innerHTML
      require('electron').clipboard.writeText(txt)
      this.$message({
        message: `[${txt}] copied`,
        showClose: true
      })
    },
    deleteItem(item) {
      this.$confirm('Are you sure deleting this rule?', 'Confirm', { type: 'warning' }).then(
        () => {
          this.$emit('delete', eraseGetter(item))
        },
        () => {}
      )
    },
    getList() {
      const list = eraseGetter(this.data)
      list.forEach(l => {
        l.enabled = !l.disabled
        l.editable = false
        l.alias = l.alias || ''
      })
      return list
    },
    handleDoubleClick(row, event) {
      const cell = getCell(event)
      if (cell.querySelector('.alias')) {
        return this.showEditAlias(row, cell)
      }
      if (!cell.querySelector('.oper')) {
        return this.copyText(cell)
      }
    },

    showEditAlias(row, cell) {
      row.editable = true
      this.$nextTick(() => {
        const input = cell.querySelector('input')
        input.style.border = 'none'
        input.focus()
      })
    },

    toggle(e, item) {
      this.$emit('toggle', eraseGetter(item))
    },

    updateAlias(val, row, elm) {
      if (!/^\w{0,15}$/.test(val)) {
        elm.focus()
        return this.$message({
          message: 'Invalid alias, only <=15 numbers & english characters are acceptable',
          type: 'warning'
        })
      }
      row.editable = false
      this.$emit('alias', {
        alias: val,
        host: eraseGetter(row)
      })
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.listHeight = window.innerHeight - 30 - 60 - 36
    })
  },
  props: {
    data: {
      required: true,
      type: Array
    }
  },
  watch: {
    data() {
      this.list = this.getList()
    }
  }
}
</script>

<style scoped>
.list {
  flex-grow: 5;
}

.oper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
