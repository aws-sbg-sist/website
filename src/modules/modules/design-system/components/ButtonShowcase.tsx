'use client';

import React, { useState } from 'react';
import { Plus, ArrowRight, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, IconButton } from '@/components/ui';

export const ButtonShowcase: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setClickCount((prev) => prev + 1);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Variants */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          1. Button Variants
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          <Button variant="primary" onClick={() => setClickCount((c) => c + 1)}>
            Primary Action
          </Button>
          <Button variant="secondary" onClick={() => setClickCount((c) => c + 1)}>
            Secondary Action
          </Button>
          <Button variant="outline" onClick={() => setClickCount((c) => c + 1)}>
            Outline Action
          </Button>
          <Button variant="ghost" onClick={() => setClickCount((c) => c + 1)}>
            Ghost Action
          </Button>
          <Button variant="danger" iconLeft={<Trash2 className="w-4 h-4" />} onClick={() => setClickCount((c) => c + 1)}>
            Danger Action
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          2. Button Sizes (sm / md / lg)
        </h4>
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          <Button size="sm" variant="primary">
            Small (32px)
          </Button>
          <Button size="md" variant="primary">
            Medium (40px)
          </Button>
          <Button size="lg" variant="primary">
            Large (48px)
          </Button>
        </div>
      </div>

      {/* States & Icons */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          3. Interactive States & Icons
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          <Button
            variant="primary"
            loading={isLoading}
            onClick={simulateLoading}
            iconLeft={<RefreshCw className="w-4 h-4" />}
          >
            {isLoading ? 'Processing Request...' : 'Trigger Async Action'}
          </Button>
          <Button variant="primary" disabled>
            Disabled Primary
          </Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="outline" iconLeft={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
          <Button variant="ghost" iconRight={<ArrowRight className="w-4 h-4" />}>
            Explore Modules
          </Button>
        </div>
      </div>

      {/* Icon Buttons */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">
          4. Icon Buttons (ARIA-label compliant)
        </h4>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-[6px] bg-[#0E1420] border border-[#1E293B]">
          <IconButton
            icon={<Plus />}
            aria-label="Add new item"
            variant="primary"
            size="sm"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<Plus />}
            aria-label="Add new item"
            variant="primary"
            size="md"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<Plus />}
            aria-label="Add new item"
            variant="primary"
            size="lg"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<RefreshCw />}
            aria-label="Reload dataset"
            variant="default"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<CheckCircle2 />}
            aria-label="Completed badge"
            variant="outline"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<Trash2 />}
            aria-label="Delete entry"
            variant="danger"
            onClick={() => setClickCount((c) => c + 1)}
          />
          <IconButton
            icon={<Trash2 />}
            aria-label="Disabled delete button"
            variant="ghost"
            disabled
          />
          <IconButton
            icon={<RefreshCw />}
            aria-label="Loading button"
            variant="default"
            loading
          />
        </div>
      </div>

      {/* Live verification stats */}
      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" />
        Verified interactive events triggered: <span className="font-mono text-[#FF9900] font-bold">{clickCount}</span>
      </div>
    </div>
  );
};
