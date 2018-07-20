import axios from 'axios'
import {commonparams} from './config'

export function lyeric(mid){
    let url='/api/lyeric';
    let data=Object.assign({},commonparams,{
        songmid:mid,
        pcachetime:+new Date(),
        format:"json",
        platform:"yqq",
        needNewCode:0,
        hostUin:0,
        loginUin:0
    })
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data); 
    })
}


