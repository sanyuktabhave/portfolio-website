import React from 'react';
import { createRoot } from 'react-dom/client';
import CaseStudy from './case-study';
import './styles.css';

document.title = 'First 50 deliveries — Sanyukta Bhave';
document.querySelector('meta[name="description"]')?.setAttribute('content', 'Designing the first-week incentive journey for new delivery partners. A product design case study by Sanyukta Bhave.');
createRoot(document.getElementById('app')!).render(<CaseStudy />);
