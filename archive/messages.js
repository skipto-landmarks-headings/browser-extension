const messages = require('../_locales/en/messages.json');
const count = Object.entries(messages).length;

console.log(`There are ${count} words or phrases that need to be translated.`);
console.log('Each grouping below consists of four lines:');
console.log('\n(1) Message Key -- identifies the message to which your translation applies');
console.log('(2) Word/Phrase -- English version of the word or phrase to be translated');
console.log('(3) Translation -- please add your translation of word/phrase on this line');
console.log('(4) Description -- provides context re. how the word or phrase is used');
console.log('\nNote: A message may include \'placeholders\', which are strings enclosed within');
console.log('dollar sign symbols (\'$\'). Please include the placeholders in your translation');
console.log('without modifying them, as they will be replaced with content from the web page.')
console.log('\nPlease return this file as a plain text file.');
console.log('\nThank you in advance! Your help is greatly appreciated.');

for (const [key, {message, description}] of Object.entries(messages)) {
  console.log(`\nMessage Key: ${key}`);
  console.log(`Word/Phrase: ${message}`);
  console.log('Translation:');
  console.log(`Description: ${description}`);
}
