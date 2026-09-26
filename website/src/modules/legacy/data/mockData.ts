import { Project, Achievement, AlumniTeam } from "../types";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "AWS Serverless Community Portal",
    summary: "A cloud-native hub for student workshops and cloud challenges.",
    description:
      "Built with Next.js, AWS Lambda, and DynamoDB for campus-wide community operations.",
    techStack: ["Next.js", "TypeScript", "AWS Lambda", "Tailwind CSS"],
    links: [{ label: "Repository", url: "https://github.com/aws-sbq-sist" }],
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Top 6 Finalist - HackForge Hackathon",
    description:
      "Recognized for developing high-impact community engineering solutions.",
    year: "2025",
    link: "https://example.com",
  },
];

export const mockAlumniTeams: AlumniTeam[] = [
  {
    id: "alumni-1",
    academicYear: "2024-25",
    teamName: "Founding Core Team",
    members: ["President", "Tech Lead", "Cloud Architect"],
    note: "Established the official AWS Student Builder Group chapter.",
  },
];
