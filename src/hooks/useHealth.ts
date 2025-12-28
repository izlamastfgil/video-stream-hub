import { useState, useEffect, useCallback } from 'react';
import { checkHealth, HealthStatus } from '@/lib/api';

export function useHealth(pollInterval = 30000) {
  const [health, setHealth] = useState<HealthStatus>({ 
    status: 'unhealthy', 
    timestamp: new Date().toISOString() 
  });
  const [isChecking, setIsChecking] = useState(true);

  const check = useCallback(async () => {
    setIsChecking(true);
    const result = await checkHealth();
    setHealth(result);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, pollInterval);
    return () => clearInterval(interval);
  }, [check, pollInterval]);

  return { health, isChecking, checkNow: check };
}
