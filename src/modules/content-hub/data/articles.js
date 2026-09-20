// Blog articles
// Plain records only. Nothing here knows how it will be displayed.
// Replace this file with an API call in lib/content-service.js when the
// admin backend exists — no other file needs to change.

export const ARTICLES = [
  {
    slug:"static-site-on-s3",
    title:"Ship a static site on S3 before your coffee goes cold",
    deck:"A complete walkthrough from an empty bucket to a live URL, with the three settings that trip up almost everyone the first time.",
    category:"foundations",
    author:"Priya Raman",
    role:"Second year, Information Technology",
    date:"2026-09-11",
    readMinutes:7,
    tags:["s3","hosting","beginner"],
    body:`Hosting a static site is the cheapest useful thing you can do with an AWS account, and it teaches you three ideas you will use forever: buckets, policies, and distributions.

## What you need first

An AWS account with the free tier still active, and a folder with an \`index.html\` in it. That is genuinely all.

> If your account is shared with the club, ask for your own IAM user before you start. Working from root credentials is a habit that gets expensive later.

## Create the bucket

Bucket names are globally unique across every AWS customer, so pick something namespaced:

\`\`\`bash
aws s3 mb s3://asbg-priya-portfolio --region ap-south-1
aws s3 sync ./dist s3://asbg-priya-portfolio --delete
\`\`\`

The \`--delete\` flag matters. Without it, files you removed locally stay live in the bucket forever, and you end up debugging a page that no longer exists in your repository.

## The three settings people miss

1. **Static website hosting is off by default.** Turn it on under Properties and set the index document. This is separate from making objects public.
2. **Block Public Access overrides your bucket policy.** You can write a perfectly correct policy and still get a 403, because the account-level block is winning. Turn off the block for this bucket specifically, not for the whole account.
3. **The website endpoint is not the REST endpoint.** \`bucket.s3.amazonaws.com\` and \`bucket.s3-website.region.amazonaws.com\` behave differently — only the second one serves your index document for a bare directory path.

## The policy

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::asbg-priya-portfolio/*"
  }]
}
\`\`\`

Read that \`Resource\` line carefully. The \`/*\` at the end means "every object inside the bucket". Without it you have granted access to the bucket itself and nothing in it, which is a distinction that costs most people about twenty minutes.

## Put CloudFront in front of it

The website endpoint is HTTP only. A CloudFront distribution gives you HTTPS, a cache, and a custom domain, and stays inside the free tier at club-project traffic levels. Set the S3 website endpoint as the origin — not the bucket — or your directory paths break again.

---

Once this works, deploying is one command. That is the point: the first deploy should be the last interesting one.`
  },
  {
    slug:"reading-an-arn",
    title:"Read an ARN the way you read a postal address",
    deck:"Six colon-separated fields explain most of the permission errors you will hit this semester. Here is what each one is doing.",
    category:"security",
    author:"Adithya Menon",
    role:"Third year, Computer Science",
    date:"2026-09-04",
    readMinutes:5,
    tags:["iam","arn","policies"],
    body:`Every resource in AWS has an Amazon Resource Name. They look like line noise until you notice they are just an address written from the outside in.

\`\`\`
arn:aws:s3:::asbg-workshop-notes/slides/iam.pdf
arn:aws:lambda:ap-south-1:123456789012:function:resize-image
\`\`\`

## The fields

- \`arn\` — always. It is a marker, not information.
- \`aws\` — the partition. Almost always \`aws\`; government and China regions differ.
- \`s3\`, \`lambda\` — the service.
- the region — empty for globally-scoped services like S3 buckets and IAM.
- the account ID — empty where the resource name is already globally unique.
- the resource — the part that actually varies.

## Why this matters for policies

A policy statement matches on the ARN string, with \`*\` as a wildcard. So this:

\`\`\`json
"Resource": "arn:aws:s3:::asbg-*"
\`\`\`

matches every bucket whose name starts with \`asbg-\`, in any region, in this account. That is a useful shape for a club: one prefix, one policy, no editing every time someone starts a project.

### The classic mistake

\`arn:aws:s3:::my-bucket\` and \`arn:aws:s3:::my-bucket/*\` are different resources. Bucket operations like \`ListBucket\` need the first. Object operations like \`GetObject\` need the second. A policy that only lists one will half-work, which is worse than failing outright because you will assume the problem is somewhere else.

## A debugging habit

When something is denied, read the error message for the ARN it actually tried to use, then diff it against the ARN in your policy, field by field. In most cases the mismatch is the region or the trailing \`/*\`, and you will find it in under a minute instead of rewriting the whole policy.`
  },
  {
    slug:"lambda-cold-starts",
    title:"Cold starts, measured on a student budget",
    deck:"We timed 900 invocations across three runtimes and two memory settings. The results argue against most of the advice you will find in a search.",
    category:"compute",
    author:"Nikhil Varma",
    role:"Final year, Computer Science",
    date:"2026-08-27",
    readMinutes:9,
    tags:["lambda","performance","benchmarks"],
    body:`Cold start anxiety is the most common reason club members avoid serverless for their projects. We wanted numbers instead of vibes, so we ran a small benchmark that cost about forty rupees.

## Setup

Three identical functions returning a JSON payload: Node.js 22, Python 3.13, and a Go binary on the custom runtime. Each deployed at 128 MB and 1024 MB. Invoked cold 50 times per configuration by redeploying between calls, plus 100 warm invocations for a baseline.

## What we saw

- Warm invocations were indistinguishable across runtimes. All under 12 ms of execution time. If your function is warm, the runtime choice does not matter for latency.
- Cold starts at 128 MB ranged from roughly 180 ms for Go to just over 900 ms for a Node function with a large dependency tree.
- Raising memory to 1024 MB cut cold start times by more than half in every case, because CPU is allocated proportionally to memory.

## The part that surprised us

The single biggest factor was not the runtime. It was the size of the deployment package. A Node function importing the entire AWS SDK started three times slower than the same function importing only the one client it used.

\`\`\`js
// slow: pulls in everything
import AWS from "aws-sdk";

// fast: one client, tree-shaken
import { S3Client } from "@aws-sdk/client-s3";
\`\`\`

## What we would actually recommend

1. Raise memory before you change anything else. It is the cheapest fix and often reduces total cost, since a function that finishes in a third of the time at double the memory is cheaper overall.
2. Import narrowly. Measure your zipped bundle and treat anything over a few megabytes as a bug.
3. Ignore cold starts entirely for anything that is not user-facing. A nightly job does not care about 700 ms.

> For a club project with a few dozen users, cold starts are a non-issue. Spend your attention on the database schema instead — that is the decision you cannot cheaply reverse.`
  },
  {
    slug:"picking-a-database",
    title:"Picking a database for a project that has six users",
    deck:"DynamoDB, RDS, or a file in S3. A decision guide written for projects that will never see production traffic.",
    category:"data",
    author:"Sneha Iyer",
    role:"Second year, Computer Science",
    date:"2026-08-19",
    readMinutes:6,
    tags:["dynamodb","rds","architecture"],
    body:`Most database advice is written for teams with a load problem. You do not have a load problem. You have a "this must not cost money while I am asleep" problem, which is different.

## Start with the access pattern

Write down every question your app needs to ask of its data, in plain English. For a club events site, that list is short:

- Show upcoming events, newest first.
- Show one event by its slug.
- List who registered for an event.

Three questions. That is the whole specification, and it is enough to choose.

## The options

### DynamoDB

Scales to zero cost when idle, which is the main argument for it. In exchange, you must design the table around those questions up front — a query it was not designed for is either impossible or a full scan.

Good when your access patterns are known and few. That describes most club projects.

### RDS or Aurora Serverless

You get SQL, which means you can answer questions you did not anticipate. You also get an instance that costs money whether or not anyone visits. A provisioned db.t4g.micro is free-tier eligible for twelve months and then is not, and several of our alumni have learned this from a bill.

Good when the data is genuinely relational and you are still exploring what you need.

### A JSON file in S3

Not a joke. If your data changes when a human edits it — the events list, the team page, workshop notes — a versioned file in a bucket is simpler, free, diff-able, and impossible to lose to a schema migration.

Good when writes come from your team and not from users.

## The honest default

Use the JSON file until users write data. Then move to DynamoDB if your questions are fixed, or Postgres if they are not. Do not start with the most sophisticated option available to you, because the complexity arrives immediately and the benefit arrives never.`
  },
  {
    slug:"terraform-for-breakers",
    title:"Terraform for people who break things",
    deck:"State files, drift, and why the console and your code end up disagreeing. Written after we destroyed a workshop environment twice.",
    category:"devops",
    author:"Fatima Sheikh",
    role:"Third year, Information Technology",
    date:"2026-08-08",
    readMinutes:8,
    tags:["terraform","iac","state"],
    body:`We rebuilt the workshop environment with Terraform this summer. It went badly twice before it went well, and both failures were about the same thing: state.

## The mental model

Terraform holds three pictures of the world and tries to reconcile them:

1. Your configuration — what you say should exist.
2. The state file — what Terraform believes it created.
3. Reality — what is actually in the account.

\`terraform plan\` is a diff between the first two, checked against the third. Almost every confusing error is one of these three drifting from the others.

## Drift, concretely

Someone changes a security group in the console. Terraform does not know. The next \`apply\` quietly reverts it, and whoever made the change assumes AWS broke. Nothing broke — the configuration won, which is the entire point.

The fix is social, not technical: once a resource is in Terraform, the console becomes read-only for that resource. Write that rule down where your team can see it.

## Put state somewhere shared

A local \`terraform.tfstate\` works for exactly one person. The moment two people run \`apply\`, you have two divergent pictures and no way to merge them.

\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "asbg-tf-state"
    key            = "workshop/terraform.tfstate"
    region         = "ap-south-1"
    use_lockfile   = true
    encrypt        = true
  }
}
\`\`\`

Locking is the important part. It makes the second concurrent \`apply\` wait instead of corrupting the first.

## Things worth knowing early

- \`terraform plan\` is free and safe. Run it constantly.
- \`terraform destroy\` on a workshop environment is a feature. On anything shared it is a resignation letter. Use separate state per environment so the blast radius is bounded.
- \`terraform import\` brings existing resources under management without recreating them. Learn it before you decide to start over.

---

Two rebuilds later, spinning up a fresh workshop account takes eleven minutes and nobody has to remember which checkbox mattered.`
  },
  {
    slug:"build-night-04-recap",
    title:"What we learned running Build Night 04",
    deck:"Forty-one people, eleven deployed projects, and one power cut. Notes for whoever organises the next one.",
    category:"club",
    author:"Core team",
    role:"AWS Student Builder Group",
    date:"2026-09-14",
    readMinutes:4,
    tags:["events","retrospective"],
    body:`Build Night 04 ran on 12 September in the CSE seminar hall. This is the write-up we wish we had before organising it.

## What worked

**Pre-created accounts.** We set up IAM users the evening before and handed out credentials on slips of paper. Account setup has eaten the first hour of every previous event. This time it ate four minutes.

**One goal, stated on a slide, for everyone.** "Your name on a public URL by 9pm." Eleven of nineteen teams got there. Previous events with open-ended goals finished with nothing deployed.

**Pairing first-years with anyone who had deployed before.** No formal mentoring, just seating.

## What did not

The power cut at 7:20pm cost us twenty minutes and two people's unsaved work. Next time: remind everyone to commit at the halfway mark, out loud.

We also underestimated the wifi. Forty-one laptops pulling npm packages simultaneously is a genuinely hostile environment. Ask people to install dependencies before arriving.

## For the next organiser

- Book the hall for an hour longer than the event.
- Print the credential slips. Do not use a shared document.
- Have a fallback exercise that works offline.
- Photograph the whiteboard before you wipe it. We did not, again.

Slides and the starter repository are linked on the announcements page.`
  }
];
