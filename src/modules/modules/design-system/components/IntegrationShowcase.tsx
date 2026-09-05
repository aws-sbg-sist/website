'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ExternalLink,
  Github,
  Server,
  ShieldCheck,
  Sparkles,
  Cloud,
  Terminal,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  IconButton,
  Badge,
  SectionHeader,
  Divider,
  Skeleton,
} from '@/components/ui';
import { FadeIn, HoverCard } from '../motion';

type TeamModule = 'member02' | 'member06' | 'member08' | 'member10';

export const IntegrationShowcase: React.FC = () => {
  const [activeModule, setActiveModule] = useState<TeamModule>('member02');
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  const triggerSimulatedLoad = () => {
    setIsSimulatingLoad(true);
    setTimeout(() => setIsSimulatingLoad(false), 1200);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-6 rounded-[8px] bg-[#121826] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#F8FAFC]">
            Team Integration Guide (Members 02–11)
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            See how downstream team modules consume Member 01 shared UI primitives with 100% architectural isolation.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={triggerSimulatedLoad}
          disabled={isSimulatingLoad}
        >
          <Sparkles className="w-4 h-4 mr-2 text-[#FF9900]" />
          {isSimulatingLoad ? 'Simulating Skeleton State...' : 'Simulate Async Load'}
        </Button>
      </div>

      {/* Module Navigation Selector */}
      <div
        role="tablist"
        aria-label="Module integration navigation"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            id: 'member02',
            member: 'Member 02',
            title: 'Home Experience',
            icon: <Cloud className="w-4 h-4 text-[#FF9900]" />,
          },
          {
            id: 'member06',
            member: 'Member 06',
            title: 'Events & Workshops',
            icon: <Calendar className="w-4 h-4 text-[#FF9900]" />,
          },
          {
            id: 'member08',
            member: 'Member 08',
            title: 'Student Projects',
            icon: <Github className="w-4 h-4 text-[#FF9900]" />,
          },
          {
            id: 'member10',
            member: 'Member 10',
            title: 'Admin Dashboard',
            icon: <Server className="w-4 h-4 text-[#FF9900]" />,
          },
        ].map((mod) => (
          <button
            key={mod.id}
            type="button"
            role="tab"
            aria-selected={activeModule === mod.id}
            aria-controls="module-preview-panel"
            onClick={() => setActiveModule(mod.id as TeamModule)}
            className={`p-3.5 rounded-[8px] border text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9900] ${
              activeModule === mod.id
                ? 'bg-[#1A2337] border-[#FF9900] shadow-sm'
                : 'bg-[#121826] border-[#1E293B] hover:border-[#2B384E]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              {mod.icon}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B0F17] text-[#FF9900]">
                {mod.member}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#F8FAFC]">{mod.title}</p>
          </button>
        ))}
      </div>

      {/* Module Preview Stage */}
      <div
        id="module-preview-panel"
        role="tabpanel"
        aria-label="Module Specimen Preview"
        className="p-6 sm:p-8 rounded-[8px] bg-[#0E1420] border border-[#1E293B]"
      >
        {/* MEMBER 02: HOME EXPERIENCE */}
        {activeModule === 'member02' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div>
                <span className="text-xs font-mono text-[#FF9900]">MEMBER 02 SPECIMEN</span>
                <h4 className="text-lg font-bold text-[#F8FAFC]">
                  Home Landing Hero & Cloud Pillar Grid
                </h4>
              </div>
              <Badge variant="accent">Hero & Metric Primitives</Badge>
            </div>

            {isSimulatingLoad ? (
              <div className="space-y-4">
                <Skeleton shape="title" className="w-1/3" />
                <Skeleton shape="text" className="w-2/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <Skeleton shape="card" className="h-40" />
                  <Skeleton shape="card" className="h-40" />
                  <Skeleton shape="card" className="h-40" />
                </div>
              </div>
            ) : (
              <FadeIn direction="up">
                <div className="space-y-6">
                  <div className="max-w-2xl space-y-2">
                    <Badge variant="default" size="sm">Sathyabama IST Chapter</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
                      Architecting Next-Gen Cloud Engineers
                    </h2>
                    <p className="text-sm text-[#94A3B8]">
                      Empowering university student builders through official AWS certifications, real-world distributed architectures, and hackathons.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="primary" size="sm">Join Student Chapter</Button>
                      <Button variant="outline" size="sm">Explore Roadmap</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    {[
                      { title: 'Serverless Compute', metric: '42+ Labs', desc: 'Lambda, DynamoDB & EventBridge' },
                      { title: 'Certified Builders', metric: '120+ Pass', desc: 'AWS Solutions Architect & Developer' },
                      { title: 'Open Source Repos', metric: '18 Legacy', desc: 'Production campus microservices' },
                    ].map((item, idx) => (
                      <HoverCard key={idx}>
                        <Card variant="bordered" className="p-4">
                          <CardHeader title={item.title} />
                          <CardContent>
                            <span className="text-xl font-bold text-[#FF9900]">{item.metric}</span>
                            <p className="text-xs text-[#94A3B8] mt-1">{item.desc}</p>
                          </CardContent>
                        </Card>
                      </HoverCard>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        )}

        {/* MEMBER 06: EVENTS & WORKSHOPS */}
        {activeModule === 'member06' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div>
                <span className="text-xs font-mono text-[#FF9900]">MEMBER 06 SPECIMEN</span>
                <h4 className="text-lg font-bold text-[#F8FAFC]">
                  Events & Technical Workshops Catalog
                </h4>
              </div>
              <Badge variant="success">Active Registration Flow</Badge>
            </div>

            {isSimulatingLoad ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton shape="card" className="h-48" />
                <Skeleton shape="card" className="h-48" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="interactive">
                  <CardHeader
                    action={<Badge variant="accent" size="sm">Upcoming</Badge>}
                  >
                    <div className="flex items-center gap-2 text-xs text-[#FF9900] font-mono mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      OCTOBER 24, 2026 • HYBRID
                    </div>
                    <h4 className="text-base font-semibold text-[#F8FAFC]">
                      AWS DeepRacer Autonomous AI League
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Reinforcement learning workshop training 1/18th scale autonomous racing vehicles using SageMaker and RoboMaker simulations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Badge variant="default" size="sm">64 Seats Left</Badge>
                    <Button variant="primary" size="sm">Register Seat</Button>
                  </CardFooter>
                </Card>

                <Card variant="bordered">
                  <CardHeader
                    action={<Badge variant="default" size="sm">Archived Lab</Badge>}
                  >
                    <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      SEPTEMBER 12, 2026
                    </div>
                    <h4 className="text-base font-semibold text-[#F8FAFC]">
                      Kubernetes with Amazon EKS
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      Deep dive into containerized microservices, ingress controllers, node group scaling, and IAM service accounts.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-[#64748B]">Recording Available</span>
                    <Button variant="outline" size="sm">View Slide Deck</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* MEMBER 08: STUDENT PROJECTS */}
        {activeModule === 'member08' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div>
                <span className="text-xs font-mono text-[#FF9900]">MEMBER 08 SPECIMEN</span>
                <h4 className="text-lg font-bold text-[#F8FAFC]">
                  Student Builds & Production Showcase
                </h4>
              </div>
              <Badge variant="info">Open Source Showcase</Badge>
            </div>

            {isSimulatingLoad ? (
              <Skeleton shape="card" className="h-52" />
            ) : (
              <Card variant="elevated">
                <CardHeader
                  action={
                    <div className="flex items-center gap-2">
                      <IconButton variant="ghost" size="sm" aria-label="GitHub Repository">
                        <Github className="w-4 h-4 text-[#94A3B8]" />
                      </IconButton>
                      <IconButton variant="ghost" size="sm" aria-label="Live Demo Link">
                        <ExternalLink className="w-4 h-4 text-[#94A3B8]" />
                      </IconButton>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="accent" size="sm">V2 Released</Badge>
                    <span className="text-xs font-mono text-[#64748B]">SIST-ENG-2026</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#F8FAFC]">
                    Campus Cloud Event Streamer
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Real-time automated bus tracking and cafeteria telemetry ingestion pipeline powered by AWS IoT Core, Kinesis Data Streams, and Serverless Aurora PostgreSQL.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default" size="sm">TypeScript</Badge>
                    <Badge variant="default" size="sm">AWS CDK</Badge>
                    <Badge variant="default" size="sm">IoT Core</Badge>
                    <Badge variant="default" size="sm">PostgreSQL</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-[#10B981] flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 99.98% Cloud Uptime
                  </span>
                  <Button variant="secondary" size="sm">Read Architecture Whitepaper</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        {/* MEMBER 10: ADMIN DASHBOARD */}
        {activeModule === 'member10' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div>
                <span className="text-xs font-mono text-[#FF9900]">MEMBER 10 SPECIMEN</span>
                <h4 className="text-lg font-bold text-[#F8FAFC]">
                  Chapter Admin & Infrastructure Telemetry
                </h4>
              </div>
              <Badge variant="warning">Production Watchdog</Badge>
            </div>

            {isSimulatingLoad ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton shape="card" className="h-32" />
                <Skeleton shape="card" className="h-32" />
                <Skeleton shape="card" className="h-32" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card variant="bordered" className="p-4">
                    <span className="text-xs text-[#94A3B8]">Active Members</span>
                    <p className="text-2xl font-bold text-[#F8FAFC] mt-1">428</p>
                    <Badge variant="success" size="sm" className="mt-2">+14% this month</Badge>
                  </Card>
                  <Card variant="bordered" className="p-4">
                    <span className="text-xs text-[#94A3B8]">AWS Credits Pool</span>
                    <p className="text-2xl font-bold text-[#FF9900] mt-1">$4,850</p>
                    <span className="text-[11px] text-[#64748B] block mt-2">Allocated via Educate</span>
                  </Card>
                  <Card variant="bordered" className="p-4">
                    <span className="text-xs text-[#94A3B8]">Production Ingress</span>
                    <p className="text-2xl font-bold text-[#10B981] mt-1">Healthy</p>
                    <span className="text-[11px] text-[#64748B] block mt-2">Latency: 28ms</span>
                  </Card>
                </div>

                <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-[#FF9900]" />
                    <span className="font-mono text-[#F8FAFC]">CloudTrail audit log stream synced</span>
                  </div>
                  <Button variant="ghost" size="sm">Export Report</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Code Export / Integration snippet */}
      <div className="p-4 rounded-[8px] bg-[#080C14] border border-[#1E293B] text-xs font-mono">
        <span className="text-[#64748B] block mb-1">// Example import for Member {activeModule === 'member02' ? '02' : activeModule === 'member06' ? '06' : activeModule === 'member08' ? '08' : '10'}:</span>
        <span className="text-[#FF9900]">import</span> {'{ Card, CardHeader, CardContent, CardFooter, Button, Badge }'} <span className="text-[#FF9900]">from</span> <span className="text-[#10B981]">'@/components/ui'</span>;
      </div>
    </div>
  );
};
