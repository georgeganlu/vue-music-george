export function addClass(el,className){
    if(el.classList.contains("slider-item")===true){
        return false;          
    }
    el.classList.add(className); 
}