<template>
  <div id="home">
    <Navbar>
      <template #default> 阅书阁 </template>
    </Navbar>
    <!-- 滚动外壳 -->
    <div class="home-wrapper">
      <!-- 内容区 -->
      <div class="home-content">
        <!-- 轮播图 -->
        <SwiperShow :swiperData="swiperData"></SwiperShow>
        <!-- 列表 -->
        <div class="table-panel">
          <TableControlVue
            @indexChange="indexChange"
            :tableControlTitle="['畅销', '推荐', '精选']"
          ></TableControlVue>
        </div>
        <!-- 书籍展示 -->
        <BookList :showData="showData"></BookList>
      </div>
    </div>
    <ToTop v-show="isShow" @toTopFn="toTopFn"></ToTop>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import TableControlVue from "@/components/content/tableControl/TableControl";
import BookList from "@/components/content/book/BookList";
import ToTop from "@/components/common/toTop/ToTop";
import SwiperShow from "@/views/home/Child/SwiperShow";
import { getHomeList } from "@/api/home";
import {
  reactive,
  ref,
  computed,
  onMounted,
  watchEffect,
  nextTick,
} from "vue";
/* 第三方插件 */
import BetterScroll from "better-scroll";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {
    Navbar,
    TableControlVue,
    BookList,
    ToTop,
    SwiperShow,
  },
  setup() {
    //控制另外一个TableControl的显示
    let isShow = ref(false);
    /* 存储-畅销,推荐,精选数据 */
    let books = reactive({
      sales: { page: 1, list: [] },
      recommend: { page: 1, list: [] },
      new: { page: 1, list: [] },
    });

    /* 变量-记录当前索引 */
    let currentIndex = ref(0);
    /* 计算-当前类型 */
    const currentType = ref("sales");
    /* 存储-索引对应关系 */
    let typeAll = ["sales", "recommend", "new"];
    /* 计算-获取当前展示列表数据 */
    let showData = computed(() => {
      return books[currentType.value].list;
    });
    /* 变量-better-scroll示例对象 */
    let bs = reactive({});
    //添加窗口大小改变事件,这样子就不会出现从pc切换到移动端无法滚动了
    // window.onresize = throttle(()=>{
    //   console.log("窗口大小被改变了");
    //   setTimeout(() => {
    //       bs.refresh();
    //   }, 400);
    //     // 重新计算高度
    //     // Object.keys(bs).length > 0 ? bs.refresh() : "";
    // },100)
    window.onresize = debounce(()=>{
      console.log("窗口大小被改变了");
      location.reload();
    },80)

    onMounted(() => {
      //距离顶部的距离和加上自己的宽度
      /* 请求-获取畅销书籍*/
      getHomeList(["sales", 0]).then((recommendData) => {
        books.sales.list = recommendData.data;
      });

      /* 请求-获取推荐书籍*/
      getHomeList(["recommend", 0]).then((recommendData) => {
        books.recommend.list = recommendData.data;
      });

      /* 请求-获取精选书籍 */
      getHomeList(["new", 0]).then((newData) => {
        books.new.list = newData.data;
      });

      let abc = document.querySelector(".table-panel").getBoundingClientRect();
      // 创建BetterScroll对象
      bs = new BetterScroll(document.querySelector(".home-wrapper"), {
        probeType: 3,
        click: true,
        pullUpLoad: true,
      });
      // //添加滚动事件,使用下节流阀
      bs.on(
        "scroll",
        throttle((position) => {
          //滚动的距离大于了TableControl组件初始化时候到顶部的距离 - TableControl的高度的时候,就显示另外一个
          isShow.value = -position.y > abc.top - abc.height - 5;
        }, 100)
      );
      bs.on(
        "pullingUp",
        throttle(() => {
          //发送ajax请求获取新页
          const page = books[currentType.value].page + 1;
          getHomeList([currentType.value, page]).then((response) => {
            //新请求的数据添加到原来数据
            books[currentType.value].list.push(...response.data);
            //页数+1
            books[currentType.value].page++;
          });
          //完成上划动作
          bs.finishPullUp();
          bs.refresh();
        }, 80)
      );
    });

    watchEffect(() => {
      nextTick(() => {
        // 重新计算高度
        Object.keys(bs).length > 0 ? bs.refresh() : "";
      });
    });
    /* 自定义事件-回到顶部 */
    function toTopFn(delay) {
      bs.scrollTo(0, 0, delay);
    }
    /* 自定义事件-TableControl栏目发生改变的时候 */
    function indexChange(newIndex) {
      //更新索引
      currentIndex.value = newIndex;
      currentType.value = typeAll[newIndex]; //更改当前类型
      getHomeList([currentType.value, 0]).then((response) => {
        books[currentType.value].list = response.data;
      });
      nextTick(() => {
        // 重新计算高度
        bs && bs.refresh();
      });
    }

    return {
      indexChange,
      showData,
      books,
      isShow,
      currentIndex,
      toTopFn,
      bs,
    };
  },
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
    .slideOne {
      /* 隔开顶部的navbar */
      margin-top: 45px;
      width: 100%;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
