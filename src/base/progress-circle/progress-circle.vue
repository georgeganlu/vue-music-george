<template>
    <div class="progress-circle">
        <svg width="32" height="32" version="1.1" viewBox='0 0 100 100' xmlns="http://www.w3.org/2000/svg">
            <circle class="c1" cx="50" cy="50" r="50" fill="transparent" />
            <circle class="c2" cx="50" cy="50" r="50" fill="transparent" 
             :stroke-dasharray='strokeArray'  :stroke-dashoffset='offsetData' />
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data(){
        return {
            strokeArray: Math.PI * 100,
        }
    },
    props:{
        ratio:{
            type:Number
        }
    },
    computed:{
      offsetData(){
          return this.strokeArray*(1-this.ratio);
      }
    },
    created(){
    //    this.offsetData=this.strokeArray*0.4-0
    }
}
</script>

<style lang='stylus' scoped>

@import '~common/stylus/veriable.styl'

   .progress-circle
      position relative
      circle
        stroke-width 8px
        transform-origin center
        &.c1
          stroke $color-cd
          transform: scale(0.9);
        &.c2
          stroke $color-theme  
          transform: scale(0.9) rotate(-90deg)
          
</style>
