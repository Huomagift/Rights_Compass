/**
 * Mock Marketplace Service
 *
 * Full in-memory implementation of IMarketplaceService.
 * Seeded with 12 realistic Nigerian lawyers.
 * Simulates ~400-800 ms network latency on each call.
 *
 * To swap in a real backend, update services/marketplaceProvider.ts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IMarketplaceService } from './marketplaceService';
import type {
  LawyerProfile,
  LawyerApplication,
  ConsultationRequest,
  LawyerFilters,
  PracticeArea,
  ContactPreference,
  UrgencyLevel,
  LawyerApplicationStatus,
} from '../types/marketplace';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  APPLICATION: '@rc_lawyer_application',
  MY_REQUESTS: '@rc_my_consultation_requests',
  INCOMING_REQUESTS: '@rc_incoming_requests',
  LAWYER_PROFILES: '@rc_lawyer_profiles', // for mutable state (availability, profile edits)
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_LAWYERS: LawyerProfile[] = [
  {
    id: 'lawyer_001',
    fullName: 'Adaeze Okonkwo',
    city: 'Lagos',
    state: 'Lagos',
    bio: 'Senior advocate with 14 years of practice in tenancy disputes, land acquisition, and property law. I have represented clients before the Lagos State High Court and the Court of Appeal.',
    practiceAreas: ['tenancy_land', 'constitutional'],
    yearsOfExperience: 14,
    firmOrChambers: 'Okonkwo & Associates',
    scnNumber: 'SCN/LAG/0045871',
    yearOfCall: 2010,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.8,
    consultationsCompleted: 67,
    verifiedAt: '2024-11-15',
  },
  {
    id: 'lawyer_002',
    fullName: 'Emeka Nwosu',
    city: 'Abuja',
    state: 'FCT',
    bio: 'Employment and labour law specialist. I handle wrongful termination, NSITF disputes, industrial arbitration, and workplace discrimination cases across federal agencies.',
    practiceAreas: ['employment', 'constitutional'],
    yearsOfExperience: 9,
    firmOrChambers: 'Nwosu Labour Chambers',
    scnNumber: 'SCN/FCT/0031204',
    yearOfCall: 2015,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.6,
    consultationsCompleted: 43,
    verifiedAt: '2024-12-01',
  },
  {
    id: 'lawyer_003',
    fullName: 'Fatima Abubakar',
    city: 'Kano',
    state: 'Kano',
    bio: 'Family law practitioner handling divorce, child custody, spousal maintenance, and Islamic inheritance matters under both common law and Sharia frameworks.',
    practiceAreas: ['family'],
    yearsOfExperience: 11,
    firmOrChambers: 'Abubakar Family Law',
    scnNumber: 'SCN/KAN/0022897',
    yearOfCall: 2013,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.9,
    consultationsCompleted: 52,
    verifiedAt: '2025-01-10',
  },
  {
    id: 'lawyer_004',
    fullName: 'Chukwuemeka Obiora',
    city: 'Enugu',
    state: 'Enugu',
    bio: 'Human rights and civil liberties attorney. I have litigated against unlawful detention, police brutality, and SARS abuses. Proud alumni of the Human Rights Law Service.',
    practiceAreas: ['police_human_rights', 'constitutional', 'criminal'],
    yearsOfExperience: 7,
    scnNumber: 'SCN/ENU/0018543',
    yearOfCall: 2017,
    applicationStatus: 'verified',
    isAvailable: false,
    rating: 4.7,
    consultationsCompleted: 31,
    verifiedAt: '2025-02-20',
  },
  {
    id: 'lawyer_005',
    fullName: 'Ngozi Eze-Okafor',
    city: 'Port Harcourt',
    state: 'Rivers',
    bio: 'Consumer protection specialist and FCCPA litigation advocate. I help Nigerians fight unfair billing, defective products, and digital subscription scams.',
    practiceAreas: ['consumer', 'business'],
    yearsOfExperience: 6,
    firmOrChambers: 'Eze-Okafor Legal',
    scnNumber: 'SCN/RIV/0014221',
    yearOfCall: 2018,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.5,
    consultationsCompleted: 28,
    verifiedAt: '2025-03-05',
  },
  {
    id: 'lawyer_006',
    fullName: 'Babatunde Oladele',
    city: 'Ibadan',
    state: 'Oyo',
    bio: 'Business law practitioner advising SMEs and startups on incorporation, contracts, intellectual property, and dispute resolution. Former in-house counsel at a Fortune 500 subsidiary.',
    practiceAreas: ['business', 'employment'],
    yearsOfExperience: 12,
    firmOrChambers: 'BTO Legal Partners',
    scnNumber: 'SCN/OYO/0039654',
    yearOfCall: 2012,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.7,
    consultationsCompleted: 89,
    verifiedAt: '2024-10-22',
  },
  {
    id: 'lawyer_007',
    fullName: 'Amina Hassan',
    city: 'Abuja',
    state: 'FCT',
    bio: 'Constitutional law specialist with extensive experience in electoral disputes, fundamental rights enforcement, and public interest litigation.',
    practiceAreas: ['constitutional', 'police_human_rights'],
    yearsOfExperience: 16,
    firmOrChambers: 'Hassan & Co Chambers',
    scnNumber: 'SCN/FCT/0008764',
    yearOfCall: 2008,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.9,
    consultationsCompleted: 112,
    verifiedAt: '2024-09-14',
  },
  {
    id: 'lawyer_008',
    fullName: 'Olawale Adeyemi',
    city: 'Lagos',
    state: 'Lagos',
    bio: 'Criminal defence attorney with 10 years at the Lagos State Legal Aid Council. I handle bail applications, criminal trials, and appeal proceedings.',
    practiceAreas: ['criminal', 'police_human_rights'],
    yearsOfExperience: 10,
    scnNumber: 'SCN/LAG/0027341',
    yearOfCall: 2014,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.6,
    consultationsCompleted: 74,
    verifiedAt: '2024-11-30',
  },
  {
    id: 'lawyer_009',
    fullName: 'Chidinma Eze',
    city: 'Port Harcourt',
    state: 'Rivers',
    bio: 'Employment and family law practitioner. I specialise in maternity rights, wrongful dismissal, and domestic relations proceedings in Rivers State.',
    practiceAreas: ['employment', 'family'],
    yearsOfExperience: 5,
    scnNumber: 'SCN/RIV/0019872',
    yearOfCall: 2019,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.4,
    consultationsCompleted: 18,
    verifiedAt: '2025-04-01',
  },
  {
    id: 'lawyer_010',
    fullName: 'Muhammad Bello',
    city: 'Kano',
    state: 'Kano',
    bio: 'Business and Islamic finance law expert. I advise on halal-compliant contracts, sukuk structuring, and commercial dispute resolution under Kano State law.',
    practiceAreas: ['business', 'family'],
    yearsOfExperience: 13,
    firmOrChambers: 'Bello Legal Consult',
    scnNumber: 'SCN/KAN/0031056',
    yearOfCall: 2011,
    applicationStatus: 'verified',
    isAvailable: false,
    rating: 4.8,
    consultationsCompleted: 61,
    verifiedAt: '2025-01-25',
  },
  {
    id: 'lawyer_011',
    fullName: 'Ifeoma Ndubuisi',
    city: 'Enugu',
    state: 'Enugu',
    bio: 'Tenancy and consumer rights advocate. I represent tenants facing illegal evictions, help landlords enforce valid leases, and fight defective product claims.',
    practiceAreas: ['tenancy_land', 'consumer'],
    yearsOfExperience: 8,
    scnNumber: 'SCN/ENU/0023110',
    yearOfCall: 2016,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.5,
    consultationsCompleted: 36,
    verifiedAt: '2025-02-10',
  },
  {
    id: 'lawyer_012',
    fullName: 'Seun Adeleke',
    city: 'Ibadan',
    state: 'Oyo',
    bio: 'General practice lawyer covering immigration, constitutional rights, and employment. Former UNHCR legal officer with expertise in refugee and asylum matters.',
    practiceAreas: ['immigration', 'constitutional', 'employment'],
    yearsOfExperience: 9,
    firmOrChambers: 'Adeleke & Partners',
    scnNumber: 'SCN/OYO/0044872',
    yearOfCall: 2015,
    applicationStatus: 'verified',
    isAvailable: true,
    rating: 4.6,
    consultationsCompleted: 47,
    verifiedAt: '2024-12-18',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  return delay(400 + Math.random() * 400);
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

// ─── Mutable In-Memory State ──────────────────────────────────────────────────

// Lawyers are seeded from SEED_LAWYERS but can be mutated (availability, profile edits)
let _lawyers: LawyerProfile[] = [...SEED_LAWYERS];

// In-memory consultation requests
let _myRequests: ConsultationRequest[] = [];
let _incomingRequests: ConsultationRequest[] = [];

// Mock current user lawyer application
let _myApplication: LawyerApplication | null = null;

// ─── Service Implementation ───────────────────────────────────────────────────

export const mockMarketplaceService: IMarketplaceService = {
  // BACKEND: lawyers table (status = 'verified')
  async listLawyers(filters) {
    await randomDelay();
    let results = _lawyers.filter((l) => l.applicationStatus === 'verified');

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.bio.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.practiceAreas.some((pa) => pa.includes(q))
      );
    }

    if (filters?.practiceArea) {
      results = results.filter((l) =>
        l.practiceAreas.includes(filters.practiceArea as PracticeArea)
      );
    }

    if (filters?.city) {
      results = results.filter(
        (l) => l.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    return results;
  },

  // BACKEND: lawyers table single row
  async getLawyer(id) {
    await randomDelay();
    return _lawyers.find((l) => l.id === id) ?? null;
  },

  // BACKEND: consultation_requests table INSERT
  async createConsultationRequest(params) {
    await randomDelay();
    const lawyer = _lawyers.find((l) => l.id === params.lawyerId);
    const now = new Date().toISOString();
    const req: ConsultationRequest = {
      id: `req_${generateId()}`,
      userId: 'mock_user',
      lawyerId: params.lawyerId,
      lawyerName: lawyer?.fullName ?? 'Unknown Lawyer',
      practiceArea: params.practiceArea,
      issueDescription: params.issueDescription,
      contactPreference: params.contactPreference,
      urgency: params.urgency,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    _myRequests = [req, ..._myRequests];
    _incomingRequests = [req, ..._incomingRequests];
    return req;
  },

  // BACKEND: consultation_requests table WHERE user_id = auth.uid()
  async listMyRequests() {
    await randomDelay();
    return [..._myRequests];
  },

  // BACKEND: lawyer_applications table WHERE user_id = auth.uid()
  async getMyApplication() {
    await randomDelay();
    return _myApplication;
  },

  // BACKEND: lawyer_applications table UPSERT (draft)
  async saveApplicationDraft(draft) {
    await delay(200);
    if (_myApplication) {
      _myApplication = {
        ..._myApplication,
        ...draft,
        lastUpdatedAt: new Date().toISOString(),
      } as LawyerApplication;
    } else {
      _myApplication = {
        id: `app_${generateId()}`,
        userId: 'mock_user',
        status: 'draft',
        personal: { fullName: '', city: '', state: '', bio: '' },
        credentials: {
          scnNumber: '',
          yearOfCall: 2020,
          practiceAreas: [],
          yearsOfExperience: 0,
        },
        documents: [],
        currentStep: 0,
        lastUpdatedAt: new Date().toISOString(),
        ...draft,
      } as LawyerApplication;
    }
    // Persist to AsyncStorage so drafts survive app restarts
    try {
      await AsyncStorage.setItem(KEYS.APPLICATION, JSON.stringify(_myApplication));
    } catch {}
    return _myApplication!;
  },

  // BACKEND: lawyer_applications table UPDATE status = 'submitted'
  async submitApplication(applicationId) {
    await randomDelay();
    if (!_myApplication || _myApplication.id !== applicationId) {
      throw new Error('Application not found');
    }
    const now = new Date().toISOString();
    _myApplication = {
      ..._myApplication,
      status: 'submitted',
      submittedAt: now,
      lastUpdatedAt: now,
    };
    try {
      await AsyncStorage.setItem(KEYS.APPLICATION, JSON.stringify(_myApplication));
    } catch {}
    return _myApplication;
  },

  // BACKEND: consultation_requests table WHERE lawyer_id = auth.uid()
  async listIncomingRequests() {
    await randomDelay();
    return [..._incomingRequests];
  },

  // BACKEND: consultation_requests table UPDATE status = accept|decline
  async respondToRequest(requestId, response, declineReason) {
    await randomDelay();
    const idx = _incomingRequests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error('Request not found');

    const updated: ConsultationRequest = {
      ..._incomingRequests[idx],
      status: response === 'accept' ? 'accepted' : 'declined',
      declineReason,
      updatedAt: new Date().toISOString(),
    };
    _incomingRequests[idx] = updated;

    // Also update user-side list
    const myIdx = _myRequests.findIndex((r) => r.id === requestId);
    if (myIdx !== -1) _myRequests[myIdx] = updated;

    return updated;
  },

  // BACKEND: lawyers table UPDATE profile fields
  async updateLawyerProfile(lawyerId, updates) {
    await randomDelay();
    const idx = _lawyers.findIndex((l) => l.id === lawyerId);
    if (idx === -1) throw new Error('Lawyer not found');
    _lawyers[idx] = { ..._lawyers[idx], ...updates };
    return _lawyers[idx];
  },

  // BACKEND: lawyers table UPDATE is_available
  async setAvailability(lawyerId, available) {
    await delay(300);
    const idx = _lawyers.findIndex((l) => l.id === lawyerId);
    if (idx === -1) throw new Error('Lawyer not found');
    _lawyers[idx] = { ..._lawyers[idx], isAvailable: available };
    return _lawyers[idx];
  },

  // DEV ONLY – cycle application status for testing Step 5 screens
  async __devSetApplicationStatus(status: LawyerApplicationStatus) {
    if (!_myApplication) {
      _myApplication = {
        id: `app_dev`,
        userId: 'mock_user',
        status,
        personal: { fullName: 'Dev User', city: 'Lagos', state: 'Lagos', bio: 'Test bio.' },
        credentials: {
          scnNumber: 'SCN/DEV/0000001',
          yearOfCall: 2015,
          practiceAreas: ['consumer'],
          yearsOfExperience: 8,
        },
        documents: [],
        currentStep: 3,
        submittedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        rejectionReason:
          status === 'rejected'
            ? 'The practising certificate you submitted has expired. Please upload a current document.'
            : undefined,
      };
    } else {
      _myApplication = {
        ..._myApplication,
        status,
        rejectionReason:
          status === 'rejected'
            ? 'The practising certificate you submitted has expired. Please upload a current document.'
            : undefined,
      };
    }
    try {
      await AsyncStorage.setItem(KEYS.APPLICATION, JSON.stringify(_myApplication));
    } catch {}
  },
};

// ─── Boot: rehydrate persisted application draft from AsyncStorage ────────────

export async function rehydrateMockService(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.APPLICATION);
    if (raw) {
      _myApplication = JSON.parse(raw) as LawyerApplication;
    }
  } catch {}
}
