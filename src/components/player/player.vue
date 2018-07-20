<template>
    <div class="play" v-show='playlist.length>0'>
        <!-- 这里是正常的翻放器 -->
        <transition name='normal'  @enter='enter' @after-enter='afterEnter' @leave='leave' @after-leave='afterLeave'>
            <div class="normal-play" v-show='fullScreen'>
                <!-- 背景图,使用外层的div模糊这张背景图-->
                <div class="backgroundimg">
                    <img :src="currentSong.image" alt="" height="100%" width="100%">
                </div>
                <div class="top">
                    <div class="backicon" @click='scalex'>
                        <span class="icon-back"></span>
                    </div>
                    <h2 class="songtitle">{{currentSong.name}}</h2>
                    <h2 class="nametitle">{{currentSong.singer}}</h2>
                </div>
                <!-- 这里是中间部分的内容,分为左右两部分 -->
                <div class="middle" @touchstart.prevent='touchS' @touchmove.prevent='touchM' @touchend.prevent='touchE'>
                    <!-- 左边是cd部分 -->
                    <div class="middle-l" ref='cd'>
                        <div class="cd-wrap" ref="cdimg">
                            <div class="cd-wrap-in" :class="bigimgcircle">
                                <img :src="currentSong.image" width="100%" height="100%" alt="" class="cd-img">
                            </div>
                        </div>
                        <div class="linep">{{currentTxt}}</div>
                    </div>
                    <!-- 这里的歌词部分和cd部分应该是在同一个div框内。 -->
                    <!-- 右边是歌词部分 -->
                    <div class="middle-r" ref="lyeric">
                        <scroll class="scroll"  ref='scroll' :data='currentLyric&&currentLyric.lines'>
                            <div>
                                <div v-if='currentLyric' class="lyric-warp">
                                  <p  ref='lyricp' class="lyric-p-txt"  :class="{'lyric-active':index===currentNum}" v-for='(item,index) in currentLyric.lines' :key='index'>
                                    {{item.txt}}
                                  </p>
                                </div>
                            </div>
                        </scroll>
                    </div>
                </div>

                <div class="bottom">
                    <div class="sign">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyeric'}"></span>
                    </div>
                    <div class="progress-bar">
                        <span class="time_bar">{{currentTimeX}}</span>
                        <progressbar class="pro"  :ratio='ratio'  @disratio='disratio'></progressbar>
                        <span class='time_bar'>{{totalTime}}</span>
                    </div>
                    <div class="btn-warp">
                        <div class="icon icon-right" @click='modeChange'>
                            <span :class="iconMode"></span>
                        </div>
                        <div class="icon icon-right" @click='prev' :class="disable">
                            <span class="icon-prev"></span>
                        </div>
                        <div class="icon icon-center" @click='changplay' :class="disable">
                            <span :class="bottom"></span>
                        </div>
                        <div class="icon icon-left" @click='next' :class="disable">
                            <span class="icon-next"></span>
                        </div>
                        <div class="icon icon-left">
                            <span class="icon icon-not-favorite"></span>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 这里是mini播放器 -->
        <transition>
            <div class="miniplay" v-show='!fullScreen' @click.stop.prevent="openBig">
                <div class="imgicon" :class="bigimgcircle">
                    <img :src="currentSong.image" class="imgmini" alt="" width="40" height="40">
                </div>
                <div class="mininame">
                    <h2 class="minititle">{{currentSong.name}}</h2>
                    <p class="minisinger">{{currentSong.singer}}</p>
                </div>
                <div class="contorl">
                    <svgcircle class="circlesvg" :ratio='ratio'>
                        <span @click.stop.prevent='changplay' class="icon-mini"  :class="miniIcon"></span>
                    </svgcircle>
                </div>
                <div class="contorl">
                    <span class="icon-playlist"></span>
                </div>
            </div>
        </transition>
        <audio ref='audiox' :src="currentSong.url"  @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
        <!--当点击时，就播放现在的歌曲-->
    </div>
</template>

<script>
import animations from "create-keyframe-animation";
import { mapActions, mapGetters, mapMutations } from "vuex";
import progressbar from "base/progress-bar/progress-bar";
import svgcircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/shuffle";
import {dateTime,ratinTime} from 'common/js/dateStr'
import Lyric from 'lyric-parser'
import scroll from 'base/scroll/scroll'

export default {
  data() {
    return {
      songReady: false,
      currentTime:0,
      ratio:0,
      disMove:0,
      touch:{},
      currentShow:'cd',
      currentLyric:null,
      lyricNumber:null,
      currentNum:0,
      currentTxt:''
    };
  },
  computed: {
    ...mapGetters([
      "playing",
      "fullScreen",
      "playlist",
      "currentIndex",
      "currentSong",
      "mode",
      "sequenceList"
    ]),
    bottom() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    bigimgcircle() {
      return this.playing ? "playbig" : "playbig pausebig";
      // 这里在暂停的时候也要加了play的状态，否则暂停后就没有animate的状态，动画需要从头在来过。
    },
    disable() {
      return this.songReady ? "" : "disable";
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
    totalTime() {
      return `${(this.currentSong.duration / 60) | 0}:${this.currentSong.duration % 60 === 0 ? "00" : this.currentSong.duration % 60}`; 
    },
    currentTimeX(){
        return dateTime(this.currentTime);
    }
  },
  methods: {
    scalex() {
      this.setFullScreen(false);
    },
    ...mapMutations({
      setFullScreen: "SET_FULLSCREEN",
      setPlay: "SET_PLAYING",
      _setCurrentIndex: "SET_CURRENTINDEX",
      _setMode: "SET_MODE",
      _setPlayList: "SET_PLAYLIST"
    }),
    changplay() {
      // 要暂停状态时，也一定是要这个歌在可ready的状态。
      if (!this.songReady) {
        return false;
      }
    // 在切换歌曲是否暂停的状态，歌词的播放也要对应的是否暂停。
     if(this.currentLyric){
         this.currentLyric.togglePlay();
     }
      this.setPlay(!this.playing);
    },
    openBig() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      /*这里需要有一个js提供动画的钩子函数,使用的是js创建动画，而不是css创建动画，这两都不能同时存在*/
      /*要通过js开始动画的话*/
      /* 这里四个动画的钩子函数其实是同步执行的。*/

      const { x, y, scale } = this._getCoor();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "music",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdimg, "music", done);
    },
    afterEnter() {
      animations.unregisterAnimation("music");
      this.$refs.cdimg.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdimg.style.transition = "all 0.4s";
      const { x, y, scale } = this._getCoor();
      /*在这里由于字母输错，其实是导致了done不能执行。*/
      //  没法在执行接下来的第四步。
      this.$refs.cdimg.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdimg.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdimg.style.transition = "";
      this.$refs.cdimg.style.transform = "";
    },
    _getCoor() {
      // 得到这个图片的要移动的初始位置,然后通过移动的主要步骤数来计算。
      // 首先要入场的话，移动的元素必先有一个初始的位置。
      const targetWidth = 40;
      const targetHeight = 30;
      const x = -(window.innerWidth / 2 - targetWidth);
      const y = window.innerHeight - 71 - 150 - targetHeight;
      const scale = 40 / 300;
      return {
        x,
        y,
        scale
      };
    },
    /*下面的事件是音频播放的4个事件。*/
    next() {
      // 这里是播放下一首。
      // 1.逻辑的步骤是，如果当前的歌没有ready是肯定不能点击进行下一首。
      if (!this.songReady) {
        return false;
      }
      // 2. 如果当前的列表只有一首歌的话，是一种特殊的情况。
      if (this.playlist.length === 1 || this.mode === playMode.loop) {
        // 如果只有一首歌，就是循环的播放。
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        let len = this.playlist.length;
        if (index === len) {
          index = 0;
        }
        this._setCurrentIndex(index);
        this.songReady = false;
      }
      if (!this.playing) {
        this.changplay();
      }
      // 这里要不停的下一着的话有可能碰到没有加载好的情况。
    },
    prev() {
      if (!this.songReady) {
        return false;
      }

      // 2. 如果当前的列表只有一首歌的话，是一种特殊的情况。
      if (this.playlist.length === 1 || this.mode === playMode.loop) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        let len = this.playlist.length;
        if (index < 0) {
          index = len - 1;
        }
        this._setCurrentIndex(index);
        // 直接把这个放在下一首或上一首index变化的时候。
        this.songReady = false;
      }
      if (!this.playing) {
        this.changplay();
      }
    },
    modeChange() {
      // 这里切换来改变三种状态的切换。这里的状态切换使用的是标记。也就是this.mode是数字。最大的数字也就是2
      let index = this.mode + 1; //得到当前mode状态是几。
      if (index > 2) {
        index = 0;
      }
      this._setMode(index);
      // 这里切换模式的同时，需要判断现在是否是随机的播放模式。并且把这这个列表给到playlist
      //  这里不能大次使用playlist，现在的playlist都已经是随机改变过了的。 只有使用最初未被改变的sequenceList，到最后变的一直都是playlist
      // 这里的sequenceList是在第一次点击列表的时候就已经定死了。所以只要点击了一次进来了，以后不管怎么变换播放模式，都是赋值。
      let list = [];
      if (index === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        // 另两种的情况要不就是顺序播放/要不就是循环播放。本身的list是不会变的。
        list = this.sequenceList;
      }
      // 如果这里直接切换变更list的话，就很大可能导致歌曲清单已经变化，但是index没变，一样的会导致现在播放的currentSong变化。
      let index1 = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this._setCurrentIndex(index1);
      this._setPlayList(list);
    },
    loop() {
      // 单独提取一年循环播放的方法。
      this.$refs.audiox.currentTime = 0;
      this.$refs.audiox.play();
      if(this.currentLyric){
          this.currentLyric.seek(0);
      }
    },
    ready(){
      this.songReady = true;
    },
    error() {
      // 如果当前的歌曲路径出错的话，songReady需要在次变为true,可以直接点击下一曲。不会出现死机现象
      this.songReady = true;
    },
    updateTime() {
      // 在歌曲的播放的过程中，更新时间。
       this.currentTime=this.$refs.audiox.currentTime;
    // 把这个比例传递过去。
       this.ratio=ratinTime(this.currentTime,this.currentSong.duration); 
    },
    end() {
      // 这里切换播放模式的话，其实也只是当现在的歌曲播放完成时自动识别的。
      //   有三种情况,顺序播放/随机播放/单曲循环
      if (this.mode === playMode.loop) {
        this.loop();
      } else if (this.mode === playMode.sequence) {
        this.next();
      }
      // 这里所采用的随机播放的模式，其实最终都是改变的playlist的。
      // 其实是当改变了模式之后，把randomlist的列表赋值给playlist。
      // 逻辑部分其实是放在了changmode里面的逻辑部分了。
    },
    disratio(ratio){
        // 这个是传回来的ratio
        const time=this.$refs.audiox.duration;
        this.$refs.audiox.currentTime=this.$refs.audiox.duration*ratio;
        if(this.currentLyric){
            this.currentLyric.seek(time*ratio*1000);
        }
    },
    touchS(e){ 
        this.touch.inited=true;
        this.touch.startX=e.touches[0].pageX;
        this.touch.startY=e.touches[0].pageY;
    },
    touchM(e){
        if(!this.touch.inited){
            return 
        }
        const touch=e.touches[0];
        let disx= touch.pageX-this.touch.startX;
        this.touch.movex=disx;
        let disY=touch.pageY-this.touch.startY;
        if(Math.abs(disx)<Math.abs(disY)){
            return 
        }
        let offsetWidth;  // 申明一个变量用来最终赋值给要移动的元素。
        let left;  // 用来记录歌词界面的初始位置。

         // 所以移动的位置就是。
        if(this.currentShow==='cd'){
            left=0;
        } else {
            left=-window.innerWidth;
        }
         // 这里限定了歌词最大能移动的位置是-window.innerWidth,但是这个移动的位置还要取一个最小值，这个值是不能大于o的，
         offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+disx)); 
         this.touch.ratioMove=Math.abs(offsetWidth/window.innerWidth);
        // 可以根据移动的比例依次计算出opacity的值。
        this.$refs.cd.style.opacity=1-this.touch.ratioMove;
        this.$refs.lyeric.style.transform=`translate3d(${offsetWidth}px,0,0)`;
    },
    touchE(e){
        // 接下来是移动停止的问。要有一个移动的限制，当移动的比例大于0.1时才让这个能够移动过去。
        let offsetWidth,opacity;
        if(this.currentShow==='cd'){
            // 当为cd时，这种
            if(this.touch.ratioMove>0.1){
               this.currentShow='lyeric';
               offsetWidth=-window.innerWidth;
               opacity=0;
               this.touch.ratioMove=1; // 做一下清空，防止下一次直接点击就可以切换当显示。
            }else{
               this.currentShow='cd';
               offsetWidth=0;
               opacity=1;
            }
        }else{
            if(this.touch.ratioMove<0.9){
                offsetWidth=0;
                this.currentShow='cd';
                opacity=1;
                this.touch.ratioMove=0;
            }else{
                offsetWidth=-window.innerWidth;
                opacity=0;
            }
        }
        this.$refs.lyeric.style.transform=`translate3d(${offsetWidth}px,0,0)`;
        this.$refs.cd.style.opacity=opacity;
        this.touch.inited=false;
    },
    _getLyericx(){
        this.currentSong._getLyeric().then((res)=>{
            this.currentLyric=new Lyric(res,this.handerlyric)
            // 作出一个判断代表当前是播放状态时才进行歌词的播放。
            if(this.songReady){
                this.currentLyric.play();
            }
        })
    },
    handerlyric(obj){
        this.currentNum=obj.lineNum
        this.currentTxt=obj.txt;
        let el;
        if(this.currentNum<6){
            this.$refs.scroll.scrollTo(0,0,1000);
        }else{
            el=this.$refs.lyricp[this.currentNum-7];
            this.$refs.scroll.scrollToElement(el,1000);
        }
    }
  },
  watch: {
    currentSong(newsong) {
      // 通过currentSong的监听改变来播放当前的这首歌。
       
    //  下面是为了防止歌词跳动的过程,清空之前歌曲的lyric对象。
      if(this.currentLyric){
          this.currentLyric.stop();
          this.currentNum=0;
      }  
      this.$nextTick(() => {
        // 这里在切换歌的时候就有必要通过设置当妆的currentSong来播放。
        this.$refs.audiox.play();
        // 这里调用方法，来产生歌词。
        this._getLyericx();
      });
    },
    playing(neyY) {
      // 这里直接监听播放所处在的状态，会更加的直接，也更加的方便。
      // playing的状态要变为false的话，只有一种方式，就是通过，点击暂停
      const audio = this.$refs.audiox;
      this.$nextTick(() => {
        neyY ? audio.play() : audio.pause();
      });
    },
    disMove(newY,oldY){
        console.log(newY);
    }
  },
  components: {
    progressbar,
    svgcircle,
    scroll
  },
  mounted() {
    // console.log(this.currentSong);
  }
};
</script>

<style lang='stylus' scoped>
@import '~common/stylus/veriable.styl'
@import '~common/stylus/mixin.styl'
.play
    .normal-play
        position fixed
        top 0
        left 0
        bottom 0
        right 0
        z-index 120
        background $color-background
        &.normal-enter-active, &.normal-leave-active
            transition all 0.4s
            .top, .bottom
                transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &.normal-enter, &.normal-leave-to
            opacity 0
            .top
                transform translate3d(0, -100px, 0)
            .bottom
                transform translate3d(0, -100px, 0)
        .backgroundimg
            position absolute
            width 100%
            height 100%
            top 0
            left 0
            z-index -1
            opacity 0.6
            filter blur(20px)
        .top
            position relative
            margin-bottom 20px
            .backicon
                position absolute
                left 6px
                top 0
                width 40px
                height 40px
                text-align center
                padding 9px
                box-sizing border-box
                transform rotate(-90deg)
                .icon-back
                    display block
                    font-size $font-size-large-x
                    color $color-theme
            .songtitle
                width 70%
                text-align center
                margin 0 auto
                font-size $font-size-large
                line-height 40px
                no-warp()
            .nametitle
                text-align center
                font-size $font-size-medium
                no-warp()
        .middle
            position fixed
            width 100%
            top 74px
            bottom 170px
            white-space nowrap
            font-size 0
            .middle-l
                position relative
                height 0
                width 100%
                padding-top 80%
                vertical-align top
                display inline-block
                .cd-wrap
                    position absolute
                    left 10%
                    top 0
                    width 80%
                    box-sizing border-box
                    .cd-wrap-in
                        width 100%
                        height 100%
                        border-radius 50%
                        border 10px solid $color-cd
                        box-sizing border-box
                        &.playbig
                            animation circle 200s linear infinite
                        &.pausebig
                            animation-play-state paused
                        .cd-img
                            border-radius 50%
                .linep
                    margin-top 50px    
                    text-align center
                    height 20px  
                    color yellow
                    font-size 16px
                    line-height 20px 
            .middle-r
                height 100%
                width 100%
                vertical-align top
                display inline-block
                font-size 20px
                .scroll
                   width 100%
                   height 100%
                   overflow hidden
                   padding 0 10% 0 10%
                   box-sizing border-box 
                   .lyric-warp
                      display flex
                      flex-direction column
                      justify-content center
                      .lyric-p-txt
                         text-align center
                         height 30px
                         line-height 30px
                         font-size 14px
                      .lyric-active   
                         color yellow
        .bottom
            position absolute
            bottom 50px
            width 100%
            .btn-warp
                display flex
                align-items center
                color $color-theme
                .icon
                    flex 1
                    &.disable
                        color $color-theme-d
                .icon-right
                    font-size 30px
                    text-align right
                .icon-left
                    font-size 30px
                    text-align left
                .icon-center
                    font-size 40px
                    text-align center
                    padding 0 20px
            .sign
                text-align center
                .dot
                    display inline-block
                    width 10px
                    height 10px
                    margin 0 4px
                    border-radius 50%
                    background-color $color-text-l
                .active
                    width 20px
                    border-radius 10px          
            .progress-bar
                display flex
                width 80%
                margin 0 auto
                align-items center
                .pro
                    flex 1
                    height 30px
                    padding 10px 0
                .time_bar
                    flex 0 0 30px
                    line-height 30px
                    text-align center
    .miniplay
        position fixed
        left 0
        bottom 0
        right 0
        z-index 120
        height 60px
        display flex
        align-items center
        background $color-background
        .imgicon
            flex 0 0 40px
            width 40px
            padding 0 10px 0 20px
            &.playbig
                animation circle 20s linear infinite
            &.pausebig
                animation-play-state paused
            .imgmini
                border-radius 50%
        .mininame
            flex 1
            display flex
            flex-direction column
            justify-content center
            line-height 20px
            .minititle
                font-size 14px
                margin-bottom 2px
            .minisinger
                font-size 12px
                color $color-text-l
        .contorl
            flex 0 0 30px
            width 30px
            padding 0 10px
            .icon-playlist
                font-size 30px
                color $color-theme-d
            .circlesvg
                .icon-pause-mini, .icon-play-mini
                    color $color-theme-d
                    font-size 30px
                .icon-mini
                    position absolute
                    top 0
                    left 0
                    font-size 32px
@keyframes circle
    0%
        transform rotate(0)
    100%
        transform rotate(360deg)
</style>
