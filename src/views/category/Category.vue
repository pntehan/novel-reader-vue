<template>
  <div>
    <Navbar>
      <template #default> 商品分类 </template>
    </Navbar>
    <div class="category-wrapper">
      <!-- 排序分布栏 -->
      <div class="navbar">
        <van-tabs v-model:active="activeTab" @click-tab="onClickTab">
          <van-tab v-for="item in categoryList" :title="item" :name="item" :key="item" />
        </van-tabs>
      </div>
      <!-- 书籍展示 -->
      <div class="show-list">
        <div class="show-content">
          <van-card
            v-for="item in showBook"
            :key="item.id"
            :title="item.name"
            :desc="item.intro"
            :tag="item.category"
            :thumb="'data:image/jpeg;base64,'+item.img"
            @click="viewDetail(item.id)"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>
    <ToTop v-show="isShow" @toTopFn="toTopFn"></ToTop>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import {
  ref,
  onMounted,
  reactive,
  computed,
  nextTick,
} from "vue";
import { getCategorybooks } from "@/api/book";
import { useRouter } from "vue-router";
import ToTop from "@/components/common/toTop/ToTop";
/* 第三方插件 */
import BetterScroll from "better-scroll";
import throttle from "lodash/throttle";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Category",
  components: {
    Navbar,
    ToTop,
  },
  setup() {
    //左分类默认项
    const categoryList = ref(["全本", "玄幻", "武侠", "都市", "历史", "网游", "科幻", "女生"]) //左侧分类列表
    const currentType = ref("全本")
    const activeTab = ref(0)
    let bs = reactive({}); //better-scroll
    let isShow = ref(false) //控制回到顶部的显示/隐藏
    const $router = useRouter() //获取路由

    /* nav选项被单击回调,结构出排序类别 */
    function onClickTab({ name }) {
      // 原始输出
      //更改类别
      currentType.value = name
      //1.如果当前类别数据已经有了,就不再次请求数据了
      if (books[currentType.value].list.length != 0) {
        return
      }
      showBook.value = []
      //2.否者的话数据请求
      getCategorybooks({name: currentType.value}).then((response) => {
        books[currentType.value].list = response.data
        //重新计算高度
        nextTick(() => {
          bs.refresh();
        });
      });
    }

    //商品被单击,跳转到查看详情页
    function viewDetail(id) {
      $router.push({ path: "/detail", query: { id } });
    }

    //回到顶部
    function toTopFn(delay) {
      bs.scrollTo(0, 0, delay);
    }

    //展示的数据项
    const showBook = computed({
      get() {
        return books[currentType.value].list;
      },
      set(newValue) {
        books[currentType.value].list = newValue;
      },
    })

    //存储请求获取到的数据
    const books = reactive({
      "全本": { page: 1, list: [] },
      "玄幻": { page: 1, list: [] },
      "武侠": { page: 1, list: [] },
      "都市": { page: 1, list: [] },
      "历史": { page: 1, list: [] },
      "网游": { page: 1, list: [] },
      "科幻": { page: 1, list: [] },
      "女生": { page: 1, list: [] },
    });

    // 左侧列表里面的二级选项被单击
    onMounted(() => {
      getCategorybooks({name: '全本'}).then((result) => {
        books["全本"].list = result.data
      });

      bs = new BetterScroll(".show-list", {
        //允许单击滚动列表的元素
        click: true,
        probeType: 3,
        pullUpLoad: TextTrackCueList,
      });
      //添加滚动事件,使用下节流阀
      bs.on(
        "scroll",
        throttle((position) => {
          //滚动的距离大于了TableControl组件初始化时候到顶部的距离 - TableControl的高度的时候,就显示另外一个
          isShow.value = -position.y > 300;
        }, 100)
      );
      bs.on(
        "pullingUp",
        throttle(() => {
          //4.完成上划动作
          bs.finishPullUp();
          //5.重新计算高度
          nextTick(() => {
            bs.refresh();
          });
        }),
        20
      );
      nextTick(() => {
        bs.refresh();
      });
    });

    return {
      activeTab,
      onClickTab,
      categoryList,
      showBook,
      bs,
      books,
      toTopFn,
      isShow,
      viewDetail,
    };
  },
};
</script>

<style lang="less" scoped>
.category-wrapper {
  margin-top: 45px;
  display: flex;
  // 为左侧分类列表的宽度
  @leftItemWidth: 10px;
  //nav的宽度
  @navBarHidth: 40px;
  .navbar {
    // background-color: red;
    float: right;
    position: fixed;
    right: 0;
    height: @navBarHidth;
    left: @leftItemWidth;
    z-index: 10;
  }
  // 书籍展示
  .show-list {
    position: absolute;
    right: 0;
    // nav的宽度 + 顶部的商品分类宽度
    top: @navBarHidth+45;
    left: @leftItemWidth;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    bottom: 0;
  }
}
//重新定义侧边导航样式
:deep(.van-collapse-item__content) {
  padding: 0;
  margin: 0;
  width: 100%;
}
:deep(.van-sidebar) {
  width: 100%;
}
</style>

