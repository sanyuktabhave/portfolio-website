import React from 'react';
import { createRoot } from 'react-dom/client';
import CaseStudy from './case-study';
import './styles.css';
import { setupLightbox } from '../lightbox';

document.title = 'First 50 deliveries — Sanyukta Bhave';
document.querySelector('meta[name="description"]')?.setAttribute('content', 'Designing the first-week incentive journey for new delivery partners. A product design case study by Sanyukta Bhave.');

function App() {
  // Runs after React has committed, so the exported markup is in the DOM.
  // The page is a generated export whose <img> elements are mostly decorative
  // vector layers; only those with real alt text are screens worth enlarging.
  React.useEffect(() => {
    const images = [...document.querySelectorAll<HTMLImageElement>('#app img')]
      .filter(img => img.alt.trim() && !img.src.endsWith('.svg'));
    return setupLightbox({ images, label: 'Enlarge screen' });
  }, []);
  return <CaseStudy />;
}

createRoot(document.getElementById('app')!).render(<App />);
