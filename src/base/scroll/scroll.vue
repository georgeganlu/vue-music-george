<template>
   <div class="slider-wrap" ref='warp'>
     <slot></slot> 
   </div>  
</template>

<script>

import BScroll from 'better-scroll'

export default {

    /*scroll滚动主要的是先写好默认好的值,然后在外面直接使用scroll组件,只需要把传进进来的data监听一下，如果变化的话，就重新调用方法*/ 

   props:{
    /*封装好的scroll组件应该能接收下面的props传参。*/   
      probeType:{
          type:Number,
          default:1
      },
      click:{
          type:Boolean,
          default:true
      },
      scrollX:{
          type:Boolean,
          default:false
      },
      listenScroll:{
          type:Boolean,
          default:false
      },
      data:{
          type:Array,
          default:[]
      },
      pullUpLoad:{
          type:Boolean,
          default:false
      },
      pullDownRefresh:{
          type:Boolean,
          default:false
      },
      beforeScroll:{
          type:Boolean,
          default:false
      },
      refreshDelay:{
          type:Number,
          default:20
      }
   },
   methods:{
      _initslider(){
         if(!this.$refs.warp){
             return 
         }
        /*better-scroll也要挂载在某个具体的元素上。*/  
         this.slider=new BScroll(this.$refs.warp,{
             probeType:this.probeType  
         });

         if(this.listenScroll){
             this.slider.on("scroll",(pos)=>{
                 this.$emit("scroll",pos);
             })
         }
         if(this.pullUpLoad){
            this.slider.on("scrollEnd",()=>{
              if(this.slider.y<= (this.slider.maxScrollY+50)){
                  this.$emit("scrollEnd");
              }    
            })
         }
         if(this.pullDownRefresh){
           this.slider.on("touchEnd",(pos)=>{
               if(pos.y>50){
                   this.$emit("pulldown");
               }    
           })    
         }
      },
      disable() {
        // 代理better-scroll的disable方法
        this.slider && this.scroll.disable();
      },
      enable() {
        // 代理better-scroll的enable方法
        this.slider && this.scroll.enable();
      },
      refresh(){
          this.slider && this.slider.refresh();
      },
      scrollTo(){
          this.slider && this.slider.scrollTo.apply(this.slider,arguments);
      },
      scrollToElement(){
          this.slider && this.slider.scrollToElement.apply(this.slider,arguments);
      }
   },
   mounted(){
      setTimeout(()=> {
          this._initslider();
      }, 20); 
    /*给一个浏览器17毫秒的刷新*/   
   },
   watch:{
      data:function(){
          setTimeout(()=>{
              this.refresh();                        
          },this.refreshDelay);
      }
   }
}
</script>

<style>

</style>
