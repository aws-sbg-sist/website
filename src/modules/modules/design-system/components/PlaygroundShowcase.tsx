'use client';

import React, { useState } from 'react';
import { Check, Copy, Sliders, RefreshCw } from 'lucide-react';
import {
  Button,
  ButtonVariant,
  ButtonSize,
  Badge,
  BadgeVariant,
  BadgeSize,
  Input,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Skeleton,
} from '@/components/ui';

type ComponentType = 'button' | 'badge' | 'input' | 'card' | 'skeleton';

export const PlaygroundShowcase: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('button');
  const [copied, setCopied] = useState(false);

  // Button Playground State
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>('primary');
  const [buttonSize, setButtonSize] = useState<ButtonSize>('md');
  const [buttonText, setButtonText] = useState('Launch EC2 Instance');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Badge Playground State
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>('accent');
  const [badgeSize, setBadgeSize] = useState<BadgeSize>('md');
  const [badgeText, setBadgeText] = useState('AWS Certified');

  // Input Playground State
  const [inputLabel, setInputLabel] = useState('IAM Role ARN');
  const [inputPlaceholder, setInputPlaceholder] = useState('arn:aws:iam::123456789012:role/...');
  const [inputHelper, setInputHelper] = useState('Enter the ARN for the Lambda execution role');
  const [inputError, setInputError] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputRequired, setInputRequired] = useState(true);

  // Card Playground State
  const [cardVariant, setCardVariant] = useState<'default' | 'interactive' | 'elevated' | 'bordered'>('default');
  const [cardTitle, setCardTitle] = useState('AWS Lambda Function');
  const [cardBody, setCardBody] = useState('Serverless compute running Node.js 20 with 256MB allocated memory.');

  // Generate code snippet based on selected component and options
  const generateSnippet = (): string => {
    switch (selectedComponent) {
      case 'button':
        return `<Button
  variant="${buttonVariant}"
  size="${buttonSize}"${buttonLoading ? '\n  isLoading={true}' : ''}${buttonDisabled ? '\n  disabled={true}' : ''}
>
  ${buttonText}
</Button>`;

      case 'badge':
        return `<Badge variant="${badgeVariant}" size="${badgeSize}">
  ${badgeText}
</Badge>`;

      case 'input':
        return `<Input
  label="${inputLabel}"
  placeholder="${inputPlaceholder}"${inputHelper ? `\n  helperText="${inputHelper}"` : ''}${inputError ? `\n  error="${inputError}"` : ''}${inputRequired ? '\n  required={true}' : ''}${inputDisabled ? '\n  disabled={true}' : ''}
/>`;

      case 'card':
        return `<Card variant="${cardVariant}">
  <CardHeader title="${cardTitle}" />
  <CardContent>
    <p className="text-sm text-[#94A3B8]">${cardBody}</p>
  </CardContent>
  <CardFooter>
    <Button size="sm" variant="primary">Deploy</Button>
  </CardFooter>
</Card>`;

      case 'skeleton':
        return `<div className="space-y-3">
  <Skeleton shape="avatar" />
  <Skeleton shape="title" className="w-1/2" />
  <Skeleton shape="text" />
  <Skeleton shape="text" className="w-4/5" />
</div>`;

      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Component Selector Pills */}
      <div
        role="tablist"
        aria-label="Component playground selector"
        className="flex flex-wrap items-center gap-2 p-1.5 rounded-[8px] bg-[#121826] border border-[#1E293B] max-w-fit"
      >
        {(
          [
            { id: 'button', label: 'Button' },
            { id: 'badge', label: 'Badge' },
            { id: 'input', label: 'Input' },
            { id: 'card', label: 'Card' },
            { id: 'skeleton', label: 'Skeleton' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selectedComponent === item.id}
            aria-controls="playground-stage"
            onClick={() => setSelectedComponent(item.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9900] ${
              selectedComponent === item.id
                ? 'bg-[#FF9900] text-[#0B0F17]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2-Column Split: Controls on Left, Live Stage & Code on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 p-6 rounded-[8px] bg-[#121826] border border-[#1E293B] space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#FF9900]" />
              Prop Configurator
            </h3>
            <span className="text-[11px] font-mono text-[#64748B]">
              Component: {selectedComponent.toUpperCase()}
            </span>
          </div>

          {/* Button Controls */}
          {selectedComponent === 'button' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Variant
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as ButtonVariant[]).map(
                    (v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setButtonVariant(v)}
                        className={`px-2.5 py-1 text-xs rounded-[4px] border capitalize focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900] ${
                          buttonVariant === v
                            ? 'bg-[#FF9900]/15 border-[#FF9900] text-[#FF9900] font-semibold'
                            : 'border-[#2B384E] text-[#94A3B8] hover:bg-[#1E293B]'
                        }`}
                      >
                        {v}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['sm', 'md', 'lg'] as ButtonSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setButtonSize(s)}
                      className={`px-2.5 py-1 text-xs rounded-[4px] border uppercase focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900] ${
                        buttonSize === s
                          ? 'bg-[#FF9900]/15 border-[#FF9900] text-[#FF9900] font-semibold'
                          : 'border-[#2B384E] text-[#94A3B8] hover:bg-[#1E293B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="button-label-input" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Button Label
                </label>
                <input
                  id="button-label-input"
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label htmlFor="button-loading-toggle" className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                  <input
                    id="button-loading-toggle"
                    type="checkbox"
                    checked={buttonLoading}
                    onChange={(e) => setButtonLoading(e.target.checked)}
                    className="accent-[#FF9900] rounded"
                  />
                  <span>Loading state</span>
                </label>
                <label htmlFor="button-disabled-toggle" className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                  <input
                    id="button-disabled-toggle"
                    type="checkbox"
                    checked={buttonDisabled}
                    onChange={(e) => setButtonDisabled(e.target.checked)}
                    className="accent-[#FF9900] rounded"
                  />
                  <span>Disabled</span>
                </label>
              </div>
            </div>
          )}

          {/* Badge Controls */}
          {selectedComponent === 'badge' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Variant
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['default', 'accent', 'success', 'warning', 'error', 'info'] as BadgeVariant[]).map(
                    (v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setBadgeVariant(v)}
                        className={`px-2.5 py-1 text-xs rounded-[4px] border capitalize focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900] ${
                          badgeVariant === v
                            ? 'bg-[#FF9900]/15 border-[#FF9900] text-[#FF9900] font-semibold'
                            : 'border-[#2B384E] text-[#94A3B8] hover:bg-[#1E293B]'
                        }`}
                      >
                        {v}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Size
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['sm', 'md'] as BadgeSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBadgeSize(s)}
                      className={`px-2.5 py-1 text-xs rounded-[4px] border uppercase focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900] ${
                        badgeSize === s
                          ? 'bg-[#FF9900]/15 border-[#FF9900] text-[#FF9900] font-semibold'
                          : 'border-[#2B384E] text-[#94A3B8] hover:bg-[#1E293B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="badge-label-input" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Badge Label
                </label>
                <input
                  id="badge-label-input"
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>
            </div>
          )}

          {/* Input Controls */}
          {selectedComponent === 'input' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="input-label-field" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Label Text
                </label>
                <input
                  id="input-label-field"
                  type="text"
                  value={inputLabel}
                  onChange={(e) => setInputLabel(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>

              <div>
                <label htmlFor="input-helper-field" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Helper Description
                </label>
                <input
                  id="input-helper-field"
                  type="text"
                  value={inputHelper}
                  onChange={(e) => setInputHelper(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>

              <div>
                <label htmlFor="input-error-field" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Validation Error Message (empty = valid)
                </label>
                <input
                  id="input-error-field"
                  type="text"
                  value={inputError}
                  placeholder="e.g. Invalid AWS ARN syntax"
                  onChange={(e) => setInputError(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label htmlFor="input-required-toggle" className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                  <input
                    id="input-required-toggle"
                    type="checkbox"
                    checked={inputRequired}
                    onChange={(e) => setInputRequired(e.target.checked)}
                    className="accent-[#FF9900] rounded"
                  />
                  <span>Required</span>
                </label>
                <label htmlFor="input-disabled-toggle" className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                  <input
                    id="input-disabled-toggle"
                    type="checkbox"
                    checked={inputDisabled}
                    onChange={(e) => setInputDisabled(e.target.checked)}
                    className="accent-[#FF9900] rounded"
                  />
                  <span>Disabled</span>
                </label>
              </div>
            </div>
          )}

          {/* Card Controls */}
          {selectedComponent === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Card Variant
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['default', 'interactive', 'elevated', 'bordered'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCardVariant(v)}
                      className={`px-2.5 py-1 text-xs rounded-[4px] border capitalize focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900] ${
                        cardVariant === v
                          ? 'bg-[#FF9900]/15 border-[#FF9900] text-[#FF9900] font-semibold'
                          : 'border-[#2B384E] text-[#94A3B8] hover:bg-[#1E293B]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="card-title-input" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Card Title
                </label>
                <input
                  id="card-title-input"
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>

              <div>
                <label htmlFor="card-body-input" className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  Card Body Content
                </label>
                <textarea
                  id="card-body-input"
                  rows={2}
                  value={cardBody}
                  onChange={(e) => setCardBody(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-[4px] bg-[#080C14] border border-[#2B384E] text-[#F8FAFC] focus:outline-none focus:border-[#FF9900] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
                />
              </div>
            </div>
          )}

          {/* Skeleton Controls */}
          {selectedComponent === 'skeleton' && (
            <div className="space-y-3">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                The Skeleton primitive provides accessible, motion-safe shimmer placeholders (`motion-safe:animate-pulse`) for layout shifts during async data fetching.
              </p>
              <div className="p-3 bg-[#080C14] rounded-[4px] border border-[#2B384E] text-[11px] font-mono text-[#64748B]">
                Supports shapes: <code>avatar</code>, <code>title</code>, <code>text</code>, <code>card</code>, <code>custom</code>.
              </div>
            </div>
          )}
        </div>

        {/* Live Stage & Code Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Canvas Stage */}
          <div
            id="playground-stage"
            aria-live="polite"
            className="p-8 rounded-[8px] bg-[#0E1420] border border-[#1E293B] flex flex-col items-center justify-center min-h-[260px] relative"
          >
            <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono uppercase text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] motion-safe:animate-pulse" />
              Live Stage
            </div>

            {selectedComponent === 'button' && (
              <Button
                variant={buttonVariant}
                size={buttonSize}
                isLoading={buttonLoading}
                disabled={buttonDisabled}
              >
                {buttonText}
              </Button>
            )}

            {selectedComponent === 'badge' && (
              <Badge variant={badgeVariant} size={badgeSize}>
                {badgeText}
              </Badge>
            )}

            {selectedComponent === 'input' && (
              <div className="w-full max-w-sm">
                <Input
                  label={inputLabel}
                  placeholder={inputPlaceholder}
                  helperText={inputHelper}
                  error={inputError}
                  required={inputRequired}
                  disabled={inputDisabled}
                />
              </div>
            )}

            {selectedComponent === 'card' && (
              <div className="w-full max-w-sm">
                <Card variant={cardVariant}>
                  <CardHeader title={cardTitle} />
                  <CardContent>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                      {cardBody}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="primary">
                      Deploy
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {selectedComponent === 'skeleton' && (
              <div className="w-full max-w-sm space-y-4 p-4 rounded-[6px] bg-[#121826] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <Skeleton shape="avatar" className="w-10 h-10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton shape="title" className="w-2/3" />
                    <Skeleton shape="text" className="w-1/3" />
                  </div>
                </div>
                <Skeleton shape="text" />
                <Skeleton shape="text" className="w-4/5" />
              </div>
            )}
          </div>

          {/* Generated JSX Snippet */}
          <div className="rounded-[8px] bg-[#080C14] border border-[#1E293B] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#121826] border-b border-[#1E293B]">
              <span className="text-xs font-mono text-[#94A3B8]">
                Generated JSX
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Code snippet copied' : 'Copy generated JSX code snippet'}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[4px] bg-[#1E293B] text-[#F8FAFC] hover:bg-[#2B384E] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF9900]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-[#F8FAFC] overflow-x-auto leading-relaxed">
              <code>{generateSnippet()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
