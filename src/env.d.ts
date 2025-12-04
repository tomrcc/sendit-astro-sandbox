/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Extend the Window interface to include CloudCannon editor properties
declare global {
  // CloudCannon editable elements
  namespace JSX {
    interface IntrinsicElements {
      "editable-text": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "data-prop"?: string;
      };
      "editable-image": React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      > & {
        "data-prop-src"?: string;
        "data-prop-alt"?: string;
        "data-prop-title"?: string;
      };
      "editable-source": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "data-prop"?: string;
        "data-path"?: string;
        "data-key"?: string;
        "data-type"?: "span" | "text" | "block";
      };
      "editable-component": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
