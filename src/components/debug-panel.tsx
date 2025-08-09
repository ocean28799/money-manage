'use client';

import { useState, useEffect } from 'react';

interface DebugInfo {
  userAgent: string;
  viewport: string;
  localStorage: boolean;
  indexedDB: boolean;
  cookiesEnabled: boolean;
  timestamp: string;
}

export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info: DebugInfo = {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        localStorage: typeof Storage !== 'undefined',
        indexedDB: 'indexedDB' in window,
        cookiesEnabled: navigator.cookieEnabled,
        timestamp: new Date().toISOString(),
      };
      setDebugInfo(info);
    }
  }, []);

  // Only show in development or when there's an error
  if (process.env.NODE_ENV !== 'development' && !showDebug) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
      >
        Debug
      </button>
      
      {showDebug && debugInfo && (
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white p-3 rounded text-xs max-w-sm overflow-auto max-h-96">
          <h4 className="font-bold mb-2">Debug Information</h4>
          <div className="space-y-1">
            <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
            <div><strong>Viewport:</strong> {debugInfo.viewport}</div>
            <div><strong>LocalStorage:</strong> {debugInfo.localStorage ? '✅' : '❌'}</div>
            <div><strong>IndexedDB:</strong> {debugInfo.indexedDB ? '✅' : '❌'}</div>
            <div><strong>Cookies:</strong> {debugInfo.cookiesEnabled ? '✅' : '❌'}</div>
            <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
          </div>
          
          <div className="mt-3">
            <button
              onClick={() => {
                console.log('🐛 Debug Info:', debugInfo);
                console.log('🐛 Local Storage:', localStorage);
                console.log('🐛 Session Storage:', sessionStorage);
              }}
              className="bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
            >
              Log to Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
