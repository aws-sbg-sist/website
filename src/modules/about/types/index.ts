export type MilestoneType = "founded" | "achievement" | "milestone";

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  preview: string;
  description: string;
  milestone: MilestoneType;
}

export interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Principle {
  title: string;
  description: string;
  icon: string;
}

export interface ChapterMetric {
  value: string;
  label: string;
  icon: string;
}

export interface FooterContent {
  email: string;
  instagram: string;
  linkedin: string;
  meetup: string;
  builderCenter: string;
  mentors: string[];
  campus: string;
  disclaimer: string;
}

export interface AboutPageContent {
  mission: string;
  vision: string;
  description: string;
  values: string[];
  timeline: TimelineEntry[];
  experiences: ExperienceCard[];
  faqItems: FAQItem[];
  principles: Principle[];
  metrics: ChapterMetric[];
  footer: FooterContent;
}
