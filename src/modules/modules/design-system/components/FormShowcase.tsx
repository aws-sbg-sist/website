'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Search, Key } from 'lucide-react';
import { Input, Button, Modal } from '@/components/ui';

export const FormShowcase: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (!val) {
      setEmailError('Email address is required for builder registration');
    } else if (!val.includes('@') || !val.includes('.')) {
      setEmailError('Please enter a valid academic or organization email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Primitives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[8px] bg-[#0E1420] border border-[#1E293B]">
        {/* Standard Input */}
        <Input
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          helperText="Display name for certificate generation"
          leftIcon={<User />}
          required
        />

        {/* Email with Interactive Validation */}
        <Input
          label="Sathyabama Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="student@sathyabama.ac.in"
          error={emailError}
          helperText={!emailError ? 'Official campus domain required' : undefined}
          leftIcon={<Mail />}
          required
        />

        {/* Password / Key Input */}
        <Input
          label="Access Key"
          type="password"
          placeholder="••••••••••••"
          helperText="Minimum 12 characters with symbol"
          leftIcon={<Lock />}
          rightIcon={<Key />}
        />

        {/* Search Input */}
        <Input
          label="Quick Filter"
          placeholder="Search by topic, track or speaker..."
          leftIcon={<Search />}
        />

        {/* Disabled State Input */}
        <Input
          label="Organization Node (Immutable)"
          value="Sathyabama AWS SBG Chapter 01"
          disabled
          helperText="Provisioned by Chapter Administrator"
        />

        {/* Forced Error State Verification */}
        <Input
          label="Account ID Validation"
          value="invalid-123"
          error="AWS Account ID must be a 12-digit numeric identifier"
          readOnly
        />
      </div>

      {/* Modal & Dialog Section */}
      <div className="p-6 rounded-[8px] bg-[#121826] border border-[#2B384E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-[#F8FAFC]">
            Accessible Modal Dialog Primitive
          </h4>
          <p className="text-sm text-[#94A3B8]">
            Features ARIA dialog semantics, automatic body scroll lock, Escape key closure, and trapped keyboard focus cycle.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Trigger Modal Preview
        </Button>
      </div>

      {/* Interactive Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Builder Workspace Provisioning"
        description="Verify your organization parameters before initializing resources."
      >
        <div className="space-y-4 text-sm text-[#94A3B8]">
          <p>
            You are about to link your student workspace with the Sathyabama AWS SBG shared builder cluster. This configuration provides read access to sandbox instances and hands-on lab templates.
          </p>
          <div className="p-3 bg-[#080C14] rounded-[6px] border border-[#1E293B] font-mono text-xs text-[#FF9900]">
            CLUSTER_ID: sathyabama-sbg-ap-south-1<br />
            TIER: Academic Sandbox Tier<br />
            REGION: ap-south-1 (Mumbai)
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm & Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
