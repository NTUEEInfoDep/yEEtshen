// If the name longer than the truncateLength,
// truncate the name to the truncateLength and
// append ellipsis to it.
function truncateName(name, truncateLength) {
  if (name.length <= truncateLength) { return name; }
  else { return (name.slice(0, truncateLength) + '...'); }
}

module.exports = {
  truncateName,
}
