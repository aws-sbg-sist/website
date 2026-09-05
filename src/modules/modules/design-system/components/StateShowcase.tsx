'use client';

import React, { useState } from 'react';
import { Calendar, RefreshCw, Sparkles, Check, AlertTriangle, Info, Terminal } from 'lucide-react';
import {
  Skeleton,
  EmptyState,
  ErrorState,
  Divider,
  Badge,
  Button,
} from '@/components/ui';

export const StateShowcase: React.FC = () => {
  const [retryStatus, setRetryStatus] = useState<string | null>(null);

  const handleRetry = () => {
    setRetryStatus('Re-fetching cluster telemetry...');
    setTimeout(() => {
      setRetryStatus('Telemetry synchronized successfully.');
      setTimeout(() => setRetryStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-10">
      {/* Badges Matrix */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          1. Badges & Tags Matrix
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          <Badge variant="default">Default</Badge>
          <Badge variant="accent" icon={<Sparkles />}>AWS Learning</Badge>
          <Badge variant="success" icon={<Check />}>Completed</Badge>
          <Badge variant="warning" icon={<AlertTriangle />}>Upcoming</Badge>
          <Badge variant="danger">Deprecated</Badge>
          <Badge variant="info" icon={<Info />}>Workshop</Badge>
          <Badge variant="accent" size="sm">Small 20px</Badge>
          <Badge variant="accent" size="md">Medium 24px</Badge>
          <Badge variant="accent" size="lg">Large 28px</Badge>
        </div>
      </div>

      {/* Dividers Showcase */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          2. Divider Separator Variations
        </h4>
        <div className="p-6 rounded-[6px] bg-[#0E1420] border border-[#1E293B] space-y-4">
          <p className="text-xs text-[#94A3B8]">Default Subtle Divider:</p>
          <Divider variant="subtle" spacing="sm" />

          <p className="text-xs text-[#94A3B8]">Labeled Divider:</p>
          <Divider label="OR CONTINUE WITH ACCESS TOKEN" spacing="sm" />

          <p className="text-xs text-[#94A3B8]">Strong Divider with Horizontal Content Flow:</p>
          <div className="flex items-center h-8 gap-4 text-xs text-[#94A3B8]">
            <span>Active Builders: 42</span>
            <Divider orientation="vertical" variant="strong" />
            <span>Region: ap-south-1</span>
            <Divider orientation="vertical" variant="strong" />
            <span>Latency: 14ms</span>
          </div>
        </div>
      </div>

      {/* Skeletons Loading States */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          3. Async Loading Skeletons
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          {/* Profile Card Skeleton */}
          <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton shape="avatar" />
              <div className="space-y-2 flex-1">
                <Skeleton shape="title" className="h-4 w-1/2" />
                <Skeleton shape="text" className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton shape="text" />
            <Skeleton shape="text" className="w-4/5" />
          </div>

          {/* Media / Event Tile Skeleton */}
          <div className="p-4 rounded-[6px] bg-[#121826] border border-[#1E293B] space-y-3">
            <Skeleton shape="image" className="h-28" />
            <Skeleton shape="title" className="h-5 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-[4px]" />
              <Skeleton className="h-6 w-24 rounded-[4px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State vs Error State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
            4. Intentional Empty State
          </h4>
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No upcoming events"
            description="Check back soon for new AWS SBG hackathons, workshops, and architecture deep-dives."
            action={
              <Button size="sm" variant="outline" iconLeft={<RefreshCw className="w-3.5 h-3.5" />}>
                View Events Archive
              </Button>
            }
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
            5. Accessible Error State
          </h4>
          <ErrorState
            title="Something went wrong"
            description="We couldn't load this content. Please verify network status or AWS credentials."
            action={
              <div className="flex flex-col items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={handleRetry}
                >
                  Try Again
                </Button>
                {retryStatus && (
                  <span className="text-xs text-[#10B981] font-mono animate-fade-in">
                    {retryStatus}
                  </span>
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
