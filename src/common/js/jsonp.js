// 导入一个新的jsonp文件。
import originJSONP from 'jsonp'


//这里默认导出这个jsonp的函数,通过defautl导出就可以直接使用了,直接是一个对象的方法。
export default function jsonp (url, data, option) {
     url+=(url.indexOf('?')<0? '?' :'&')+params(data)
 
   return new Promise(function(resolve,reject){
      originJSONP(url,option, function(err,data){
         if(!err){
           resolve(data);  
         }else{
           reject(data);
         }     
      })    
   })
}

function params(data){
  // 这上函数是专门来对传入的参数进行处理的。
   let url='';
   for(var k  in data){
     let value=data[k]!==undefined?data[k]:''
    url+='&'+k+'='+encodeURIComponent(value);      
   }
  //  返回的时候把第一个&符号去掉。
   return url?url.substring(1):''
}