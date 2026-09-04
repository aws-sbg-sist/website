export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface ExperienceCard {
  title: string;
  description: string;
  icon?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AboutPageContent {
  mission: string;
  vision: string;
  description: string;
  values: string[];
  timeline: TimelineEntry[];
  experiences: ExperienceCard[];
  faq: FAQItem[];
}