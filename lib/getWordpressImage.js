export const IMAGE_TYPES = {
  MINI: 'MINI',
  THUMB: 'THUMB',
  ORIGINAL: 'ORIGINAL',
};

export function getSquareImage(imgString, size) {
  const imgParts = imgString.split('.');
  imgParts[imgParts.length - 2] = `${imgParts[imgParts.length - 2]}-${size}`;
  return imgParts.join('.');
}

export default function getWordpressImage(imgString, type) {
  switch (type) {
    case IMAGE_TYPES.ORIGINAL:
      return imgString;
    case IMAGE_TYPES.MINI:
      return getSquareImage(imgString, '100x100');
    case IMAGE_TYPES.THUMB:
      return getSquareImage(imgString, '150x150');
    default:
      return imgString;
  }
}
