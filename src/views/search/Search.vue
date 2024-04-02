<template>
  <div id="home">
    <Navbar>
      <template #default> 搜书 </template>
    </Navbar>
    <!-- 滚动外壳 -->
    <div class="home-wrapper">
      <!-- 内容区 -->
      <div class="home-content">
        <!-- 搜索框 -->
        <van-field 
          v-model="searchWord"
          label="搜索："
          placeholder="请输入关键词..."
          style="margin-top: 50px; background-color: rgba(220, 220, 220, 0.8); width: 100vw; border-radius: 20px;"
        >
        <template #button>
          <van-button size="small" type="primary" @click="onSearch" style="border-radius: 15px;">点击查询</van-button>
        </template>
        </van-field>
        <!-- 列表 -->
        <div class="table-panel">
          <div class="empty" v-if="!showData.length">
            <img class="empty-cart" src="~@/assets/image/empty.png" alt="空购物车">
          </div>
          <div v-else>
            <p style="margin: 5px;">搜索结果</p>
          </div>
        </div>
        <BookList :showData="showData" v-if="showData.length"></BookList>
      </div>
    </div>
    <ToTop v-show="isShow" @toTopFn="toTopFn"></ToTop>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import BookList from "@/components/content/book/BookList";
import ToTop from "@/components/common/toTop/ToTop";
import { getSearchList } from "@/api/home";
import {
  reactive,
  ref,
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
  name: "Search",
  components: {
    Navbar,
    BookList,
    ToTop,
  },
  setup() {
    //控制另外一个TableControl的显示
    let isShow = ref(false);
    /* 存储-数据 */
    let showData = ref([]);
    let searchWord = ref('');
    let bs = reactive({});
    window.onresize = debounce(()=>{
      console.log("窗口大小被改变了");
      location.reload();
    },80)

    watchEffect(() => {
      nextTick(() => {
        // 重新计算高度
        Object.keys(bs).length > 0 ? bs.refresh() : "";
      });
    });

    onMounted(() => {
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
          //完成上划动作
          bs.finishPullUp();
          bs.refresh();
        }, 80)
      );
    })

    /* 自定义事件-回到顶部 */
    function toTopFn(delay) {
      bs.scrollTo(0, 0, delay);
    }

    function onSearch() {
      if (searchWord.value) {
        getSearchList({"searchWord": searchWord.value}).then((res) => {
          showData.value = res.data
        })
      }
      else {
        showData.value = []
      }
    }

    return {
      searchWord,
      showData,
      isShow,
      toTopFn,
      onSearch,
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
  }
}
</style>
