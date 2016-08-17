/**
  * Returns a string that has no punctuation.
  *
  *
  */
String.prototype.stripPunctuation = function () {
  return this.replace(/\W+/, '');
}

/**
  * Returns true if the string contains any of the keywords (eg. not)
  * @param {keywords} An array of String keywords.
  * @return {Boolean} A boolean depending on if the sentence has a keyword.
  */
export default String.prototype.hasKeyWords = function (keywords) {
  var sentence = this.split(" ");
  for (var i in sentence) {
    console.log(sentence[i].stripPunctuation())
    if (keywords.includes(sentence[i].stripPunctuation())) {
      return true;
    }
  }
  return false;
}
