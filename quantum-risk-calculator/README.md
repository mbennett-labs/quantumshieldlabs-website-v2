# Quantum Risk Calculator

A professional web application for assessing organizational quantum security risks. This tool helps organizations understand their vulnerability to quantum computing threats through an interactive 8-question assessment.

## Overview

The Quantum Risk Calculator is a single-page application that:
- Assesses quantum security risks through 8 targeted questions
- Calculates risk scores from 0-100 points
- Provides detailed vulnerability analysis
- Generates branded PDF reports
- Captures leads via Formspree integration
- Deploys seamlessly to quantumshieldlabs.dev/quantum-risk-calculator/

## Features

### Assessment Flow
1. **Landing Page**: Introduction and value proposition
2. **8-Question Assessment**: Progressive questionnaire with visual feedback
3. **Processing Animation**: 2-second analysis simulation
4. **Results Page**: Risk score, gauge visualization, and vulnerabilities
5. **Email Capture**: Lead generation before PDF download
6. **PDF Report**: Comprehensive 3-page branded document

### Technical Stack
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Tailwind CSS 2.2.19 (CDN)
- **Icons**: Font Awesome 6.4.0
- **Charts**: Chart.js 3.9.1
- **PDF Generation**: jsPDF 2.5.1
- **Form Backend**: Formspree

## How Scoring Works

### Point System

Each question awards points based on the selected answer:

**Question 1: Cryptographic Protocols**
- RSA: 15 pts (highest risk - quantum vulnerable)
- ECC: 12 pts
- Multiple/Unsure: 10 pts
- AES: 5 pts (lowest risk - symmetric encryption)

**Question 2: Encryption Deployment**
- Unsure: 15 pts (unknown = vulnerability)
- Data at rest: 8 pts
- In transit: 8 pts
- Both: 5 pts (best practice)

**Question 3: Data Retention**
- Yes (5+ years): 20 pts (harvest now, decrypt later risk)
- Unsure: 10 pts
- No: 5 pts

**Question 4: Regulations**
- Both (HIPAA + HITECH): 15 pts
- HIPAA: 10 pts
- HITECH: 10 pts
- Other: 8 pts
- None: 5 pts

**Question 5: Data Type**
- Both (PHI + Financial): 15 pts
- PHI: 12 pts
- Financial: 10 pts
- Other: 8 pts

**Question 6: Last Audit**
- Never: 20 pts (critical gap)
- 3+ years: 15 pts
- 1-3 years: 8 pts
- <1 year: 5 pts

**Question 7: Migration Speed**
- Unsure: 15 pts
- 1-2 years: 12 pts
- 6-12 months: 8 pts
- <6 months: 5 pts

**Question 8: Organization Size**
- 1000+: 15 pts (larger attack surface)
- 201-1000: 12 pts
- 51-200: 8 pts
- 1-50: 5 pts

### Risk Levels

Scores are categorized into four risk levels:

**LOW RISK (0-25 points)**
- Color: Green (#10b981)
- Icon: Shield with checkmark
- Message: Strong security posture, monitoring recommended
- Timeline: Review annually

**MODERATE RISK (26-50 points)**
- Color: Yellow (#f59e0b)
- Icon: Shield with exclamation
- Message: Vulnerabilities detected, planning needed
- Timeline: Action within 12 months

**HIGH RISK (51-75 points)**
- Color: Orange (#f97316)
- Icon: Warning triangle
- Message: Significant exposure to quantum threats
- Timeline: Assessment within 3-6 months

**CRITICAL RISK (76-100 points)**
- Color: Red (#ef4444)
- Icon: Shield with X
- Message: Serious quantum vulnerability
- Timeline: Immediate action required

## Vulnerability Detection Logic

The system identifies up to 3 top vulnerabilities based on user responses, prioritized as follows:

1. **Long-term Data Storage** (Q3 = Yes, 20pts)
   - "Long-term data storage vulnerable to 'harvest now, decrypt later' quantum attacks"

2. **No Security Audits** (Q6 = Never, 20pts)
   - "No cryptographic security audits create dangerous blind spots to quantum threats"

3. **RSA Encryption** (Q1 = RSA, 15pts)
   - "RSA encryption will be broken by quantum computers within 5-10 years"

4. **Unknown Deployment** (Q2 = Unsure, 15pts)
   - "Unknown encryption deployment points create exploitable vulnerabilities"

5. **Migration Uncertainty** (Q7 = Unsure, 15pts)
   - "Inability to quickly migrate to quantum-resistant algorithms extends exposure window"

6. **Enterprise Scale** (Q8 = 1000+, 15pts)
   - "Enterprise scale amplifies potential impact of quantum cryptographic breaks"

7. **Dual Regulations** (Q4 = Both, 15pts)
   - "Dual regulatory requirements (HIPAA/HITECH) face quantum compliance gaps"

8. **Combined Data Types** (Q5 = Both, 15pts)
   - "Combined PHI and financial data creates high-value quantum attack target"

Vulnerabilities are displayed in priority order (highest point value first), showing only the top 3.

## Formspree Integration

### Endpoint Configuration
- **URL**: `https://formspree.io/f/mgvrkooo`
- **Method**: POST
- **Content-Type**: application/x-www-form-urlencoded

### Data Submitted

**Visible Fields**:
- `name`: User's full name
- `email`: User's email address
- `company`: Company name
- `phone`: Phone number (optional)

**Hidden Fields**:
- `risk_score`: Calculated score (0-100)
- `risk_level`: LOW/MODERATE/HIGH/CRITICAL RISK
- `assessment_data`: JSON string of all questions and answers

### Form Flow

1. User completes 8-question assessment
2. Results page displays with risk score
3. Email capture form appears
4. User fills out contact information
5. Form submits to Formspree
6. On success: PDF generates and downloads automatically
7. Thank you message displays with consultation link

### Error Handling

- Network errors show user-friendly message
- Failed submissions display retry option
- Console logging for debugging
- Fallback contact information provided

## PDF Report Structure

### Page 1: Cover and Results
- Quantum Shield Labs header with branding
- Report title and generation date
- Company name
- Large risk score display with color coding
- Risk level badge
- Risk message and recommended timeline

### Page 2: Assessment Details
- **Your Organization's Profile**: All 8 questions and selected answers
- **Identified Vulnerabilities**: Top 3 vulnerabilities with descriptions
- Point values displayed for context

### Page 3: Next Steps and Contact
- **Understanding Quantum Threats**: Educational content
- **Why Act Now**: 4 key reasons for urgent action
- **Recommended Next Steps**: 5-step action plan
- **Contact Information**:
  - Email: michael@quantumshieldlabs.dev
  - Phone: (240) 659-8286
  - Address: 6814 Westmoreland Ave, Takoma Park, MD 20912
- Footer with copyright and tagline

## Customization Guide

### Updating Questions

Edit the `questions` array in the JavaScript section:

```javascript
const questions = [
    {
        id: 1,
        title: "Your question text here",
        options: [
            { text: "Option 1", points: 15 },
            { text: "Option 2", points: 10 }
        ]
    }
];
```

### Adjusting Risk Thresholds

Modify the score ranges in the `displayResults()` function:

```javascript
if (totalScore <= 25) {
    riskLevel = 'LOW RISK';
    // ... configure colors, messages, etc.
}
```

### Changing Brand Colors

Update the CSS variables and Tailwind classes:

```css
/* Primary Blue */
#3b82f6 → your-color

/* Secondary Purple */
#8b5cf6, #7c3aed → your-colors

/* Background Gradient */
from-blue-500 to-purple-500 → your-gradient
```

### Modifying Formspree Endpoint

Replace the Formspree URL in the form submission handler:

```javascript
const response = await fetch('https://formspree.io/f/YOUR-FORM-ID', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
});
```

## Testing Checklist

### Functionality Tests
- [ ] All 8 questions display correctly
- [ ] Progress bar updates on each question
- [ ] Back button works (hidden on Q1)
- [ ] Next button requires answer selection
- [ ] Score calculation is accurate
- [ ] Risk level displays correctly for all ranges
- [ ] Gauge chart animates and shows correct score
- [ ] Top 3 vulnerabilities display based on answers
- [ ] Email form validates required fields
- [ ] Formspree submission works
- [ ] PDF generates with all 3 pages
- [ ] PDF contains correct data

### Responsive Design Tests
- [ ] Mobile (320px-480px): Single column layout
- [ ] Tablet (481px-768px): Adjusted spacing
- [ ] Desktop (769px+): Full layout with two columns
- [ ] Navigation collapses to hamburger on mobile
- [ ] Touch targets are large enough (44px minimum)
- [ ] Text is readable at all sizes
- [ ] Gauge chart scales appropriately

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Error Handling Tests
- [ ] Form submission failure shows error message
- [ ] Network errors handled gracefully
- [ ] Missing answers prevent progression
- [ ] PDF generation errors caught

## Analytics Integration (Future)

Currently, the app logs events to the console. To add Google Analytics:

1. Add GA script to `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

2. Replace console.log calls with gtag events:
```javascript
// Before
console.log('Assessment started');

// After
gtag('event', 'assessment_started', {
    'event_category': 'calculator',
    'event_label': 'quantum_risk'
});
```

## Deployment

### Via GitHub Actions (Automatic)

1. Commit files to repository:
```bash
git add quantum-risk-calculator/
git commit -m "feat: add quantum risk calculator"
git push origin main
```

2. GitHub Actions automatically deploys to Hostinger via FTP

3. Access at: `https://quantumshieldlabs.dev/quantum-risk-calculator/`

### Manual Deployment

If deploying outside the GitHub Actions workflow:

1. Upload entire `quantum-risk-calculator/` folder to web server
2. Ensure `index.html` is accessible at the desired URL
3. No build process required (all dependencies via CDN)
4. No server-side code needed (static HTML/JS)

## File Structure

```
quantum-risk-calculator/
├── index.html          # Complete application (single file)
└── README.md          # This documentation
```

## Dependencies (CDN)

All dependencies are loaded via CDN (no npm install required):

- **Tailwind CSS**: 2.2.19
- **Font Awesome**: 6.4.0
- **Chart.js**: 3.9.1
- **jsPDF**: 2.5.1
- **Google Fonts**: Inter (300-800 weights)

## Browser Requirements

- Modern browsers with ES6 support
- JavaScript enabled
- Canvas API support (for charts)
- Fetch API support (for form submission)

Supports:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

## Security Considerations

- All form submissions go through Formspree (no direct email exposure)
- No sensitive data stored in browser (session-based only)
- HTTPS required for production (Formspree requires it)
- No authentication required (public tool)
- Input validation on form fields
- XSS protection via textContent (not innerHTML for user input)

## Support

For issues or questions:
- Email: michael@quantumshieldlabs.dev
- Phone: (240) 659-8286

## License

© 2025 Quantum Shield Labs. All rights reserved.

---

**Version**: 1.0.0
**Last Updated**: November 15, 2025
**Author**: Quantum Shield Labs Development Team
