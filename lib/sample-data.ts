import { Feature } from '@/types'
import { generateFeatureId } from './calculations'

export const sampleRiceFeatures: Feature[] = [
  {
    id: generateFeatureId(),
    name: 'Social Login (Google/Facebook)',
    reach: 1200,
    impact: 2,
    confidence: 95,
    effort: 2,
    riceScore: 1140,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Dark Mode Theme',
    reach: 1000,
    impact: 1,
    confidence: 90,
    effort: 2,
    riceScore: 450,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Push Notifications for Orders',
    reach: 500,
    impact: 2,
    confidence: 80,
    effort: 3,
    riceScore: 267,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'AI-Powered Search with Filters',
    reach: 800,
    impact: 3,
    confidence: 70,
    effort: 8,
    riceScore: 210,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Offline Reading Mode',
    reach: 200,
    impact: 1,
    confidence: 60,
    effort: 6,
    riceScore: 20,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Advanced Analytics Dashboard',
    reach: 300,
    impact: 2,
    confidence: 85,
    effort: 5,
    riceScore: 102,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Multi-language Support',
    reach: 600,
    impact: 1.5,
    confidence: 75,
    effort: 4,
    riceScore: 169,
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Video Calling Integration',
    reach: 400,
    impact: 2.5,
    confidence: 65,
    effort: 7,
    riceScore: 93,
    createdAt: new Date()
  }
]

export const sampleMoscowFeatures: Feature[] = [
  {
    id: generateFeatureId(),
    name: 'User Authentication System',
    moscowCategory: 'must',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Secure Payment Processing',
    moscowCategory: 'must',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Mobile Responsive Design',
    moscowCategory: 'must',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Advanced Search Functionality',
    moscowCategory: 'should',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Social Media Integration',
    moscowCategory: 'should',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Email Notifications',
    moscowCategory: 'should',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Dark Mode Theme',
    moscowCategory: 'could',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Custom Themes',
    moscowCategory: 'could',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Advanced Reporting',
    moscowCategory: 'could',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'Voice Commands',
    moscowCategory: 'wont',
    createdAt: new Date()
  },
  {
    id: generateFeatureId(),
    name: 'AR/VR Integration',
    moscowCategory: 'wont',
    createdAt: new Date()
  }
]

export const featureTemplates = {
  'mobile-app': {
    name: 'Mobile App Features',
    features: [
      { name: 'Push Notifications', reach: 800, impact: 2, confidence: 85, effort: 2 },
      { name: 'Offline Mode', reach: 300, impact: 2.5, confidence: 70, effort: 4 },
      { name: 'Biometric Login', reach: 600, impact: 1.5, confidence: 90, effort: 3 },
      { name: 'Social Sharing', reach: 400, impact: 1, confidence: 80, effort: 1 }
    ]
  },
  'saas-platform': {
    name: 'SaaS Platform Features',
    features: [
      { name: 'Advanced Analytics', reach: 500, impact: 3, confidence: 80, effort: 6 },
      { name: 'API Integration', reach: 300, impact: 2.5, confidence: 75, effort: 5 },
      { name: 'Team Collaboration', reach: 700, impact: 2, confidence: 85, effort: 4 },
      { name: 'Custom Dashboards', reach: 400, impact: 2, confidence: 70, effort: 3 }
    ]
  },
  'e-commerce': {
    name: 'E-commerce Features',
    features: [
      { name: 'One-Click Checkout', reach: 1000, impact: 3, confidence: 90, effort: 3 },
      { name: 'Product Recommendations', reach: 800, impact: 2, confidence: 75, effort: 4 },
      { name: 'Live Chat Support', reach: 600, impact: 2.5, confidence: 85, effort: 2 },
      { name: 'Wishlist Feature', reach: 400, impact: 1.5, confidence: 80, effort: 2 }
    ]
  }
}
