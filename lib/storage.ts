import { Feature } from '@/types'

const STORAGE_KEY = 'feature-prioritizer-data'

export function saveFeaturesToStorage(features: Feature[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features))
  } catch (error) {
    console.warn('Failed to save features to localStorage:', error)
  }
}

export function loadFeaturesFromStorage(): Feature[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const features = JSON.parse(stored)
      // Convert date strings back to Date objects
      return features.map((feature: any) => ({
        ...feature,
        createdAt: new Date(feature.createdAt)
      }))
    }
  } catch (error) {
    console.warn('Failed to load features from localStorage:', error)
  }
  return []
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}

export function exportBackup(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || '[]'
  } catch (error) {
    console.warn('Failed to export backup:', error)
    return '[]'
  }
}

export function importBackup(backupData: string): Feature[] {
  try {
    const features = JSON.parse(backupData)
    // Validate and convert data
    const validFeatures = features.map((feature: any) => ({
      ...feature,
      createdAt: new Date(feature.createdAt || Date.now())
    }))
    
    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validFeatures))
    return validFeatures
  } catch (error) {
    console.warn('Failed to import backup:', error)
    throw new Error('Invalid backup data format')
  }
}
