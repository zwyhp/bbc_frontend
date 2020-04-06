<template>
  <div class="app-container">
    <div id="main">
      <el-container>
        <el-aside width="205px">
          <div style="width: 200px; margin-top: 75px">
            <el-table
              :data="category"
              style="width: 90%">
              <el-table-column
                prop="category"
                label="板块"
                width="100">
              </el-table-column>
              <el-table-column
                label="操作"
                align="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="click(scope.row.category)"
                    round>
                    查询
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              用户名：{{username}}
              <el-button v-show="show" type="primary" @click="dialogVisible = true" >发布帖子</el-button>
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-header align="center"><h2>TOP10</h2></el-header>
          <el-main>
            <el-table
              :data="top10"
              style="width: 100%">
              <el-table-column
                label="标题"
                prop="messageTitle"
              />
              <el-table-column
                label="发帖人"
                prop="guestName"
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
                label="操作"
                align="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="indetail(scope.row.messageId)"
                    round>
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <h3 align="center">最新帖子</h3>
            <el-input v-model="queryInfo.query" placeholder="搜索标题关键字" style="margin-bottom:30px; width: 70%" />
            <el-button type="primary" @click="getmessage">搜索</el-button>
            <el-table
              :data="messages"
              style="width: 100%">
              <el-table-column
                label="标题"
                prop="messageTitle"
              />
              <el-table-column
                label="发帖人"
                prop="guestName"
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
                label="操作"
                align="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="indetail(scope.row.messageId)"
                    round>
                    详情
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
          </el-main>
        </el-container>
      </el-container>
    </div>
    <el-dialog
      title="发布帖子"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="cancel">
      >
      <el-form ref="form" :model="message" label-width="80px">
        <el-form-item label="帖子标题">
          <el-input v-model="message.messageTitle"></el-input>
        </el-form-item>
        <el-form-item label="帖子正文">
          <el-input type="textarea" v-model="message.messageContent"></el-input>
        </el-form-item>
        <el-form-item label="帖子回复">
          <el-input type="textarea" v-model="message.reply"></el-input>
        </el-form-item>
        <el-form-item label="版块名">
          <el-input
            placeholder="请选择板块"
            v-model="message.messKind"
            :disabled="true">
          </el-input>
          <el-popover
            placement="right"
            width="700"
            trigger="click">
            <el-table :data="category">
              <el-table-column width="150" property="category" label="用户名"></el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="setcate(scope.row.category)" >
                    选择
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button slot="reference">选择</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addmessage">创建/修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getcategory } from '@/api/category'
import { messagetop, getMessage, addMessage } from '@/api/message'
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      queryInfo: {
        plate: '',
        query: '',
        pageNum: 1,
        pageSize: 2
      },
      querytop: {
        query: ''
      },
      total: 0,
      category: null,
      top10: null,
      messages: null,
      username: '',
      show: false,
      message: {
        guestName: '',
        messageTitle: '',
        messageContent: '',
        reply: '',
        messKind: ''
      },
      dialogVisible: false
    }
  },
  watch: {
  },
  created() {
    this.getcategory1()
    this.getTop10()
    this.getmessage()
    this.getusername()
  },
  methods: {
    getcategory1() {
      getcategory().then(res => {
        this.category = res.data
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    getmessage() {
      getMessage(this.queryInfo).then(res => {
        this.messages = res.data.list
        this.total = res.data.total
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
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
    getTop10() {
      messagetop(this.querytop).then(res => {
        this.top10 = res.data
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    click(category) {
      this.queryInfo.plate = category
      this.querytop.query = category
      this.getTop10()
      this.getmessage()
    },
    indetail(id) {
      this.$router.push({ name: 'particular', params: { id: id }})
    },
    addmessage() {
      this.message.guestName = this.username
      addMessage(this.message).then(() => {
        this.cancel()
        MessageBox.alert('发布成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        this.getmessage()
      }).catch(response => {
        this.cancel()
        MessageBox.alert('发布失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    getusername() {
      this.username = this.$store.getters.name
      if (this.$store.getters.role !== -1) {
        this.show = true
      }
    },
    setcate(cate) {
      this.message.messKind = cate
    },
    cancel() {
      this.message.messageTitle = ''
      this.message.messageContent = ''
      this.message.reply = ''
      this.message.messKind = ''
      this.dialogVisible = false
    }
  }
}
</script>

<style>
  #main{
    width: 1280px;
    height: 980px;
    margin:100px auto;
  }
</style>

