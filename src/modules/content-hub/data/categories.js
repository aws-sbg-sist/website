// Content categories
// Plain records only. Nothing here knows how it will be displayed.
// Replace this file with an API call in lib/content-service.js when the
// admin backend exists — no other file needs to change.

export const CATEGORIES = [
  { id:"foundations", name:"Cloud foundations",   blurb:"Accounts, regions, billing, and the vocabulary everything else assumes you already have." },
  { id:"compute",     name:"Compute & serverless", blurb:"EC2, containers, and Lambda — what to run your code on and what it costs to keep it running." },
  { id:"data",        name:"Data & databases",     blurb:"Storing things that must survive a redeploy: S3, DynamoDB, RDS, and how to pick between them." },
  { id:"security",    name:"Security & identity",  blurb:"IAM, least privilege, and the habits that stop a student project from becoming an incident." },
  { id:"devops",      name:"DevOps & automation",  blurb:"Infrastructure as code, pipelines, and making a deploy something you do without holding your breath." }
];

export const EXTRA_CATEGORIES = [
  { id:"club", name:"Club notes", blurb:"Recaps, retrospectives, and how we run things." }
];
