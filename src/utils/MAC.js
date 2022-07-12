export function macFormatter(str) {
  const trimValue = str.trim();
  let formatted = trimValue.replace(/(.{2})/g, "$& ").toUpperCase();
  const lastWord = formatted.substr(formatted.length - 1, 1);
  if (lastWord === " ") formatted = formatted.substr(0, formatted.length - 1);

  return formatted;
}

export function macDeformatter(str) {
  return str.replace(/ /g, "");
}
