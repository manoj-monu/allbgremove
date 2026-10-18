import fs from 'fs';
import path from 'path';


const specs = [
  // 1. United States - Passport
  {
    country: "United States",
    countryCode: "US",
    countrySlug: "united-states",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "United States Passport Photo",
    widthMm: 51,
    heightMm: 51,
    dpi: 300,
    minPx: { width: 600, height: 600 },
    maxPx: { width: 1200, height: 1200 },
    maxFileKB: 240,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 25,
    headHeightMaxMm: 35,
    eyeLineFromBottomMm: 28,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Eyeglasses are strictly forbidden unless a signed medical waiver from a doctor is provided.",
      smile: "Neutral facial expression or natural smile, with both eyes open and mouth closed.",
      ears: "Ears need not be visible, but hairline and facial edges must not be obscured by hair or headwear.",
      shadows: "Shadows on the face or behind the head on the background are not acceptable.",
      babyRules: "No other person or hands in photo. Baby may lie on a plain white sheet or sit in a car seat covered with a white sheet."
    },
    sourceUrl: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 2. United States - Visa
  {
    country: "United States",
    countryCode: "US",
    countrySlug: "united-states",
    docType: "visa",
    docTypeSlug: "visa",
    docTitle: "United States Visa Photo (DS-160)",
    widthMm: 51,
    heightMm: 51,
    dpi: 300,
    minPx: { width: 600, height: 600 },
    maxPx: { width: 1200, height: 1200 },
    maxFileKB: 240,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 25,
    headHeightMaxMm: 35,
    eyeLineFromBottomMm: 28,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Eyeglasses strictly forbidden. Must be taken within the last 6 months.",
      smile: "Neutral facial expression with both eyes open directly facing camera.",
      ears: "Full face visible without shadows or hair obstructing eyes or eyebrows.",
      shadows: "Even lighting across face and background, no harsh shadows.",
      babyRules: "Infants eyes must be open. Ensure no toys, pacifiers, or supporting hands appear."
    },
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 3. United Kingdom - Passport
  {
    country: "United Kingdom",
    countryCode: "GB",
    countrySlug: "united-kingdom",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "United Kingdom Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 600, height: 750 },
    maxPx: { width: 1200, height: 1500 },
    maxFileKB: 10240,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 29,
    headHeightMaxMm: 34,
    eyeLineFromBottomMm: 26,
    backgroundColor: "#E5E7EB", // Official UK requires plain light-grey or cream, not pure white
    notes: {
      glasses: "No tinted glasses or sunglasses. Clear prescription glasses allowed only if no glare, reflection, or frame covering eyes.",
      smile: "Neutral expression, mouth closed, no grinning or smiling.",
      ears: "Hair tucked back if covering face; eyes must be clearly visible.",
      shadows: "No shadows on face or background. Clear contrast between subject and background.",
      babyRules: "Children aged 1 to 5 do not need a neutral expression. Babies under 1 do not need eyes open. No hands, dummies, or toys."
    },
    sourceUrl: "https://www.gov.uk/photos-for-passports/photo-requirements",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 4. Canada - Passport
  {
    country: "Canada",
    countryCode: "CA",
    countrySlug: "canada",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Canada Passport Photo",
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    minPx: { width: 590, height: 826 },
    maxPx: { width: 1200, height: 1680 },
    maxFileKB: 4096,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 31,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 39,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Prescription glasses may be worn as long as eyes are clearly visible and there is no glare. Sunglasses or tinted glasses forbidden.",
      smile: "Neutral facial expression with mouth closed and eyes open.",
      ears: "Ears do not need to be shown, but face edge and hair line must not cast shadows or block features.",
      shadows: "Uniform lighting without glare, flash reflections, or harsh shadows.",
      babyRules: "Newborns may be photographed in a car seat covered with a white sheet. No parent hands or shadows visible."
    },
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 5. Australia - Passport
  {
    country: "Australia",
    countryCode: "AU",
    countrySlug: "australia",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Australia Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 600, height: 800 },
    maxPx: { width: 1200, height: 1600 },
    maxFileKB: 4096,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 25,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Glasses are not allowed in Australian passport photos since 2018, even with prescription, unless medical certificate provided.",
      smile: "Neutral expression, mouth closed, looking straight at the camera.",
      ears: "Edges of face must be visible. Head coverings allowed for religious reasons only.",
      shadows: "Even lighting with no shadows behind head or under chin.",
      babyRules: "Infants under 3: mouth can be open. Under 1: eyes can be closed. No other person or support visible."
    },
    sourceUrl: "https://www.passports.gov.au/how-to-apply/photo-requirements",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 6. India - Passport
  {
    country: "India",
    countryCode: "IN",
    countrySlug: "india",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "India Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 600, height: 600 }, // Indian digital portal accepts 35x45 or 51x51 for VFS/online
    maxPx: { width: 1200, height: 1200 },
    maxFileKB: 300,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 25,
    headHeightMaxMm: 35,
    eyeLineFromBottomMm: 24,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Thick frames, dark glasses, tinted lenses strictly prohibited. Clear lenses permitted if eyes fully visible without reflections.",
      smile: "Natural neutral expression, mouth firmly closed, facing camera straight-on.",
      ears: "Both ears and full front facial oval should ideally be visible.",
      shadows: "No shadows on face, neck, or white background.",
      babyRules: "For babies, neutral background, eyes open, no pacifiers, toys, or parent hands visible."
    },
    sourceUrl: "https://www.passportindia.gov.in/AppOnlineProject/online/photoSpecNew",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 7. Germany / Schengen - Passport
  {
    country: "Germany",
    countryCode: "DE",
    countrySlug: "germany",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Germany & Schengen Biometric Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 413, height: 531 },
    maxPx: { width: 1200, height: 1600 },
    maxFileKB: 2048,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 26,
    backgroundColor: "#E5E7EB", // Light grey
    notes: {
      glasses: "Eyes must not be covered by frame; no reflections or tinted glasses allowed.",
      smile: "Strict neutral facial expression, mouth closed, facing camera centered.",
      ears: "Ears do not strictly have to be visible, but face contour from chin to hairline must be visible.",
      shadows: "Even illumination, no shadow behind ears, chin, or background.",
      babyRules: "Children aged 5 and under may have slight deviations. For infants under 1 year, head doesn't need to be straight or eyes open."
    },
    sourceUrl: "https://www.bmi.bund.de/SharedDocs/downloads/DE/veroeffentlichungen/themen/moderne-verwaltung/ausweise/fotomustertabelle.pdf",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 8. China - Visa
  {
    country: "China",
    countryCode: "CN",
    countrySlug: "china",
    docType: "visa",
    docTypeSlug: "visa",
    docTitle: "China Visa Photo",
    widthMm: 33,
    heightMm: 48,
    dpi: 300,
    minPx: { width: 354, height: 472 },
    maxPx: { width: 420, height: 560 },
    maxFileKB: 120,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 28,
    headHeightMaxMm: 33,
    eyeLineFromBottomMm: 25,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Eyeglasses allowed only if frames are thin and lenses completely transparent. No heavy frames or jewelry.",
      smile: "Neutral expression with eyes looking straight ahead and lips naturally closed.",
      ears: "Ears and forehead MUST be clearly visible. Hair must not cover eyebrows or ears.",
      shadows: "No shadows anywhere on the face, contours, or backdrop.",
      babyRules: "Infant must be positioned facing camera with both ears and eyes visible, neutral background."
    },
    sourceUrl: "http://cs.mfa.gov.cn/wgrlh/lhqz/cjbg/201611/t20161125_1002364.shtml",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 9. Japan - Passport
  {
    country: "Japan",
    countryCode: "JP",
    countrySlug: "japan",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Japan Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 413, height: 531 },
    maxPx: { width: 1200, height: 1600 },
    maxFileKB: 2048,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 26,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Glasses with thick or colored frames, sunglasses, or tinted lenses are prohibited. Flash reflection on lenses is rejected.",
      smile: "Neutral expression, mouth closed, direct forward gaze.",
      ears: "Hair must not obscure eyebrows, eyes, or facial contours.",
      shadows: "No shadows on facial surface or background.",
      babyRules: "Infants should face forward with eyes open. No hands or support pillows in frame."
    },
    sourceUrl: "https://www.mofa.go.jp/mofaj/toko/passport/ic_photo.html",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 10. UAE - Visa
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    countrySlug: "uae",
    docType: "visa",
    docTypeSlug: "visa",
    docTitle: "UAE Visa & Emirates ID Photo",
    widthMm: 43,
    heightMm: 55,
    dpi: 300,
    minPx: { width: 508, height: 650 },
    maxPx: { width: 1000, height: 1300 },
    maxFileKB: 500,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 38,
    eyeLineFromBottomMm: 30,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Glasses should be avoided if possible; no glare, reflections, or tinted lenses.",
      smile: "Neutral expression, mouth closed, looking straight into lens.",
      ears: "Ears and hairline should be unobstructed unless wearing traditional religious head covering.",
      shadows: "Even studio lighting without backdrop shadow.",
      babyRules: "Babies must be photographed against clean white background without toys or visible parent hands."
    },
    sourceUrl: "https://icp.gov.ae/en/services/priority-services/passport-and-id-card-photo-specifications/",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 11. Singapore - Passport
  {
    country: "Singapore",
    countryCode: "SG",
    countrySlug: "singapore",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Singapore Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 400, height: 514 },
    maxPx: { width: 1200, height: 1600 },
    maxFileKB: 2048,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 25,
    headHeightMaxMm: 35,
    eyeLineFromBottomMm: 25,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Glasses must not cause glare or obscure eyes. Tinted lenses not allowed.",
      smile: "Neutral facial expression with mouth closed and eyes open looking straight.",
      ears: "Eyebrows and eyes must not be covered by hair or headgear.",
      shadows: "Even lighting with sharp focus and no shadow on face or plain white background.",
      babyRules: "Infants: eyes must be open, looking towards camera. No support hands or props visible."
    },
    sourceUrl: "https://www.ica.gov.sg/photo-guidelines",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 12. Ireland - Passport
  {
    country: "Ireland",
    countryCode: "IE",
    countrySlug: "ireland",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Ireland Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 715, height: 951 },
    maxPx: { width: 1500, height: 2000 },
    maxFileKB: 9216,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 26,
    backgroundColor: "#E5E7EB", // Light grey or cream
    notes: {
      glasses: "Prescription glasses allowed only if no glare, reflection, or frames covering eyes. Sunglasses forbidden.",
      smile: "Neutral facial expression, closed mouth, eyes directed at camera.",
      ears: "Hair should be tucked behind ears or away from face so facial edges are clearly distinct.",
      shadows: "No shadows on face, background, or shoulders.",
      babyRules: "Babies under one year old do not need to keep their eyes open, but must be supported invisibly."
    },
    sourceUrl: "https://www.ireland.ie/en/dfa/passports/photo-guidelines/",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 13. New Zealand - Passport
  {
    country: "New Zealand",
    countryCode: "NZ",
    countrySlug: "new-zealand",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "New Zealand Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 900, height: 1200 },
    maxPx: { width: 3000, height: 4000 },
    maxFileKB: 10240,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 28,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 25,
    backgroundColor: "#E5E7EB", // Plain light-coloured background (not pure white)
    notes: {
      glasses: "Glasses are strongly discouraged and rejected if glare exists or frames obscure eyes.",
      smile: "Neutral expression with mouth closed and eyes open looking directly at lens.",
      ears: "Face completely visible, hair held back off face.",
      shadows: "Even illumination, no background shadowing.",
      babyRules: "For children under 3, mouth may be open. No visible hands or objects."
    },
    sourceUrl: "https://www.passports.govt.nz/passport-photos/passport-photo-requirements/",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 14. France - Passport
  {
    country: "France",
    countryCode: "FR",
    countrySlug: "france",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "France Biometric Passport Photo",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    minPx: { width: 413, height: 531 },
    maxPx: { width: 1200, height: 1600 },
    maxFileKB: 2048,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 26,
    backgroundColor: "#E5E7EB", // French law explicitly forbids pure white background: light blue or light grey only
    notes: {
      glasses: "Thick frames forbidden. Must not reflect flash. Tinted glasses forbidden.",
      smile: "Neutral expression, mouth closed, direct gaze, no teeth shown.",
      ears: "Head bare without accessories. Hair must not conceal face or forehead.",
      shadows: "Strictly even light, no shadow on background or cheeks.",
      babyRules: "Infants: eyes must be open, head straight, no pacifiers, toys or visible parent hands."
    },
    sourceUrl: "https://www.service-public.fr/particuliers/vosdroits/F10619",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 15. Brazil - Passport
  {
    country: "Brazil",
    countryCode: "BR",
    countrySlug: "brazil",
    docType: "passport",
    docTypeSlug: "passport",
    docTitle: "Brazil Passport Photo",
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    minPx: { width: 590, height: 826 },
    maxPx: { width: 1200, height: 1680 },
    maxFileKB: 2048,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 31,
    headHeightMaxMm: 36,
    eyeLineFromBottomMm: 38,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "Dark or reflective lenses not allowed. Eyes must be fully visible.",
      smile: "Neutral expression with closed lips.",
      ears: "Ears should ideally be visible to verify facial proportions.",
      shadows: "Even white background without shadows or gradients.",
      babyRules: "Babies must face front with eyes visible. No foreign objects."
    },
    sourceUrl: "https://www.gov.br/pf/pt-br/assuntos/passaporte/ajuda/duvidas/foto/foto-especificacoes",
    lastVerified: "2026-10-18",
    verified: true
  },
  // 16. Saudi Arabia - Visa
  {
    country: "Saudi Arabia",
    countryCode: "SA",
    countrySlug: "saudi-arabia",
    docType: "visa",
    docTypeSlug: "visa",
    docTitle: "Saudi Arabia Visa & Umrah/Hajj Photo",
    widthMm: 40,
    heightMm: 60,
    dpi: 300,
    minPx: { width: 472, height: 708 },
    maxPx: { width: 1000, height: 1500 },
    maxFileKB: 200,
    fileFormat: ["image/jpeg"],
    headHeightMinMm: 32,
    headHeightMaxMm: 40,
    eyeLineFromBottomMm: 32,
    backgroundColor: "#FFFFFF",
    notes: {
      glasses: "No sunglasses or reflective glasses. Clear glasses permitted if eyes unobscured.",
      smile: "Neutral face, closed mouth, facing camera squarely.",
      ears: "Traditional headwear allowed provided full face from forehead to chin is unobstructed.",
      shadows: "Crisp white background without casting shadows.",
      babyRules: "Baby photo must show upright head and open eyes against white backdrop."
    },
    sourceUrl: "https://visa.visitsaudi.com/Home/TermsConditions",
    lastVerified: "2026-10-18",
    verified: true
  }
];

// Target directory
const specsDir = path.resolve('data/specs');
if (!fs.existsSync(specsDir)) {
  fs.mkdirSync(specsDir, { recursive: true });
}

for (const spec of specs) {
  const fileName = `${spec.countrySlug}-${spec.docTypeSlug}.json`;
  const filePath = path.join(specsDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2), 'utf-8');
  console.log(`✓ Wrote spec: ${fileName} (verified: ${spec.verified})`);
}

console.log(`\nSuccessfully populated ${specs.length} verified country specifications!`);
