import { TagParser } from './TagParser';
import { TagValidator } from './TagValidator';

/**
 * TagChecker - Main orchestrator for HTML-like tag validation
 */
export class TagChecker {
  private parser: TagParser;
  private validator: TagValidator;

  constructor() {
    this.parser = new TagParser();
    this.validator = new TagValidator();
  }

  /**
   * Checks if tags in a paragraph are correctly nested and matched
   *
   * @param paragraph - Text to check for tag validity (accepts null/undefined)
   * @returns Validation message
   */
  public check(paragraph: string | null | undefined): string {
    const text = paragraph ?? '';
    const tags = this.parser.parse(text);
    const result = this.validator.validate(tags);
    return result.message;
  }
}
