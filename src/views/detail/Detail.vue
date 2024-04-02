<template>
  <div>
    <!-- 顶部  -->
    <Navbar>
      <template #default> 小说详情 </template>
    </Navbar>
    <!-- 弹出 -->
    <van-dialog v-model:show="showAdd" title="加入书架" @confirm="addToShelf" show-cancel-button>
      <van-radio-group v-model="checked" direction="horizontal" style="margin: 10px;">
        <van-radio name="我的最爱">我的最爱</van-radio>
        <van-radio name="随便看看">随便看看</van-radio>
        <van-radio name="精品">精品</van-radio>
      </van-radio-group>
    </van-dialog>
    <!-- 展示部分 -->
    <div class="detail-show">
      <!-- 图片展示 -->
      <div class="pic-content">
        <img :src="'data:image/jpeg;base64,'+book.img" />
      </div>
      <!-- 用户操作及书籍信息 -->
      <div class="operation">
        <van-card style="text-align: left; font-size:17px; margin: 10px" :desc="book.category" :title="book.name">
          <template #bottom>
            <van-button color="linear-gradient(#fcd51f, #feba23)" @click="showAddToShelf" style="margin: 5px; width: 90px">加入书架</van-button>
            <van-button color="linear-gradient(#fe3e4e, #f72e1d)" @click="readBook" style="margin: 5px; width: 90px">立即阅读</van-button>
            <van-button color="linear-gradient(#fe3e4e, #f72e1d)" @click="localReadBook" style="margin: 5px; width: 90px">下载阅读</van-button>
            <van-button color="linear-gradient(#fe3e4e, #f72e1d)" @click="listenBook" style="margin: 5px; width: 90px">点击听书</van-button>
          </template>
        </van-card>
      </div>
      <!-- 选择器 -->
      <div class="nav-select">
        <!-- 这里应该添加一个滚动跳转的 -->
        <van-tabs v-model:active="active" type="card" @click-tab="onClickTab" >
          <van-tab title="概述">
            <div class="book-detail-info" v-html="book.intro" style="margin-top: 10px;"></div>
          </van-tab>
          <van-tab title="热评">
            <van-list>
              <van-cell v-for="item in comments" :key="item.id">
                <van-row>
                  <van-col span="18">
                    <p>{{ item.content }}</p>
                  </van-col>
                  <van-col span="6">
                    <p>{{ item.create_time }}</p>
                    <van-divider />
                  </van-col>
                </van-row>
              </van-cell>
            </van-list>
          </van-tab>
          <van-tab title="相关图书">
            <BookList :showData="like_books" style="margin-top: 10px;"></BookList>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <loading v-show="downloading"></loading>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import BookList from '@/components/content/book/BookList'
import Loading from '@/views/localReader/Loading.vue';
import { useRoute,useRouter } from "vue-router";
import { onMounted, ref, reactive, toRefs} from "vue";
import { getBook, getChapter, getChapterList } from "@/api/book";
// import {reqAddCart} from "@/api/shopcart";
import { useStore } from 'vuex';
import { showNotify } from "vant";
import { addShelf } from "@/api/book"
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Detail",
  components: {
    Navbar,
    BookList,
    Loading
  },
  setup() {
    // 记录是否下载
    const downloading = ref(false);
    //获取当前路由信息
    const $route = useRoute();
    //获取路由总管
    const $router = useRouter();
    //获取存储仓库
    const store = useStore();
    //记录当前选择项
    const active = ref(0);
    let showAdd = ref(false);
    let checked = ref("我的最爱");
    let detailInfo = reactive({
      //里面有数据项comments
      book: {},
      comments: [],
      like_books: [],
    });
    //获取选择器到顶部的距离
    //用户查看了选择项,跳转到位置
    function onClickTab(){
      window.scrollTo({
        top:document.documentElement.clientHeight-200,
        bahavior:'smooth',
      })
    }
    //判断是否可以加入购物车和立即购买
    function canRead(){
      //具有认证信息
      if(store.state.user.user_id){
        return true;
      }else{
        return false;
      }
    }

    function showAddToShelf() {
      let isCanRead = canRead();
      if(!isCanRead){
        //跳转到登录
        $router.push("/login");
        return
      }
      showAdd.value = true
    }

    //添加到购物车
    function addToShelf() {
      let params = {
        user_id: store.state.user.user_id,
        book_id: detailInfo.book.id,
        group_name: checked.value 
      }
      addShelf(params).then((res) => {
        if (res.status == 200) {
          showNotify({type: 'success', message: '加入成功！'})
        }
        else {
          showNotify({type: 'warning', message: '加入失败！'})
        }
      })
    }
    //立即阅读
    function readBook() {
      let isCanRead = canRead();
      if(!isCanRead){
        //跳转到登录
        $router.push("/login");
        return;
      }
      $router.push({ path: "/reader", query: {id: detailInfo.book.id} })
    }
    // 下载单章
    async function downloadOne(id1, id2) {
      let res = await getChapter({book_id: id1, chapter_id: id2})
      let data = {
        title: res.data.title,
        content: res.data.content.split('&;&;&')
      }
      localStorage.setItem(id1+"_"+id2, JSON.stringify(data))
    }
    //下载阅读
    function localReadBook() {
      let isCanRead = canRead();
      if(!isCanRead){
        //跳转到登录
        $router.push("/login");
        return;
      }
      // 打开缓存
      downloading.value = true
      getChapterList({id: detailInfo.book.id}).then(async (res) => {
        let chapterList = res.data
        localStorage.setItem("chapterList", JSON.stringify(chapterList))
        for (let i=0; i<chapterList.length; i++) {
          if (JSON.parse(localStorage.getItem(chapterList[i].id))) {
            continue
          }
          await downloadOne(detailInfo.book.id, chapterList[i].id.split("_")[1])
        }
        downloading.value = false
        $router.push({ path: "/localReader", query: {id: detailInfo.book.id} })
      })
    }
    // 听书
    function listenBook() {
      $router.push({ path: "/listener", query: {id: detailInfo.book.id} })
    }
    //记录数据
    onMounted(() => {
      //1.保存传递过来的查询id
      let book_id = $route.query.id
      // 2.请求数据
      getBook({id: book_id}).then((res) => {
        detailInfo.book = res.data
        detailInfo.comments = res.comment_list
        detailInfo.like_books = res.data_list
      });
    });


    return {
      ...toRefs(detailInfo),
      downloading,
      active,
      showAdd,
      checked,
      onClickTab,
      showAddToShelf,
      addToShelf,
      readBook,
      localReadBook,
      listenBook,
      store
    };
  },
};
</script>

<style lang="less" scoped>
.detail-show {
  width: 100vw;
  margin-top: 45px;
  margin-bottom: 60px;
  // 图片部分
  .pic-content {
    width: 100%;
    img {
      width: 100%;
    }
  }
  //用户操作和书籍信息
  .operation {
    :deep(.van-card__price-integer){
      font-size: 20px;
      color: #f8230b;
    }
  }
  //选择器
  .nav-select{
    width: 100vw;
    :deep(.van-tabs__wrap) {
      padding-bottom: 10px;
    }
    :deep(.book-detail-info){
      img{
        // width: 300px!important;
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
