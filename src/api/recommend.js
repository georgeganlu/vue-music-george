
/*像jsonp公共的js请求的话,就单独建立一个请求。*/ 
import jsonp from 'common/js/jsonp'
import {commonparams,options} from './config'
import axios from 'axios'

// 第一个用在推荐页面,用export导出函数的话，
export  function getRecommend(){
     let url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
     let data=Object.assign({},commonparams,{
         platform:'h5',
         uin:0,
         needWewCode:1
     });
    return jsonp(url,data,options);  
}

// 用来获取热门歌词的歌曲。
export function _getRecomSong(id){
    console.log(id);
    let data=Object.assign({},commonparams,{
        type:1,
        json:1,
        utf8:1,
        disstid:id,
        format:'json',
        g_tk:"5381",
        loginUin:0,
        hostUin:0,
        notice:0,
        platform:"yqq",
        needNewCode:0
    });
    return axios.get('/api/recom',{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data);
    })
}




// 用来获取热门歌单的推荐列表
export function getDistList(){
/*用axios来请求本地的接口*/
  let data=Object.assign({},commonparams,{
    platform: 'yqq',
    hostUin: 0,
    sin: 30,
    ein: 59,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
 let url='/api/distList';
//  let uri='http://192.168.12.47:8750';
//  let urx=uri+url;
return axios.get(url,{
    params:data
}).then((res)=>{
     return Promise.resolve(res.data);  //Promise.resolve(value)直接在次返回一个promise的对象,value就是传回去的值。
  });   
}