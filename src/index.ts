import * as readline from 'readline';

import { TagChecker } from '#/services';

function runSampleTests() {
  const checker = new TagChecker();

  const testCases = [
    'The following text<C><B>is centred and in boldface</B></C>',
    '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> sentence',
    '<B><C> This should be centred and in boldface, but the\ntags are wrongly nested </B></C>',
    '<B>This should be in boldface, but there is an extra closing\ntag</B></C>',
    '<B><C>This should be centred and in boldface, but there is\na missing closing tag</C>',
  ];

  console.log('Sample Input');
  testCases.forEach((testCase) => {
    console.log(` ${testCase}`);
  });

  console.log('\nSample Output');
  testCases.forEach((testCase) => {
    const result = checker.check(testCase);
    console.log(result);
  });
}

function hasValidTags(text: string): boolean {
  const tagPattern = /<\/?[A-Z]>/g;
  return tagPattern.test(text);
}

function runInteractiveMode() {
  const checker = new TagChecker();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter text to check (or "exit" to quit, "sample" for sample tests): ',
  });

  console.log('\n=== Tag Checker - Interactive Mode ===');
  console.log('Enter text with tags to validate.');
  console.log('Tags format: <X> for opening, </X> for closing (X = single uppercase letter)');
  console.log('Commands: "exit" to quit, "sample" to run sample tests\n');

  rl.prompt();

  rl.on('line', (line: string) => {
    const input = line.trim();

    if (input.toLowerCase() === 'exit') {
      console.log('\nGoodbye!');
      rl.close();
      return;
    }

    if (input.toLowerCase() === 'sample') {
      console.log();
      runSampleTests();
      console.log();
      rl.prompt();
      return;
    }

    if (input.length === 0) {
      console.log('Please enter some text or "exit" to quit.\n');
      rl.prompt();
      return;
    }

    if (!hasValidTags(input)) {
      console.log('Warning: No valid tags found. Valid tags are single uppercase letters: <A>, <B>, </Z>, etc.\n');
      rl.prompt();
      return;
    }

    const result = checker.check(input);
    console.log(`Result: ${result}\n`);
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--interactive') || args.includes('-i')) {
    runInteractiveMode();
  } else if (args.length > 0) {
    const checker = new TagChecker();
    const input = args.join(' ');

    if (!hasValidTags(input)) {
      console.log('Error: No valid tags found. Valid tags are single uppercase letters: <A>, <B>, </Z>, etc.');
      process.exit(1);
    }

    const result = checker.check(input);
    console.log(result);
  } else {
    runSampleTests();
  }
}

if (require.main === module) {
  main();
}

export { TagChecker };
