export enum TagType {
  OPENING = 'OPENING',
  CLOSING = 'CLOSING',
}

export interface TagToken {
  type: TagType;
  letter: string;
  raw: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}
