import { useEffect, useState } from 'react';

export const useCloudCannonEditor = () => {
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // Check if window.editable exists (CloudCannon specific)
    // or window.inEditorMode (from our previous setup)
    if (
      typeof window !== 'undefined' && 
      ((window as any).editable || (window as any).inEditorMode)
    ) {
      setIsEditable(true);
    }
  }, []);

  return isEditable;
};
