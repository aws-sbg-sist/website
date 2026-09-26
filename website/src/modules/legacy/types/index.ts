export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  links: ProjectLink[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  imageUrl?: string;
  link?: string;
}

export interface AlumniTeam {
  id: string;
  academicYear: string;
  teamName: string;
  members: string[];
  note?: string;
}
