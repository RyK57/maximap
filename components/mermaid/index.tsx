"use client"

import React, { useEffect, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface MermaidProps {
  chart: string;
  name: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, name }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const renderMermaid = useCallback(async () => {
    try {
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      const { svg } = await mermaid.render('mermaid-svg', chart);
      setSvg(svg);
      setError(null);
    } catch (err) {
      console.error('Error rendering mermaid chart:', err);
      setError('Failed to render chart. Please check your Mermaid syntax.');
    }
  }, [chart]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const handleZoom = (delta: number) => {
    setScale(prevScale => Math.max(0.1, Math.min(prevScale + delta, 4)));
  };

  const resetZoom = () => setScale(1);

  const exportSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMermaidCode = () => {
    navigator.clipboard.writeText(chart)
      .then(() => alert('Mermaid code copied to clipboard!'))
      .catch(() => alert('Failed to copy Mermaid code. Please try again.'));
  };

  return (
    <div className="relative w-full h-[180vh] border rounded-lg overflow-hidden bg-black">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        <button onClick={() => handleZoom(0.1)} className="p-4 bg-gray-700 text-white rounded text-lg">
          <ZoomIn size={24} />
        </button>
        <button onClick={() => handleZoom(-0.1)} className="p-4 bg-gray-700 text-white rounded text-lg">
          <ZoomOut size={24} />
        </button>
        <button onClick={resetZoom} className="p-4 bg-gray-700 text-white rounded text-lg">
          <RotateCcw size={24} />
        </button>
      </div>
      
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button onClick={copyMermaidCode} className="p-4 bg-blue-700 text-white rounded text-lg">
          Copy Code
        </button>
        <button onClick={exportSvg} className="p-4 bg-green-700 text-white rounded text-lg">
          <Download size={24} />
        </button>
      </div>

      <div className="w-full h-full overflow-auto flex items-center justify-center">
        {error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : (
          <div
            className="mermaid"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center', color: 'white', fontSize: '1.5rem', minWidth: '100%', minHeight: '100%' }}
            dangerouslySetInnerHTML={{ __html: svg || '' }}
          />
        )}
      </div>
    </div>
  );
};

export default Mermaid;