import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ImpactCard } from '@/integrations/supabase/types/models.types';

export const useMapData = () => {
  const [impactCards, setImpactCards] = useState<ImpactCard[]>([]);

  const loadImpactCards = useCallback(async (filters: {
    dateRange: DateRange | undefined;
    category: string | undefined;
    userId: string | undefined;
  }) => {
    try {
      let query = supabase
        .from('impact_cards')
        .select('*')
        .eq('status', 'published')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (filters.dateRange?.from) {
        query = query.gte('created_at', format(filters.dateRange.from, 'yyyy-MM-dd'));
      }
      if (filters.dateRange?.to) {
        query = query.lte('created_at', format(filters.dateRange.to, 'yyyy-MM-dd'));
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching impact cards:', error);
        return;
      }

      setImpactCards(data);
    } catch (error) {
      console.error('Error in loadImpactCards:', error);
    }
  }, []);

  return {
    impactCards,
    loadImpactCards,
  };
};