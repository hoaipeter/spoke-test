import { TagChecker } from './TagChecker';

describe('TagChecker', () => {
  let checker: TagChecker;

  beforeAll(() => {
    checker = new TagChecker();
  });

  describe('check', () => {
    it.each([
      [
        'correctly tagged paragraph - Sample 1',
        'The following text<C><B>is centred and in boldface</B></C>',
        'Correctly tagged paragraph',
      ],
      [
        'correctly tagged paragraph with invalid tags - Sample 2',
        '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> sentence',
        'Correctly tagged paragraph',
      ],
      ['empty input', '', 'Correctly tagged paragraph'],
      ['text with no tags', 'This is plain text without any tags', 'Correctly tagged paragraph'],
      ['single pair of tags', '<X>content</X>', 'Correctly tagged paragraph'],
      ['deeply nested tags', '<A><B><C><D></D></C></B></A>', 'Correctly tagged paragraph'],
      ['sibling tags correctly', '<A></A><B></B><C></C>', 'Correctly tagged paragraph'],
      ['tags with text between them', 'Start <A>middle <B>content</B> more</A> end', 'Correctly tagged paragraph'],
      ['tags that are not single uppercase letters', '<abc>text</abc><123>more</123>', 'Correctly tagged paragraph'],
      [
        'only valid tags when mixed with invalid ones',
        '<A><invalid><B></B></invalid></A>',
        'Correctly tagged paragraph',
      ],
      ['null input', null, 'Correctly tagged paragraph'],
      ['undefined input', undefined, 'Correctly tagged paragraph'],
    ])('should handle %s', (_, input, expected) => {
      const result = checker.check(input);
      expect(result).toBe(expected);
    });

    it.each([
      [
        'wrongly nested tags - Sample 3',
        '<B><C> This should be centred and in boldface, but the\ntags are wrongly nested </B></C>',
        'Expected </C> found </B>',
      ],
      ['wrong nesting in deeply nested tags', '<A><B><C><D></C></D></B></A>', 'Expected </D> found </C>'],
      ['wrong closing in sibling tags', '<A></A><B></C>', 'Expected </B> found </C>'],
    ])('should detect %s', (_, input, expected) => {
      const result = checker.check(input);
      expect(result).toBe(expected);
    });

    it.each([
      [
        'extra closing tag - Sample 4',
        '<B>This should be in boldface, but there is an extra closing\ntag</B></C>',
        'Expected # found </C>',
      ],
      ['only closing tags', '</A></B></C>', 'Expected # found </A>'],
    ])('should detect %s', (_, input, expected) => {
      const result = checker.check(input);
      expect(result).toBe(expected);
    });

    it.each([
      [
        'missing closing tag - Sample 5',
        '<B><C>This should be centred and in boldface, but there is\na missing closing tag</C>',
        'Expected </B> found #',
      ],
      ['multiple opening tags with no closing tags', '<A><B><C>', 'Expected </C> found #'],
    ])('should detect %s', (_, input, expected) => {
      const result = checker.check(input);
      expect(result).toBe(expected);
    });
  });
});
