import { useCallback, useState } from 'react';
import { ESService } from '../services';

type BuildStatus = {
  loading: boolean;
  error: Error | null;
}

const esService = new ESService();

export const useEsBuild = () => {
  const [status, setStatus] = useState<BuildStatus>({
    loading: false,
    error: null,
  });

  const triggerBuild = useCallback(async (content: string) => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await esService.build(content);
      setStatus({
        loading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus({
        loading: false,
        error: new Error(message),
      });
      throw error;
    }
  }, []);

  return {
    triggerBuild,
		...status
  };
};