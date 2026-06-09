// React Theme — extracted from https://localhost:7023/KisitliKisiBilgileri/Details/105
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '14': string;
    '15': string;
    '16': string;
    '18': string;
    '20': string;
    '24': string;
    '30.4': string;
    '19.2': string;
    '17.6': string;
    '15.2': string;
    '14.4': string;
    '13.6': string;
 *   };
 *   space: {
    '2': string;
    '12': string;
    '24': string;
    '28': string;
    '32': string;
    '40': string;
    '70': string;
 *   };
 *   radii: {
    md: string;
    lg: string;
 *   };
 *   shadows: {
    sm: string;
    md: string;
    xl: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#0d6efd",
    "secondary": "#ffc107",
    "accent": "#0dcaf0",
    "background": "#f8f9fa",
    "foreground": "#000000",
    "neutral50": "#2d3748",
    "neutral100": "#ffffff",
    "neutral200": "#212529",
    "neutral300": "#000000",
    "neutral400": "#64748b",
    "neutral500": "#6c757d",
    "neutral600": "#4f5d78"
  },
  "fonts": {
    "body": "'Segoe UI', sans-serif"
  },
  "fontSizes": {
    "14": "14px",
    "15": "15px",
    "16": "16px",
    "18": "18px",
    "20": "20px",
    "24": "24px",
    "30.4": "30.4px",
    "19.2": "19.2px",
    "17.6": "17.6px",
    "15.2": "15.2px",
    "14.4": "14.4px",
    "13.6": "13.6px"
  },
  "space": {
    "2": "2px",
    "12": "12px",
    "24": "24px",
    "28": "28px",
    "32": "32px",
    "40": "40px",
    "70": "70px"
  },
  "radii": {
    "md": "10px",
    "lg": "16px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.075) 0px 2px 4px 0px",
    "md": "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px",
    "xl": "rgba(102, 126, 234, 0.08) 0px 25px 60px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#0d6efd",
      "light": "hsl(216, 98%, 67%)",
      "dark": "hsl(216, 98%, 37%)"
    },
    "secondary": {
      "main": "#ffc107",
      "light": "hsl(45, 100%, 66%)",
      "dark": "hsl(45, 100%, 36%)"
    },
    "background": {
      "default": "#f8f9fa",
      "paper": "#ffffff"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#2d3748"
    }
  },
  "typography": {
    "h2": {
      "fontSize": "24px",
      "fontWeight": "700",
      "lineHeight": "28.8px"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "600",
      "lineHeight": "32px"
    },
    "body1": {
      "fontSize": "17.6px",
      "fontWeight": "400",
      "lineHeight": "28.16px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": [
    "rgba(102, 126, 234, 0.15) 0px 0px 0px 4px",
    "rgba(0, 0, 0, 0.075) 0px 2px 4px 0px",
    "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px",
    "rgba(0, 0, 0, 0.1) -10px 0px 50px 0px",
    "rgba(102, 126, 234, 0.08) 0px 25px 60px 0px"
  ]
};

export default theme;
