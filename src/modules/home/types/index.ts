export interface EventItem {
  date: string;
  type: string;
  title: string;
  description: string;
  location: string;
  format: "In-Person" | "Virtual" | "Hybrid";
  tint: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
  a: string;
  b: string;
}

export interface FeatureItem {
  key: string;
  label: string;
  title: string;
  desc: string;
  color: string;
}

export type EventFormat = "In-Person" | "Virtual" | "Hybrid";

export type FormatColors = Record<EventFormat, string>;
