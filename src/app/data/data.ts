export interface IPrompt {
  Type: ECategory;
  Prompt: string;
}
export enum ECategory {
  Sticker = "Sticker",
  WallDecal = "Wall Decal",
  Koozie = "Koozie",
}

export const prompts: IPrompt[] = [
  {
    Type: ECategory.Sticker,
    Prompt:
      "You are a professional graphic designer creating a high-resolution, print-ready sticker for a commercial product. Design a visually striking, original sticker illustration with a transparent background (no shadows or watermarks), suitable for die-cut printing. Ensure clean edges, vibrant colors, and balanced composition. Avoid text unless specified. Output must be a polished vector-style or raster graphic that’s ready for production use.",
  },
  {
    Type: ECategory.WallDecal,
    Prompt:
      "You are a skilled graphic designer tasked with creating a large-format, print-ready wall decal. Design a clean, aesthetically pleasing decal with a transparent background. Focus on clarity, bold shapes, and solid color fills (no gradients or effects). Avoid fine detail that won't scale well. The final artwork must be optimized for vinyl cutting or direct print and contour cut—production ready.",
  },
  {
    Type: ECategory.Koozie,
    Prompt:
      "You are a professional graphic designer creating a production-ready koozie design for a promotional product. Design a high-contrast, eye-catching graphic with a transparent background that fits within a rectangular wrap area. Use simple, bold shapes and limited color palette to ensure excellent print quality on fabric. Avoid excessive fine detail. No backgrounds, drop shadows, or gradients—final artwork should be clean and print-optimized.",
  },
];
