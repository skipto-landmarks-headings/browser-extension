const messages = require('../_locales/en/messages.json');
const count = Object.entries(messages).length;

console.log(`There are ${count} phrases that need to be translated.`);
console.log('\nOnly the phrases need to be translated. The description is there solely');
console.log('to aid you, the translator, by describing the purpose of the phrase and');
console.log('the context in which it is used.');
console.log('\nPlease return this file as a plain text file.');
console.log('\nThank you in advance! Your help is greatly appreciated.');

for (const [key, {message, description}] of Object.entries(messages)) {
  // console.log(`${key}:`);
  console.log(`\nPhrase to translate: ${message}`);
  console.log('Translation:');
  console.log(`Description: ${description}`);
}
