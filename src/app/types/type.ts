export type geminiResponse = {
  prompt: string;
  image?: string;
  loading?: boolean;
  error: string;
  geminiText:string;
};

export enum PromptWrapperType {
  NONE = "none",
  ARTISTIC_WATERCOLOR = "artistic_watercolor",
  PHOTOREALISTIC_DETAIL = "photorealistic_detail",
  POLICY_SFW_INCLUSIVE = "policy_sfw_inclusive",
}
