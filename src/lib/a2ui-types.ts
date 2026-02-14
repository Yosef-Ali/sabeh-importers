export type A2UIComponentType =
  | "text"
  | "heading"
  | "ocr_result"
  | "image_analysis"
  | "suggestion_chips"
  | "button"
  | "card";

export interface A2UIElement {
  type: A2UIComponentType;
  props: Record<string, any>;
  children?: A2UIElement[];
}

export interface A2UIResponse {
  message?: string;
  ui?: A2UIElement;
}
