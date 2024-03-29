<template>
  <div class="swiper-show" >
    <Swiper v-if="swiperData.length > 0">
      <Slide v-for="(item, index) in swiperData" :key="index">
        <img :src="'data:image/jpeg;base64,'+item.img" :alt="item.name" />
      </Slide>
    </Swiper>
  </div>
</template>

<script>
import { getIndexData } from "@/api/home";
import { Swiper, Slide } from 'vue-swiper-component'

export default {
  name: "SwiperShow",
  components: {
    Swiper,
    Slide
  },
  
  data() {
    return {
      swiperData: [],
    }
  },

  mounted() {
    getIndexData().then((res) => {
      //轮播图数据
      for (let i=0; i<res.data.length; i++) {
        this.swiperData.push(
          {img: res.data[i].img, name: res.data[i].name, id: res.data[i].id}
        )
      }
      console.log(this.swiperData)
    })
  },

  methods: {
    onChange(index) {
      this.image = this.images[index]
      console.log(index)
    }
  }
};
</script>

<style lang="less" scoped>
.swiper-show {
  margin-top: 45px;
  width: 100vw;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
