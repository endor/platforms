// origin: M
// builds a search query for lucene

module.exports = function(original_query) {
  var today = new Date(Date());
  return original_query + ' AND enddate<date>:[' + today.getFullYear()
    + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate()) + ' TO 2099-12-31]';
}

function pad(number) {
  if(number < 10) {
    return '0' + number;
  } else {
    return number;
  }
}