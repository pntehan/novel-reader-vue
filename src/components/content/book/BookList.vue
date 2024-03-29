<template>
  <div>
    <div class="good">
      <BookListItem
        v-for="item in showData"
        :key="item.id"
        :itemData="item"
        @click="viewDetail(item.id)"
      >
      </BookListItem>
    </div>
  </div>
</template>

<script>
import BookListItem from "@/components/content/book/BookListItem";
import { useRouter } from 'vue-router';
export default {
  name: "BookList",
  props: {
    showData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    BookListItem,
  },
  setup(){
    const $router = useRouter();
     /* 跳转到查看详情页 */
    function viewDetail(id) {
      $router.push({ path: "/detail", query: { id } });
    }
    return {
      viewDetail
    }
  }
};
</script>

<style lang="less" scoped>
.good {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  // width: 100%;
  width: 100vw;
  // padding-bottom: 60px;
}
</style>
