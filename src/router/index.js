import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// 按需加载组件到路由页面的话,vue可以将组件定义为一个工厂函数
// 在这里的话，就可以是下面的这种样式。


const User=function(resolve){
   import('components/user/user').then((user)=>{
      // 接下来工厂函数接收的resove回调，这是vue内部定义实现的。
      resolve(user);
   })
}

const Search=function(resolve){
  import('components/search/search').then((user)=>{
     // 接下来工厂函数接收的resove回调，这是vue内部定义实现的。
     resolve(user);
  })
}


const Rank=function(resolve){
  import('components/rank/rank').then((user)=>{
     // 接下来工厂函数接收的resove回调，这是vue内部定义实现的。
     resolve(user);
  })
}


const Singer=function(resolve){
  import('components/singer/singer').then((user)=>{
     // 接下来工厂函数接收的resove回调，这是vue内部定义实现的。
     resolve(user);
  })
}
const Singerdetail=(resolve)=>{
  import('components/singerdetail/singerdetail').then((res)=>{
      resolve(res); 
  })
}


const Recommend=function(resolve){import('components/recommend/recommend').then((user)=>{resolve(user);})}
const RecomList=function(resolve){import('components/recommend/recomlist').then((user)=>{resolve(user);})}





export default new Router({
  routes: [
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children:[
        {
          path:':id',
          component:RecomList
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children:[
        {
          path:':id',
          component:Singerdetail
        }  
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/',
      redirect:'/recommend'
    },
    {
      path:'/user',
      component:User
    }
  ]
})
