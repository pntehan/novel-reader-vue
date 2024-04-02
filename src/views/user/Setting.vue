<template>
  <div id="home">
    <Navbar>
      <template #default> 信息管理 </template>
    </Navbar>
    <!-- 滚动外壳 -->
    <div class="home-wrapper">
      <!-- 内容区 -->
      <div class="home-content">
        <!-- 信息栏 -->
        <van-form @submit="onSubmit" style="margin: 50px auto 0;">
          <van-cell-group inset>
            <van-field
              v-model="user.name"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="user.email"
              name="邮箱"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]"
              disabled
            />
            <van-field
              v-model="user.intro"
              name="个性签名"
              label="个性签名"
              placeholder="个性签名"
              :rules="[{ required: true, message: '请填写个性签名' }]"
            />
            <van-field
              v-model="user.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
              v-model="confirm_pwd"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="确认密码"
              :rules="[{ required: true, message: '请再次填写密码' }]"
            />
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import { userUpdate } from '@/api/user'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Search",
  components: {
    Navbar,
  },

  data() {
    return{
      user: {
        name: '',
        email: '',
        password: '',
        intro: ''
      },
      confirm_pwd: ''
    }
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.confirm_pwd = this.user.password
  },

  methods: {
    onSubmit() {
      if (!this.user.name) {
        alert('请输入用户名')
        return
      }
      if (!this.user.email) {
        alert('请输入邮箱')
        return
      }
      if (!this.user.password) {
        alert('请输入密码')
        return
      }
      if (this.user.password != this.confirm_pwd) {
        alert('两次密码不一致')
        return
      }
      userUpdate(this.user).then((res) => {
        this.user = res.data
      })
    }
  }
};
</script>

<style lang="less" scoped>
#home {
  position: relative;
  height: 100vh;
  width: 100vw;
  .home-wrapper {
    position: absolute;
    //隔开底部
    top: 0;
    bottom: 53px;
    //占满宽度  内容居中
    left: 0;
    right: 0;
    overflow: hidden;
    .home-content {
      position: absolute;
    }
  }
}
</style>
