declare module '@brightcove/react-player-loader' {
  import * as React from 'react';

  export interface ReactPlayerLoaderProps {
    accountId: string;
    playerId: string;
    videoId?: string | number | undefined;
    onSuccess?: (success: unknown) => void;
    onFailure?: (success: unknown) => void;
  }

  const ReactPlayerLoader: React.ComponentType<ReactPlayerLoaderProps>;
  export default ReactPlayerLoader;
}