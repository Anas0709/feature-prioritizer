import { Feature } from '@/types'

export function exportToCSV(features: Feature[], framework: 'rice' | 'moscow'): string {
  const headers = framework === 'rice' 
    ? ['Rank', 'Feature Name', 'Reach', 'Impact', 'Confidence (%)', 'Effort (months)', 'RICE Score']
    : ['Rank', 'Feature Name', 'Category', 'Priority Level']

  const rows = features.map((feature, index) => {
    if (framework === 'rice') {
      return [
        index + 1,
        `"${feature.name}"`,
        feature.reach || '',
        feature.impact || '',
        feature.confidence || '',
        feature.effort || '',
        feature.riceScore || ''
      ]
    } else {
      return [
        index + 1,
        `"${feature.name}"`,
        feature.moscowCategory || '',
        feature.moscowCategory ? 
          feature.moscowCategory.charAt(0).toUpperCase() + feature.moscowCategory.slice(1) : ''
      ]
    }
  })

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  return csvContent
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function generateFilename(framework: string): string {
  const timestamp = new Date().toISOString().split('T')[0]
  return `feature-prioritization-${framework}-${timestamp}.csv`
}

export function parseCSVImport(csvText: string, framework: 'rice' | 'moscow'): Partial<Feature>[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  const features: Partial<Feature>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    
    if (framework === 'rice') {
      features.push({
        name: values[0],
        reach: parseInt(values[1]) || undefined,
        impact: parseFloat(values[2]) || undefined,
        confidence: parseInt(values[3]) || undefined,
        effort: parseInt(values[4]) || undefined
      })
    } else {
      features.push({
        name: values[0],
        moscowCategory: values[1]?.toLowerCase() as 'must' | 'should' | 'could' | 'wont' || undefined
      })
    }
  }
  
  return features
}
