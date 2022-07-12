import { getObjectProperty } from 'lib/Util';
import { default as update_ori } from 'immutability-helper';

function update(object, operation, path) {
  let target = getObjectProperty(object, path);
  if (target !== null) {
    for (let key of path.split(".").reverse()) {
      operation = { [key]: operation };
    }
  }
  return update_ori(object, operation);
}

export { update };