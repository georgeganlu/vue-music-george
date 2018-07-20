 export function shuffle(arr1) {
   var res = [];
   let arr = arr1.slice();  //这里需要的是复制不是引用复制--深拷贝,
   for (var i = 0, len = arr.length; i < len; i++) {
     var j = Math.floor(Math.random() * arr.length);
     res[i] = arr[j];
     arr.splice(j, 1);
   }
   return res;
 }
