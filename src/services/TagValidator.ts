import type { TagToken, ValidationResult } from '#/models';
import { TagType } from '#/models';

/**
 * TagValidator - Validates proper nesting and matching of HTML-like tags
 */
export class TagValidator {
  /**
   * Validates tag sequence
   *
   * @param tags - Ordered array of parsed tags to validate
   * @returns ValidationResult with success status and message
   */
  public validate(tags: TagToken[]): ValidationResult {
    const stack: TagToken[] = [];

    for (const tag of tags) {
      if (tag.type === TagType.OPENING) {
        stack.push(tag);
      } else {
        if (stack.length === 0) {
          return {
            isValid: false,
            message: `Expected # found ${tag.raw}`,
          };
        }

        const lastOpening = stack[stack.length - 1];

        if (lastOpening.letter === tag.letter) {
          stack.pop();
        } else {
          return {
            isValid: false,
            message: `Expected </${lastOpening.letter}> found ${tag.raw}`,
          };
        }
      }
    }

    if (stack.length > 0) {
      const unmatchedTag = stack[stack.length - 1];
      return {
        isValid: false,
        message: `Expected </${unmatchedTag.letter}> found #`,
      };
    }

    return {
      isValid: true,
      message: 'Correctly tagged paragraph',
    };
  }
}
