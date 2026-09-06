import { supabase } from '../utils/supabase';

export interface ServerTutorResponse {
  answer: string;
  citation: string;
  sources?: string[];
  isUrgent: boolean;
  emergencyTip?: string;
  mode: 'online';
}

/**
 * Sends user query to the server-side AI Tutor pipeline (Supabase Edge Function)
 */
export const sendOnlineTutorQuery = async (
  query: string,
  history?: Array<{ sender: string; text: string }>
): Promise<ServerTutorResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-tutor', {
      body: { query, history },
    });

    if (error || !data) {
      throw new Error(error?.message || 'Server Edge Function response empty');
    }

    return {
      answer: data.answer,
      citation: data.citation || '1999 Constitution of Nigeria',
      sources: data.sources || [],
      isUrgent: !!data.isUrgent,
      emergencyTip: data.emergencyTip,
      mode: 'online',
    };
  } catch (err) {
    console.warn('Online server pipeline error, falling back to local server response:', err);
    throw err;
  }
};
