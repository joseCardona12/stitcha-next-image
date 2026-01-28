export class ImageFetch {
  public async getImage(urlImage: string) {
    const endpoint: string = `/api/image-sharp?urlImage=${encodeURIComponent(
      urlImage,
    )}`;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Error to get image");
      return await response.blob();
    } catch (error) {
      throw new Error(`ERROR: ${error}`);
    }
  }
}

export const imageFetch = new ImageFetch();
