/*前台这里直接使用ajax就可以了。*/ 

import axios from 'axios'
import {commonparams,options} from './config'
import jsonp from 'common/js/jsonp'


export function getSinger(){
  // 这里合并传过来的私有参数。
  let data=Object.assign({},commonparams,{
     channel:'singer',
     page:'list',
     key:'all_all_all',
     pagesize:100,
     pagenum:1,
     loginUin:0,
     hostUin:0,
     format:'json',
     platform:'yqq',
     needNewCode:0
  });
 let url='/api/singer';
//  let uri='http://192.168.12.47:8750';
//  let urx=uri+url;
return axios.get(url,{
    params:data 
  }).then((res)=>{
      // Promise.resolve在次返回一个primise对象。
     return Promise.resolve(res.data); 
  })
}

export function singerlist(id){
   let url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg' 
   let data=Object.assign({},commonparams,{
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: id
   });

   return jsonp(url,data,options);
}
