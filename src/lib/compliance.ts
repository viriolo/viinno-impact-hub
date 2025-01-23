import { supabase } from "@/integrations/supabase/client";

interface ConsentSettings {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
}

const DEFAULT_CONSENT: ConsentSettings = {
  analytics: false,
  marketing: false,
  necessary: true,
};

export const getConsent = (): ConsentSettings => {
  const stored = localStorage.getItem('userConsent');
  return stored ? JSON.parse(stored) : DEFAULT_CONSENT;
};

export const updateConsent = (settings: Partial<ConsentSettings>) => {
  const current = getConsent();
  const updated = { ...current, ...settings };
  localStorage.setItem('userConsent', JSON.stringify(updated));
  return updated;
};

export const checkGDPRCompliance = () => {
  const consent = getConsent();
  
  if (!consent.necessary) {
    throw new Error('Necessary cookies must be accepted to use the platform');
  }
  
  return {
    canTrackAnalytics: consent.analytics,
    canSendMarketing: consent.marketing,
  };
};

export const getUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return {
    data,
    error,
    export: () => {
      // Format data according to GDPR requirements
      return JSON.stringify(data, null, 2);
    },
    delete: async () => {
      // Implement user deletion process
      // This should delete all user data across all tables
      const { error } = await supabase.auth.admin.deleteUser(userId);
      return { error };
    },
  };
};