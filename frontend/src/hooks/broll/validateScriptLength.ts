export function getScriptLengthError(length: number): string | null {
  if (!length) return 'Please enter a script first';
  const MIN_SCRIPT_CHARACTERS = 800;
  const MAX_SCRIPT_CHARACTERS = 1500;
  if (length < MIN_SCRIPT_CHARACTERS || length > MAX_SCRIPT_CHARACTERS) {
    return `Your script must be between ${MIN_SCRIPT_CHARACTERS} and ${MAX_SCRIPT_CHARACTERS} characters. Current length: ${length}.`;
  }
  return null;
}

