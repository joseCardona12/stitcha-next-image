export interface IImageLocalMockup {
  base: string;
  shadow: string;
  mask: string;
  id: string;
}

export const CURRENT_IMAGES: IImageLocalMockup[] = [
  {
    base: "/images/heavy-hoodie/base.png",
    shadow: "/images/heavy-hoodie/shadow.png",
    mask: "/images/heavy-hoodie/mask.png",
    id: "heavy-hoodie",
  },
  {
    base: "/images/cardigan/base.png",
    shadow: "/images/cardigan/shadow.png",
    mask: "/images/cardigan/mask.png",
    id: "cardigan",
  },
  {
    base: "/images/heavy-sweatshirt/base.png",
    shadow: "/images/heavy-sweatshirt/shadow.png",
    mask: "/images/heavy-sweatshirt/mask.png",
    id: "heavy-sweatshirt",
  },
  {
    base: "/images/t-shirt/base.png",
    shadow: "/images/t-shirt/shadow.png",
    mask: "/images/t-shirt/mask.png",
    id: "t-shirt",
  },
];

export const CURRENT_IMAGE_LOCAL_MOCKUP: IImageLocalMockup = {
  base: "",
  shadow: "",
  mask: "",
  id: "",
};
