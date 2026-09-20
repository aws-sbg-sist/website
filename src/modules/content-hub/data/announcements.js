// Announcements
// Plain records only. Nothing here knows how it will be displayed.
// Replace this file with an API call in lib/content-service.js when the
// admin backend exists — no other file needs to change.

export const ANNOUNCEMENTS = [
  {
    id:"a-05",
    title:"Build Night 05 — deploy a serverless API in one evening",
    date:"2026-09-26",
    pinned:true,
    tag:"Event",
    body:`Friday 26 September, 5:30pm, CSE seminar hall. Bring a laptop with Node 22 and the AWS CLI already installed — the wifi will not thank you otherwise.

We will go from an empty function to a live HTTPS endpoint with a DynamoDB table behind it. First-years welcome; no prior AWS experience assumed. Registration closes on the 24th or when we hit 45 seats.`
  },
  {
    id:"a-04",
    title:"Core team applications are open until 30 September",
    date:"2026-09-15",
    pinned:false,
    tag:"Recruiting",
    body:`Six roles across workshops, content, and outreach. We are specifically looking for someone to own this Content Hub — writing the weekly notes and keeping the resource list from rotting.

You do not need to be an expert. You need to be reliable for two hours a week.`
  },
  {
    id:"a-03",
    title:"Slides and recording from the IAM basics workshop",
    date:"2026-09-09",
    pinned:false,
    tag:"Resource",
    body:`The 5 September session covered users, roles, policies, and the trust relationships between them. Slides, the policy exercises, and the recording are all in the shared drive linked from the club Discord.

The exercise answers are deliberately not included. Ask in \`#help\` if you are stuck on the third one — nearly everyone is.`
  },
  {
    id:"a-02",
    title:"We are now a recognised AWS Cloud Club chapter",
    date:"2026-08-30",
    pinned:false,
    tag:"Notice",
    body:`Formal recognition came through this week. In practice this means credits for workshop accounts, access to official curriculum material, and a direct line to a Cloud Club captain for event support.

It also means we can issue attendance certificates for workshops, which several of you have asked about.`
  },
  {
    id:"a-01",
    title:"The weekly study room moves to Thursdays",
    date:"2026-08-21",
    pinned:false,
    tag:"Notice",
    body:`Lab availability changed for the new semester, so the open study session is now Thursdays, 4–6pm, in Lab 204. Same format: bring whatever you are stuck on.`
  }
];
