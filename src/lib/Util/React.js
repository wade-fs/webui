//for better compare of react(shouldComponentUpdate)
//React.js pure render performance anti-pattern
export const defaultArray = [];
export const defaultObject = {};
export function getValue(e){
  let{ type,name,value,checked } = e.target;
  // if (type == 'checkbox') value = checked;
  if (type == 'file') value = e.target.files;
  return {[name]:value};
}
