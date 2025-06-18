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

  
    
    
  
];
