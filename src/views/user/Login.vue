<template>
  <div id="login">
    <Navbar>
      <template #default> 用户登录 </template>
    </Navbar>
    <div class="login-content">
      <!-- logo展示 -->
      <div class="login-logo">
        <van-image
          width="10rem"
          height="10rem"
          src="https://dreamlove.top/img/favicon.png"
        />
      </div>
      <!-- 登录表单 -->
      <div class="login-form">
        <van-form @submit="onSubmit">
          <!-- 输入项目 -->
          <van-cell-group inset>
             <!-- 邮件 -->
               <van-field
              autocomplete
              v-model="email"
              type="text"
              label="电子邮箱"
              name="pattern"
              placeholder="请输入邮件"
              :rules="[
              { required: true, message: '请填写您的邮箱' },
              { pattern: emailReg, message: '邮箱格式错误'}]" />
            
            <!-- 密码 -->
            <van-field
              v-model="password"
              autocomplete
              type="password"
              name="pattern"
              label="密码"
              placeholder="请输入密码"
              :rules="[
                {required: true,message:'请输入密码'},
                {pattern:passworReg,message:'密码至少为6个字符'}
              ]" />
             
          </van-cell-group>
          
          <router-link to="/register" class="account-create">立即注册</router-link>
          <!-- 提交按钮 -->
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
    
  
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { showNotify } from "vant";
import { userLogin } from "@/api/user";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "login",
  setup(){
    //路由总管
    const $router = useRouter()
    //自己的路由信息
    const $route = useRoute()
    //store
    const $store = useStore()
     /* 存储用户登录输入信息 */
    const userInfo = reactive({
        email:"",
        password:"",
    });
    //空对象就算是空的,转化为布尔值也是为真
    if(Object.keys($route.query).length){
        //有参数,并且为账号密码
        if($route.query.email && $route.query.password){
            userInfo.email = $route.query.email;
            userInfo.password = $route.query.password;
            //登录
            onSubmit();
        }
    }
    /* 正则验证规则 */
    const regCheck = {
        //邮箱正则
        // emailReg:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        // eslint-disable-next-line no-useless-escape
        emailReg:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i ,
        //密码正则
        passworReg:/.{6,}/,
    }
    /* 用户单击提交数据 */
    function onSubmit(){
      //显示提示
      showNotify({ type: 'primary', message:"登录中..." })
      //登录提交
      userLogin(userInfo).then(res=>{
        if (res.status == 200) {
          //提示成功,失败会在拦截器中捕获的
          showNotify({ type: 'success', message: "登录成功..." })
          //存储数据
          $store.dispatch("setUserId", res.data.id)
          //清空数据
          userInfo.email = ""
          userInfo.password= ""
          //跳转到位置
          setTimeout(() => {
              //返回到之前的位置
              $router.go(-1)
          }, 800);
        }
        else {
          console.log(res)
          showNotify({ type: 'warning', message: "登录失败, 请检查账号密码是否正确!" })
        }
      // eslint-disable-next-line no-unused-vars
      }).catch(reason=>{
         //关闭提示
        showNotify({ type: 'warning', message: "登录失败, 请检查账号密码是否正确!" })
      })
    }

    
    return {
        ...toRefs(userInfo),
        onSubmit,
        ...regCheck,
    }
  }
};
</script>

<style lang="less" scoped>
#login {
  margin-top: 45px;
  .login-logo{
      margin-top: 15+45px;
  }
  .login-form{
      margin-top: 15px;
  }
  .van-button--primary{
    background-color: #4bae81;
    border-color: #4bae81;
  }
  //已有账号
  .account-create{
    color: #017eff;
    font-size: 14px;
    float: left;
    margin-left: 30px;
    padding: 15px 0;
  }
}
</style>
