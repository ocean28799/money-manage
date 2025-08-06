import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatVNDShort(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VND`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VND`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K VND`;
  } else {
    return `${amount} VND`;
  }
}

// Format number with commas for display in input fields
export function formatNumberWithCommas(value: string | number): string {
  const num = typeof value === 'string' ? value.replace(/,/g, '') : value.toString();
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return '';
  return parsed.toLocaleString('en-US');
}

// Parse formatted number back to actual number
export function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Handle input change for formatted number inputs
export function handleNumberInputChange(
  value: string,
  onChange: (value: string) => void
) {
  // Remove all non-digit characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  const formatted = parts.length > 2 
    ? parts[0] + '.' + parts.slice(1).join('')
    : cleaned;
  
  // Format with commas for display
  const withCommas = formatNumberWithCommas(formatted);
  onChange(withCommas);
}
