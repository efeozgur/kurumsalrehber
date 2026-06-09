'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface BankNameSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function BankNameSelect({ value, onChange, required }: BankNameSelectProps) {
  const [banks, setBanks] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    api.getBanks().then(setBanks).catch(() => {});
  }, []);

  return (
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="v-input text-sm"
    >
      <option value="" disabled>Banka seçin</option>
      {banks.map((bank) => (
        <option key={bank.id} value={bank.name}>{bank.name}</option>
      ))}
    </select>
  );
}
