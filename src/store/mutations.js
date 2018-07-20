import * as types from './mutation-types'

// 接下来定义mutations
// 对象字量面来定义,把表达式放在【】内成为对象的key,---属性名

const mutations = {
  // 这里面接收的state和最开始定义的vuex一样，同样代表了整个所有的状态。
  [types.SET_SINGER](state, params) {
    state.singer = params;
  },
  [types.SET_PLAYING](state, params) {
    state.playing = params;
  },
  [types.SET_FULLSCREEN](state, params) {
    state.fullScreen = params;
  },
  [types.SET_PLAYLIST](state, params) {
    state.playlist = params;
  },
  [types.SET_SEQUENCELIST](state, params) {
    state.sequenceList = params;
  },
  [types.SET_MODE](state, params) {
    state.mode = params;
  },
  [types.SET_CURRENTINDEX](state, params) {
    state.currentIndex = params;
  },
}

export default mutations;
