import { readFile } from 'fs';

readFile('../_locales/en/messages.json', (err, source) => {
  if (err) {
    console.error(err);
  }
  else {
    // console.log(JSON.parse(source));
    const messages = JSON.parse(source);
    displayPreface(Object.entries(messages).length);
    displayMessages(messages);
  }
});

function displayPreface (count) {
  console.log(`There are ${count} words or phrases that need to be translated.`);
  console.log('Each grouping below consists of four lines:');
  console.log('\n(1) Message Key -- identifies the message to which your translation applies');
  console.log('(2) Word/Phrase -- English version of the word or phrase to be translated');
  console.log('(3) Translation -- please add your translation of word/phrase on this line');
  console.log('(4) Description -- provides context re. how the word or phrase is used');
  console.log('\nNote: A phrase may include \'placeholders\', which are strings enclosed within');
  console.log('dollar sign symbols (\'$\'). Please translate all of the text in the phrase,');
  console.log('including punctuation, but without modifying the placeholders, as they will');
  console.log('be replaced with content from the web page.')
  console.log('\nPlease return this file as a plain text file.');
  console.log('\nThank you in advance! Your help is greatly appreciated.');
}

function displayMessages (messages) {
  for (const [key, {message, description}] of Object.entries(messages)) {
    console.log(`\nMessage Key: ${key}`);
    console.log(`Word/Phrase: ${message}`);
    console.log('Translation:');
    console.log(`Description: ${description}`);
  }
}
