// src/components/dashboard/ThreatHeatmap.tsx
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Chart from 'chart.js/auto';

export interface ThreatData {
  ipAddress: string;
  threatLevel: number;
  location?: {
    lat: number;
    lng: number;
  };
}

interface ThreatHeatmapProps {
  data: ThreatData[];
}

const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Prepare data for the chart
      const labels = data.map(item => item.ipAddress);
      const threatValues = data.map(item => item.threatLevel);
      
      // Create gradient color scheme
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Prepare chart configuration
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Threat Level',
              data: threatValues,
              backgroundColor: threatValues.map(value => {
                if (value > 75) return 'rgba(239, 68, 68, 0.8)'; // High - Red
                if (value > 50) return 'rgba(245, 158, 11, 0.8)'; // Medium - Orange
                if (value > 25) return 'rgba(245, 200, 11, 0.8)'; // Low - Yellow
                return 'rgba(34, 197, 94, 0.8)'; // Safe - Green
              }),
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Threat Level',
              },
            },
            x: {
              title: {
                display: true,
                text: 'IP Addresses',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y;
                  let severity = 'Safe';
                  if (value > 75) severity = 'Critical';
                  else if (value > 50) severity = 'High';
                  else if (value > 25) severity = 'Medium';
                  
                  return `Threat: ${value} (${severity})`;
                },
              },
            },
          },
        },
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Threat Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <canvas ref={chartRef} />
        </div>
        <div className="flex justify-between mt-4 text-xs">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded mr-1"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-yellow-500 rounded mr-1"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-orange-500 rounded mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-500 rounded mr-1"></div>
            <span>Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatHeatmap;