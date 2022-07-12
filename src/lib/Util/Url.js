import { stringValid } from 'lib/Util';

export function urlValid(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(#[-a-z\\d_]*)?$','i'); // fragment locater
  if(!pattern.exec(str)) {
    return false;
  } else {
    return true;
  }
}

export function getPara(name){
  let v = getHashPara(name);
  if(!stringValid(v))v = getQueryPara(name);
  return v == null ? '': v;
}
export function getHashPara(name){
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\#&]' + name + '=([^&#]*)');
    var results = regex.exec(location.hash);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
export function setHashPara(name,value){
    let uri = location.hash
    let re = new RegExp("([#&])" + name + "=.*?(&|$)", "i");
    let separator = uri.indexOf('#') !== -1 ? "&" : "#";
    if (uri.match(re)) {
        location.hash = uri.replace(re, '$1' + name + "=" + value + '$2');
    } else {
        location.hash = uri + separator + name + "=" + value;
    }
}
function getQueryPara(name) {
    if (window.URLSearchParams != null) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    } else {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}
function setQueryPara(name, value) {
    if (window.URLSearchParams != null) {
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.set(name, value);
        window.location.search = urlParams.toString();
    } else {
        let uri = window.location.search
        let re = new RegExp("([?&])" + name + "=.*?(&|$)", "i");
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            window.location.search = uri.replace(re, '$1' + name + "=" + value + '$2');
        } else {
            window.location.search = uri + separator + name + "=" + value;
        }
    }
}