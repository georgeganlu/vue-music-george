<template>
  <div>
    <!--在滚动之前先要确定滚动条父级的位置-->
    <div class="singer" ref='singer' v-if='singerData.length'>
      <scroll :data='singerData' class="scroll-content" 
      @scroll='scroll' :listenScroll='listenscroll' :probeType='probetype' ref='scrollbase'>

        <!--整个滑动的组件是ul,在侧边的话可以有一个ul name的连动选择的-->
        <ul ref='heightul'>
          <li v-for='(item,index) in singerData' :key='index' class="item-big" ref='itemli'>
            <h2 v-text='item.title' class="item-title"></h2>
            <ul class="inside-ul">
              <li class="item-small" v-for='(item1,index1) in item.items' :key='index1' @click='selectitem(item1,index1)'>
                <img :src="item1.imgurl" alt="" width="50" height="50" class='imgitem'>
                <span v-text='item1.name' class='spanitem'></span>
              </li>
            </ul>
          </li>
        </ul>
        <!--这里是侧边的listnam位置。-->
        <!-- 这里直接给上面的元素设置事件,在向下传播过去。其实是由点的li向上传播 -->
        <div class="list-name" @touchstart.stop.prevent='touchStart' @touchmove.stop.prevent='touchmove'>
          <ul>
            <li v-for='(item,index) in singerOrder' :data-index='index' :key='index' v-text='item' class="item-name" :class="{'current':currentIndex===index}"></li>
          </ul>
        </div>
        <!--这里是固定到头的条-->

        <div class="fix-title" v-show='title' ref='fixtitle'>
          <h2 class="fix-title-h">{{title}}</h2>
        </div>

      </scroll>
    </div>

    <router-view></router-view>

  </div>
</template>

<script>

import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/Singer'
import scroll from 'base/scroll/scroll'
import {mapMutations} from 'vuex'
import {playlistMixins} from 'common/js/mixins'

const TitleHeight = 30;
const liHeight = 16;

export default {
  name: 'header',
  mixins:[playlistMixins],
  data() {
    return {
      singerOrder: [],
      singerData: [],
      listenscroll: true,
      probetype: 3,
      scrolly: 0,
      currentIndex: 0,
      transDis: '',
      touch: {},
      singer:{}
    }
  },
  methods: {
    _getSinger() {
      getSinger().then((res) => {
        if (res.code === ERR_OK) {
          let data = res.data.list;
          /*这里的data是一个大的数据的数组。*/
          let map = {
            hot: {
              title: '热',
              items: []
            }
          };
          data.forEach(function(item, index) {
            if (index < 10) {
              map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
            }
            //接下来不停的创建map的子对象。使用需要提取出来的那个字母
            let key = item.Findex;
            if (!map[key]) {
              map[key] = {
                title: key,
                items: []
              }
            }
            map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
          });
          /*这里声明两个数组，一个数据用来存前的字母名，一个数组用来存放遍历的具体内容。*/
          let hotData = [];
          let retData = [];
          for (let value in map) {
            let regex = /[a-zA-Z]/;
            if (regex.test(map[value].title)) {
              retData.push(map[value]);
            } else if (map[value].title === '热') {
              hotData.push(map[value]);
            }
          }
          retData.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0);
          });
          this.singerData = hotData.concat(retData);
          this.singerData.forEach((item, index) => {
            this.singerOrder.push(item.title.substring(0, 1));
          });

          // 这里调用计算高度的方法。
          this.$nextTick(() => {
            this.calcullateheight();
          });
        }
      });
    },
    scroll(pos) {
      /*这里接受到了滚动的位置，那边是监听的事件。*/
      this.scrolly = pos.y;
    },
    sureIndex(newy) {
      const listHeight = this.listHeight;
      //  需要把滑动出来的位置取一个绝对值来进行比较
      if (newy >= 0) {
        this.currentIndex = 0;
        return false;
      }
      let disx = Math.abs(newy);

      for (let k = 0; k < listHeight.length - 1; k++) {
        let d1 = listHeight[k];
        let d2 = listHeight[k + 1];   //如果从第二个开始的话，d2现在就是第一个元素的高度。
        // 现在是循环作出比较，确定index是那一个元素。
        if ((disx >= d1 && disx < d2) || !d2) {
          this.currentIndex = k;
          this.transDis = d2 - disx;  //得出相减的值,来计算平滑移动的距离。
          return false;
        }
      }
      this.currentIndex = listHeight.length - 2;
    },
    touchStart(e) {
      // 这里点击那一个就是那一个,所有如果要和右边有一样的hover状态的话，就直接来改变这个index的话，就直接是同步的。
      let index = e.target.getAttribute("data-index");  //获取的形式是字符串的形式的。
      if (index === null) {
        return false;
      } else {
        index = index - 0;
        this.touch.firstIndex = index;
      }
      // 要获得touch第一次点的坐标,以及记录现在的索引。以计算滑动时的索引应该到那一个。
      this.touch.y1 = e.touches[0].pageY;
      //还是要点击之后这个元素进行滚动。
      this.scrollTo(index);
    },
    touchmove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let delta = (this.touch.y2 - this.touch.y1) / liHeight | 0;
      let index = this.touch.firstIndex + delta;
      this.scrollTo(index);
    },
    scrollTo(index) {
      // 要能按元素的索引来一滚动到相应的无素。
      if (index > 0 || index === 0) {
        // 在组件外面重新使用scrolltoElement的话，！！！！！如果把滚动的时间设为0的话不会触发组scroll组件的scroll事件。
        this.$refs.scrollbase.scrollToElement(this.listli[index], 200);
        // 这里需要把这个新滚动动索引给到scrollY这个值，由scrollY值监听的改变现在的值。
        //this.scrolly=-this.listHeight[index];  //向上滚动是一个负值。需要给一个符合要求的值。接下来的事，就是正常滚动的那样由自己计算完成下面的事情。
      } else {
        return;
      }
    },
    calcullateheight() {
      this.listli = this.$refs.itemli;  //需要获得每个li的高度。
      this.listHeight = [];
      let height = 0;
      this.listHeight.push(height);
      this.listli.forEach((item, index) => {
        height += item.clientHeight;
        this.listHeight.push(height); //这样可以得出每个元素的高度。   
      });
    },
    selectitem(item,index){
      /*这里点击的话，就是进入正式的路由里面去了。*/ 
      this.$router.push({path:`/singer/${item.id}`});
      /*这里通过vuex来传递值。*/
      this.setSinger(item);
    },
    heightHandle(list){
      const height=list.length>0?'60px':'0px';
      this.$refs.singer.style.bottom=height;
      this.$refs.scrollbase.refresh();
    },
    // 这里通过vuex来把singer-item的数组传递过去,具体反映去vuex中的话就是mutation去映射去方法中去,映射的周时用到了数组的解构。
    ...mapMutations({
       setSinger:'SET_SINGER'
    })
  },
  computed: {
    title: function() {
      /*这里利用函数直接返回的方法就是computed的get方法。*/
      /*计算属性随便都可以写。只需要随便的一个变量改变了之后,返回东西就行。*/
      if (this.scrolly > 0) {
        return ''
      }
      return this.singerOrder[this.currentIndex] ? this.singerOrder[this.currentIndex] : ''
    }

  },
  components: {
    scroll
  },
  watch: {
    scrolly: function(newy) {
      // 这里是时时监听滚动返回来的Y轴的值,先收集到所有li的值。
      this.sureIndex(newy);
    },
    transDis: function(newVal) {
      let fixedTop = (newVal > 0 && newVal < TitleHeight) ? newVal - TitleHeight : 0
      // if (this.fixedTop === fixedTop) {
      //   return
      // }
      // // 这里用的是newVal来减去的titleHeight这个高度，向上滑动用的是负值。
      // this.fixedTop = fixedTop;  
      this.$refs.fixtitle.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  created() {
    this._getSinger();
  }
}

</script>

<style scoped lang='stylus'>

@import '~common/stylus/veriable.styl'
    .singer
      position fixed
      top 88px
      bottom 0px
      width 100vw
      background-color $color-background-d
      .scroll-content
         height 100%
         width 100%
         overflow hidden
         position relative
         .item-big
            padding 0 0 30px 0
            .item-title
               height 30px
               line-height 30px
               padding-left 20px
               background #333
            .inside-ul
               padding-bottom 20px
               .item-small
                  padding 20px 0  0 30px
                  display flex
                  align-items center
                  .imgitem
                     border-radius 50%
                     margin-right 24px
                  .spanitem
                     color $color-text-l
                     font-size $font-size-medium
        .list-name
            position: absolute;
            right: 0
            top: 30px
            width: 26px
            text-align: center
            padding: 20px 0
            border-radius: 10px
            background-color $color-background-d
            .item-name
               font-size $font-size-medium-x
               color $color-text-l   
               margin 2px 0
               font-weight 200
            .current
               color yellow    
        .fix-title
            position absolute
            top 0
            left 0
            height 30px
            line-height 30px
            padding-left 20px
            background #333
            width 100%



            
</style>
