import type { AboutPageContent } from "../types";

/**
 * OFFICIAL REAL CLUB DATA - AWS Student Builder Group SIST
 * Updated with official mission, vision, milestones, and FAQs
 * Source: Club founding documents & official records
 */

export const mockAboutData: AboutPageContent = {
  // OFFICIAL MISSION
  mission:
    "To create and empower an accessible, high-agency global community of student builders at Sathyabama to learn, build, and connect with cloud computing, serverless architectures, agentic AI, and DevOps—bridging grassroots campus talent directly into the global Amazon Web Services ecosystem.",

  // OFFICIAL VISION
  vision:
    "To establish the benchmark university cloud community in India and globally—a premier student innovation powerhouse where any student, regardless of background or year of study, can progress from zero cloud experience to certified production engineering, shipping open-source cloud architectures, competing in national hackathons, and earning globally recognized industry credentials.",

  // OFFICIAL DESCRIPTION
  description:
    "The AWS Student Builder Group (AWS SBGL) — SIST Chapter is an officially affiliated, autonomous student developer organization at Sathyabama Institute of Science and Technology (School of Computing, Department of CSE), supported by the global AWS Student Builder Groups program (Seattle, WA). Spanning 600+ campuses worldwide, the group provides an enterprise-grade sandbox for students to master Amazon Web Services, build production software, and earn cloud certifications—operating on a 100% free, non-commercial model.",

  // OFFICIAL COMMUNITY VALUES
  values: [
    "Radical Accessibility (100% Free Access)",
    "Proof of Work Over Pure Theory",
    "High Agency & Relentless Execution",
    "Pristine Brand & Typographic Discipline",
    "Open Source & Permanent Knowledge Archiving"
  ],

  // REAL MILESTONES FROM FOUNDING TO KAIROS 2027
  timeline: [
    {
      id: "founding-2026-05-31",
      date: "May 31, 2026",
      title: "Chapter Founded",
      preview: "Founding charter signed and Executive Core Board assembled.",
      description:
        "Founding charter signed and Executive Core Board assembled under President Thenappan T (MasterZ).",
      milestone: "founded"
    },
    {
      id: "global-affiliation-2026-06-03",
      date: "June 3, 2026",
      title: "Official Global AWS Affiliation",
      preview: "SIST enrolled into the worldwide 600+ campus network.",
      description:
        "Received official global affiliation letter from Amazon Web Services (Seattle, WA), officially enrolling SIST into the worldwide 600+ campus network.",
      milestone: "achievement"
    },
    {
      id: "launchpad-2026-07-14",
      date: "July 14, 2026",
      title: "AWS Launchpad 2026 Inaugural",
      preview: "350+ student builders gathered for keynotes and live demos.",
      description:
        "350+ student builders gathered in the Central Auditorium. Keynotes from Samuel Asirvatham Rajarathinam and Pooja Srikanth featuring live Agentic AI demonstrations using AWS Strands SDK and Model Context Protocol (MCP).",
      milestone: "achievement"
    },
    {
      id: "ccp-bootcamp-2026-08",
      date: "August 2026",
      title: "AWS CCP Certification Bootcamp",
      preview: "A six-day intensive series covering the complete CCP curriculum.",
      description:
        "6-day intensive technical series covering the complete AWS Certified Cloud Practitioner curriculum, with 100% free certification voucher allocations for all participants.",
      milestone: "milestone"
    },
    {
      id: "progression-series-2026-autumn",
      date: "Autumn 2026",
      title: "Flagship 6-Event Progression Series",
      preview: "A seasonal roadmap from Cloud Zero to Autonomous Operations.",
      description:
        "Launch of the seasonal progression roadmap: Cloud Zero, Cloud Forge, Startup Synapse, Exam Engine, Zeus Core, and Autonomous Operations.",
      milestone: "milestone"
    },
    {
      id: "kairos-2027-01-22",
      date: "January 22–24, 2027",
      title: "KAIROS 2027: Grand Edition Hackathon",
      preview: "A 48-hour national flagship with 2,000+ applicant teams.",
      description:
        "48-Hour National Flagship Hackathon (Jan 22–24, 2027) with 2,000+ applicant teams, 100 on-campus finalists, ₹1,75,000 pure cash prize pool, $50,000+ AWS Cloud Credits across 5 enterprise tracks.",
      milestone: "achievement"
    }
  ],

  // THE 3 OFFICIAL CORE PILLARS + COMMUNITY IMPACT
  experiences: [
    {
      id: "learn",
      title: "Learn: Zero-Friction Cloud Literacy",
      description:
        "From Cloud Practitioner basics to advanced solutions architecture. 100% free workshops, bootcamps, and AWS Builder IDs—no credit card required. Join 1,200+ active student builders mastering cloud engineering.",
      icon: "📚"
    },
    {
      id: "build",
      title: "Build: Production Engineering Lab",
      description:
        "Ship serverless pipelines, microservices, and AI workflows in the Elite Production Lab. Prove your work with open-source cloud architectures and earn ₹1,75,000+ in hackathon prizes and $50,000+ AWS Cloud Credits.",
      icon: "🚀"
    },
    {
      id: "connect",
      title: "Connect: Direct AWS & Industry Access",
      description:
        "Get direct mentorship from AWS Principal Advocates, access corporate hiring pipelines, and network with 600+ global university builder groups. Earn AWS Certifications and industry-recognized credentials.",
      icon: "🌐"
    }
  ],

  // OFFICIAL FAQs FROM CLUB DOCUMENTATION
  faqItems: [
    {
      id: "faq-1-what-is-sbgl",
      question: "What is an AWS Student Builder Group?",
      answer:
        "An AWS Student Builder Group (AWS SBGL) is an official student developer community supported by Amazon Web Services. We bring together students passionate about cloud computing, generative AI, serverless engineering, and software architecture through workshops, bootcamps, project sprints, and national hackathons.",
      category: "general"
    },
    {
      id: "faq-2-free-membership",
      question: "Is it truly 100% free to join and attend events? Do I need a credit card?",
      answer:
        "Yes, 100% free! Under official AWS guidelines, our chapter never charges any registration fees, ticket charges, or membership dues. You do not need a personal credit card or billing profile—all hands-on workshops utilize free AWS Builder IDs and sandboxed labs.",
      category: "membership"
    },
    {
      id: "faq-3-builder-id",
      question: "What is an AWS Builder ID and why should I create one?",
      answer:
        "The universal AWS Builder ID is your personal, credit-card-free developer passport across Amazon. It unlocks free access to AWS Skill Builder, 400+ digital courses, Cloud Quest tournaments, and digital learning badges that prove your cloud skills on LinkedIn. You can create one for free at s12d.com/students.",
      category: "general"
    },
    {
      id: "faq-4-eligibility",
      question: "Who is eligible to join the SIST Chapter?",
      answer:
        "Any currently enrolled undergraduate or postgraduate student at Sathyabama Institute of Science and Technology, regardless of branch, year of study, or prior cloud experience. We welcome total beginners as well as seasoned developers.",
      category: "membership"
    },
    {
      id: "faq-5-register-events",
      question: "How do I register for chapter events?",
      answer:
        "We use a dual-registration model: First, join our official chapter on Meetup.com (meetup.com/aws-student-builder-group-sist) and RSVP to the event. Second, submit your registration form on our website with your Meetup profile and AWS Builder ID.",
      category: "events"
    },
    {
      id: "faq-6-aws-certified",
      question: "Can I get AWS certified through the chapter?",
      answer:
        "Yes! High-performing students who actively complete our certification bootcamps, attend workshops, and publish technical articles on the AWS Builder Center can earn 100% free examination vouchers for exams like the AWS Certified Cloud Practitioner (CCP) and Solutions Architect Associate (SAA).",
      category: "general"
    },
    {
      id: "faq-7-kairos",
      question: "What is Kairos 2027?",
      answer:
        "Kairos 2027 is our flagship 48-hour national hackathon held on campus from January 22–24, 2027. It features a ₹1,75,000 pure cash prize pool, $50,000+ in AWS Cloud Credits, 5 enterprise innovation tracks, and mentors from top cloud companies. Registration is 100% free.",
      category: "events"
    },
    {
      id: "faq-8-sponsors",
      question: "How can sponsors or corporate partners collaborate with the chapter?",
      answer:
        "We offer multi-tier sponsorship packages (Platinum, Gold, Silver, Track Sponsors) that give companies direct access to Chennai's premier student cloud engineering talent, stage branding, and project recruitment. Contact us at sistawscc@gmail.com or download our sponsorship prospectus on the website.",
      category: "general"
    }
  ],
  principles: [
  {
    title: "Radical Accessibility",
    description: "No paywalls, no ticket fees, no credit card requirements. High-quality cloud education belongs to everyone.",
    icon: "◌"
  },
  {
    title: "Proof of Work Over Pure Theory",
    description: "Every workshop deconstructs real architectures, terminal code, or active AWS consoles. Students leave with running code, not just slides.",
    icon: "⌘"
  },
  {
    title: "High Agency & Relentless Execution",
    description: "Student leaders take end-to-end ownership, moving fast, innovating, and solving bottlenecks with high velocity.",
    icon: "↗"
  },
  {
    title: "Pristine Brand & Typographic Discipline",
    description: "Strict adherence to Amazon Ember typography, official logo clear-space rules, and professional institutional etiquette.",
    icon: "▦"
  },
  {
    title: "Open Source & Permanent Knowledge Archiving",
    description: "Every project, event report, and architecture is documented, photographed, and archived as open knowledge for future cohorts.",
    icon: "∞"
  }
  ],
  metrics: [
  { value: "1,200+", label: "Active Student Builders", icon: "◉" },
  { value: "850+", label: "Universal AWS Builder IDs onboarded", icon: "⌁" },
  { value: "50+", label: "Certified Cloud Practitioners (CCP)", icon: "✦" },
  { value: "₹1,75,000+", label: "Pure Cash Hackathon Prize Pool", icon: "◇" },
  { value: "$50,000+", label: "AWS Cloud Credits", icon: "▰" },
  { value: "4.85 / 5.0", label: "Average CSAT Rating", icon: "☆" }
  ],
  footer: {
  email: "sistawscc@gmail.com",
  instagram: "@awssbg_sist",
  linkedin: "aws-sbg-sist",
  meetup: "AWS Student Builder Group SIST",
  builderCenter: "s12d.com/students",
  mentors: ["Dr. Balapriya .S", "Dr. K. Ashok Kumar"],
  campus: "School of Computing, Department of Computer Science and Engineering, Sathyabama Institute of Science and Technology, Chennai 600119, Tamil Nadu, India.",
  disclaimer: "AWS Student Builder Group Sathyabama is an independent student organization supported by the AWS Student Builder Groups program. Amazon Web Services, AWS, and the AWS logo are trademarks of Amazon.com, Inc. or its affiliates."
  }
};

/**
 * VERIFIED CHAPTER ACHIEVEMENTS & METRICS
 * (Optional: use in additional sections if needed)
 */
export const chapterMetrics = {
  activeBuilders: "1,200+",
  certifiedCCP: "50+",
  builderIDsOnboarded: "850+",
  hackathonPrizePool: "₹1,75,000+",
  awsCloudCredits: "$50,000+",
  csatRating: "4.85 / 5.0",
  admissionFee: "₹0 (100% Free)"
};
