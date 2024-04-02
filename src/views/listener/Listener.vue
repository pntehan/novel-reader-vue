<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Navbar>
    <template #default> 听书 </template>
  </Navbar>
  <div class="music-player">
    <div class="album-cover">
      <img :src="currentSong.img" alt="Album Cover" />
    </div>
    <div class="controls">
      <van-button
        icon="arrow-left"
        size="small"
        class="control-btn"
        @click="prev"
      ></van-button>
      <van-button
        icon="play-circle-o"
        size="small"
        class="control-btn"
        @click="playSong(currentSongIndex)"
      ></van-button>
      <van-button
        icon="pause-circle-o"
        size="small"
        class="control-btn"
        @click="pauseSong"
      ></van-button>
      <van-button
        icon="arrow"
        size="small"
        class="control-btn"
        @click="next"
      ></van-button>
    </div>
    <div class="progress">
      <span class="current-time">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar">
        <div class="progress-fill" :style="`width: ${(currentTime / duration) * 100}%`"></div>
      </div>
      <span class="duration">{{ formatTime(duration) }}</span>
    </div>
    <audio @canplay="getDuration" :src="currentSong.src" @timeupdate="updateCurrentTime" @ended="next" ref="audioPlayer"></audio>
    <div class="playlist">
      <van-cell-group class="playlist">
        <van-cell v-for="(song, index) in playlist" :key="index" :title="song.name" @click="playSong(index)">
          <template #icon>
            <img :src="song.img" alt="Song Cover" class="song-cover" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <ToTop v-show="isShow" @toTopFn="toTopFn"></ToTop>
  </div>
</template>

<script>
import Navbar from "@/components/common/navbar/Navbar";
import ToTop from "@/components/common/toTop/ToTop";
import BetterScroll from "better-scroll";
import { getBook, getChapterList } from "@/api/book";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Listener",
  components: {
    Navbar,
    ToTop,
  },

  data() {
    return {
      book: {},
      bs: null,
      isShow: false,
      audio: null,
      currentTime: 0,
      duration: 0,
      playlist: [
        { name: '歌曲1', src: 'song1.mp3', img: '', singer: '' },
      ],
      currentSong: {},
      currentSongIndex: 0,
    };
  },

  mounted() {
    // 初始化数据
    let book_id = this.$route.query.id
    // 2.请求数据
    getBook({id: book_id}).then((res) => {
      this.book = res.data
      this.book.img = 'data:image/jpeg;base64,'+this.book.img
      getChapterList({id: book_id}).then(async (res) => {
        this.playlist = []
        for (let i=0; i<res.data.length; i++) {
          this.playlist.push({ 
            name: res.data[i].name,
            src: 'book.mp3',
            img: this.book.img,
            singer: this.book.author
          })
        }
        this.currentSong = this.playlist[this.currentSongIndex]
      });
    });
    // 初始化音频
    this.audio = this.$refs.audioPlayer;
    this.bs = new BetterScroll(document.querySelector(".home-wrapper"), {
      probeType: 3,
      click: true,
      pullUpLoad: true,
    })
  },

  methods: {
    toTopFn(delay) {
      this.bs.scrollTo(0, 0, delay);
    },

    getDuration() {
       this.duration = this.$refs.audioPlayer.duration;
    },

    pauseSong() {
      this.audio.pause();
    },

    prev() {
      this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
      // this.audio.src = ''
      this.audio.play();
    },

    next() {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
      // this.audio.src = ''
      this.audio.play();
    },

    playSong(index) {
      this.currentSongIndex = index;
      if (this.audio.src) {
        this.audio.play();
      }
      else {
        this.audio.src = this.currentSong.src;
        this.audio.play();
      }
    },

    updateCurrentTime() {
      this.currentTime = this.audio.currentTime;
    },

    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
  },
}
</script>

<style lang="less" scoped>
.music-player {
  padding: 20px;
  text-align: center;
  margin-top: 50px;
}

.album-cover {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 10px;
  overflow: hidden;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  margin-bottom: 20px;
}

.control-btn {
  margin: 0 10px;
}

.time {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.playlist {
  max-height: 300px;
  overflow-y: auto;
}

.song-cover {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}
</style>