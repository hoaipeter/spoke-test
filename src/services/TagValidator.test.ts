import type { TagToken } from '#/models';
import { TagType } from '#/models';
import { TagValidator } from './TagValidator';

describe('TagValidator', () => {
  let validator: TagValidator;

  beforeAll(() => {
    validator = new TagValidator();
  });

  describe('validate', () => {
    it.each([
      [
        'correctly nested single tag',
        [
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.CLOSING, letter: 'B', raw: '</B>' },
        ],
        true,
        'Correctly tagged paragraph',
      ],
      [
        'correctly nested multiple tags',
        [
          { type: TagType.OPENING, letter: 'C', raw: '<C>' },
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.CLOSING, letter: 'B', raw: '</B>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        true,
        'Correctly tagged paragraph',
      ],
      ['empty tag list', [], true, 'Correctly tagged paragraph'],
      [
        'complex valid nesting',
        [
          { type: TagType.OPENING, letter: 'A', raw: '<A>' },
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.CLOSING, letter: 'B', raw: '</B>' },
          { type: TagType.OPENING, letter: 'C', raw: '<C>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
          { type: TagType.CLOSING, letter: 'A', raw: '</A>' },
        ],
        true,
        'Correctly tagged paragraph',
      ],
    ])('should validate %s', (_, tags, isValid, message) => {
      const result = validator.validate(tags as TagToken[]);
      expect(result.isValid).toBe(isValid);
      expect(result.message).toBe(message);
    });

    it.each([
      [
        'wrongly nested tags',
        [
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.OPENING, letter: 'C', raw: '<C>' },
          { type: TagType.CLOSING, letter: 'B', raw: '</B>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        'Expected </C> found </B>',
      ],
      [
        'wrong closing tag in complex nesting',
        [
          { type: TagType.OPENING, letter: 'A', raw: '<A>' },
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        'Expected </B> found </C>',
      ],
    ])('should detect %s', (_, tags, message) => {
      const result = validator.validate(tags as TagToken[]);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(message);
    });

    it.each([
      [
        'extra closing tag',
        [
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.CLOSING, letter: 'B', raw: '</B>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        'Expected # found </C>',
      ],
    ])('should detect %s', (_, tags, message) => {
      const result = validator.validate(tags as TagToken[]);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(message);
    });

    it.each([
      [
        'missing closing tag',
        [
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.OPENING, letter: 'C', raw: '<C>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        'Expected </B> found #',
      ],
      [
        'multiple missing closing tags',
        [
          { type: TagType.OPENING, letter: 'A', raw: '<A>' },
          { type: TagType.OPENING, letter: 'B', raw: '<B>' },
          { type: TagType.OPENING, letter: 'C', raw: '<C>' },
          { type: TagType.CLOSING, letter: 'C', raw: '</C>' },
        ],
        'Expected </B> found #',
      ],
    ])('should detect %s', (_, tags, message) => {
      const result = validator.validate(tags as TagToken[]);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(message);
    });
  });
});
