<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="user">
    <Navbar>
      <template #default>个人中心</template>
    </Navbar>
    <div class="user-box">
      <div class="user-info">
        <div class="info">
          <img src="https://dreamlove.top/img/favicon.png" />
          <div class="user-desc">
            <span>昵称：{{ name }}</span>
            <span>邮箱：{{ email }}</span>
            <span class="name">个性签名：{{ intro }}</span>
          </div>
        </div>
      </div>

      <ul class="user-list">
        <li class="van-hairline--bottom" style="background-color:rgb(241 241 241);" @click="goTo('/setting')">
          <span>账号管理</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/comment')">
          <span>我的评论</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/info')">
          <span>公告信息</span>
          <van-icon name="arrow" />
        </li>
        <li class="van-hairline--bottom" @click="goTo('/about')">
          <span>关于我们</span>
          <van-icon name="arrow" />
        </li>
      </ul>
    </div>

    <div style="margin: 16px">
      <van-button round block color="#44BA80" @click="loginOut"
        >退出登录</van-button
      >
    </div>
  </div>
</template>
<script>
import Navbar from "@/components/common/navbar/Navbar";
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showNotify } from "vant";
import { getUser } from "@/api/user";
import { useStore } from 'vuex'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Profile",
  components: {
    Navbar,
  },
  setup() {
    const $router = useRouter()
    const $store = useStore()
    //存储数据
    const userInfo = reactive({
      name: "",
      email: "",
      intro: ""
    })
    //跳转路由
    function goTo(path) {
      $router.push(path);
    }
    //退出登录
    function loginOut() {
      showNotify({ type: 'primary', message: '退出中...' })
      //清空认证信息内容
      $store.dispatch("setLoginOut", "")
      showNotify({ type: 'primary', message: '登出成功...' })
      //然后应该跳转下,跳转到主页算了
      $router.push("/");
    }
    //初始化挂载请求
    function init(){
      showNotify({ type: 'primary', message: '正在加载...' })
      getUser({user_id: $store.state.user.user_id}).then( res => {
        localStorage.setItem("user", JSON.stringify(res.data))
        userInfo.name = res.data.name
        userInfo.email = res.data.email
        userInfo.intro = res.data.intro
      })
    }
    onMounted(()=>{
      init();
    })
    return {
      goTo,
      loginOut,
      ...toRefs(userInfo),
    };
  },
};
</script>

<style lang="less" scoped>
#user {
  background: #fcfcfc;
  height: 100vh;
  overflow: hidden;
  .user-box {
    margin-top: 65px;
    .user-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 10px;
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .user-name {
        font-size: 14px;
      }
    }
    .user-info {
      width: 94%;
      margin: 10px;
      height: 115px;
      background: linear-gradient(90deg, #31c7a7, #a1c7c7);
      box-shadow: 0 2px 5px #269090;
      border-radius: 6px;
      margin-top: 50px;
      text-align: left;
      .info {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 25px 20px;

        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-top: 4px;
        }
        .user-desc {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          line-height: 20px;
          font-size: 14px;
          color: #fff;
          span {
            color: #fff;
            font-size: 14px;
            padding: 2px 0;
          }
        }
        .account-setting {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 13px;
          color: #fff;
          .van-icon-setting-o {
            font-size: 16px;
            vertical-align: -3px;
            margin-right: 4px;
          }
        }
      }
    }
    .user-list {
      padding: 0 8px;
      margin-top: 40px;
      li {
        
        padding-left: 5px;
        padding-right: 5px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .van-icon-arrow {
          margin-top: 13px;
        }
        margin: 20px 0 !important;
        background: #ffffff;
        border-radius: 3px;
      }
    }
  }
}
</style>
