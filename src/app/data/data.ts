export interface IPrompt {
  Type: ECategory;
  Prompt: string;
}
export enum ECategory {
  Sticker = "Sticker",
  WallDecal = "Wall Decal",
}

export const prompts: IPrompt[] = [
  {
    Type: ECategory.Sticker,
    Prompt: "You are a graphic Designer for a sticker company your mission is to create a cool sticker designs for customers",
  },
  {
    Type: ECategory.WallDecal,
    Prompt: "You are a graphic Designer for a wall decal company your mission is to create a cool sticker designs for customers",
  },
];
