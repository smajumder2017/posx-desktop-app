import { useEffect, useState } from 'react';

import { IconRefresh, IconRefreshAlert } from '@tabler/icons-react';

export const SyncStatusBar = () => {
  const [message, setMessage] = useState<{ message: string; status: string }>();
  useEffect(() => {
    const eventSource = new EventSource(
      'http://localhost:8080/api/syncStatusEvent',
    );
    eventSource.onmessage = ({ data }) => {
      setMessage(JSON.parse(data));
      // console.log('New message', JSON.parse(data));
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (message?.status === 'SUCCESS') {
    return <IconRefresh className="text-green-600" />;
  }

  if (message?.status === 'FAILED') {
    return <IconRefreshAlert className="text-red-600 animate-pulse" />;
  }

  return <IconRefresh className="text-yellow-600 animate-spin" />;
};
