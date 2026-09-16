export interface PayslipItem {
  id: string;
  month: string;
  gross: string;
  deductions: string;
  net: string;
  status: 'Paid' | 'Processing' | 'On Hold';
  disbursementDate: string;
  earnings: Array<{ label: string; amount: string }>;
  deductionsList: Array<{ label: string; amount: string }>;
}

export interface PayrollStats {
  gross: string;
  deductions: string;
  net: string;
  ytd: string;
}

export let globalPayrollStats: PayrollStats = {
  gross: '₹85,000',
  deductions: '₹12,400',
  net: '₹72,600',
  ytd: '₹5,80,200',
};

export let globalPayslipsStore: PayslipItem[] = [
  {
    id: 'pay-2026-08',
    month: 'August 2026',
    gross: '₹85,000',
    deductions: '₹12,400',
    net: '₹72,600',
    status: 'Paid',
    disbursementDate: '31 Aug 2026',
    earnings: [
      { label: 'Basic Salary', amount: '₹50,000' },
      { label: 'House Rent Allowance (HRA)', amount: '₹20,000' },
      { label: 'Special Executive Allowance', amount: '₹10,000' },
      { label: 'Performance Bonus', amount: '₹5,000' },
    ],
    deductionsList: [
      { label: 'Provident Fund (PF)', amount: '₹6,000' },
      { label: 'Professional Tax (PT)', amount: '₹400' },
      { label: 'Income Tax (TDS)', amount: '₹6,000' },
    ],
  },
  {
    id: 'pay-2026-07',
    month: 'July 2026',
    gross: '₹82,000',
    deductions: '₹11,800',
    net: '₹70,200',
    status: 'Paid',
    disbursementDate: '31 Jul 2026',
    earnings: [
      { label: 'Basic Salary', amount: '₹48,000' },
      { label: 'House Rent Allowance (HRA)', amount: '₹19,000' },
      { label: 'Special Executive Allowance', amount: '₹10,000' },
      { label: 'Performance Bonus', amount: '₹5,000' },
    ],
    deductionsList: [
      { label: 'Provident Fund (PF)', amount: '₹5,800' },
      { label: 'Professional Tax (PT)', amount: '₹400' },
      { label: 'Income Tax (TDS)', amount: '₹5,600' },
    ],
  },
  {
    id: 'pay-2026-06',
    month: 'June 2026',
    gross: '₹82,000',
    deductions: '₹11,800',
    net: '₹70,200',
    status: 'Paid',
    disbursementDate: '30 Jun 2026',
    earnings: [
      { label: 'Basic Salary', amount: '₹48,000' },
      { label: 'House Rent Allowance (HRA)', amount: '₹19,000' },
      { label: 'Special Executive Allowance', amount: '₹10,000' },
      { label: 'Performance Bonus', amount: '₹5,000' },
    ],
    deductionsList: [
      { label: 'Provident Fund (PF)', amount: '₹5,800' },
      { label: 'Professional Tax (PT)', amount: '₹400' },
      { label: 'Income Tax (TDS)', amount: '₹5,600' },
    ],
  },
];