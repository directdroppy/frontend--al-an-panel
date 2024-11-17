import { COUNTRIES, INVESTMENT_DURATIONS } from '../constants';

export const calculateInvestmentReturn = (
  amount: number,
  countryCode: string,
  durationDays: number
) => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  const duration = INVESTMENT_DURATIONS.find(d => d.days === durationDays);

  if (!country || !duration) {
    throw new Error('Invalid country or duration');
  }

  // Yıllık faiz oranını günlük faiz oranına çevirme
  const dailyCountryRate = country.interestRate / 365;
  
  // Seçilen vade için ülke faizi
  const countryReturn = amount * (dailyCountryRate * duration.days) / 100;
  
  // Vade süresine özel ek getiri
  const durationReturn = amount * (duration.rate / 100);
  
  // Toplam getiri
  const totalReturn = countryReturn + durationReturn;
  
  // Yıllık efektif faiz oranı
  const annualizedRate = (totalReturn / amount) * (365 / duration.days) * 100;

  return {
    countryReturn,
    durationReturn,
    totalReturn,
    annualizedRate,
    dailyReturn: totalReturn / duration.days,
    expectedTotal: amount + totalReturn
  };
};

export const formatCurrency = (value: number, currency = 'USDT') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value) + ` ${currency}`;
};

export const calculateRiskScore = (
  amount: number,
  countryCode: string,
  durationDays: number
) => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  if (!country) return 0;

  const baseRisk = {
    high: 80,
    medium: 50,
    low: 20
  }[country.riskLevel];

  const durationRisk = (durationDays / 30) * 20;
  const amountRisk = (amount / 100000) * 30;

  return Math.min(100, baseRisk + durationRisk + amountRisk);
};