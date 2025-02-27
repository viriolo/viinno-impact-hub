
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImpactCard as ImpactCardType } from '@/integrations/supabase/types/models.types';
import { supabase } from '@/integrations/supabase/client';

interface ImpactCardProps {
  card: ImpactCardType;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ card }) => {
  const [creatorName, setCreatorName] = useState<string>('');
  
  // Calculate progress percentage
  const progressPercentage = card.goal_amount && card.current_amount 
    ? Math.min(Math.round((card.current_amount / card.goal_amount) * 100), 100)
    : 0;
  
  // Format currency amounts
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch creator's name
  useEffect(() => {
    const fetchCreator = async () => {
      if (card.user_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', card.user_id)
          .maybeSingle();
          
        if (!error && data) {
          setCreatorName(data.username || 'Anonymous');
        } else {
          setCreatorName('Anonymous');
        }
      }
    };
    
    fetchCreator();
  }, [card.user_id]);

  return (
    <Card className="bg-white shadow-md rounded-lg p-4 max-w-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold line-clamp-2">{card.title}</CardTitle>
          {card.status && (
            <Badge 
              variant={card.status === 'published' ? 'default' : 'secondary'}
              className="ml-2"
            >
              {card.status}
            </Badge>
          )}
        </div>
        {card.category && (
          <span className="text-sm text-muted-foreground mt-1">{card.category}</span>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        {card.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{card.description}</p>
        )}
        
        {card.location && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {card.location}
          </div>
        )}
        
        {(card.goal_amount !== null) && (
          <div className="mt-4 flex items-center">
            <div className="w-20 h-20">
              <CircularProgressbar
                value={progressPercentage}
                text={`${progressPercentage}%`}
                styles={buildStyles({
                  // Colors
                  pathColor: `${progressPercentage >= 75 ? '#10b981' : '#4ade80'}`,
                  textColor: '#374151',
                  trailColor: '#d1d5db',
                  backgroundColor: '#3e98c7',
                  // Text size
                  textSize: '22px',
                })}
              />
            </div>
            <div className="flex flex-col ml-4 flex-1">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Current: {formatCurrency(card.current_amount)}</span>
              </div>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Goal: {formatCurrency(card.goal_amount)}</span>
              </div>
            </div>
          </div>
        )}
        
        {creatorName && (
          <div className="flex items-center text-sm text-gray-500 mt-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Created by: {creatorName}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 text-xs text-gray-500 flex justify-between">
        <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
        <div className="flex space-x-3">
          {card.views !== null && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {card.views}
            </span>
          )}
          {card.shares !== null && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {card.shares}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
