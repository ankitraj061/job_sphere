'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  onComplete: () => void;
  companyId?: string | null; // You can keep this if needed elsewhere
}

export default function CompanySelection({ onComplete }: Props) {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleCompleteCompanyProfile = () => {
    router.push(`/employer/company-profile`); // Redirect to company management page
  };

  return (
    <div className="max-w-md mx-auto space-y-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Step 3: Company Profile</h2>
      <p className="mb-4">
        Please complete your company profile before proceeding.
      </p>
      <button
        type="button"
        onClick={handleCompleteCompanyProfile}
        className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Complete Company Profile
      </button>
    </div>
  );
}
