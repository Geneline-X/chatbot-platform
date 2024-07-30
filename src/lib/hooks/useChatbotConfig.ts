import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';


const useChatbotConfig = (chatbotId: string | undefined) => {
  if(!chatbotId){
    return {}
  }
  const { data, isLoading, error } = trpc.getBrand.useQuery({ chatbotId });

  return { config: data, isLoading, error };
  
};

export default useChatbotConfig;
