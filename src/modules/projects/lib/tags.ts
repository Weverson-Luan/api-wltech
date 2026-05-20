export function serializeTags(tags: string[]): string {
  return JSON.stringify(tags);
}

export function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((tag): tag is string => typeof tag === 'string');
  } catch {
    return [];
  }
}

export function validateTags(tags: unknown): { valid: boolean; tags: string[]; message?: string } {
  if (!Array.isArray(tags)) {
    return { valid: false, tags: [], message: 'Tags deve ser uma lista.' };
  }

  if (tags.length === 0) {
    return { valid: false, tags: [], message: 'Informe ao menos uma tag.' };
  }

  const normalized: string[] = [];

  for (const tag of tags) {
    if (typeof tag !== 'string' || !tag.trim()) {
      return { valid: false, tags: [], message: 'Cada tag deve ser um texto válido.' };
    }
    normalized.push(tag.trim());
  }

  return { valid: true, tags: normalized };
}
