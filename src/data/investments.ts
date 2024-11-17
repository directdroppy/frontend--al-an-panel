export const mockInvestments = [
  {
    id: '1',
    clientName: 'Mehmet Demir',
    amount: 250000,
    type: 'fixed',
    status: 'active',
    returnRate: 15.5,
    startDate: '2024-02-15',
    endDate: '2024-08-15',
    employeeId: '1',
    notes: 'Altı aylık sabit getirili yatırım'
  },
  {
    id: '2',
    clientName: 'Zeynep Yıldız',
    amount: 175000,
    type: 'flexible',
    status: 'active',
    returnRate: 12.8,
    startDate: '2024-03-01',
    employeeId: '1'
  },
  {
    id: '3',
    clientName: 'Ali Kaya',
    amount: 500000,
    type: 'special',
    status: 'pending',
    returnRate: 18.2,
    startDate: '2024-03-20',
    employeeId: '1',
    notes: 'Özel portföy yönetimi'
  }
];

export const mockInvestmentStats = {
  totalAmount: 925000,
  activeInvestments: 2,
  monthlyTarget: 1000000,
  targetProgress: 92.5,
  averageReturnRate: 15.5,
  monthlyGrowth: 23.4
};