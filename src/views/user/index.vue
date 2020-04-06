<template>
  <div class="app-container">
    <el-input v-model="queryInfo.query" placeholder="搜索用户名关键字" style="margin-bottom:30px; width: 70%" />
    <el-button type="primary" @click="queryuser">搜索</el-button>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="用户名"
        prop="userName">
      </el-table-column>
      <el-table-column
        label="用户邮箱"
        prop="userEmail">
      </el-table-column>
      <el-table-column
        label="是否在黑名单">
        <template slot-scope="scope">
          <p v-if="scope.row.inBlack === 1">是</p>
          <p v-if="scope.row.inBlack === 0">否</p>
        </template>
      </el-table-column>
      <el-table-column
        label="是否为版主">
        <template slot-scope="scope">
          <p v-if="scope.row.isOwner === 1">是</p>
          <p v-if="scope.row.isOwner === 0">否</p>
          <p v-if="scope.row.isOwner === 2">管理员</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="right">
        <template slot-scope="scope">
          <div type="display:inline;" v-if="scope.row.isOwner !== 2">
          <el-button
            size="mini"
            type="danger"
            @click="updateBlack(scope.row.userID)" >
            <p v-if="scope.row.inBlack === 1" >移除黑名单</p>
            <p v-if="scope.row.inBlack === 0">加入黑名单</p>
          </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :page-size.sync= "queryInfo.pageSize"
      :total="total"
      :current-page="queryInfo.pageNum"
      @prev-click="prevclick()"
      @next-click="nextclick()"
      @current-change="currentchange"
      >
    </el-pagination>
  </div>
</template>

<script>
import { getlist, updateBlack } from '@/api/user'
import { MessageBox } from 'element-ui'
export default {

  data() {
    return {
      filterText: '',
      total: 0,
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      list: null
    }
  },
  watch: {
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getlist(this.queryInfo).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
        this.list = []
        this.total = 0
      })
    },
    prevclick() {
      this.queryInfo.pageNum -= 1
      this.getUserList()
    },
    nextclick() {
      this.queryInfo.pageNum += 1
      this.getUserList()
    },
    currentchange(current) {
      this.queryInfo.pageNum = current
      this.getUserList()
    },
    queryuser() {
      this.getUserList()
    },
    updateBlack(id) {
      this.$confirm('确定进行此操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateBlack(id).then(() => {
          this.getUserList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消成功'
        })
      })
    }
  }
}
</script>

