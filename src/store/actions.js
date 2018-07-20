// 主要用来作异步的mutations的操作，mutations里面是改变state的状态，只能是同步的操作。
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/shuffle'


export const selectPlay=({commit,state},{list,index,random})=>{
    commit(types.SET_SEQUENCELIST,list); 
    // 选择对应的歌曲后需要使用actions来异步同时提交多个mutations,在mutations中一次只能提交一个mutation
    if(state.mode===playMode.random||random==="random"){
      let listShuffle=shuffle(list);
      commit(types.SET_PLAYLIST,listShuffle);
      index=listShuffle.findIndex((item)=>{
        return item.id===list[index].id;
      });
    } else {
        commit(types.SET_PLAYLIST,list);
    }
    // 上面两个确定播放列表的顺序。
    commit(types.SET_CURRENTINDEX,index);
    commit(types.SET_FULLSCREEN,true);
    commit(types.SET_PLAYING,true);
}

