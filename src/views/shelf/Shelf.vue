<template>
  <div id="shopcart">
    <Navbar>
      <template #default> 我的书架 </template>
    </Navbar>
    <div class="content">
      <!-- cartChecked收集所有的van-checkbox里面的nam属性,也就是选中的商品id 滑动单元格-->
      <div class="navbar">
        <van-tabs v-model:active="activeTab" @click-tab="onClickTab">
          <van-tab v-for="item in categoryList" :title="item" :name="item" :key="item" />
        </van-tabs>
      </div>
      <div>
        <BookList :showData="showData"></BookList>
      </div>
      <div class="empty" v-if="!showData.length">
        <img class="empty-cart" src="~@/assets/image/empty.png" alt="空购物车">
        <div class="title" style="margin: 20px;">书架空空如也</div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import { ref, reactive,onMounted,computed, } from "vue";
import { getShelfbooks } from "@/api/book";
// import {useRouter} from "vue-router";
import BookList from "@/components/content/book/BookList";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Shopcart",
  components: {
    Navbar,
    BookList
  },
  setup() {
    // const $router = useRouter();
    const categoryList = ref(["我的最爱", "随便看看", "精品"])
    const currentType = ref("我的最爱");
    const books = reactive({
      "我的最爱": { page: 1, list: [] },
      "随便看看": { page: 1, list: [] },
      "精品": { page: 1, list: [] },
    });
    const showData = computed(() => {
      return books[currentType.value].list;
    })

    //请求购物车信息
    function init(){
      let user_id = localStorage.getItem("user_id")
      getShelfbooks({user_id: user_id, group_name: currentType.value}).then((res)=>{
        books[currentType.value].list = res.data
      })
    }

    function onClickTab({ name }) {
      // 原始输出
      //更改类别
      currentType.value = name
      //1.如果当前类别数据已经有了,就不再次请求数据了
      if (books[currentType.value].list.length != 0) {
        return
      }
      let user_id = localStorage.getItem("user_id")
      getShelfbooks({user_id: user_id, group_name: currentType.value}).then((res)=>{
        books[currentType.value].list = res.data
      })
    }

    onMounted(()=>{
      init()
    })
    
    return {
      categoryList,
      showData,
      books,
      onClickTab
    };
  },
};
</script>

<style lang="less" scoped>
#shopcart {
  margin-top: 45px;
  // margin-bottom: 60px;
  .content{
    .good-item{
      display: flex;
      padding: 7px 8px;
      width: 100%;
      //图片样式
      .good-img{
        width: 110px;
        img{
          width: 100%;
          height: auto;
        }
      }
    }
    .good-detail-wrapper{
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      padding: 15px 5px;
      &>div{
        width: 100%;
      }
      .good-title{
        &>span{
          font-size: 15px;
        }
        &>span:first-child{
          float: left;
        }
         &>span:last-child{
          float: right;
        }
      }
      .good-operation{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .price{
          float: left;
          font-size: 16px;
          color: red;
        }
      }
    }
   
  }
  .empty{
    .empty-cart{
      width: 100%;
      height: auto;
    }
  }
}
:deep(.van-icon-success:before) {
  font-size: 14px !important;
}

</style>
