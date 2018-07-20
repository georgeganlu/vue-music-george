export function dateTime(timex){
//  这个时间是时时获取的。
    let time=timex|0;
    let min= time/60 | 0;
    let sec=time%60;
    let str;
    if(sec<10){
        str=`0${sec}`;
    } else {
        str=sec;
    }
    return `${min}:${str}`
}


export function ratinTime(time1,time2){
    return time1 / time2;
}
