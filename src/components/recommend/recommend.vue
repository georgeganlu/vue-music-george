<template>
  <div class="recommend" ref='recommend'>
    <!--包含一个整体滚动体和一个轮播图。-->
       <!--先完成轮播图-->
     <scroll  :data='discList' ref="scroll"  class="scroll-content">
        <div>
          <div v-if='recommends.length'>
            <slider>
                <div v-for='(item,index) in recommends' :key='index' class="slider-item">
                  <a :href="item.linkUrl">
                      <img :src="item.picUrl" alt="" @load='imgload'>  
                  </a> 
                </div>   
            </slider>
          </div>

          <div class="recommend-list">
            <h2 class="recommend-hot">热门歌单推荐</h2>
            <ul>
              <li class="list-item" v-for='(item,index) in discList' :key='index' @click='select(item)'>
                <!--这里的布局采用了水平flex的模式 -->
                <div class="list-row-left">
                  <img alt="" width="60" height="60" v-lazy='item.imgurl'>
                </div>
                <div class="list-row-right">
                  <!--这里的布局采用了垂直flex的模式 -->
                  <h3 v-text='item.creator.name' class="item-title"></h3>
                  <p v-text='item.dissname' class="item-content"></p>
                </div>
              </li>
            </ul>
          </div>

        </div>    
     </scroll>  
     <router-view :recomData='recomData'></router-view>
  </div>
  
</template>
 
<script>

import {ERR_OK} from 'api/config'
import {getRecommend,getDistList} from 'api/recommend'
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import {playlistMixins} from 'common/js/mixins'

export default {
  mixins:[playlistMixins],
   name:'header',
   data(){
     return {
        recommends:[],
        discList:[],
        recomData:{} 
     }
   },
   components:{
     slider,
     scroll
   },
   methods:{
     heightHandle(list){
        const height=list.length>0?'60px':'0px';
        this.$refs.recommend.style.bottom=height;
        this.$refs.scroll.refresh();
     },
     _getRecommend(){
       let vm=this;
        getRecommend().then((res)=>{
          if(res.code===ERR_OK){
             vm.recommends=res.data.slider;
             this.$nextTick(()=>{
               this.$refs.scroll.refresh();
             })
          }
        }); 
     },
     _getDistList(){
         getDistList().then((res)=>{
             if(res.code===ERR_OK){
               this.discList=res.data.list;
            }  
         })
     },
     imgload(){
       if(!this.checked){
         this.$refs.scroll.refresh();  //这里可以拿到这个组件的索引,可以直接调用这个组件里面的方法。
         this.checked=true;  //只要有一张图片加载完成就可以了。不需要连需要连续的加载。
       }
     },
     select(item){
       this.$router.push({path:`/recommend/${item.dissid}`});
       this.recomData=item;
     }
   },
   created(){
      /*第一步先获取轮翻图的数据*/
     setTimeout(()=>{
      this._getRecommend(); 
     }, 1000);
    
      // this._getRecommend(); 
      /*第二步获取哥单的热门数据*/
      this._getDistList();  
   }
}
</script>

<style scoped lang='stylus'>

@import '~common/stylus/veriable.styl'
   .recommend
      position: fixed
      width: 100%
      top: 88px
      bottom: 0
      .scroll-content
        overflow hidden
        height 100%  
        .recommend-list
          .recommend-hot
            height 50px
            line-height 50px
            text-align center
            color $color-theme
          .list-item
            display flex
            align-items center
            box-sizing border-box  //设置成box-sizing之后设内边距就不会超出最大宽度
            padding 0 20px 20px 20px
            .list-row-left
                flex 0 0 80px
            .list-row-right
                flex 1
                display flex
                flex-direction column
                line-height: 20px
                overflow: hidden
                font-size: 14px
                .item-title
                  padding-bottom 10px
                .item-content
                  color $color-text-d


    
</style>
