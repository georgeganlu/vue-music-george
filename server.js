let express=require('express');
let axios=require('axios');
let port='8750';
let app=express();
let appRouter=express.Router();

app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  


appRouter.get('/distList',function(req,res){
   var url='https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
   axios.get(url,{
     headers:{
       referer:'https://y.qq.com/portal/playlist.html'
     },
     params:req.query
   }).then((response)=>{
      res.json(response.data); 
   })
})

appRouter.get('/singer',(req,res)=>{
   let url='https://c.y.qq.com/v8/fcg-bin/v8.fcg';
   axios.get(url,{
      headers:{
        referer:'https://y.qq.com/portal/singer_list.html'
      },
      params:req.query
   }).then((response)=>{
      res.json(response.data); 
   })
});
app.use('/api',appRouter)  //这里是挂载注册这个路由

app.listen(port,()=>{
    console.log('服务起来了');
})

