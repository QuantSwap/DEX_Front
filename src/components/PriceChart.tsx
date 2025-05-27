import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

interface PriceChartProps {
  pair: string;
  timeframe?: string;
}

interface CandlestickData {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface HistogramData {
  time: number | string;
  value: number;
  color?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ pair, timeframe = '1h' }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const generateMockData = () => {
    const candles: CandlestickData[] = [];
    const volumes: HistogramData[] = [];
    
    const now = new Date();
    let time = new Date(now.getTime() - 100 * 60 * 60 * 1000).getTime() / 1000;
    let price = 50 + Math.random() * 10;
    
    for (let i = 0; i < 100; i++) {
      const open = price;
      const high = open + Math.random() * 2;
      const low = open - Math.random() * 2;
      const close = (open + high + low) / 3 + (Math.random() - 0.5) * 2;
      
      candles.push({
        time: time as any,
        open,
        high,
        low,
        close,
      });
      
      volumes.push({
        time: time as any,
        value: Math.random() * 100,
        color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
      });
      
      price = close;
      time += 60 * 60;
    }
    
    return { candles, volumes };
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = generateMockData();
        
        if (chartRef.current) {
          if (candleSeriesRef.current) {
            candleSeriesRef.current.setData(data.candles);
          }
          if (volumeSeriesRef.current) {
            volumeSeriesRef.current.setData(data.volumes);
          }
        } else {
          initChart(data);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    if (chartContainerRef.current) {
      fetchChartData();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
      }
    };
  }, [pair, timeframe]);

  const initChart = (data: { candles: CandlestickData[], volumes: HistogramData[] }) => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#1a1a1a' } as any, 
        textColor: '#d9d9d9',
      },
      grid: {
        vertLines: { color: '#2c2c2c' },
        horzLines: { color: '#2c2c2c' },
      },
      crosshair: {
        mode: 0 as any, 
      },
      timeScale: {
        borderColor: '#2c2c2c',
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    const anyChart = chart as any;
    
    const candleSeries = anyChart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    const volumeSeries = anyChart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    candleSeries.setData(data.candles);
    volumeSeries.setData(data.volumes);
    
    chart.timeScale().fitContent();
    
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '320px' }}
    />
  );
};

export default PriceChart;
