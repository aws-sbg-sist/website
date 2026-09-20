// AWS learning resources
// Plain records only. Nothing here knows how it will be displayed.
// Replace this file with an API call in lib/content-service.js when the
// admin backend exists — no other file needs to change.

export const RESOURCES = [
  { category:"foundations", provider:"AWS Skill Builder", title:"AWS Cloud Practitioner Essentials", url:"https://explore.skillbuilder.aws/", description:"The free foundational course. Six hours, no prerequisites, and the vocabulary every other resource assumes you have." },
  { category:"foundations", provider:"AWS", title:"AWS Educate", url:"https://aws.amazon.com/education/awseducate/", description:"Labs and learning paths that run in a sandbox account, so you can practise without attaching a credit card." },
  { category:"foundations", provider:"AWS", title:"Free Tier details and limits", url:"https://aws.amazon.com/free/", description:"Read this before your first project. Knowing which services are always-free versus twelve-months-free prevents the most common surprise bill." },
  { category:"foundations", provider:"AWS", title:"Well-Architected Framework", url:"https://aws.amazon.com/architecture/well-architected/", description:"Six pillars for judging a design. Skim it early, return to it when someone asks why you built something a particular way." },

  { category:"compute", provider:"AWS", title:"Lambda developer guide", url:"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html", description:"The reference, not a tutorial. The sections on execution environments and concurrency are the ones worth reading end to end." },
  { category:"compute", provider:"Serverless Land", title:"Patterns library", url:"https://serverlessland.com/patterns", description:"Copyable infrastructure snippets for common service-to-service wiring. Faster than assembling the same thing from documentation." },
  { category:"compute", provider:"AWS", title:"Hands-on workshops", url:"https://workshops.aws/", description:"Guided multi-hour builds maintained by AWS teams. Filter by level; the 200-level ones suit a club session well." },

  { category:"data", provider:"AWS", title:"DynamoDB developer guide", url:"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html", description:"Start at the core components and single-table design sections. Modelling is the part that actually needs learning." },
  { category:"data", provider:"AWS", title:"S3 user guide", url:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html", description:"Storage classes, lifecycle rules, and versioning — the three features that turn a bucket into something you can rely on." },
  { category:"data", provider:"AWS Blog", title:"AWS Database Blog", url:"https://aws.amazon.com/blogs/database/", description:"Practical migration and modelling write-ups. Useful once you have a schema and a specific problem with it." },

  { category:"security", provider:"AWS", title:"IAM user guide", url:"https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html", description:"The identity model explained properly: users, roles, policies, and the trust relationships that connect them." },
  { category:"security", provider:"AWS", title:"IAM policy simulator", url:"https://policysim.aws.amazon.com/", description:"Test whether a policy allows an action before you deploy it. Much faster than deploying and reading the denial." },
  { category:"security", provider:"AWS Blog", title:"AWS Security Blog", url:"https://aws.amazon.com/blogs/security/", description:"Current guidance on credentials, detection, and incident response, written by the teams that build the services." },

  { category:"devops", provider:"HashiCorp", title:"Terraform AWS provider documentation", url:"https://registry.terraform.io/providers/hashicorp/aws/latest/docs", description:"The authoritative argument reference for every resource type. Keep it open while you write configuration." },
  { category:"devops", provider:"AWS", title:"CDK workshop", url:"https://cdkworkshop.com/", description:"Infrastructure as code in a language you already know. A good second step if Terraform's syntax is the blocker." },
  { category:"devops", provider:"GitHub", title:"GitHub Actions documentation", url:"https://docs.github.com/en/actions", description:"Where most club projects put their deploy pipeline. The OIDC section shows how to deploy to AWS without storing long-lived keys." }
];
