/**
 * Marketplace Service Interface
 *
 * All marketplace screens must call methods through this interface (or the
 * provider re-export). Swapping from mock to real backend = update
 * services/marketplaceProvider.ts only.
 */

import type {
  LawyerProfile,
  LawyerApplication,
  ConsultationRequest,
  LawyerFilters,
  PracticeArea,
  ContactPreference,
  UrgencyLevel,
  ConsultationStatus,
  LawyerApplicationStatus,
} from '../types/marketplace';

export interface IMarketplaceService {
  // ─── Directory ─────────────────────────────────────────────────────────────
  // BACKEND: lawyers table (status = 'verified')
  listLawyers(filters?: LawyerFilters): Promise<LawyerProfile[]>;

  // BACKEND: lawyers table single row
  getLawyer(id: string): Promise<LawyerProfile | null>;

  // ─── Consultation Requests (User Side) ─────────────────────────────────────
  // BACKEND: consultation_requests table INSERT
  createConsultationRequest(params: {
    lawyerId: string;
    practiceArea: PracticeArea;
    issueDescription: string;
    contactPreference: ContactPreference;
    urgency: UrgencyLevel;
  }): Promise<ConsultationRequest>;

  // BACKEND: consultation_requests table WHERE user_id = auth.uid()
  listMyRequests(): Promise<ConsultationRequest[]>;

  // ─── Lawyer Application ────────────────────────────────────────────────────
  // BACKEND: lawyer_applications table WHERE user_id = auth.uid()
  getMyApplication(): Promise<LawyerApplication | null>;

  // BACKEND: lawyer_applications table UPSERT (draft)
  saveApplicationDraft(draft: Partial<LawyerApplication>): Promise<LawyerApplication>;

  // BACKEND: lawyer_applications table UPDATE status = 'submitted'
  submitApplication(applicationId: string): Promise<LawyerApplication>;

  // ─── Lawyer Dashboard (verified lawyers only) ──────────────────────────────
  // BACKEND: consultation_requests table WHERE lawyer_id = auth.uid()
  listIncomingRequests(): Promise<ConsultationRequest[]>;

  // BACKEND: consultation_requests table UPDATE status = accept|decline
  respondToRequest(
    requestId: string,
    response: 'accept' | 'decline',
    declineReason?: string
  ): Promise<ConsultationRequest>;

  // BACKEND: lawyers table UPDATE profile fields
  updateLawyerProfile(
    lawyerId: string,
    updates: Partial<Pick<LawyerProfile, 'bio' | 'practiceAreas' | 'firmOrChambers'>>
  ): Promise<LawyerProfile>;

  // BACKEND: lawyers table UPDATE is_available
  setAvailability(lawyerId: string, available: boolean): Promise<LawyerProfile>;

  // ─── Dev / testing only ────────────────────────────────────────────────────
  // BACKEND: n/a (dev only)
  __devSetApplicationStatus?(status: LawyerApplicationStatus): Promise<void>;
}
