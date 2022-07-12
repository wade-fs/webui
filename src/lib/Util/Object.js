//
// Object Helpers
//
export function isNull(value) {
  return value === undefined || value === null;
}
export function isObject(value) {
  return typeof value === "object";
}
export function isArray(value) {
  return Array.isArray(value);
}
export function isFunction(value) {
  return typeof value === "function";
}
export function numbersValid(numbers) {
  return (
    numbers != null &&
    numbers
      .map((v) => !isNaN(v))
      .reduce((last, v) => last === true && v === true, true)
  );
}
export function stringValid(s) {
  if (typeof s !== "string") return s != null && s.toString().length > 0;
  return s != null && s.length > 0;
}
export function arrayValid(s) {
  return s != null && s.length > 0;
}
export function isNumber(s) {
  return stringValid(s) && !isNaN(parseFloat(s));
}

export function objectEqual(objA, objB, keys, stack = []) {
  //Circular Reference Detector is needed to prevent infinity loop
  if (objA === objB) return true;
  if (!isObject(objA) || objA == null || !isObject(objB) || objB == null)
    return false;

  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);
  if (keys != null && keys.length > 0) {
    keysA = keys;
    keysB = keys;
  }
  if (keysA.length !== keysB.length) return false;

  // Test for A's keys different from B.
  let subEqual;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    const valueA = getObjectProperty(objA, key);
    const valueB = getObjectProperty(objB, key);
    if (stack.indexOf(valueA) === -1) {
      stack.push(valueA);
      subEqual = objectEqual(valueA, valueB, null, stack);
      stack.pop();
      if (!subEqual) return false;
    }
  }
  return true;
}
export function arrayEqual(array1, array2, keys) {
  if (array1 == array2) return true;
  if (array1 == null || array2 == null) return false;
  if (array1.length != array2.length) return false;

  for (let i = 0; i < array1.length; i++) {
    const value1 = array1[i];
    const value2 = array2[i];
    if (!objectEqual(value1, value2, keys)) return false;
  }
  return true;
}
export function iterateObject(obj, callback) {
  if (callback && obj)
    for (let key of Object.keys(obj)) {
      let value = obj[key];
      callback({ key, value });
    }
}
export function clone(obj) {
  if (isNull(obj)) return null;

  let copy,
    deep = false;
  if (isArray(obj)) {
    copy = [...obj];
    deep = true;
  } else if (isObject(obj)) {
    copy = { ...obj };
    deep = true;
  } else copy = obj;

  if (deep === true)
    iterateObject(obj, ({ key, value }) => {
      copy[key] = clone(value);
    });

  return copy;
}
export function getObjectProperty(obj, path) {
  if (obj == null || path == null) return null;
  let paths = path.split(".");
  paths.map((p) => {
    if (obj != null) obj = obj[p];
  });
  return obj;
}
export function different(obj, nextObj, paths) {
  if (obj === nextObj) return false;
  if (paths === null) return true;
  let diff = false;
  paths.map((path) => {
    if (diff === false)
      diff = getObjectProperty(obj, path) !== getObjectProperty(nextObj, path);
  });
  return diff;
}

export function getObjectFirstProperty(obj, ...properties) {
  if (!isNull(obj) && !isNull(properties) && isArray(properties))
    for (let i = 0; i < properties.length; i++) {
      let p = obj[properties[i]];
      if (!isNull(p)) return p;
    }
  return null;
}

export function isDefaultObject(obj) {
  return obj != null && Object.keys(obj).length == 0;
}
export function isNotEmptyObject(obj) {
  return obj != null && Object.keys(obj).length > 0;
}
