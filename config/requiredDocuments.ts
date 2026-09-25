/**
 * Required Documents for Lawyer Application
 *
 * Keeping this in a config file means the list can be updated
 * without touching any screen component.
 */

export interface RequiredDocument {
  id: string;
  label: string;
  description: string;
  required: boolean;
  accept: string[]; // MIME types or file extensions
}

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    id: 'government_id',
    label: 'Government-Issued ID',
    description:
      'National ID Card, International Passport, or Drivers Licence. Must show your full name and photo.',
    required: true,
    accept: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    id: 'nba_evidence',
    label: 'NBA Stamp / Seal or Practising Certificate',
    description:
      'Scanned copy of your valid Nigerian Bar Association annual practising certificate, stamp impression, or a letter from your branch stamped with the NBA seal.',
    required: true,
    accept: ['image/jpeg', 'image/png', 'application/pdf'],
  },
];
