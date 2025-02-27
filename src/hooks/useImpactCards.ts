
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImpactCard } from '@/integrations/supabase/types/models.types';
import { useToast } from '@/hooks/use-toast';

// Function to fetch active impact cards
const fetchActiveImpactCards = async (): Promise<ImpactCard[]> => {
  const { data, error } = await supabase
    .from('impact_cards')
    .select('*')
    .eq('status', 'published') // Using published as the active status based on the existing enum
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching impact cards:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useImpactCards = () => {
  const { toast } = useToast();
  
  // Use React Query to fetch and cache the data
  const {
    data: impactCards,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['activeImpactCards'],
    queryFn: fetchActiveImpactCards,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Set up Supabase real-time subscription for automatic updates
  useEffect(() => {
    const channel = supabase
      .channel('impact-cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'impact_cards',
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refetch data when the table is updated
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Display error toast if there's an error
  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Failed to load impact cards—please try again.',
        variant: 'destructive',
      });
    }
  }, [isError, toast]);

  return {
    impactCards: impactCards || [],
    isLoading,
    isError,
    refetch,
  };
};
