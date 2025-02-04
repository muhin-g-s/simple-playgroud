import { useEffect } from "react";

export const useBuildOnce = (content: string | undefined, triggerBuild: (content: string) => Promise<void>) => {
  useEffect(() => {
    if (content) {
      triggerBuild(content);
    }
  }, [content, triggerBuild]);
};