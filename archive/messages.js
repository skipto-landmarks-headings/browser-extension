const messages = require('../_locales/en/messages.json');
const count = Object.entries(messages).length;

console.log(`There are ${count} words or phrases that need to be translated.`);
console.log('Each grouping below consists of three lines:');

console.log('\n(1) Message Key -- identifies the message to which your translation applies');
console.log('(2) Word/Phrase -- English version of the word or phrase to be translated');
console.log('(3) Translation -- please add your translation of word/phrase on this line');

console.log('\nNote: You may need to refer to the description fields for messages to get');
console.log('a better sense of the context in which a word or phrase is used. These can');
console.log('be found at:\n');
console.log('    https://github.com/skipto/extension/blob/master/_locales/en/messages.json')

console.log('\nNote: A phrase may include \'placeholders\', which are strings enclosed within');
console.log('dollar sign symbols (\'$\'). Please translate all of the text in the phrase,');
console.log('including punctuation, but without modifying the placeholders, as they will');
console.log('be replaced with content from the web page.')
console.log('\nPlease return this file as a plain text file.');
console.log('\nThank you in advance! Your help is greatly appreciated.');

for (const [key, {message, description}] of Object.entries(messages)) {
  console.log(`\nMessage Key: ${key}`);
  console.log(`Word/Phrase: ${message}`);
  console.log('Translation:');
}
