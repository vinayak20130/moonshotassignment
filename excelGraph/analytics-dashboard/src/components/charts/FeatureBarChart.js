
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <div className="flex items-center text-primary-600">
          <span className="font-semibold">{payload[0].value}</span>
          <span className="ml-1 text-sm text-gray-600">hours</span>
        </div>
      </div>
    );
  }
  return null;
};

export const FeatureBarChart = ({ data, onFeatureClick }) => {
  const containerRef = useRef(null);
  const [zoomState, setZoomState] = useState({
    scale: 1,
    domain: { start: 0, end: data.length - 1 }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const handleWheel = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const isMouseOverChart = 
      e.clientX >= rect.left && 
      e.clientX <= rect.right && 
      e.clientY >= rect.top && 
      e.clientY <= rect.bottom;

    if (!isMouseOverChart) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaY = e.deltaY;
    const scaleChange = deltaY > 0 ? 0.9 : 1.1;
    
    const containerWidth = containerRef.current.clientWidth;
    if (containerWidth === 0) return;

 
    const mouseX = (e.clientX - rect.left) / containerWidth;

    setZoomState(prev => {
      const newScale = Math.min(Math.max(prev.scale * scaleChange, 1), 5);
      const domainLength = data.length;
      const visiblePoints = Math.ceil(domainLength / newScale);
      
      const domainCenter = prev.domain.start + 
        (prev.domain.end - prev.domain.start) * mouseX;
      
      let start = Math.max(0, Math.floor(domainCenter - visiblePoints / 2));
      let end = Math.min(domainLength - 1, Math.ceil(domainCenter + visiblePoints / 2));
      
      if (start === 0) {
        end = Math.min(domainLength - 1, start + visiblePoints);
      }
      if (end === domainLength - 1) {
        start = Math.max(0, end - visiblePoints);
      }

      return {
        scale: newScale,
        domain: { start, end }
      };
    });
  }, [data.length]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      domain: { ...zoomState.domain }
    });
  }, [zoomState.domain]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragStart) return;

    const containerWidth = containerRef.current.clientWidth;
    const deltaX = e.clientX - dragStart.x;
    const domainLength = data.length;
    const pointsPerPixel = (domainLength / containerWidth) * zoomState.scale;
    const pointsDelta = Math.round(deltaX * pointsPerPixel);

    let newStart = dragStart.domain.start - pointsDelta;
    let newEnd = dragStart.domain.end - pointsDelta;

 
    if (newStart < 0) {
      newStart = 0;
      newEnd = dragStart.domain.end - dragStart.domain.start;
    }
    if (newEnd >= domainLength) {
      newEnd = domainLength - 1;
      newStart = newEnd - (dragStart.domain.end - dragStart.domain.start);
    }

    setZoomState(prev => ({
      ...prev,
      domain: { start: newStart, end: newEnd }
    }));
  }, [isDragging, dragStart, data.length, zoomState.scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const resetZoom = () => {
    setZoomState({
      scale: 1,
      domain: { start: 0, end: data.length - 1 }
    });
  };

  const handleZoomIn = () => {
    setZoomState(prev => {
      const newScale = Math.min(prev.scale * 1.2, 5);
      const visiblePoints = Math.ceil(data.length / newScale);
      const currentCenter = Math.floor((prev.domain.start + prev.domain.end) / 2);
      const halfPoints = Math.floor(visiblePoints / 2);
      
      let start = Math.max(0, currentCenter - halfPoints);
      let end = Math.min(data.length - 1, currentCenter + halfPoints);

      return {
        scale: newScale,
        domain: { start, end }
      };
    });
  };

  const handleZoomOut = () => {
    setZoomState(prev => {
      const newScale = Math.max(prev.scale / 1.2, 1);
      const visiblePoints = Math.ceil(data.length / newScale);
      const currentCenter = Math.floor((prev.domain.start + prev.domain.end) / 2);
      const halfPoints = Math.floor(visiblePoints / 2);
      
      let start = Math.max(0, currentCenter - halfPoints);
      let end = Math.min(data.length - 1, currentCenter + halfPoints);

      if (newScale === 1) {
        start = 0;
        end = data.length - 1;
      }

      return {
        scale: newScale,
        domain: { start, end }
      };
    });
  };

  const visibleData = data.slice(
    zoomState.domain.start,
    zoomState.domain.end + 1
  );

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className={`relative h-[400px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        style={{ overflow: 'hidden' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={visibleData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              onClick={(data) => onFeatureClick(data.name)}
              cursor="pointer"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200 text-gray-700"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200 text-gray-700"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {zoomState.scale > 1 && (
          <button
            className="p-2 bg-white rounded-md shadow hover:bg-gray-50 transition-colors duration-200 text-gray-700"
            onClick={resetZoom}
            title="Reset Zoom"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {zoomState.scale === 1 && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white/90 px-3 py-1 rounded-full shadow-sm">
          Use mouse wheel to zoom, drag to pan
        </div>
      )}
    </div>
  );
};

export default FeatureBarChart;