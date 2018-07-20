<template>
    <transition name="sinin">
        <musli  :bgimg='bgimg' :title='title' :song='song'></musli>  
    </transition>     
</template>

<script>
// 这里是一个业务组件
import musli from 'components/music-list/music-list'
import {singerlist} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {creatSong} from 'common/js/song'

export default {
  components:{
     musli
  },
  data(){
    return {
       song:[],
       title:'',
       bgimg:''
    }
  },
  methods:{
    // 这里是一个业务的组件，应该有去直接获取数据，传到基础组件中去。
    _getSingerList(){
        // 有可能是在刷新的时候进入，不应该进去子路由，vuex传递的直接是一个空的对象,如果刷新进来的话，没有这个id值，就退回到上一级中去。
        if(!this.singer.id){
          this.$router.push({path:'/singer'});
          return false;
        }
        singerlist(this.singer.id).then((res)=>{
            if(res.code===ERR_OK){
               this.bgimg=this.singer.imgurl;
               this.title=this.singer.name;
               this.song=this.newsongs(res.data.list);
            }   
        });
    },
    newsongs(data){
       let ret=[];
       data.forEach((item)=>{
          let {musicData}=item;
          ret.push(creatSong(musicData));
       });
      return ret
    }
  },
  computed:{
    //  有一个数据其实在从vuex里面映射过来的。
    ...mapGetters([
      'singer'   
    ])
  },
  created(){
      this._getSingerList();
  }
}
</script>

<style scoped lang='stylus'>
  .sinin-enter-active, .sinin-leave-active
      transition all 0.4s
  .sinin-enter,.sinin-leave-to
      transform translate3d(100%,0,0);    
 
</style>
