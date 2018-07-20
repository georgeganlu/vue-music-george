<template>
    <div class="progress-bar" @click='click'>
        <div class="progress">
            <div class="bar" ref="bar"></div>
            <div class="circle" ref='circle' @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'>
                <div class="circle-in"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
           
        }
    },
    props:{
        ratio:{
            type:Number
        }
    },
    watch:{
        ratio(newy,oldy){
            if(this.moveFlag){
                this.$refs.circle.style.left=this.progressWidth*newy+'px';
                this.$refs.bar.style.width=this.progressWidth*newy+'px';
            }
        }
    },
    created(){
        this.startA=0;
        this.moveB=0;
        this.barStartP=0;
        this.progressWidth=window.innerWidth*0.8-80;
        this.leftset=window.innerWidth*0.2/2+30;
        this.rightset=this.leftset+16;  //记录右边到球最后的位置。
        this.moveFlag=true; // 做一个移动的标记
    },
    methods:{
        touchstart(e){
            // 先获得初始的位置。
             this.startA=e.touches[0].pageX;
             this.moveFlag=false;
        },
        touchmove(e){
            this.moveB=e.touches[0].pageX;
            // 同时也有一个问题就是拖动位置大小的限制
            let dismove=this.moveB-this.leftset;
            if(dismove<=0){
                this.$refs.circle.style.left=0+'px';  
                this.$refs.bar.style.width=0+'px';  
            }else if(dismove>=this.progressWidth){
                this.$refs.circle.style.left=this.progressWidth+'px';
                this.$refs.bar.style.width=this.progressWidth+'px';
            }else{
                // 当移动的时候赋值的值应该减去一个边距的值。
                this.$refs.bar.style.width=dismove+'px';
                this.$refs.circle.style.left=dismove+"px";  // 这个宽度的赋值方式，子元素一定是基于父元素的。  
            }
        },
        touchend(){
            this.moveFlag=true;
            this._getMove(this.moveB);
        },
        _getMove(x){
            // 这里直接计算出moveB和起点的距离在和 this.progressWidth作比率就好了。
            let disratio=(x-this.leftset)/this.progressWidth;
            this.$emit("disratio",disratio);
        },
        click(e){
            console.log(e.clientX);
            let clientX=e.clientX;
            let leftMax=window.innerWidth-this.rightset;
            if(clientX>leftMax){
                clientX=leftMax
            }
            let disx=clientX-this.leftset; 
            this.$refs.circle.style.left=disx+'px';
            this.$refs.bar.style.width=disx+'px';
            let disratio=disx/this.progressWidth;
            this.$emit("disratio",disratio);
        }
    }
}
</script>

<style scoped lang='stylus'>

@import '~common/stylus/veriable.styl'
 .progress-bar
    .progress 
       position: relative;
       width: 100%
       height 4px
       .bar
          position: absolute;
          left 0
          top 0
          height 4px
          width 20px
          background $color-theme
       .circle 
          position absolute
          left 0px
          top -6px             
          height 16px
          width 16px
          border-radius 50%
          background #FFFFFF
          .circle-in
            position absolute
            left 3px
            top 3px
            box-sizing border-box
            width 10px
            height 10px
            background $color-theme
            border-radius 50%
          

</style>
