export type DocumentType = 
  | 'passport' 
  | 'visa' 
  | 'id' 
  | 'driver-license' 
  | 'online-portal';

export interface DimensionPx {
  width: number;
  height: number;
}

export interface SpecNotes {
  glasses: string;
  smile: string;
  ears: string;
  shadows: string;
  babyRules: string;
}

export interface DocumentSpec {
  country: string;              // e.g. "United States"
  countryCode: string;          // ISO 3166-1 alpha-2, e.g. "US"
  countrySlug: string;          // URL slug, e.g. "united-states"
  docType: DocumentType;        // "passport", "visa", etc.
  docTypeSlug: string;          // URL slug, e.g. "passport"
  docTitle: string;             // Human readable, e.g. "US Passport Photo"
  
  // Physical & Print Dimensions
  widthMm: number;              // Width in millimeters (e.g. 51 for US, 35 for IN)
  heightMm: number;             // Height in millimeters (e.g. 51 for US, 45 for IN)
  dpi: number;                  // Typically 300 or 600
  
  // Digital Upload Limits
  minPx: DimensionPx;           // Minimum required pixel size (e.g. { width: 600, height: 600 })
  maxPx: DimensionPx;           // Maximum allowed pixel size (e.g. { width: 1200, height: 1200 })
  maxFileKB: number;            // File size cap in KB (e.g. 240 for US travel.state.gov)
  fileFormat: string[];         // Allowed formats (e.g. ["image/jpeg"])
  
  // Biometric Composition
  headHeightMinMm: number;      // Min chin-to-crown height (e.g. 25 for US)
  headHeightMaxMm: number;      // Max chin-to-crown height (e.g. 35 for US)
  eyeLineFromBottomMm: number;  // Distance from bottom edge to eye level center
  backgroundColor: string;      // Official background hex code (e.g. "#FFFFFF")
  
  // Compliance Rules
  notes: SpecNotes;
  
  // Government Verification Tracking
  sourceUrl: string;            // Official government requirement page URL
  lastVerified: string;         // ISO date "YYYY-MM-DD"
  verified: boolean;            // STRICT RULE: true ONLY when verified against official sourceUrl
}
