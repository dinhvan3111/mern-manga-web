function isNumberic(val) {
  if (typeof val === "number") return true;
  if (typeof val !== "string") return false;
  return !isNaN(val) && !isNaN(parseInt(val));
}

function toNum(val) {
  if (typeof val === "number") return val;
  return parseInt(val.toString());
}

function toFloat(val) {
  if (typeof val === "number") return val;
  return parseFloat(val.toString());
}
module.exports = { isNumberic, toNum, toFloat };
