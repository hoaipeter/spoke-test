import type { TagToken } from '#/models';
import { TagType } from '#/models';

/**
 * TagParser - Extracts and orders HTML-like tags from text
 */
export class TagParser {
  private static readonly OPENING_TAG_REGEX = /<([A-Z])>/g;
  private static readonly CLOSING_TAG_REGEX = /<\/([A-Z])>/g;

  /**
   * Parses text and extracts all valid tags in order of appearance
   *
   * @param text - Input text containing tags to parse
   * @returns Array of TagToken objects ordered by appearance in text
   */
  public parse(text: string): TagToken[] {
    const tags: { position: number; token: TagToken }[] = [];
    let match: RegExpExecArray | null;

    TagParser.OPENING_TAG_REGEX.lastIndex = 0;
    while ((match = TagParser.OPENING_TAG_REGEX.exec(text)) !== null) {
      tags.push({
        position: match.index,
        token: {
          type: TagType.OPENING,
          letter: match[1],
          raw: match[0],
        },
      });
    }

    TagParser.CLOSING_TAG_REGEX.lastIndex = 0;
    while ((match = TagParser.CLOSING_TAG_REGEX.exec(text)) !== null) {
      tags.push({
        position: match.index,
        token: {
          type: TagType.CLOSING,
          letter: match[1],
          raw: match[0],
        },
      });
    }

    tags.sort((a, b) => a.position - b.position);
    return tags.map((t) => t.token);
  }
}
