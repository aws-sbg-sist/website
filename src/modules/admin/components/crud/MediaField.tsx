import React, { useState } from 'react';

export interface MediaFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  previewHeightClass?: string;
}

export const MediaField: React.FC<MediaFieldProps> = ({
  label = 'Media Asset URL',
  value,
  onChange,
  error,
  required = false,
  placeholder = 'https://images.unsplash.com/... or https://res.cloudinary.com/...',
  helperText = 'Enter a direct HTTPS image URL or use the Cloudinary upload hand-off widget.',
  previewHeightClass = 'h-32',
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showSimulateBanner, setShowSimulateBanner] = useState(false);

  // Handle URL change
  const handleUrlChange = (newUrl: string) => {
    setImageLoadError(false);
    onChange(newUrl);
  };

  // Preset demo image fixtures for rapid frontend simulation
  const handleSimulateUpload = (presetUrl: string) => {
    setImageLoadError(false);
    setShowSimulateBanner(true);
    onChange(presetUrl);
    setTimeout(() => setShowSimulateBanner(false), 3000);
  };

  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      {/* Field Label */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-800">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <span className="text-[10px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
          CDN / HTTPS
        </span>
      </div>

      {/* URL Input */}
      <div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-lg border bg-white py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-500/20'
            }`}
          />
          {hasValue && (
            <button
              type="button"
              onClick={() => handleUrlChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear media URL"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs font-medium text-rose-600 flex items-center space-x-1" role="alert">
            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
        )}
      </div>

      {/* Image Preview & Placeholder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Visual Preview Box */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Media Preview
          </span>
          <div
            className={`relative flex items-center justify-center rounded-lg border border-slate-200 bg-white overflow-hidden ${previewHeightClass}`}
          >
            {hasValue && !imageLoadError ? (
              <img
                src={value}
                alt="Media preview"
                onError={() => setImageLoadError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="p-4 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-[11px] text-slate-400">
                  {imageLoadError ? 'Unable to load image from URL' : 'No media specified'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cloudinary Integration Hand-off Zone */}
        <div className="flex flex-col justify-between rounded-lg border border-dashed border-amber-300 bg-amber-50/50 p-3">
          <div>
            <div className="flex items-center space-x-1.5 text-amber-900 font-semibold text-xs">
              <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Cloudinary CDN Hand-off</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-800/80 leading-relaxed">
              Future signed direct client uploads connect via{' '}
              <code className="rounded bg-amber-100 px-1 font-mono text-[10px]">
                /api/admin/media/sign-upload
              </code>
              . Zero client secrets exposed.
            </p>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="text-[10px] font-semibold text-amber-900">Simulate Upload Fixture:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleSimulateUpload(
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
                  )
                }
                className="rounded border border-amber-300 bg-white px-2 py-1 text-[10px] font-medium text-amber-900 hover:bg-amber-100 transition-colors"
              >
                Banner
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSimulateUpload(
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                  )
                }
                className="rounded border border-amber-300 bg-white px-2 py-1 text-[10px] font-medium text-amber-900 hover:bg-amber-100 transition-colors"
              >
                Avatar
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSimulateUpload(
                    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800'
                  )
                }
                className="rounded border border-amber-300 bg-white px-2 py-1 text-[10px] font-medium text-amber-900 hover:bg-amber-100 transition-colors"
              >
                Gallery
              </button>
            </div>
            {showSimulateBanner && (
              <div className="text-[10px] text-emerald-700 font-semibold animate-fade-in">
                &check; Simulated CDN media asset linked!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
