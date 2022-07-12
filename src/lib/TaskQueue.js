import { iterateObject } from './Util';

export default class TaskLimiter{
  constructor() {
    this.map = {};
    this.clock = 100;
    this.checkTask = null;
  }
  add({ name,time=1000,callback }){
    let{ map,check,clock,checkTask } = this;
    map[name] = {time:new Date().getTime() + time,callback};
    if(checkTask === null)this.checkTask = setTimeout(()=>{check.apply(this)},clock);
  }
  execute(name){
    let{ map,check,clock,checkTask } = this;
    iterateObject(map,({ key,value })=>{if(name === null || name === key)value.time = 0});
    if(checkTask == null)this.checkTask = setTimeout(()=>{check.apply(this)},clock);
  }
  check(){
    this.checkTask = null;
    let[ count,current ] = [0,new Date().getTime()];
    let{ map,check,clock } = this;
    iterateObject(map,({key, value})=>{
      let{ time,callback } = value;
      if(time <= current){
        delete map[key];
        if(callback)callback();
      }else count++;
    });
    if(count>0)this.checkTask = setTimeout(()=>{check.apply(this)},clock);
  }
}