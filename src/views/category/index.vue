<template>
  <div class="app-container">
    <el-col :span="8">
      <el-card shadow="always">
        <el-input v-model="queryInfo.query" placeholder="搜索用户名关键字" style="margin-bottom:30px; width: 70%" />
        <el-button type="primary" @click="queryCategory">搜索</el-button>
        <el-button type="text" @click="dialogVisible = true">添加版块</el-button>
        <el-table
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            label="版块名"
            prop="category"
          />
          <el-table-column
            label="版主名"
            prop="categoryOwner"
          />
          <el-table-column
            label="操作"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="update(scope.row)"
              round>
                修改
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delete1(scope.row.categoryId)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size.sync="queryInfo.pageSize"
          :total="total"
          :current-page="queryInfo.pageNum"
          @prev-click="prevclick()"
          @next-click="nextclick()"
          @current-change="currentchange"
        />
      </el-card>
    </el-col>

    <el-dialog
      title="添加或修改版块"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="cancel">
    >
      <el-form ref="form" :model="tcategory" label-width="80px">
        <el-form-item label="版块名">
          <el-input v-model="tcategory.category"></el-input>
        </el-form-item>
        <el-form-item label="版主名">
          <el-input
            placeholder="请选择版主"
            v-model="tcategory.categoryOwner"
            :disabled="true">
          </el-input>
          <el-popover
            placement="right"
            width="700"
            trigger="click">
            <el-input v-model="queryInfo2.query" placeholder="搜索用户名关键字" style="margin-bottom:30px; width: 70%" />
            <el-button @click="getuser">搜索</el-button>
            <el-table :data="user">
              <el-table-column width="150" property="userName" label="用户名"></el-table-column>
              <el-table-column width="100" property="userEmail" label="用户邮箱"></el-table-column>
              <el-table-column
                label="是否为版主">
                <template slot-scope="scope">
                  <p v-if="scope.row.isOwner === 1">是</p>
                  <p v-if="scope.row.isOwner === 0">否</p>
                  <p v-if="scope.row.isOwner === 2">管理员</p>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
              <template slot-scope="scope">
                <div type="display:inline;" v-if="scope.row.isOwner !== 2">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="setOwner(scope.row.userName)" >
                    选择
                  </el-button>
                </div>
              </template>
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :page-size.sync= "queryInfo2.pageSize"
              :total="total2"
              :current-page="queryInfo2.pageNum"
              @prev-click="prevclick2()"
              @next-click="nextclick2()"
              @current-change="currentchange2"
            >
            </el-pagination>
            <el-button slot="reference" @click="getuser">选择</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addcategory">创建/修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addCategory, updateCategory, getCategory, deleteCategory } from '@/api/category'
import { getlist } from '@/api/user'
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      tcategory: {
        categoryId: 0,
        category: '',
        categoryOwner: ''
      },
      filterText: '',
      total: 0,
      total2: 0,
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      list: null,
      dialogVisible: false,
      queryInfo2: {
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      user: null
    }
  },
  watch: {
  },
  created() {
    this.getcategory()
  },
  methods: {
    getcategory() {
      getCategory(this.queryInfo).then(response => {
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
      this.getcategory()
    },
    nextclick() {
      this.queryInfo.pageNum += 1
      this.getcategory()
    },
    currentchange(current) {
      this.queryInfo.pageNum = current
      this.getcategory()
    },
    queryCategory() {
      this.getcategory()
    },
    getuser() {
      getlist(this.queryInfo2).then(response => {
        this.user = response.data.list
        this.total2 = response.data.total
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    prevclick2() {
      this.queryInfo2.pageNum -= 1
      this.getuser()
    },
    nextclick2() {
      this.queryInfo2.pageNum += 1
      this.getuser()
    },
    currentchange2(current) {
      this.queryInfo2.pageNum = current
      this.getuser()
    },
    addcategory() {
      if (this.tcategory.categoryId === 0) {
        addCategory(this.tcategory).then(() => {
          this.cancel()
          MessageBox.alert('添加成功', '提示', {
            confirmButtonText: '确定',
            type: 'info'
          })
        }).catch(response => {
          this.cancel()
        })
      } else {
        this.updatecategoty()
      }
    },
    setOwner(userName) {
      this.tcategory.categoryOwner = userName
    },
    update(category) {
      this.tcategory = category
      this.dialogVisible = true
    },
    updatecategoty() {
      updateCategory(this.tcategory).then(() => {
        this.cancel()
        MessageBox.alert('修改成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
      }).catch(response => {
        this.cancel()
      })
    },
    delete1(id) {
      this.$confirm('确定删除此版块', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(id).then(() => {
          this.getcategory()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    cancel() {
      this.tcategory.categoryId = 0
      this.tcategory.category = ''
      this.tcategory.categoryOwner = ''
      this.dialogVisible = false
      this.getcategory()
    }
  }
}
</script>

<style scoped>

</style>

