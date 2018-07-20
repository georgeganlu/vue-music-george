<template>
  <div class="m-head">
     <div class="icom"></div>
     <h2 class="titleflag">George Music</h2>
     <router-link tag="div" class="mine" to='/user'>
         <span class="icon-mine"></span> 
     </router-link>
  </div>
</template>

<script>


export default {
   name:'header'
}
</script>

<style scoped lang='stylus'>

@import '~common/stylus/veriable.styl'
@import '~common/stylus/mixin.styl'

.m-head
   postition:relative
   text-align:center
   height:44px
   font-size:0px
   color:$color-theme
   .icom
     display:inline-block
     vertical-align:top
     width:30px
     height:32px;
     bg-image('logo')
     background-size:30px 32px
     margin-top:6px;
     margin-right 8px
  .titleflag
     display:inline-block
     vertical-align:top
     line-height:44px
     font-size $font-size-large
  .mine 
    position: absolute
    top: 0
    right: 0
    .icon-mine
      display: inline-block
      padding: 12px
      font-size: 20px
      // height 44px
      // width 44px
      // line-height 44px
      // font-size 20px
      // text-align center
      color: $color-theme
</style>
