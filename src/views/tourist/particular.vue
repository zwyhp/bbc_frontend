<template>
  <div class="app-container">
    <div id="main">
      <el-container>
        <el-header>
          <div class="top">
            <span>帖子详情</span>
          </div>
        </el-header>
        <el-main>
          <div>
            <div>
              <div style="width: 298px;" >
                <span>发帖人：{{message.guestName}}</span>
                <br/>
                <span>所在板块：{{message.messKind}}</span>
                <br/>
                <span>发帖时间：{{message.messageTime}}</span>
              </div>
              <div class="b" >
                <span><h3> 内容：</h3>
                  {{message.messageContent}}</span>
                <br/><br/>
                <span >
                  <h3> 自我回复：：</h3>{{message.reply}}</span>
              </div>
            </div>
            <div class="center" >
              <el-form  status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="评论" prop="pass" style="width: 600px;">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="addcomment.commentContent">
                  </el-input>
                </el-form-item>
                <el-form-item style="margin-left: 150px;">
                  <el-button type="primary" @click="addcomment1" >提交</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="margin-top: 100px;">
            <template>
              <el-table
                :data="comment"
                border
                style="width: 100%">
                <el-table-column
                  prop="commentTime"
                  label="日期"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="commentUser"
                  label="姓名"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="commentContent"
                  label="回复内容">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-main>

      </el-container>
      <el-pagination
        layout="prev, pager, next"
        :page-size.sync="querycom.pageSize"
        :total="totalcom"
        :current-page="querycom.pageNum"
        @prev-click="prevclick2()"
        @next-click="nextclick1()"
        @current-change="currentchange2"
      />
    </div>
  </div>
</template>

<script>
import { getcomment, getmessageid, addComment } from '@/api/message'
import { MessageBox } from 'element-ui'

export default {
  data() {
    return {
      addcomment: {
        commentContent: '',
        messageId: 0
      },
      querycom: {
        messageId: 0,
        pageNum: 1,
        pageSize: 10
      },
      totalcom: 0,
      message: null,
      comment: null
    }
  },
  watch: {
  },
  created() {
    this.querycom.messageId = this.$route.params.id
    this.addcomment.messageId = this.$route.params.id
    this.getMessageid(this.querycom.messageId)
    this.getComment()
  },
  methods: {
    prevclick2() {
      this.querycom.pageNum -= 1
      this.getComment()
    },
    nextclick1() {
      this.querycom.pageNum += 1
      this.getComment()
    },
    currentchange2(current) {
      this.querycom.pageNum = current
      this.getComment()
    },
    getComment() {
      getcomment(this.querycom).then(res => {
        this.comment = res.data.list
        this.totalcom = res.data.total
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    reset() {
      this.addcomment.commentContent = ''
    },
    getMessageid(id) {
      getmessageid(id).then(res => {
        this.message = res.data
      }).catch(() => {
        MessageBox.alert('查询失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    addcomment1() {
      addComment(this.addcomment).then(() => {
        MessageBox.alert('评论成功', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
        this.getComment()
      }).catch(() => {
        MessageBox.alert('评论失败', '警告', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
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

  .divleft .el-input__inner{
    height:60px;
    width: 120px;
  }
  .b{
    height: 500px;
    margin-left: 300px;
  }
  .center{
    margin-top:30px ;
    margin-left: 200px;
  }
  .top{
    text-align: center;
    background-color: #42B983;
  }
  .top span{
    font-size: 50px;
  }
</style>

