'use client'

import { Feature } from '@/types'
import { useState } from 'react'
import { BarChart } from 'lucide-react'

interface AdvancedChartsProps {
  features: Feature[]
  framework: 'rice' | 'moscow'
}

export default function AdvancedCharts({ features, framework }: AdvancedChartsProps) {
  const [activeChart, setActiveChart] = useState<'matrix' | 'distribution' | 'confidence'>('matrix')

  if (features.length === 0) return null

  const riceFeatures = features.filter(f => f.reach && f.impact && f.effort && f.confidence)

  // Impact vs Effort Matrix
  const ImpactEffortMatrix = () => {
    const maxImpact = Math.max(...riceFeatures.map(f => f.impact || 0))
    const maxEffort = Math.max(...riceFeatures.map(f => f.effort || 0))
    
    const matrixData = riceFeatures.map(feature => ({
      id: feature.id,
      name: feature.name,
      impact: feature.impact || 0,
      effort: feature.effort || 0,
      riceScore: feature.riceScore || 0,
      x: 20 + ((feature.impact || 0) / maxImpact) * 60, // Scale to 20-80% range
      y: 20 + ((feature.effort || 0) / maxEffort) * 60  // Scale to 20-80% range (higher effort = lower on chart)
    }))

    return (
      <div className="relative">
        <div className="h-80 w-full relative border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
          {/* Quadrant Backgrounds */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-success-50/30 dark:bg-success-900/20 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-warning-50/30 dark:bg-warning-900/20 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary-50/30 dark:bg-primary-900/20 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-danger-50/30 dark:bg-danger-900/20 rounded-br-lg"></div>
          </div>
          
          {/* Quadrant Labels */}
          <div className="absolute top-4 left-4 text-xs font-semibold text-success-700 dark:text-success-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
            High Impact, Low Effort
          </div>
          <div className="absolute top-4 right-4 text-xs font-semibold text-warning-700 dark:text-warning-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
            High Impact, High Effort
          </div>
          <div className="absolute bottom-4 left-4 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
            Low Impact, Low Effort
          </div>
          <div className="absolute bottom-4 right-4 text-xs font-semibold text-danger-700 dark:text-danger-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
            Low Impact, High Effort
          </div>
          
          {/* Quadrant Lines */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-slate-400 dark:bg-slate-500"></div>
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-slate-400 dark:bg-slate-500"></div>
          
          {/* Data Points */}
          {matrixData.map((point, index) => (
            <div
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={`${point.name} - Impact: ${point.impact}, Effort: ${point.effort}mo, RICE: ${point.riceScore}`}
            >
              <div className={`
                w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-lg
                ${point.riceScore > 500 ? 'bg-success-500' :
                  point.riceScore > 100 ? 'bg-warning-500' :
                  'bg-danger-500'}
                hover:scale-125 transition-all duration-200 hover:shadow-xl
              `} />
              
              {/* Feature name on hover */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 shadow-lg">
                <div className="font-medium">{point.name}</div>
                <div className="text-xs opacity-75">RICE: {point.riceScore.toFixed(0)}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-slate-100"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Axes Labels */}
        <div className="flex justify-between mt-4 text-xs text-slate-600 dark:text-slate-400 px-4">
          <span>Low Impact (0.25)</span>
          <span className="text-center font-medium">Impact Level</span>
          <span>High Impact (3.0)</span>
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 -rotate-90 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <span>High Effort</span>
          <span className="mx-2 font-medium">Effort (months)</span>
          <span>Low Effort</span>
        </div>
      </div>
    )
  }

  // Effort Distribution Chart
  const EffortDistribution = () => {
    const effortRanges = [
      { range: '1-2mo', count: riceFeatures.filter(f => (f.effort || 0) <= 2).length, color: 'bg-success-500' },
      { range: '3-4mo', count: riceFeatures.filter(f => (f.effort || 0) >= 3 && (f.effort || 0) <= 4).length, color: 'bg-warning-500' },
      { range: '5-6mo', count: riceFeatures.filter(f => (f.effort || 0) >= 5 && (f.effort || 0) <= 6).length, color: 'bg-primary-500' },
      { range: '7+mo', count: riceFeatures.filter(f => (f.effort || 0) >= 7).length, color: 'bg-danger-500' }
    ]

    const maxCount = Math.max(...effortRanges.map(r => r.count))

    return (
      <div className="space-y-3">
        {effortRanges.map((range, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-slate-600 dark:text-slate-400">
              {range.range}
            </div>
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
              <div 
                className={`h-6 rounded-full ${range.color} transition-all duration-500`}
                style={{ width: maxCount > 0 ? `${(range.count / maxCount) * 100}%` : '0%' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {range.count} features
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Confidence Levels
  const ConfidenceLevels = () => {
    const confidenceRanges = [
      { range: '50-70%', count: riceFeatures.filter(f => (f.confidence || 0) >= 50 && (f.confidence || 0) < 70).length, color: 'bg-danger-500' },
      { range: '70-85%', count: riceFeatures.filter(f => (f.confidence || 0) >= 70 && (f.confidence || 0) < 85).length, color: 'bg-warning-500' },
      { range: '85-95%', count: riceFeatures.filter(f => (f.confidence || 0) >= 85 && (f.confidence || 0) < 95).length, color: 'bg-primary-500' },
      { range: '95-100%', count: riceFeatures.filter(f => (f.confidence || 0) >= 95).length, color: 'bg-success-500' }
    ]

    const maxCount = Math.max(...confidenceRanges.map(r => r.count))

    return (
      <div className="space-y-3">
        {confidenceRanges.map((range, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-slate-600 dark:text-slate-400">
              {range.range}
            </div>
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
              <div 
                className={`h-6 rounded-full ${range.color} transition-all duration-500`}
                style={{ width: maxCount > 0 ? `${(range.count / maxCount) * 100}%` : '0%' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {range.count} features
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (framework !== 'rice' || riceFeatures.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600 dark:text-slate-400">
        <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Advanced charts available for RICE features</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
        <button
          onClick={() => setActiveChart('matrix')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeChart === 'matrix'
              ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Impact vs Effort
        </button>
        <button
          onClick={() => setActiveChart('distribution')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeChart === 'distribution'
              ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Effort Distribution
        </button>
        <button
          onClick={() => setActiveChart('confidence')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeChart === 'confidence'
              ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Confidence Levels
        </button>
      </div>

      {/* Chart Content */}
      <div className="min-h-[300px]">
        {activeChart === 'matrix' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Impact vs Effort Matrix
            </h3>
            <ImpactEffortMatrix />
          </div>
        )}
        
        {activeChart === 'distribution' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Effort Distribution
            </h3>
            <EffortDistribution />
          </div>
        )}
        
        {activeChart === 'confidence' && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Confidence Levels
            </h3>
            <ConfidenceLevels />
          </div>
        )}
      </div>
    </div>
  )
}
