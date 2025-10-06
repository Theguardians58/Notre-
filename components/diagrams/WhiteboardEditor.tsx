// Whiteboard/drawing editor using Excalidraw
'use client';

import { FC, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => {
    const module = await import('@excalidraw/excalidraw');
    return module.Excalidraw;
  },
  { ssr: false }
);

interface WhiteboardEditorProps {
  initialData?: any;
  onChange?: (data: any) => void;
  readOnly?: boolean;
}

export const WhiteboardEditor: FC<WhiteboardEditorProps> = ({
  initialData,
  onChange,
  readOnly = false,
}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  useEffect(() => {
    if (excalidrawAPI && initialData) {
      excalidrawAPI.updateScene(initialData);
    }
  }, [excalidrawAPI, initialData]);

  const handleChange = (elements: any, appState: any) => {
    if (onChange) {
      onChange({
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemStrokeColor: appState.currentItemStrokeColor,
          currentItemBackgroundColor: appState.currentItemBackgroundColor,
        },
      });
    }
  };

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        viewModeEnabled={readOnly}
        gridModeEnabled={true}
        theme="light"
      />
    </div>
  );
};
