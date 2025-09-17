export interface Feature {
  id: string
  name: string
  reach?: number
  impact?: number
  confidence?: number
  effort?: number
  moscowCategory?: 'must' | 'should' | 'could' | 'wont'
  riceScore?: number
  createdAt: Date
}

export type Framework = 'rice' | 'moscow'

export interface RiceMetrics {
  reach: number
  impact: number
  confidence: number
  effort: number
}

export interface MoscowCategory {
  category: 'must' | 'should' | 'could' | 'wont'
}
