// 这里state一定是一种状态存在的。
// 进入播放列表的状态后，先定义vuex的状态。

import {playMode} from 'common/js/config'

const state={
    singer:{},
    playing:false,
    fullScreen:false,
    playlist:[],  //当前播放列表 
    sequenceList:[], //顺序播放列表
    mode:playMode.sequence,  //播放模式。
    currentIndex:-1
}

export default state