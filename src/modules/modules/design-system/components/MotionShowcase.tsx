'use client';

import React, { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Sparkles, MoveRight, Eye, ShieldCheck, RefreshCw } from 'lucide-react';
import { FadeIn, Reveal, HoverCard } from '@/modules/design-system/motion';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from '@/components/ui';

export const MotionShowcase: React.FC = () => {
  const [replayKey, setReplayKey] = useState(0);
  const systemReducedMotion = useReducedMotion();

  return (
    <div className="space-y-10">
      {/* Motion Principles & Accessibility Status */}
      <div className="p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F8FAFC]">System Motion Accessibility:</span>
            <Badge variant={systemReducedMotion ? 'warning' : 'success'} size="sm">
              {systemReducedMotion ? 'Prefers Reduced Motion: ACTIVE' : 'Standard Motion: ACTIVE'}
            </Badge>
          </div>
          <p className="text-xs text-[#94A3B8]">
            All 3 motion primitives automatically disable transforms and scale down animation durations when the user has reduced motion enabled in their OS.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => setReplayKey((k) => k + 1)}
        >
          Replay Entrance Motions
        </Button>
      </div>

      {/* 1. FadeIn Primitives */}
      <div key={`fadein-${replayKey}`} className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
          1. FadeIn Primitives (Page / Element Entrance)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeIn direction="up" delay={0.1}>
            <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] text-center space-y-1">
              <span className="text-xs font-mono text-[#FF9900]">FadeIn direction="up"</span>
              <p className="text-sm font-medium text-[#F8FAFC]">Subtle 12px upward slide</p>
            </div>
          </FadeIn>

          <FadeIn direction="down" delay={0.2}>
            <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] text-center space-y-1">
              <span className="text-xs font-mono text-[#38BDF8]">FadeIn direction="down"</span>
              <p className="text-sm font-medium text-[#F8FAFC]">Subtle downward settle</p>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.3}>
            <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] text-center space-y-1">
              <span className="text-xs font-mono text-[#10B981]">FadeIn direction="left"</span>
              <p className="text-sm font-medium text-[#F8FAFC]">Horizontal slide-in</p>
            </div>
          </FadeIn>

          <FadeIn direction="none" delay={0.4}>
            <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] text-center space-y-1">
              <span className="text-xs font-mono text-[#94A3B8]">FadeIn direction="none"</span>
              <p className="text-sm font-medium text-[#F8FAFC]">Pure opacity crossfade</p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 2. Reveal Primitives */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
          2. Reveal Primitives (Viewport-Triggered Scroll Reveal)
        </h4>
        <Reveal distance={20} duration={0.4}>
          <div className="p-6 rounded-[8px] bg-[#121826] border border-[#2B384E] flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#FF9900]">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Viewport Observer</span>
              </div>
              <h5 className="text-base font-semibold text-[#F8FAFC]">
                Section Content Automatically Enters Smoothly While In View
              </h5>
              <p className="text-sm text-[#94A3B8]">
                Triggers once when 15% of the element crosses the viewport threshold, preventing repetitive jank upon upward scrolling.
              </p>
            </div>
            <Badge variant="accent" size="sm">whileInView</Badge>
          </div>
        </Reveal>
      </div>

      {/* 3. HoverCard Primitives */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8]">
          3. HoverCard Primitives (Controlled Interaction Lift)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HoverCard lift={4} scale={1.01}>
            <Card variant="default" className="h-full cursor-pointer">
              <CardHeader action={<Sparkles className="w-4 h-4 text-[#FF9900]" />}>
                <h5 className="text-base font-semibold text-[#F8FAFC]">AWS Cloud Architect</h5>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#94A3B8]">
                  HoverCard wraps any card or tile to provide smooth GPU-accelerated lift (4px) and micro-scale (1.01x).
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-[#FF9900] font-medium flex items-center gap-1">
                  Hover to test lift <MoveRight className="w-3.5 h-3.5" />
                </span>
              </CardFooter>
            </Card>
          </HoverCard>

          <HoverCard lift={4} scale={1.01}>
            <Card variant="default" className="h-full cursor-pointer">
              <CardHeader action={<ShieldCheck className="w-4 h-4 text-[#10B981]" />}>
                <h5 className="text-base font-semibold text-[#F8FAFC]">DevOps & Security</h5>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#94A3B8]">
                  Clean hover feedback without hiding critical content behind hover states. Accessible and keyboard focus compatible.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                  Hover to test lift <MoveRight className="w-3.5 h-3.5" />
                </span>
              </CardFooter>
            </Card>
          </HoverCard>

          <HoverCard lift={4} scale={1.01}>
            <Card variant="default" className="h-full cursor-pointer">
              <CardHeader action={<Badge variant="info" size="sm">Lab Track</Badge>}>
                <h5 className="text-base font-semibold text-[#F8FAFC]">Serverless & AI</h5>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#94A3B8]">
                  Tapping down on mobile or click triggers smooth spring response (`whileTap`).
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-[#38BDF8] font-medium flex items-center gap-1">
                  Hover to test lift <MoveRight className="w-3.5 h-3.5" />
                </span>
              </CardFooter>
            </Card>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};
