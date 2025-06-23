export interface IPrompt {
  Type: ECategory;
  skus?: SKU[];
}
export interface SKU {
  skuNumber:number | string;
  promptWrapper: string;
  productDescription: string;
}
export enum ECategory {
  Sticker = "Sticker",
  WallDecal = "Wall Decal",
  None = "None",
  NameTag = "NameTag",
  Signs = "Signs",
}


export const prompts: IPrompt[] = [
  {
    Type: ECategory.NameTag,
    skus:[
      {
        skuNumber:100123,
        promptWrapper:`Generate a product rendering for a custom name tag based on {{prompt}}. Include details that match: product:full color rectangle name tag, custom badge, background color, texture.`,
        productDescription:'Full color rectangle name tag, custom badge, background color, texture',
      },
      {
        skuNumber:100126,
        promptWrapper:`Generate a product rendering for a custom name tag based on {{prompt}}. Include details that match product:sublimated gold rectangle name tag, custom badge, background color, texture.`,
        productDescription:'Sublimated gold rectangle name tag, custom badge, background color, texture.',
      },

    ]
  },
    
  {
    Type: ECategory.WallDecal,
    //Prompt: "You are a graphic Designer for a wall decal company your mission is to create a cool sticker designs for customers",
  },

  {
    Type:ECategory.None,
    //Prompt:""
  },

  {
    Type: ECategory.Sticker
  },
  {
    Type: ECategory.Signs,
    skus:[
      {
        skuNumber:"CS-EXIT-101",
        promptWrapper:`Create a clear and professional product rendering for a 'Glow-in-the-Dark EXIT Sign' based on {{prompt}}. Display the sign with dimensions 10" x 7", focusing on color, readability, and placement on a wall or door. Ensure the image conveys its practical use in a workplace or public setting.`,
        productDescription:"Glow in the dark EXIT sign. 10 x 7"
      },
      {
        skuNumber:"CS-NOFOOD-103",
        promptWrapper:`Create a clear and professional product rendering for a 'No Food or Drink Allowed Sign' based on {{prompt}}. Display the sign with dimensions 7" x 10", focusing on color, readability, and placement on a wall or door. Ensure the image conveys its practical use in a workplace or public setting.`,
        productDescription:"No Food or Drink Allowed sign 7 x 10"

      }
    ]
  }

  
    
    
  
];


export const FONT_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Comic Sans MS", label: "Comic Sans" },
  { value: "Impact", label: "Impact" },
  { value: "Times New Roman", label: "Times New Roman" },
];