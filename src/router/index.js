import {
  createRouter,
  createWebHistory
} from 'vue-router'
//引入仓库
import store from "@/store/index";
import {
  showNotify
} from "vant";
//引入路由组件
const Home = () => import("@/views/home/Home");
const Search = () => import("@/views/search/Search");
const Shelf = () => import("@/views/shelf/Shelf");
const Category = () => import("@/views/category/Category");
const User = () => import("@/views/user/User");
const Detail = () => import("@/views/detail/Detail");
const Register = () => import("@/views/user/Register");
const Login = () => import("@/views/user/Login");
const AddressManager = () => import("@/views/user/Address/AddressManager");
const AddressEdit = () => import("@/views/user/Address/AddressEdit");
const Reader = () => import("@/views/reader/Reader");
const About = () => import("@/views/other/About");
// meta为定义window.title的属性所用
const routes = [
  {
    path: '/',
    name: "Home",
    component: Home,
    meta: {
      title: "阅书阁-首页",
      keepAlive: true, // 组件需要缓存
    },
  },
  {
    path: '/search',
    name: "Search",
    component: Search,
    meta: {
      title: "阅书阁-搜书",
      keepAlive: true, // 组件需要缓存
    },
  },
  {
    path: "/shelf",
    name: "Shelf",
    component: Shelf,
    meta: {
      title: "阅书阁-书架"
    },
    beforeEnter: (to, from, next) => {
      if (store.state.user.user_id) {
        //有认证信息，跳转到个人中心
        next();
      } else {
        next("/login");
      }
    }
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
    meta: {
      title: "阅书阁-分类",
      keepAlive: true, // 组件需要缓存
    }
  },
  {
    path: "/user",
    name: "User",
    component: User,
    meta: {
      title: "阅书阁-个人中心",
    },
  },
  {
    //需要有商品id才可以进入
    //在加入购物车和立即购买需要登录后才可以
    path: "/detail",
    name: "Detail",
    component: Detail,
    meta: {
      title: "阅书阁-小说详情"
    },
    beforeEnter: (to, from, next) => {
      if (to.query.id) {
        //id存在
        next();
      } else {
        //id不存在
        next("/");
      }

    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "阅书阁-用户注册"
    },
    beforeEnter: (to, from, next) => {
      if (store.state.user.user_id) {
        //有认证信息，跳转到个人中心
        next("/user");
      } else {
        next();
      }
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "阅书阁-用户登录"
    },
    beforeEnter: (to, from, next) => {
      if (store.state.user.user_id) {
        //有认证信息，跳转到个人中心
        next("/user");
      } else {
        next();
      }
    }
  },
  {
    path: "/address",
    name: "Address",
    component: AddressManager,
    meta: {
      title: "地址管理-dreamlove.top"
    }
  },
  {
    path: "/addressedit",
    name: "Addressedit",
    component: AddressEdit,
    meta: {
      title: "地址编辑-dreamlove.top"
    }
  },
  {
    path: "/reader",
    name: "Reader",
    component: Reader,
    meta: {
      title: "阅书阁-小说阅读"
    }
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: "关于我们-dreamlove.top",
    }
  },

]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})
//导航守卫
router.beforeEach((to, from, next) => {
  //to是目的地,from是起点,
  //更改网页title
  document.title = to.meta.title;
  let path = to.path;
  if (path === "/" || path === "/category" || path === "/detail" || path === "/register" || path === "/login" || path === "/about") {
    next();
  } else {
    if (store.state.user.user_id) {
      //有认证信息，放行
      next();
    } else {
      showNotify("请登录");
      //没有认证信息,跳转到登录界面
      next("/login");
    }
  }
})

export default router