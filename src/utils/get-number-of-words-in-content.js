export function getNumberOfWords(content) {
  const decryptedContent = atob(atob(content));
  return decryptedContent.split(" ").length;
}
