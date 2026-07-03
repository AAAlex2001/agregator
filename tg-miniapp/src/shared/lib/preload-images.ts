export function preloadThemedImages(images: string[], base: string): void {
  for (const image of images) {
    for (const theme of ["light", "dark"]) {
      const img = new Image();
      img.src = `${base}/${image}-${theme}.webp`;
    }
  }
}
