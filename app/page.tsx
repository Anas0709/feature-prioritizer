'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Calculator, Download, Plus, Settings, Zap, X, Edit, Trash2, Info, HelpCircle, Upload, FileText, Save, RotateCcw, BarChart, Search, Filter } from 'lucide-react'
import SimpleChart from '@/components/SimpleChart'
import AdvancedCharts from '@/components/AdvancedCharts'
import FeatureComparison from '@/components/FeatureComparison'
import { Feature, Framework } from '@/types'
import { calculateRiceScore, sortFeaturesByRice, sortFeaturesByMoscow, generateFeatureId, validateRiceFeature, validateMoscowFeature } from '@/lib/calculations'
import { sampleRiceFeatures, sampleMoscowFeatures, featureTemplates } from '@/lib/sample-data'
import { exportToCSV, downloadCSV, generateFilename, parseCSVImport } from '@/lib/export'
import { saveFeaturesToStorage, loadFeaturesFromStorage, clearStorage } from '@/lib/storage'

export default function Home() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [framework, setFramework] = useState<Framework>('rice')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    reach: '',
    impact: '',
    confidence: '',
    effort: '',
    moscowCategory: '' as 'must' | 'should' | 'could' | 'wont' | ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors.length > 0) setErrors([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (framework === 'rice') {
      const riceData = {
        name: formData.name,
        reach: parseInt(formData.reach),
        impact: parseFloat(formData.impact),
        confidence: parseInt(formData.confidence),
        effort: parseInt(formData.effort)
      }

      const validationErrors = validateRiceFeature(riceData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      const newFeature: Feature = {
        id: generateFeatureId(),
        name: riceData.name,
        reach: riceData.reach,
        impact: riceData.impact,
        confidence: riceData.confidence,
        effort: riceData.effort,
        riceScore: calculateRiceScore(riceData as Feature),
        createdAt: new Date()
      }

      setFeatures(prev => sortFeaturesByRice([...prev, newFeature]))
    } else {
      const moscowData = {
        name: formData.name,
        moscowCategory: formData.moscowCategory
      }

      const validationErrors = validateMoscowFeature(moscowData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      const newFeature: Feature = {
        id: generateFeatureId(),
        name: moscowData.name,
        moscowCategory: moscowData.moscowCategory as 'must' | 'should' | 'could' | 'wont',
        createdAt: new Date()
      }

      setFeatures(prev => sortFeaturesByMoscow([...prev, newFeature]))
    }

    // Reset form
    setFormData({
      name: '',
      reach: '',
      impact: '',
      confidence: '',
      effort: '',
      moscowCategory: ''
    })
  }

  const handleDeleteFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id))
  }

  // New functionality handlers
  const loadSampleData = () => {
    const sampleData = framework === 'rice' ? sampleRiceFeatures : sampleMoscowFeatures
    setFeatures(sampleData)
  }

  const handleExportCSV = () => {
    const csvContent = exportToCSV(sortedFeatures, framework)
    const filename = generateFilename(framework)
    downloadCSV(csvContent, filename)
  }

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string
          const importedFeatures = parseCSVImport(csvText, framework)
          
          const newFeatures = importedFeatures.map(featureData => {
            const feature: Feature = {
              id: generateFeatureId(),
              name: featureData.name || 'Imported Feature',
              createdAt: new Date(),
              ...featureData
            }
            
            if (framework === 'rice' && feature.reach && feature.impact && feature.confidence && feature.effort) {
              feature.riceScore = calculateRiceScore(feature)
            }
            
            return feature
          })
          
          setFeatures(prev => [...prev, ...newFeatures])
        } catch (error) {
          setErrors(['Failed to import CSV file. Please check the format.'])
        }
      }
      reader.readAsText(file)
    }
  }

  const handleTemplateSelect = (templateKey: keyof typeof featureTemplates) => {
    const template = featureTemplates[templateKey]
    const newFeatures = template.features.map(featureData => {
      const feature: Feature = {
        id: generateFeatureId(),
        name: featureData.name,
        reach: featureData.reach,
        impact: featureData.impact,
        confidence: featureData.confidence,
        effort: featureData.effort,
        riceScore: calculateRiceScore({
          id: '',
          name: featureData.name,
          reach: featureData.reach,
          impact: featureData.impact,
          confidence: featureData.confidence,
          effort: featureData.effort,
          createdAt: new Date()
        }),
        createdAt: new Date()
      }
      return feature
    })
    
    setFeatures(newFeatures)
    setShowTemplates(false)
  }

  const clearAllFeatures = () => {
    if (confirm('Are you sure you want to clear all features? This action cannot be undone.')) {
      setFeatures([])
    }
  }

  // Auto-save to localStorage
  useEffect(() => {
    if (features.length > 0) {
      saveFeaturesToStorage(features)
    }
  }, [features])

  // Load from localStorage on mount
  useEffect(() => {
    const savedFeatures = loadFeaturesFromStorage()
    if (savedFeatures.length > 0) {
      setFeatures(savedFeatures)
    }
  }, [])

  // Filter and search logic
  const filteredFeatures = features.filter(feature => {
    // Search filter
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Priority filter
    let matchesPriority = true
    if (framework === 'rice' && filterPriority !== 'all') {
      const score = feature.riceScore || 0
      if (filterPriority === 'high') matchesPriority = score >= 500
      if (filterPriority === 'medium') matchesPriority = score >= 100 && score < 500
      if (filterPriority === 'low') matchesPriority = score < 100
    } else if (framework === 'moscow' && filterPriority !== 'all') {
      const category = feature.moscowCategory
      if (filterPriority === 'high') matchesPriority = category === 'must'
      if (filterPriority === 'medium') matchesPriority = category === 'should'
      if (filterPriority === 'low') matchesPriority = category === 'could' || category === 'wont'
    }
    
    return matchesSearch && matchesPriority
  })

  const sortedFeatures = framework === 'rice' 
    ? sortFeaturesByRice(filteredFeatures)
    : sortFeaturesByMoscow(filteredFeatures)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Feature Prioritizer
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Data-driven feature prioritization
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                className="btn-secondary"
                title="Load feature templates"
              >
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </button>
              <button 
                onClick={loadSampleData}
                className="btn-secondary"
                title="Load sample data for demo"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Sample Data
              </button>
              <button 
                onClick={() => document.getElementById('csv-import')?.click()}
                className="btn-secondary"
                title="Import features from CSV file"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </button>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                id="csv-import"
              />
              <button 
                onClick={handleExportCSV}
                className="btn-primary"
                disabled={features.length === 0}
                title="Export features to CSV"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Framework Toggle */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Choose Framework
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Select a prioritization methodology
                </p>
              </div>
              
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setFramework('rice')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    framework === 'rice'
                      ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Calculator className="w-4 h-4 mr-2 inline" />
                  RICE
                </button>
                <button
                  onClick={() => setFramework('moscow')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    framework === 'moscow'
                      ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2 inline" />
                  MoSCoW
                </button>
              </div>
            </div>
            
            {framework === 'rice' ? (
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                  RICE Framework
                </h3>
                <p className="text-primary-700 dark:text-primary-300 text-sm mb-3">
                  <strong>R</strong>each × <strong>I</strong>mpact × <strong>C</strong>onfidence ÷ <strong>E</strong>ffort
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <strong>Reach:</strong> Users affected per time period
                  </div>
                  <div>
                    <strong>Impact:</strong> Impact per user (0.25-3)
                  </div>
                  <div>
                    <strong>Confidence:</strong> Confidence in estimates (50-100%)
                  </div>
                  <div>
                    <strong>Effort:</strong> Person-months of work
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                <h3 className="font-semibold text-warning-900 dark:text-warning-100 mb-2">
                  MoSCoW Framework
                </h3>
                <p className="text-warning-700 dark:text-warning-300 text-sm mb-3">
                  Categorize features by priority level
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <strong>Must Have:</strong> Essential features
                  </div>
                  <div>
                    <strong>Should Have:</strong> Important but not critical
                  </div>
                  <div>
                    <strong>Could Have:</strong> Nice-to-have features
                  </div>
                  <div>
                    <strong>Won't Have:</strong> Not this time
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                How It Works
              </h2>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            {showInfo && (
              <div className="space-y-6 animate-slide-up">
                {framework === 'rice' ? (
                  <div className="space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                      <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
                        RICE Scoring Formula
                      </h3>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 font-mono text-lg text-center border border-primary-200 dark:border-primary-700">
                        <span className="text-primary-600 dark:text-primary-400">RICE = </span>
                        <span className="text-slate-900 dark:text-slate-100">(Reach × Impact × Confidence) ÷ Effort</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4">
                        <h4 className="font-semibold text-success-900 dark:text-success-100 mb-2 flex items-center">
                          <span className="bg-success-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">R</span>
                          Reach
                        </h4>
                        <p className="text-success-700 dark:text-success-300 text-sm mb-2">
                          How many users will this affect per time period?
                        </p>
                        <ul className="text-success-600 dark:text-success-400 text-xs space-y-1">
                          <li>• 1-100: Small feature</li>
                          <li>• 100-500: Medium feature</li>
                          <li>• 500-1000: Large feature</li>
                        </ul>
                      </div>
                      
                      <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                        <h4 className="font-semibold text-warning-900 dark:text-warning-100 mb-2 flex items-center">
                          <span className="bg-warning-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">I</span>
                          Impact
                        </h4>
                        <p className="text-warning-700 dark:text-warning-300 text-sm mb-2">
                          How much will this help each user?
                        </p>
                        <ul className="text-warning-600 dark:text-warning-400 text-xs space-y-1">
                          <li>• 3: Massive impact</li>
                          <li>• 2: High impact</li>
                          <li>• 1: Medium impact</li>
                          <li>• 0.5: Low impact</li>
                          <li>• 0.25: Minimal impact</li>
                        </ul>
                      </div>
                      
                      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2 flex items-center">
                          <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">C</span>
                          Confidence
                        </h4>
                        <p className="text-primary-700 dark:text-primary-300 text-sm mb-2">
                          How confident are you in your estimates?
                        </p>
                        <ul className="text-primary-600 dark:text-primary-400 text-xs space-y-1">
                          <li>• 100%: Very confident</li>
                          <li>• 80%: Confident</li>
                          <li>• 70%: Somewhat confident</li>
                          <li>• 50%: Low confidence</li>
                        </ul>
                      </div>
                      
                      <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
                        <h4 className="font-semibold text-danger-900 dark:text-danger-100 mb-2 flex items-center">
                          <span className="bg-danger-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">E</span>
                          Effort
                        </h4>
                        <p className="text-danger-700 dark:text-danger-300 text-sm mb-2">
                          How much work will this take in person-months?
                        </p>
                        <ul className="text-danger-600 dark:text-danger-400 text-xs space-y-1">
                          <li>• 1-2mo: Small effort</li>
                          <li>• 3-5mo: Medium effort</li>
                          <li>• 6-10mo: Large effort</li>
                          <li>• 10+mo: Very large effort</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Interpreting RICE Scores
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200 px-3 py-2 rounded-lg font-semibold">
                            High Priority (500+)
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Build these first
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200 px-3 py-2 rounded-lg font-semibold">
                            Medium Priority (100-500)
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Consider for next sprint
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200 px-3 py-2 rounded-lg font-semibold">
                            Low Priority (&lt;100)
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Maybe later or skip
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                      <h3 className="font-semibold text-warning-900 dark:text-warning-100 mb-3">
                        MoSCoW Prioritization
                      </h3>
                      <p className="text-warning-700 dark:text-warning-300 text-sm mb-4">
                        Categorize features by importance and urgency
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4">
                        <h4 className="font-semibold text-success-900 dark:text-success-100 mb-2 flex items-center">
                          <span className="bg-success-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">M</span>
                          Must Have
                        </h4>
                        <p className="text-success-700 dark:text-success-300 text-sm mb-2">
                          Essential features without which the product fails
                        </p>
                        <ul className="text-success-600 dark:text-success-400 text-xs space-y-1">
                          <li>• Core functionality</li>
                          <li>• Critical user flows</li>
                          <li>• Legal/compliance requirements</li>
                        </ul>
                      </div>
                      
                      <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                        <h4 className="font-semibold text-warning-900 dark:text-warning-100 mb-2 flex items-center">
                          <span className="bg-warning-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">S</span>
                          Should Have
                        </h4>
                        <p className="text-warning-700 dark:text-warning-300 text-sm mb-2">
                          Important features that add significant value
                        </p>
                        <ul className="text-warning-600 dark:text-warning-400 text-xs space-y-1">
                          <li>• User experience improvements</li>
                          <li>• Competitive advantages</li>
                          <li>• Business value drivers</li>
                        </ul>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                          <span className="bg-slate-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">C</span>
                          Could Have
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                          Nice-to-have features if time allows
                        </p>
                        <ul className="text-slate-600 dark:text-slate-400 text-xs space-y-1">
                          <li>• Nice-to-have enhancements</li>
                          <li>• Future considerations</li>
                          <li>• Low-priority improvements</li>
                        </ul>
                      </div>
                      
                      <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
                        <h4 className="font-semibold text-danger-900 dark:text-danger-100 mb-2 flex items-center">
                          <span className="bg-danger-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">W</span>
                          Won't Have
                        </h4>
                        <p className="text-danger-700 dark:text-danger-300 text-sm mb-2">
                          Features explicitly not in this iteration
                        </p>
                        <ul className="text-danger-600 dark:text-danger-400 text-xs space-y-1">
                          <li>• Out of scope for now</li>
                          <li>• Future roadmap items</li>
                          <li>• Rejected features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Feature Templates
                </h2>
                <button 
                  onClick={() => setShowTemplates(false)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(featureTemplates).map(([key, template]) => (
                  <div key={key} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {template.features.length} pre-configured features
                    </p>
                    <button 
                      onClick={() => handleTemplateSelect(key as keyof typeof featureTemplates)}
                      className="btn-primary w-full text-sm"
                    >
                      Load Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Add Features
              </h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAdding ? 'Cancel' : 'Add Feature'}
              </button>
            </div>
            
            {isAdding && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
                {errors.length > 0 && (
                  <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
                    <h4 className="font-semibold text-danger-900 dark:text-danger-100 mb-2">
                      Please fix the following errors:
                    </h4>
                    <ul className="text-danger-700 dark:text-danger-300 text-sm space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <label className="form-label">Feature Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter feature description..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                {framework === 'rice' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Reach</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Users affected"
                        min="1"
                        max="1000"
                        value={formData.reach}
                        onChange={(e) => handleInputChange('reach', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Impact</label>
                      <select 
                        className="form-input"
                        value={formData.impact}
                        onChange={(e) => handleInputChange('impact', e.target.value)}
                        required
                      >
                        <option value="">Select impact level</option>
                        <option value="3">Massive (3)</option>
                        <option value="2">High (2)</option>
                        <option value="1">Medium (1)</option>
                        <option value="0.5">Low (0.5)</option>
                        <option value="0.25">Minimal (0.25)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Confidence (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="50-100%"
                        min="50"
                        max="100"
                        value={formData.confidence}
                        onChange={(e) => handleInputChange('confidence', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Effort</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Person-months"
                        min="1"
                        max="50"
                        value={formData.effort}
                        onChange={(e) => handleInputChange('effort', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Priority Level</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => handleInputChange('moscowCategory', 'must')}
                        className={`btn-secondary ${formData.moscowCategory === 'must' ? 'bg-primary-600 text-white' : ''}`}
                      >
                        Must Have
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleInputChange('moscowCategory', 'should')}
                        className={`btn-secondary ${formData.moscowCategory === 'should' ? 'bg-primary-600 text-white' : ''}`}
                      >
                        Should Have
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleInputChange('moscowCategory', 'could')}
                        className={`btn-secondary ${formData.moscowCategory === 'could' ? 'bg-primary-600 text-white' : ''}`}
                      >
                        Could Have
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleInputChange('moscowCategory', 'wont')}
                        className={`btn-secondary ${formData.moscowCategory === 'wont' ? 'bg-primary-600 text-white' : ''}`}
                      >
                        Won't Have
                      </button>
                    </div>
                  </div>
                )}
                
                <button type="submit" className="btn-success w-full">
                  Add Feature
                </button>
              </form>
            )}
          </div>

          {/* Results Preview */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Prioritization Results
            </h2>
            
            {sortedFeatures.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Add features to see prioritization results
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Visual Priority Chart
                  </h3>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Top {Math.min(8, sortedFeatures.length)} features
                  </span>
                </div>
                <SimpleChart features={sortedFeatures} framework={framework} />
                
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Quick Summary
                  </h4>
                  <div className="space-y-2">
                    {sortedFeatures.slice(0, 3).map((feature, index) => (
                      <div key={feature.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-900 dark:text-slate-100">
                          {index + 1}. {feature.name}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {framework === 'rice' ? `RICE: ${feature.riceScore}` : feature.moscowCategory}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        {features.length > 0 && (
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="form-input text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
                  className="btn-secondary"
                  title="Show advanced analytics"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                
                {selectedFeatures.length >= 2 && (
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="btn-primary"
                    title="Compare selected features"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Compare ({selectedFeatures.length})
                  </button>
                )}
              </div>
            </div>
            
            {/* Advanced Charts */}
            {showAdvancedCharts && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                <AdvancedCharts features={features} framework={framework} />
              </div>
            )}
          </div>
        )}

        {/* Features List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Features List ({sortedFeatures.length})
              {features.length !== sortedFeatures.length && (
                <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                  (filtered from {features.length} total)
                </span>
              )}
            </h2>
            {features.length > 0 && (
              <button 
                onClick={clearAllFeatures}
                className="btn-danger text-sm"
                title="Clear all features"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
          
          {sortedFeatures.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No features added yet. Start by adding your first feature above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFeatures.map((feature, index) => (
                <div key={feature.id} className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border transition-all duration-200 ${
                  selectedFeatures.includes(feature.id) 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-slate-200 dark:border-slate-600'
                }`}>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFeatures(prev => [...prev, feature.id])
                        } else {
                          setSelectedFeatures(prev => prev.filter(id => id !== feature.id))
                        }
                      }}
                      className="w-4 h-4 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {feature.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        {framework === 'rice' && (
                          <>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Reach: {feature.reach}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Impact: {feature.impact}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Confidence: {feature.confidence}%
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Effort: {feature.effort}mo
                            </span>
                            {feature.riceScore && (
                              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                RICE: {feature.riceScore}
                              </span>
                            )}
                          </>
                        )}
                        {framework === 'moscow' && feature.moscowCategory && (
                          <span className={`badge ${
                            feature.moscowCategory === 'must' ? 'badge-success' :
                            feature.moscowCategory === 'should' ? 'badge-warning' :
                            feature.moscowCategory === 'could' ? 'badge-neutral' :
                            'badge-danger'
                          }`}>
                            {feature.moscowCategory.charAt(0).toUpperCase() + feature.moscowCategory.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="text-slate-400 hover:text-danger-500 transition-colors p-1"
                      title="Delete feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Feature Comparison Modal */}
      {showComparison && (
        <FeatureComparison
          features={features}
          selectedFeatureIds={selectedFeatures}
          framework={framework}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  )
}
