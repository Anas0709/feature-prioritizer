'use client'

import { Feature } from '@/types'

interface SimpleChartProps {
  features: Feature[]
  framework: 'rice' | 'moscow'
}

export default function SimpleChart({ features, framework }: SimpleChartProps) {
  if (features.length === 0) return null

  const maxScore = framework === 'rice' 
    ? Math.max(...features.map(f => f.riceScore || 0))
    : 100

  return (
    <div className="space-y-3">
      {features.slice(0, 8).map((feature, index) => {
        const score = framework === 'rice' ? (feature.riceScore || 0) : 
          feature.moscowCategory === 'must' ? 100 :
          feature.moscowCategory === 'should' ? 75 :
          feature.moscowCategory === 'could' ? 50 : 25
        
        const percentage = framework === 'rice' 
          ? (score / maxScore) * 100 
          : score

        const barColor = framework === 'rice'
          ? score > 500 ? 'bg-success-500' :
            score > 100 ? 'bg-warning-500' :
            'bg-danger-500'
          : feature.moscowCategory === 'must' ? 'bg-success-500' :
            feature.moscowCategory === 'should' ? 'bg-warning-500' :
            feature.moscowCategory === 'could' ? 'bg-primary-500' :
            'bg-slate-500'

        return (
          <div key={feature.id} className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {feature.name}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">
                  {framework === 'rice' ? Math.round(score) : feature.moscowCategory}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
