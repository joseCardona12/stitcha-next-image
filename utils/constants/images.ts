export interface IImageLocalMockup {
  base: string;
  shadow: string;
  mask: string;
}
export interface IImageLocal {
  heavy_hoddie: IImageLocalMockup;
}
export const CURRENT_IMAGES: IImageLocal = {
  heavy_hoddie: {
    base: "/images/heavy-hoodie/base.png",
    shadow: "/images/heavy-hoodie/shadow.png",
    mask: "/images/heavy-hoodie/mask.png",
  },
};
