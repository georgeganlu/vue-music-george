import axios from 'axios'
import {commonparams} from 'api/config'
import {lyeric} from 'api/song'
import { resolve } from 'path';
import {Base64} from 'js-base64' 

class song{
    // 这里传值直接使用了解构
   constructor({id,mid,singer,name,album,duration,image,url}){
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
   }
  // 这里封一个方法，用来取回歌词的数据，当创建的这个类来调用这个方法的时候需要直接拿到数据的。
  _getLyeric(){
    if(this.lyeric){
      return Promise.resolve(this.lyeric);
    }
    return new Promise((resolve,reject)=>{
      lyeric(this.mid).then((res)=>{
        this.lyeric=Base64.decode(res.lyric);
        resolve(this.lyeric); 
      })
    })
  }
}

export function creatSong(musicData){
   return new song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
   })
}

function filterSinger(singer){
  // 取到对象里面的singer.name的名字。
  let ret=[];
  if(!singer){
     return ''
  }
  singer.forEach((v)=>{
     ret.push(v.name);
  })
  return ret.join('/');
}