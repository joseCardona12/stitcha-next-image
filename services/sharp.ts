export interface IGeneratePreviewSharpRequest {
  mockupId: string;
  logoData: string;
  coords: {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: any;
  };
}

export class SharpService {
  public async generatePreviewSharp(request: IGeneratePreviewSharpRequest) {
    try {
      const result = await fetch("/api/sharp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!result.ok) throw new Error(`Error to generate preview`);
      return await result.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export const sharpService = new SharpService();
