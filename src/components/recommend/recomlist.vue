<template>
  <transition name='recom'>
      <musiclist :title='title' 
         :bgimg='recomData.imgurl'
         :song='songs'
         ></musiclist>
  </transition>
      <!-- 就是一个热门歌曲页面的父页面。 -->
</template>

<script>
import musiclist from 'components/music-list/music-list'
import {_getRecomSong} from 'api/recommend'
import {creatSong} from 'common/js/song'

export default {
    components: {
        musiclist
    },
    props: {
        recomData:{
            type:null,
            default:''
        }
    },
    computed: {
      title(){
          return this.recomData.name
      }  
    },
    data(){
        return {
            songs:[]
        }
    },
    created () {
        this._getSong(this.recomData.dissid);
    },
    methods: {
        _getSong(id){
             if(!this.recomData.dissid){
                this.$router.push('/recommend');
                return false
            }
            _getRecomSong(id).then((res)=>{
                this.songs=res.cdlist[0].songlist;
                this.songs=this.receive(this.songs);
                console.log(this.songs);
            })
        },
        receive(list){
            let arr=[];
            list.forEach(el => {
                if(el.songmid&&el.albumid){
                    arr.push(creatSong(el));
                }
            });
            return arr;
        }
    }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/veriable.styl'

.recom-enter-active,.recom-leave-active
    transition all 0.3s
.recom-enter,.recom-leave-to
    transform translate3d(100%,0,0)



</style>
