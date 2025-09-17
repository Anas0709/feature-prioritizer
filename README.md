# Feature Prioritization Simulator

> **Interactive tool for data-driven product feature prioritization** — Apply RICE and MoSCoW frameworks to rank features objectively and make better product decisions.

![Feature Prioritization Simulator](https://img.shields.io/badge/Status-MVP-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

## Overview

The Feature Prioritization Simulator is a lightweight web application designed for product managers, startup founders, and teams who need to prioritize features objectively. Input your feature ideas with key metrics, apply proven prioritization frameworks, and instantly get ranked outputs to support data-driven decision making.

### Why This Tool?

- **Fast & Simple**: No complex setup or learning curve
- **Framework-Based**: Uses established PM methodologies (RICE, MoSCoW)
- **Visual Results**: Clear rankings and charts for stakeholder communication
- **Interview Ready**: Perfect for demonstrating prioritization skills

## Features

### Core Functionality (MVP)

- **Feature Entry Form**
  - Dynamic add/remove features
  - RICE metrics: Reach, Impact, Confidence, Effort
  - MoSCoW categorization: Must/Should/Could/Won't

- **Prioritization Engine**
  - Automatic RICE score calculation: `(Reach × Impact × Confidence) ÷ Effort`
  - Real-time ranking and sorting
  - Framework comparison (RICE vs MoSCoW)

- **Results Visualization**
  - Sortable results table with scores
  - Bar chart visualization
  - Export to CSV functionality

- **Modern UI/UX**
  - Clean, PM-friendly interface
  - Responsive design (desktop-first)
  - Dark/light mode toggle

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm

### Installation

```cmd
# Clone the repository
git clone https://github.com/yourusername/feature-prioritizer.git
cd feature-prioritizer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### RICE Framework

1. **Add Features**: Click "Add Feature" and fill in:
   - **Feature Name**: Brief description
   - **Reach**: How many users will this affect? (1-1000)
   - **Impact**: How much will this help each user? (0.25-3)
   - **Confidence**: How confident are you in estimates? (50-100%)
   - **Effort**: How much work will this take? (1-50 person-months)

2. **Calculate**: Features automatically rank by RICE score
3. **Review**: Use the results table and visualization to make decisions

### MoSCoW Framework

1. **Switch Framework**: Toggle to "MoSCoW" mode
2. **Categorize**: Assign each feature to:
   - **Must Have**: Essential features
   - **Should Have**: Important but not critical
   - **Could Have**: Nice-to-have features
   - **Won't Have**: Not this time

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Chart.js for visualizations
- **Icons**: Lucide React
- **Deployment**: Vercel (optimized)

## Project Structure

```
feature-prioritizer/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── FeatureForm.tsx    # Add/edit feature form
│   ├── ResultsTable.tsx   # Prioritization results
│   ├── FrameworkToggle.tsx # RICE/MoSCoW switch
│   ├── Visualization.tsx  # Charts and graphs
│   └── ExportButton.tsx   # CSV export functionality
├── lib/                   # Utility functions
│   ├── calculations.ts    # RICE scoring logic
│   ├── export.ts         # CSV export utilities
│   └── types.ts          # TypeScript definitions
├── hooks/                 # Custom React hooks
│   ├── useFeatures.ts    # Feature state management
│   └── usePrioritization.ts # Prioritization logic
└── data/                  # Sample data
    └── sample-features.json # Demo features
```

## Design Principles

### User Experience
- **Immediate Feedback**: Real-time calculations and updates
- **Zero Learning Curve**: Intuitive interface for non-technical users
- **Mobile Responsive**: Works on all device sizes
- **Accessibility**: WCAG-compliant colors and interactions

### Performance
- **Fast Loading**: < 2 seconds initial page load
- **Smooth Interactions**: 60fps animations and transitions
- **Client-Side**: No server dependencies for core functionality
- **Lightweight**: Minimal bundle size for quick deployment

## Sample Use Cases

### Product Manager Interview
1. Add 5-10 realistic features for a mobile app
2. Demonstrate RICE calculation process
3. Show how results inform roadmap decisions
4. Compare with MoSCoW prioritization

### Startup Planning
1. Input all potential features for MVP
2. Use RICE to identify highest-impact features
3. Export results for investor presentations
4. Track how priorities change over time

### Team Workshop
1. Have team members suggest features
2. Collaboratively score each feature
3. Use visualization to build consensus
4. Create shared roadmap from results

## Future Enhancements

### Phase 2 Features
- **Additional Frameworks**: Kano Model, Value vs Effort Matrix
- **Advanced Analytics**: Historical tracking, trend analysis
- **Collaboration**: Share links, team scoring
- **Templates**: Pre-built feature sets for common product types

### Phase 3 Features
- **AI Integration**: Smart scoring suggestions
- **API Integration**: Connect with Jira, Trello, Asana
- **Advanced Export**: PowerPoint templates, PDF reports
- **Multi-User**: Real-time collaboration, user accounts

## Deployment

### Vercel (Recommended)

```cmd
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Other Platforms

The app is optimized for:
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting with custom domain
- **AWS S3**: Scalable static hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **RICE Framework**: Inspired by Sean McBride's prioritization method
- **MoSCoW**: Based on the Agile prioritization technique
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first styling approach
- **Chart.js**: For beautiful data visualizations

## Contact

**Your Name** - [@yourusername](https://github.com/yourusername) - your.email@example.com

Project Link: [https://github.com/yourusername/feature-prioritizer](https://github.com/yourusername/feature-prioritizer)

---

**Built for the product management community**

*Make data-driven decisions, not gut feelings.*
