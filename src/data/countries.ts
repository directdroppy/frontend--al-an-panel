export const countries = [
  {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    interestRate: 59.26,
    currency: 'USDT',
    minInvestment: 50,
    maxInvestment: 100000,
    riskLevel: 'high'
  },
  {
    code: 'AR',
    name: 'Arjantin',
    flag: '🇦🇷',
    interestRate: 40,
    currency: 'USDT',
    minInvestment: 50,
    maxInvestment: 100000,
    riskLevel: 'high'
  },
  {
    code: 'TR',
    name: 'Türkiye',
    flag: '🇹🇷',
    interestRate: 50,
    currency: 'USDT',
    minInvestment: 50,
    maxInvestment: 100000,
    riskLevel: 'medium'
  },
  {
    code: 'ZW',
    name: 'Zimbabve',
    flag: '🇿🇼',
    interestRate: 35,
    currency: 'USDT',
    minInvestment: 50,
    maxInvestment: 100000,
    riskLevel: 'high'
  }
] as const;

// Vade süreleri ve getiri oranları
export const investmentDurations = [
  {
    days: 3,
    label: '3 Günlük',
    rate: 8.9,
    description: 'Kısa vadeli yüksek getiri'
  },
  {
    days: 7,
    label: 'Haftalık',
    rate: 20.7,
    description: 'Haftalık sabit getiri'
  },
  {
    days: 15,
    label: '15 Günlük',
    rate: 44.4,
    description: 'Orta vadeli yatırım'
  },
  {
    days: 30,
    label: 'Aylık',
    rate: 59.3,
    description: 'Maksimum getiri potansiyeli'
  }
] as const;

// Yatırım hesaplama fonksiyonları
export const calculateInvestmentReturn = (
  amount: number,
  countryInterestRate: number,
  durationDays: number,
  durationRate: number
) => {
  // Yıllık faiz oranını günlük faiz oranına çevirme
  const dailyCountryRate = countryInterestRate / 365;
  
  // Seçilen vade için ülke faizi
  const countryReturn = amount * (dailyCountryRate * durationDays) / 100;
  
  // Vade süresine özel ek getiri
  const durationReturn = amount * (durationRate / 100);
  
  // Toplam getiri
  const totalReturn = countryReturn + durationReturn;
  
  // Yıllık efektif faiz oranı
  const annualizedRate = (totalReturn / amount) * (365 / durationDays) * 100;

  return {
    countryReturn,
    durationReturn,
    totalReturn,
    annualizedRate,
    dailyReturn: totalReturn / durationDays
  };
};

// Koruma tipleri
export const protectionTypes = [
  {
    id: 'currency-protected',
    name: 'Kur Korumalı',
    description: 'Döviz kuru dalgalanmalarına karşı koruma',
    additionalRate: 5
  },
  {
    id: 'inflation-protected',
    name: 'Enflasyon Korumalı',
    description: 'Enflasyon artışına karşı koruma',
    additionalRate: 3
  }
] as const;