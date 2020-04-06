<template>
  <div class="app-container">
    <div id="main">
      <h1>{{queryInfo.plate}}   板块管理</h1>
      <el-input v-model="queryInfo.query" placeholder="搜索用户名关键字" style="margin-bottom:30px; width: 70%" />
      <el-button type="primary" @click="querymessage">搜索</el-button>
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          label="标题"
          prop="messageTitle"
        />
        <el-table-column
          label="发帖人"
          prop="guestName"
        />
        <el-table-column
          label="所属板块"
          prop="messKind"
        />
        <el-table-column
          label="发帖时间"
          prop="messageTime"
        />
        <el-table-column
          label="查看次数"
          prop="clickNumber"
        />
        <el-table-column
          label="是否审核"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.isPass === 1">是</p>
            <p v-if="scope.row.isPass === 0">否</p>
          </template>
        </el-table-column>
        <el-table-column
          label="是否置顶"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.isTop === 1">是</p>
            <p v-if="scope.row.isTop === 0">否</p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="right"
          width="400"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="getmessageid(scope.row.messageId)"
            >
              <p>查看详细</p>
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="checkmessage(scope.row.messageId)"
            >
              <p v-if="scope.row.isPass === 0">过审</p>
              <p v-if="scope.row.isPass === 1">取消过审</p>
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="stickmessage(scope.row.messageId)"
            >
              <p v-if="scope.row.isTop === 1">取消置顶</p>
              <p v-if="scope.row.isTop === 0">置顶</p>
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deletemessage(scope.row.messageId)"
            >
              <p>删除</p>
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
      <!--查看详细弹窗框的代码段-->
      <el-dialog
        title="帖子详细"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <el-container>
          <el-header><h1 align="center">标题： {{ message.messageTitle }}</h1></el-header>
          <el-container>
            <el-aside width="200px">
              <el-form ref="form" :model="message" label-width="90px">
                <el-form-item label="发帖人">
                  <el-input v-model="message.guestName" :disabled="true">111111</el-input>
                </el-form-item>
                <el-form-item label="发帖时间">
                  <el-input v-model="message.messageTime" :disabled="true">111111111</el-input>
                </el-form-item>
                <el-form-item label="所属板块">
                  <el-input v-model="message.messKind" :disabled="true">111111</el-input>
                </el-form-item>
                <el-form-item label="被查看次数">
                  <el-input v-model="message.clickNumber" :disabled="true">111111</el-input>
                </el-form-item>
              </el-form>
            </el-aside>
            <el-main>
              <p>{{ message.messageContent }}</p>
              <br><p>楼主回复</p><br>
              <p>{{ message.reply }}</p>
            </el-main>
          </el-container>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMessage, checkMessage, stickMessage, deleteMessage, getMessageid } from '@/api/owner'
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      message: {
        messageId: '',
        guestName: '',
        messageContent: '',
        messageTime: '',
        reply: '',
        isPass: '',
        messKind: '',
        messageTitle: '',
        clickNumber: '',
        isTop: '',
        lastCommentTime: ''
      },
      filterText: '',
      total: 0,
      queryInfo: {
        plate: '',
        query: '',
        pageNum: 1,
        pageSize: 8
      },
      list: null,
      dialogVisible: false
    }
  },
  created() {
    this.queryInfo.plate = this.$route.params.category
    this.getmessage()
  },
  methods: {
    getmessage() {
      getMessage(this.queryInfo).then(response => {
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
      this.getmessage()
    },
    nextclick() {
      this.queryInfo.pageNum += 1
      this.getmessage()
    },
    currentchange(current) {
      this.queryInfo.pageNum = current
      this.getmessage()
    },
    querymessage() {
      this.getmessage()
    },
    checkmessage(id) {
      checkMessage(id).then(() => {
        MessageBox.alert('操作成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        this.getmessage()
      }).catch(() => {
        MessageBox.alert('操作失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    stickmessage(id) {
      stickMessage(id).then(() => {
        MessageBox.alert('操作成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        this.getmessage()
      }).catch(() => {
        MessageBox.alert('操作失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    deletemessage(id) {
      deleteMessage(id).then(() => {
        MessageBox.alert('删除成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        this.getmessage()
      }).catch(() => {
        MessageBox.alert('删除失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    getmessageid(id) {
      getMessageid(id).then(res => {
        this.message = res.data
        this.dialogVisible = true
      }).catch(() => {
        MessageBox.alert('查看失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    }
  }
}
</script>

