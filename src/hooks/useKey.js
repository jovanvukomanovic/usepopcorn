import { useEffect } from "react";

export function useKey(key, actionCallback) {
  useEffect(() => {
    function callback(e) {
      // we have set event and key ("Escape","Enter") to lowerCase for comparison, because someone can type differently
      if (e.code.toLowerCase() === key.toLowerCase()) {
        actionCallback();
      }
    }

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [actionCallback, key]);
}
