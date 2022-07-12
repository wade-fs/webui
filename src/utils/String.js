export function toLetter(id) {
  if (id == null || isNaN(parseInt(id))) return "";
  if (typeof id === "number") {
    return String.fromCharCode(64 + id);
  }
  return String.fromCharCode(64 + parseInt(id));
}

export function toNumber(letter) {
  if (letter == null || typeof letter !== "string" || letter.length === 0)
    return "";
  return letter.charCodeAt() - 65 + 1;
}
