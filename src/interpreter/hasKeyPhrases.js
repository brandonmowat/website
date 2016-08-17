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
export default String.prototype.hasKeyPhrases = function (keyphrases) {
  var sentences = this.split(".");
  for (var i in sentences) {
    for (var j in keyphrases) {
      console.log(keyphrases[j], sentences[i]);
      if (sentences[i].includes(keyphrases[j])) {
        return true;
      }
    }
  }
  return false;
}
