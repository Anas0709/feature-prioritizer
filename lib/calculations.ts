import { Feature } from '@/types'

export function calculateRiceScore(feature: Feature): number {
  if (!feature.reach || !feature.impact || !feature.confidence || !feature.effort) {
    return 0
  }
  
  // Convert confidence percentage to decimal
  const confidenceDecimal = feature.confidence / 100
  
  // RICE formula: (Reach × Impact × Confidence) ÷ Effort
  const riceScore = (feature.reach * feature.impact * confidenceDecimal) / feature.effort
  
  return Math.round(riceScore * 100) / 100 // Round to 2 decimal places
}

export function sortFeaturesByRice(features: Feature[]): Feature[] {
  return features
    .map(feature => ({
      ...feature,
      riceScore: calculateRiceScore(feature)
    }))
    .sort((a, b) => (b.riceScore || 0) - (a.riceScore || 0))
}

export function sortFeaturesByMoscow(features: Feature[]): Feature[] {
  const priorityOrder = { must: 4, should: 3, could: 2, wont: 1 }
  
  return [...features].sort((a, b) => {
    const aPriority = priorityOrder[a.moscowCategory || 'wont']
    const bPriority = priorityOrder[b.moscowCategory || 'wont']
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // If same priority, sort by name
    return a.name.localeCompare(b.name)
  })
}

export function generateFeatureId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function validateRiceFeature(feature: Partial<Feature>): string[] {
  const errors: string[] = []
  
  if (!feature.name?.trim()) {
    errors.push('Feature name is required')
  }
  
  if (!feature.reach || feature.reach < 1 || feature.reach > 1000) {
    errors.push('Reach must be between 1 and 1000')
  }
  
  if (!feature.impact || feature.impact < 0.25 || feature.impact > 3) {
    errors.push('Impact must be between 0.25 and 3')
  }
  
  if (!feature.confidence || feature.confidence < 50 || feature.confidence > 100) {
    errors.push('Confidence must be between 50% and 100%')
  }
  
  if (!feature.effort || feature.effort < 1 || feature.effort > 50) {
    errors.push('Effort must be between 1 and 50 person-months')
  }
  
  return errors
}

export function validateMoscowFeature(feature: Partial<Feature>): string[] {
  const errors: string[] = []
  
  if (!feature.name?.trim()) {
    errors.push('Feature name is required')
  }
  
  if (!feature.moscowCategory) {
    errors.push('Priority category is required')
  }
  
  return errors
}
