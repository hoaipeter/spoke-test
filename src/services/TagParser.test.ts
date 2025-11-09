import { TagType } from '#/models';
import { TagParser } from './TagParser';

describe('TagParser', () => {
  let parser: TagParser;

  beforeAll(() => {
    parser = new TagParser();
  });

  describe('parse', () => {
    it('should parse simple opening and closing tags', () => {
      const tags = parser.parse('<B>Hello</B>');

      expect(tags).toHaveLength(2);
      expect(tags[0]).toEqual({
        type: TagType.OPENING,
        letter: 'B',
        raw: '<B>',
      });
      expect(tags[1]).toEqual({
        type: TagType.CLOSING,
        letter: 'B',
        raw: '</B>',
      });
    });

    it('should parse nested tags in correct order', () => {
      const tags = parser.parse('<C><B>text</B></C>');

      expect(tags).toHaveLength(4);
      expect(tags[0]).toEqual({ type: TagType.OPENING, letter: 'C', raw: '<C>' });
      expect(tags[1]).toEqual({ type: TagType.OPENING, letter: 'B', raw: '<B>' });
      expect(tags[2]).toEqual({ type: TagType.CLOSING, letter: 'B', raw: '</B>' });
      expect(tags[3]).toEqual({ type: TagType.CLOSING, letter: 'C', raw: '</C>' });
    });

    it.each([
      ['lowercase letters', '<b>text</b>', 0],
      ['multiple letters', '<ABC>text</ABC>', 0],
      ['special characters', '<\\g>text<\\6><<*>', 0],
      ['text with no tags', 'This is plain text without any tags', 0],
      ['empty string', '', 0],
    ])('should ignore invalid tags with %s', (_, text, expectedLength) => {
      const tags = parser.parse(text);
      expect(tags).toHaveLength(expectedLength);
    });

    it('should parse only valid tags and ignore invalid ones', () => {
      const tags = parser.parse('<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> sentence');

      expect(tags).toHaveLength(4);
      expect(tags[0]).toEqual({ type: TagType.OPENING, letter: 'B', raw: '<B>' });
      expect(tags[1]).toEqual({ type: TagType.OPENING, letter: 'B', raw: '<B>' });
      expect(tags[2]).toEqual({ type: TagType.CLOSING, letter: 'B', raw: '</B>' });
      expect(tags[3]).toEqual({ type: TagType.CLOSING, letter: 'B', raw: '</B>' });
    });

    it('should parse tags with newlines in text', () => {
      const tags = parser.parse('<B><C> This should be centred\nand in boldface </B></C>');

      expect(tags).toHaveLength(4);
      expect(tags.map((t) => t.letter)).toEqual(['B', 'C', 'B', 'C']);
    });

    it('should parse all uppercase letters A-Z', () => {
      const tags = parser.parse('<A><Z><M></M></Z></A>');

      expect(tags).toHaveLength(6);
      expect(tags.map((t) => t.letter)).toEqual(['A', 'Z', 'M', 'M', 'Z', 'A']);
    });
  });
});
