<template>
  <div id="home">
    <Navbar>
      <template #default> 我的评论 </template>
    </Navbar>
    <!-- 滚动外壳 -->
    <div class="home-wrapper">
      <!-- 内容区 -->
      <div class="home-content">
        <!-- 信息栏 -->
        <van-cell-group class="comments" style="margin: 60px auto 0">
          <van-cell v-for="(comment, index) in commentlist" :key="index" :title="comment.content" @click="playSong(index)">
            <template #icon>
              <van-icon name="comment" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import BetterScroll from "better-scroll";
import { getCommentByUser } from '@/api/user'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Search",
  components: {
    Navbar,
  },

  data() {
    return{
      bs: null,
      commentlist: []
    }
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    getCommentByUser({user_id: this.user.id}).then((res) => {
      this.commentlist = res.data
    })
    this.bs = new BetterScroll(document.querySelector(".home-wrapper"), {
      probeType: 3,
      click: true,
      pullUpLoad: true,
    })
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
