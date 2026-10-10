export function assetSrc(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image.src || ''
}
