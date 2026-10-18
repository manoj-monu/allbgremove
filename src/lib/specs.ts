import fs from 'fs';
import path from 'path';
import { DocumentSpec } from '@/types/spec';

const specsDir = path.join(process.cwd(), 'data', 'specs');

/**
 * Get all document specifications from data/specs
 */
export function getAllSpecs(): DocumentSpec[] {
  if (!fs.existsSync(specsDir)) {
    return [];
  }
  const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'));
  const specs: DocumentSpec[] = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(specsDir, file), 'utf-8');
      specs.push(JSON.parse(content));
    } catch (e) {
      console.error(`Failed to parse spec file: ${file}`, e);
    }
  }
  
  return specs;
}

/**
 * Get a specific document spec by country slug and docType slug
 */
export function getSpecBySlug(countrySlug: string, docTypeSlug: string = 'passport'): DocumentSpec | null {
  const all = getAllSpecs();
  return all.find(s => s.countrySlug === countrySlug && s.docTypeSlug === docTypeSlug) || null;
}

/**
 * Get all specs for a given country slug
 */
export function getSpecsForCountry(countrySlug: string): DocumentSpec[] {
  const all = getAllSpecs();
  return all.filter(s => s.countrySlug === countrySlug);
}

/**
 * Get list of all distinct country slugs available
 */
export function getAllCountrySlugs(): string[] {
  const all = getAllSpecs();
  const slugs = new Set(all.map(s => s.countrySlug));
  return Array.from(slugs);
}
