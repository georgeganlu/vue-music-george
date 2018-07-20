<template>
  <div id="app">
    
    <Headx></Headx>
    <Tabx></Tabx>  
    <keep-alive>
      <router-view></router-view>
    </keep-alive>   
    <play></play>
  </div>
</template>

<script>

import Headx from './components/header/header'
import Tabx from './components/tab/tab'
import play from './components/player/player'

export default {
  name: 'app',
  components:{
     Headx,
     Tabx,
     play    
  }
}
</script>

<style>

</style>
