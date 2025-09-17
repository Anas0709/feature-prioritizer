'use client'

import { Feature } from '@/types'
import { X } from 'lucide-react'

interface FeatureComparisonProps {
  features: Feature[]
  selectedFeatureIds: string[]
  framework: 'rice' | 'moscow'
  onClose: () => void
}

export default function FeatureComparison({ features, selectedFeatureIds, framework, onClose }: FeatureComparisonProps) {
  const selectedFeatures = features.filter(f => selectedFeatureIds.includes(f.id))

  if (selectedFeatures.length < 2) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Feature Comparison
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedFeatures.map((feature) => (
              <div key={feature.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-lg">
                  {feature.name}
                </h3>
                
                {framework === 'rice' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">RICE Score</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                        {feature.riceScore?.toFixed(0) || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Reach</span>
                        <span className="font-medium">{feature.reach || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Impact</span>
                        <span className="font-medium">{feature.impact || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Confidence</span>
                        <span className="font-medium">{feature.confidence || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Effort</span>
                        <span className="font-medium">{feature.effort || 'N/A'}mo</span>
                      </div>
                    </div>
                    
                    {/* Priority Badge */}
                    <div className="mt-4">
                      <span className={`badge ${
                        (feature.riceScore || 0) >= 500 ? 'badge-success' :
                        (feature.riceScore || 0) >= 100 ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {(feature.riceScore || 0) >= 500 ? 'High Priority' :
                         (feature.riceScore || 0) >= 100 ? 'Medium Priority' :
                         'Low Priority'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Category</span>
                      <span className={`badge ${
                        feature.moscowCategory === 'must' ? 'badge-success' :
                        feature.moscowCategory === 'should' ? 'badge-warning' :
                        feature.moscowCategory === 'could' ? 'badge-neutral' :
                        'badge-danger'
                      }`}>
                        {feature.moscowCategory?.charAt(0).toUpperCase() + feature.moscowCategory?.slice(1) || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <span className={`badge ${
                        feature.moscowCategory === 'must' ? 'badge-success' :
                        feature.moscowCategory === 'should' ? 'badge-warning' :
                        feature.moscowCategory === 'could' ? 'badge-neutral' :
                        'badge-danger'
                      }`}>
                        {feature.moscowCategory === 'must' ? 'Must Have' :
                         feature.moscowCategory === 'should' ? 'Should Have' :
                         feature.moscowCategory === 'could' ? 'Could Have' :
                         feature.moscowCategory === 'wont' ? 'Won\'t Have' :
                         'N/A'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Created: {feature.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
              Comparison Summary
            </h4>
            {framework === 'rice' ? (
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Highest RICE Score:</strong> {Math.max(...selectedFeatures.map(f => f.riceScore || 0)).toFixed(0)}
                </div>
                <div>
                  <strong>Average RICE Score:</strong> {(selectedFeatures.reduce((sum, f) => sum + (f.riceScore || 0), 0) / selectedFeatures.length).toFixed(0)}
                </div>
                <div>
                  <strong>Total Effort:</strong> {selectedFeatures.reduce((sum, f) => sum + (f.effort || 0), 0)} person-months
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Must Have Features:</strong> {selectedFeatures.filter(f => f.moscowCategory === 'must').length}
                </div>
                <div>
                  <strong>Should Have Features:</strong> {selectedFeatures.filter(f => f.moscowCategory === 'should').length}
                </div>
                <div>
                  <strong>Could Have Features:</strong> {selectedFeatures.filter(f => f.moscowCategory === 'could').length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
