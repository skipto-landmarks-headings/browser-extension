const messages = require('../_locales/en/messages.json');
const count = Object.entries(messages).length;

console.log(`There are ${count} words or phrases that need to be translated.`);
console.log('Each grouping below consists of three lines:');
console.log('\n(1) Word/Phrase to translate');
console.log('(2) Translation -- please add your translation of word/phrase on this line');
console.log('(3) Description -- provides context re. how the word or phrase is used')
console.log('\nPlease return this file as a plain text file.');
console.log('\nThank you in advance! Your help is greatly appreciated.');

for (const [key, {message, description}] of Object.entries(messages)) {
  // console.log(`${key}:`);
  console.log(`\nWord/Phrase: ${message}`);
  console.log('Translation:');
  console.log(`Description: ${description}`);
}
