export function formatBiography(rawBio?: string): string[] {
  if (!rawBio) return [];

  let bio = rawBio
    .replace(/Description above from the Wikipedia article.*$/i, "")
    .replace(/\([^)]*\/[^)]*\)/g, "")
    .replace(/\(\d{4}\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\bLatin American Spanish:[^;)]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = bio.match(/[^.!?]+[.!?]+/g) || [bio];

  const size = Math.ceil(sentences.length / 3);
  const paragraphs: string[] = [];

  for (let i = 0; i < sentences.length; i += size) {
    paragraphs.push(
      sentences
        .slice(i, i + size)
        .join(" ")
        .replace(/^\s*[.!?]\s*/, "")
        .trim(),
    );
  }

  return paragraphs;
}
