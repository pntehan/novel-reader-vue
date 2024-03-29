<template>
  <div class="book-list-item">
    <div class="list-pic">
      <img :src="'data:image/jpeg;base64,'+itemData.img" />
    </div>
    <div class="book-info">
      <!-- 书名 -->
      <p class="book-title">{{itemData.name}}</p>
      <p>
          <!-- 价格 -->
          <span class="book-price"><small>作者: </small>{{itemData.author}}</span>
          <!-- 书库存 -->
          <span class="book-collect">{{itemData.category}}</span>
        </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookListItem",
  props:{
    itemData:{
      type:Object,
      default(){
        return {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
.book-list-item{
    width: 46%;
    font-size: 13px;
    text-align: center;
    border-radius: 6px;
    background-color: var(--color-background);
    position: relative;
    z-index: 4;
    .list-pic{
        img{
            width: 100%;
        }
    }
    .book-info{
        display: flex;
        //居中
        flex-direction: column;
        align-items: center;
        &>p{
            width: 100%;
        }
        .book-price{
            color: red;
        }
        // 书名
        .book-title{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        //库存
        .book-collect{
            margin-left: 5px;
            &::before{
                content: '☆';
            }
        }
    }
}
</style>
