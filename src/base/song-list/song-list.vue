<template>
    <div>
        <ul>
            <li class="item" v-for='(item,index) in song' :key='index' @click='select(item,index)'>
                <div class="content">
                    <h2 v-html='item.name' class="title"></h2>
                    <p v-text='getp(item)' class="pargraph"></p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

// 这里是song-list的基础组件，不用写业务逻辑，点击的话把需要的状态传递到vuex中去


export default {
    props: {
        song: {
            type: Array,
            default: []
        }
    },
    methods: {
        getp(item) {
            return `${item.singer}--${item.album}`
        },
        select(item,index){
           this.$emit("selected",item,index);
        }
    },
    mounted(){
    //    console.log(this.song); 
    }
}
</script>

<style scoped lang='stylus'>

@import '~common/stylus/mixin.styl'
@import '~common/stylus/veriable.styl'

   .item
      display flex
      item-align center
      box-sizing border-box
      padding 7px
      height 60px
      font-size $font-size-medium
      .title
        margin-bottom 6px
        no-warp()
      .pargraph
        no-warp()
        color $color-text-d

</style>
