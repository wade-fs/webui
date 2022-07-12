import { getObjectFirstProperty } from 'lib/Util';

const variants = [null, 'moz', 'webkit', 'ms'];
function generateVariants(base){
    return variants.map(v=>v==null?base:(v+base.charAt(0).toUpperCase()+base.slice(1)));
}
export function getFullScreenApi(ele){
    return getObjectFirstProperty(ele, ...generateVariants('requestFullscreen'));
}
export function getExitFullScreenApi(){
    return getObjectFirstProperty(document, ...generateVariants('exitFullscreen'));
}
export function fullscreenEnabled(){
    return getObjectFirstProperty(document, ...generateVariants('fullscreenEnabled'));
}
export function getFullscreenElement(){
    return getObjectFirstProperty(document, ...generateVariants('fullscreenElement'));
}