const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Readable } = require('stream');

function getWordsFromString(text) {
  return text.toLowerCase().match(/\w+/g);
}

function analyzeFile(filePath, wordCounts) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    output: new Readable(),
    terminal: false,
  });

  rl.on('line', line => {
    const words = getWordsFromString(line);
    if (words) {
      for (const word of words) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
  });

  return new Promise(resolve => {
    rl.on('close', () => {
      resolve();
    });
  });
}

async function main() {
  const fileDirectory = './TextFiles';  // path for text files
  const fileNames = fs.readdirSync(fileDirectory).filter(filename => filename.endsWith('.txt'));

  const overallWordCounts = {};

  for (const fileName of fileNames) {
    const filePath = path.join(fileDirectory, fileName);
    const wordCounts = {};
    await analyzeFile(filePath, wordCounts);

    console.log(`Top 10 words in ${fileName}:`);
    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    for (let i = 0; i < 10 && i < sortedWords.length; i++) {
      const word = sortedWords[i];
      console.log(`${word}: ${wordCounts[word]}`);
    }

    Object.entries(wordCounts).forEach(([word, count]) => {
      overallWordCounts[word] = (overallWordCounts[word] || 0) + count;
    });
  }

  console.log('\nOverall Top 10 words:');
  const sortedOverallWords = Object.keys(overallWordCounts).sort((a, b) => overallWordCounts[b] - overallWordCounts[a]);
  for (let i = 0; i < 10 && i < sortedOverallWords.length; i++) {
    const word = sortedOverallWords[i];
    console.log(`${word}: ${overallWordCounts[word]}`);
  }
}

main();
