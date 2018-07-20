<template>
    <div class="music-list">
        <!-- 头部返回的位置 -->
        <div class="back" @click='back'>
            <span class="icon-back icom"></span>
        </div>
        <h2 class="title">{{title}}</h2>

        <div class="music-header" :style='bgimgc' ref='bgimgref'>
            <!-- 随机播放音乐位置 -->
            <div class="play-wrapper" ref='randomWarp'>
                <!-- @click="random" -->
                <div ref="playBtn" @click="randomPlay" v-show="song.length>0" class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>

        <!-- 滑动list列表 -->
        <div class="layer" ref="layer"></div>
        <scroll :data='song' class="m-scroll" :probeType='probeType' :listenScroll='listenScroll' @scroll='scroll' ref='scroll'>
            <div class="song-list-wrap">
                <song-list :song='song' @selected="selected"></song-list>
            </div>
        </scroll>
        
    </div>
</template>

<script>

import scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import {mapActions,mapMutations} from 'vuex'
import {playlistMixins} from 'common/js/mixins'

const MIN_HEIGHT = 40;

export default {
    mixins:[playlistMixins],
    components: {
        scroll,
        songList
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        bgimg: {
            type: String,
            default: ''
        },
        song: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            scrolly: 0
        }
    },
    methods: {
        randomPlay(){
           let index=Math.random()*this.song.length|0;
           this.selectPlay({
             list:this.song,
             index:index,
             random:'random'
          })
        },
        back() {
            this.$router.go(-1);
        },
        scroll(pos) {
            this.scrolly = pos.y;
        },
        selected(item,index) {
         // 在这里的话，一次性需要存储多个状态。  // 使用解构来传值 
         this.selectPlay({
             list:this.song,
             index:index
          })            
        },
        heightHandle(list){
            const height=list.length>0?'60px':'0px';
            this.$refs.scroll.$el.style.bottom=height;
            this.$refs.scroll.refresh();
        },
         ...mapActions([
            'selectPlay'
        ])
    },
    computed: {
        bgimgc() {
            return `background-image:url(${this.bgimg})`
        }
    },
    watch: {
        scrolly(newy) {
            //  console.log(newy);
            //  这里分成两种情况，上滚动和下滚动。
            let valuey = Math.max(this.minHeight, newy);  // 这里采用那个大取那个来给滚动的位置去赋值。总有一个位置时minHeight是一定会常大
            let scale = 1;
            let zIndex = 0;
            let blur = 0;
            // 向下拉的话，就是放大。
            if (newy > 0) {
                scale += Math.abs(newy / this.bgimgHeight);
                // this.$refs.scroll.$el.style.top = `${this.bgimgHeight+newy}px`;
            }
            this.$refs.layer.style.transform = `translate3d(0,${valuey}px,0)`;

            if (newy < this.minHeight) {
                zIndex = 10;
                // 此时改变bg的宽高比例，给bg 赋值真正的高。
                this.$refs.bgimgref.style.paddingTop = 0;
                this.$refs.bgimgref.style.height = `${MIN_HEIGHT}px`;
                this.$refs.randomWarp.style.display = 'none'
            } else {
                zIndex = 0;
                this.$refs.bgimgref.style.paddingTop = '70%';
                this.$refs.bgimgref.style.height = 0;
                this.$refs.randomWarp.style.display = 'block'
            }
            this.$refs.bgimgref.style.zIndex = zIndex;
            this.$refs.bgimgref.style.transform = `scale(${scale})`;
        }
    },
    created() {
        this.listenScroll = true;
        this.probeType = 3;
    },
    mounted() {
        // 现在开始对逻辑进行处理。首先页面一进来的话，肯定是要正常日韩显示图片的，歌曲列表应该就是在下面。但现在
        // list的fixed的定位是相对于父级来定位的，这里必须要改变z-index，否则就是list列表通过js来向下移动。
        this.bgimgHeight = this.$refs.bgimgref.clientHeight;
        this.$refs.scroll.$el.style.top = `${this.bgimgHeight}px`;
        // 有了layer层这个事就好说了,就是滑动向下或向下滑动的事
        this.minHeight = -this.bgimgHeight + MIN_HEIGHT;  // 这个是滚动的最大距离
    }
}
</script>

<style lang='stylus' scoped>

@import '~common/stylus/mixin.styl'
@import '~common/stylus/veriable.styl'

.music-list
   position fixed
   top 0
   left 0
   right 0
   bottom 0
   z-index 100
   background $color-background
   .back
     position fixed
     left 6px
     top 0
     z-index 20
     .icom
        padding 10px
        display block
        font-size $font-size-large-x
        color $color-theme
   .title
    position fixed
    z-index 20
    top 0
    width 80%
    left 10%
    text-align center
    font-size $font-size-large
    no-warp()
    line-height 40px
   .music-header
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-repeat no-repeat
      background-size: cover
      .play-wrapper
        position absolute
        bottom 20px
        width 100%
        text-align center
        .play
           padding 10px
           margin 0 auto
           width 155px
           border-radius 100px
           box-sizing border-box
           border 1px solid $color-theme
           color $color-theme
           .icon-play
             display inline-block
             font-size $font-size-medium
             vertical-align middle
             margin-right 8px
           .text
             display inline-block
             font-size $font-size-medium

   .m-scroll
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      .song-list-wrap
          box-sizing border-box
          padding 20px 30px
   .layer
      position relative   
      height 100%
      background-color $color-background
               
</style>
