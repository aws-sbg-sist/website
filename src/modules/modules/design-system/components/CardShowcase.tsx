'use client';

import React, { useState } from 'react';
import { Layers, ArrowUpRight, ShieldCheck, Terminal, Calendar } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from '@/components/ui';

export const CardShowcase: React.FC = () => {
  const [interactiveActive, setInteractiveActive] = useState(false);

  const toggleInteractive = () => {
    setInteractiveActive((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* 4 Architectural Card Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Card */}
        <Card variant="default">
          <CardHeader
            action={<Badge variant="accent" size="sm">Default</Badge>}
          >
            <div className="flex items-center gap-2 text-sm text-[#FF9900] font-mono">
              <Terminal className="w-4 h-4" />
              <span>AWS_CORE_PRIMITIVE</span>
            </div>
            <h4 className="text-lg font-semibold text-[#F8FAFC]">
              Standard Static Surface
            </h4>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Standard card component for general content packaging without forced hover animations or extraneous styling.
            </p>
          </CardContent>
          <CardFooter>
            <span>Updated 2 hrs ago</span>
            <span className="font-mono text-xs text-[#64748B]">v1.0.0</span>
          </CardFooter>
        </Card>

        {/* Interactive Card */}
        <Card
          variant="interactive"
          tabIndex={0}
          role="button"
          aria-label="Explore AWS Serverless Architectures"
          aria-pressed={interactiveActive}
          onClick={toggleInteractive}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleInteractive();
            }
          }}
        >
          <CardHeader
            action={<ArrowUpRight className="w-4 h-4 text-[#FF9900]" />}
          >
            <div className="flex items-center gap-2 text-sm text-[#38BDF8] font-mono">
              <Layers className="w-4 h-4" />
              <span>INTERACTIVE_CARD</span>
            </div>
            <h4 className="text-lg font-semibold text-[#F8FAFC]">
              Interactive Surface with Focus Ring
            </h4>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Includes subtle hover transitions and keyboard focus accessibility. Essential for clickable listings, links, or drill-downs.
            </p>
          </CardContent>
          <CardFooter>
            <Badge variant={interactiveActive ? 'accent' : 'success'} size="sm">
              {interactiveActive ? 'Selected' : 'Active Module'}
            </Badge>
            <span className="text-xs text-[#FF9900] font-medium">
              {interactiveActive ? 'Keyboard Activated' : 'Click or press Enter'}
            </span>
          </CardFooter>
        </Card>

        {/* Elevated Card */}
        <Card variant="elevated">
          <CardHeader
            action={<Badge variant="warning" size="sm">Elevated</Badge>}
          >
            <div className="flex items-center gap-2 text-sm text-[#F59E0B] font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>ELEVATED_SURFACE</span>
            </div>
            <h4 className="text-lg font-semibold text-[#F8FAFC]">
              Elevated Depth Layer
            </h4>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Designed for floating widgets, modals, sticky banners, and high-prominence summary containers.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Review Specs
            </Button>
            <span className="text-xs text-[#94A3B8]">Z-Index Tier 2</span>
          </CardFooter>
        </Card>

        {/* Bordered Minimal Card */}
        <Card variant="bordered">
          <CardHeader
            action={<Badge variant="default" size="sm">Bordered</Badge>}
          >
            <div className="flex items-center gap-2 text-sm text-[#94A3B8] font-mono">
              <Calendar className="w-4 h-4" />
              <span>BORDERED_CANVAS</span>
            </div>
            <h4 className="text-lg font-semibold text-[#F8FAFC]">
              Bordered Minimal Outline
            </h4>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Transparent body with crisp outline borders. Ideal for embedded lists, secondary sections, and light telemetry tiles.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-[#64748B]">Zero background fill</span>
            <Badge variant="info" size="sm">Telemetry</Badge>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
