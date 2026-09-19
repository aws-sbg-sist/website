import type {
  EventItem,
  FeatureItem,
  FormatColors,
  ProjectItem,
} from "../types";

export const events: EventItem[] = [
  {
    date: "OCT 14, 2026",
    type: "Workshop",
    title: "Serverless Architectures with AWS Lambda",
    description:
      "Build and deploy production-ready serverless applications using Lambda, API Gateway and DynamoDB from scratch.",
    location: "Engineering Building, Room 204",
    format: "In-Person",
    tint: "rgba(255,153,0,0.13)",
  },
  {
    date: "OCT 28, 2026",
    type: "Hackathon",
    title: "CloudHack: 24-Hour Build Challenge",
    description:
      "Teams of 2–4 compete to build the most innovative cloud-native solution. Prizes and swag for top teams.",
    location: "Innovation Hub, Level 3",
    format: "In-Person",
    tint: "rgba(91,140,255,0.12)",
  },
  {
    date: "NOV 5, 2026",
    type: "Study Group",
    title: "AWS Solutions Architect Exam Prep",
    description:
      "Collaborative study session for students preparing for the SAA-C03 certification exam.",
    location: "Online via Amazon Chime",
    format: "Virtual",
    tint: "rgba(139,92,246,0.12)",
  },
  {
    date: "NOV 20, 2026",
    type: "Panel",
    title: "Cloud Careers: From Student to Engineer",
    description:
      "Cloud engineers at AWS, Atlassian and Canva share how they built their careers.",
    location: "Student Union, Hall B",
    format: "Hybrid",
    tint: "rgba(103,232,249,0.12)",
  },
];

export const projects: ProjectItem[] = [
  {
    name: "CampusRoute",
    description:
      "Real-time campus navigation powered by AWS Location Service and Amplify.",
    tags: ["Amplify", "Location API", "React Native"],
    a: "#5B8CFF",
    b: "#8B5CF6",
  },
  {
    name: "StudyLens",
    description:
      "AI-powered document summarizer and quiz generator built on Amazon Bedrock.",
    tags: ["Bedrock", "S3", "Lambda"],
    a: "#FF9900",
    b: "#FF6B6B",
  },
  {
    name: "GreenGrid",
    description:
      "Campus energy monitoring dashboard backed by IoT Core and Timestream.",
    tags: ["IoT Core", "Timestream", "CloudWatch"],
    a: "#67E8F9",
    b: "#5B8CFF",
  },
  {
    name: "PeerMesh",
    description:
      "Real-time peer study platform using AppSync and GraphQL subscriptions.",
    tags: ["AppSync", "DynamoDB", "Cognito"],
    a: "#8B5CF6",
    b: "#EC4899",
  },
];

export const features: FeatureItem[] = [
  {
    key: "learn",
    label: "LEARN",
    title: "Learn by doing",
    desc: "Hands-on workshops covering AWS services, cloud architecture and emerging technologies.",
    color: "#5B8CFF",
  },
  {
    key: "build",
    label: "BUILD",
    title: "Ship real projects",
    desc: "Turn ideas into deployed applications — from proof of concept to production-grade solutions.",
    color: "#FF9900",
  },
  {
    key: "compete",
    label: "COMPETE",
    title: "Push your limits",
    desc: "Hackathons and challenges that sharpen skills, build your portfolio and earn prizes.",
    color: "#8B5CF6",
  },
  {
    key: "connect",
    label: "CONNECT",
    title: "Grow your network",
    desc: "Meet students, mentors and industry professionals shaping the future of cloud computing.",
    color: "#67E8F9",
  },
];

export const formatColors: FormatColors = {
  "In-Person": "#22C55E",
  Virtual: "#5B8CFF",
  Hybrid: "#8B5CF6",
};