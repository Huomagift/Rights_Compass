import NetInfo from '@react-native-community/netinfo';
import { sendOnlineTutorQuery } from './serverTutorService';
import { processTutorQuery } from './tutorAgent';

export interface RoutedTutorResponse {
  answer: string;
  citation: string;
  sources?: string[];
  isUrgent: boolean;
  emergencyTip?: string;
  mode: 'online' | 'offline';
}

/**
 * Checks connectivity status prior to routing queries.
 * Returns true if network is connected and internet is reachable.
 */
export const checkIsOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && (state.isInternetReachable ?? true));
  } catch (e) {
    return false;
  }
};

/**
 * Routes user query based on real-time network status:
 * - Online: Routes to server-side AI Tutor pipeline (Supabase Edge Function)
 * - Offline: Explicitly falls back to local tutorAgent.ts keyword RAG against 1999 Constitution
 */
export const routeTutorQuery = async (
  query: string,
  history?: Array<{ sender: string; text: string }>
): Promise<RoutedTutorResponse> => {
  const isOnline = await checkIsOnline();

  if (isOnline) {
    try {
      const onlineRes = await sendOnlineTutorQuery(query, history);
      return onlineRes;
    } catch (err) {
      console.warn('Server pipeline failed despite online status, falling back to local tutorAgent:', err);
    }
  }

  // EXPLICIT OFFLINE FALLBACK: Uses local keyword RAG engine (services/tutorAgent.ts)
  const offlineRes = processTutorQuery(query);
  const citationStr = offlineRes.citation || '1999 Constitution of Nigeria';
  return {
    answer: offlineRes.answer,
    citation: citationStr,
    sources: [citationStr],
    isUrgent: offlineRes.isUrgent,
    emergencyTip: offlineRes.emergencyTip,
    mode: 'offline',
  };
};
