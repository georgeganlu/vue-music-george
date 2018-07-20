<template>
   <div class="slider" ref="slider">
        <!--第一步和图片均可以正常显示了，下面的dots就是一小标记-->
       <div class="slider-group" ref="slidergroup">
          <slot></slot>
       </div>
       
       <div class="dots">
         <span class="dot" :class="{active:currentPageIndex === index }"  :key='index' 
            v-for="(item, index) in dots">
         </span>  
       </div>

   </div>  
</template>

<script>

import {addClass} from 'common/js/domClass'
import BScroll from 'better-scroll'

export default {
   name:"slider",
   props:{
     loop:{
       type:Boolean,
       default:true,
     },
     autoplay:{
       type:Boolean,
       default:true
     },
     interval:{
       type:Number,
       default:4000
     }
   },
  data(){
     return {
        dots:[],
        currentPageIndex:0
     }
   },
   methods:{
     _setSliderWidth(isresize){
      /*第一步是求出slider组件的宽度*/
       this.children=this.$refs.slidergroup.children;
       let width=0;
       let sliderWidth=this.$refs.slider.clientWidth;
       for(let i=0;i<this.children.length;i++){
         let child=this.children[i];
        /*这里写一个通用的判断一下这个child的子元素是否包含一个class*/  
         addClass(child,'slider-item');
         child.style.width=sliderWidth+'px';
         width+=sliderWidth; 
       }
       if(this.loop&&!isresize){
        /*如果是无缝轮播的话,对于betterScroll来说就必须要首尾多加一个宽度*/  
         width+=2*sliderWidth;
       }
       this.$refs.slidergroup.style.width=width+'px';
     },
     _initDots(){
        this.dots=new Array(this.children.length);
     },
     _initSliders(){
        this.slider=new BScroll(this.$refs.slider,{
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        });
        /*上面是初始化了better-scroll,下面要知道现在滚动到那一个页面了。*/
        /*下面的逻辑使用better-scroll的方法了,第一次滚动完成后,获取当前滚动到那一页了。*/
        this.slider.on("scrollEnd",()=>{
            let curPage=this.slider.getCurrentPage().pageX;
            /*这里是得到横向滚动的当前页面,如果这个滚动是无缝的,better-scroll在前后各增加了两张图片。so--*/
            if(this.loop){
               curPage-=1; 
            }
            /*直接把这个index给到currentPageIndex*/  
           this.currentPageIndex=curPage;
           if(this.loop){
            /*在上一次图片切换完成后,防止手动拖动图片，先手动清空计时，让下一次计时依旧能保持在4s执行。*/  
             clearTimeout(this.timer);
             this._play();
           }
        });  
      },
      /*还有一步是让betterScroll开始自动滚起来。*/
      _play(){
         let curpage=this.currentPageIndex+1;
         if(this.loop){
           curpage+=1;
         }
        /*使用settimeout但是每一次都清空了这个时间。*/
        this.timer=setTimeout(()=>{
          this.slider.goToPage(curpage,0,2000); 
        },this.interval);    
      } 
   },
   mounted:function(){
    /*当slider组件在mounted的时候，数据一定是需要加载出来的，所以slider组件的加载一定要使用v-if来完成,当组件有数后在加载出来*/  
     let vm=this;
     setTimeout(function(){
        vm._setSliderWidth();
        vm._initDots();
        vm._initSliders();
        if(vm.autoplay){
          vm._play();
        }  
     },20);
    /*作一个浏览器刷新频率的延迟*/  
    /*最后做一个resize的监听*/ 
    window.addEventListener("resize",()=>{
       if(!this.slider){
        /*这里如果这个slider没有初始化的话,这里应该是直接return不应该有*/  
        return 
       }
      /*如果这里是有的话*/  
      this._setSliderWidth(true);
      this.slider.refresh();
    },false);

   },
   destroyed(){
      clearTimeout(this.timer);  
   }
}
</script>

<style scoped lang='stylus'>
 
 @import '~common/stylus/veriable' 

    .slider
       min-height 1px
       position relative
       .slider-group
          white-space nowrap
          overflow hidden
          width 375px
          .slider-item
            text-align center
            overflow hidden
            float left
            box-sizing border-box
            width 375px
            a
            display block
            overflow hidden
            text-decoration none 
            width 100%
            img
              width 100%
              display block
        .dots
           position absolute
           left 0
           right 0
           bottom 12px
           font-size 0
           text-align center
           .dot
              display inline-block
              width 10px
              height 10px
              margin 2px 4px
              border-radius 50%
              background $color-text-l
              &.active
                width 20px
                border-radius 5px
                background yellow
                transition 0.9s background ease

</style>
