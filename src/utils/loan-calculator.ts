/**
 * Loan calculation utilities
 * Handles various loan computations and financial calculations
 */

export interface LoanCalculationParams {
  principal: number;
  annualRate: number;
  loanTermMonths: number;
  downPayment?: number;
  processingFee?: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  effectiveRate: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

/**
 * Calculate monthly loan payment using standard amortization formula
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * where M = monthly payment, P = principal, r = monthly rate, n = number of months
 */
export const calculateMonthlyPayment = (params: LoanCalculationParams): number => {
  const principal = params.principal - (params.downPayment || 0);
  const monthlyRate = params.annualRate / 100 / 12;
  const numberOfPayments = params.loanTermMonths;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return Math.round(monthlyPayment * 100) / 100;
};

/**
 * Calculate total interest paid over loan term
 */
export const calculateTotalInterest = (params: LoanCalculationParams): number => {
  const monthlyPayment = calculateMonthlyPayment(params);
  const totalPayment = monthlyPayment * params.loanTermMonths;
  const principal = params.principal - (params.downPayment || 0);
  return Math.round((totalPayment - principal) * 100) / 100;
};

/**
 * Generate complete amortization schedule
 */
export const generateAmortizationSchedule = (
  params: LoanCalculationParams
): AmortizationEntry[] => {
  const schedule: AmortizationEntry[] = [];
  let balance = params.principal - (params.downPayment || 0);
  const monthlyRate = params.annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(params);

  for (let month = 1; month <= params.loanTermMonths; month++) {
    const interestPayment = Math.round(balance * monthlyRate * 100) / 100;
    const principalPayment = Math.round((monthlyPayment - interestPayment) * 100) / 100;
    balance = Math.round((balance - principalPayment) * 100) / 100;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance), // Prevent negative due to rounding
    });
  }

  return schedule;
};

/**
 * Complete loan calculation with all details
 */
export const calculateLoan = (params: LoanCalculationParams): LoanCalculationResult => {
  const monthlyPayment = calculateMonthlyPayment(params);
  const totalPayment = monthlyPayment * params.loanTermMonths;
  const principal = params.principal - (params.downPayment || 0);
  const totalInterest = Math.round((totalPayment - principal) * 100) / 100;

  // Calculate effective annual rate (APR)
  const monthlyRate = params.annualRate / 100 / 12;
  const effectiveRate = Math.round((Math.pow(1 + monthlyRate, 12) - 1) * 100 * 100) / 100;

  return {
    monthlyPayment,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest,
    effectiveRate,
    amortizationSchedule: generateAmortizationSchedule(params),
  };
};

/**
 * Calculate loan term based on payment, principal, and rate
 */
export const calculateLoanTerm = (
  principal: number,
  monthlyPayment: number,
  annualRate: number
): number => {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return Math.ceil(principal / monthlyPayment);
  }

  // Using the formula: n = -log(1 - (P*r)/M) / log(1 + r)
  const numerator = 1 - (principal * monthlyRate) / monthlyPayment;
  if (numerator <= 0) {
    throw new Error('Monthly payment too low for given principal and rate');
  }

  const loanTerm = Math.ceil(-Math.log(numerator) / Math.log(1 + monthlyRate));
  return loanTerm;
};

/**
 * Calculate required principal based on monthly payment
 */
export const calculatePrincipal = (
  monthlyPayment: number,
  annualRate: number,
  loanTermMonths: number
): number => {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyPayment * loanTermMonths;
  }

  const principal =
    (monthlyPayment * (Math.pow(1 + monthlyRate, loanTermMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths));

  return Math.round(principal * 100) / 100;
};

/**
 * Calculate effective annual rate from monthly rate
 */
export const calculateEffectiveRate = (annualRate: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const effectiveRate = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  return Math.round(effectiveRate * 100) / 100;
};

/**
 * Calculate compound interest
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
  compoundingPeriods: number = 12
): number => {
  const amount = principal * Math.pow(1 + rate / 100 / compoundingPeriods, compoundingPeriods * time);
  return Math.round((amount - principal) * 100) / 100;
};

/**
 * Calculate early payoff savings
 */
export const calculateEarlyPayoffSavings = (
  params: LoanCalculationParams,
  payoffMonths: number
): { interestSaved: number; totalPayment: number } => {
  if (payoffMonths >= params.loanTermMonths) {
    return { interestSaved: 0, totalPayment: 0 };
  }

  const originalResult = calculateLoan(params);
  const earlyPayoffParams = { ...params, loanTermMonths: payoffMonths };
  const earlyPayoffResult = calculateLoan(earlyPayoffParams);

  const interestSaved = Math.round(
    (originalResult.totalInterest - earlyPayoffResult.totalInterest) * 100
  ) / 100;

  return {
    interestSaved,
    totalPayment: earlyPayoffResult.totalPayment,
  };
};

/**
 * Calculate refinancing benefits
 */
export const calculateRefinancingBenefits = (
  currentParams: LoanCalculationParams,
  currentMonthsPaid: number,
  newRate: number,
  refinancingFee: number = 0
): { monthlySavings: number; totalSavings: number; breakEvenMonths: number } => {
  const currentPayment = calculateMonthlyPayment(currentParams);
  const remainingMonths = currentParams.loanTermMonths - currentMonthsPaid;

  // Calculate remaining balance
  const schedule = generateAmortizationSchedule(currentParams);
  const remainingBalance = schedule[currentMonthsPaid - 1]?.balance || 0;

  const newParams: LoanCalculationParams = {
    principal: remainingBalance,
    annualRate: newRate,
    loanTermMonths: remainingMonths,
  };

  const newPayment = calculateMonthlyPayment(newParams);
  const monthlySavings = Math.round((currentPayment - newPayment) * 100) / 100;
  const breakEvenMonths = refinancingFee > 0 ? Math.ceil(refinancingFee / monthlySavings) : 0;
  const totalSavings = Math.round(
    (monthlySavings * remainingMonths - refinancingFee) * 100
  ) / 100;

  return {
    monthlySavings,
    totalSavings,
    breakEvenMonths,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate loan-to-value ratio (LTV)
 */
export const calculateLTV = (loanAmount: number, propertyValue: number): number => {
  if (propertyValue === 0) return 0;
  return Math.round((loanAmount / propertyValue) * 100 * 100) / 100;
};

/**
 * Validate loan parameters
 */
export const validateLoanParams = (params: LoanCalculationParams): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (params.principal <= 0) {
    errors.push('Principal must be greater than 0');
  }

  if (params.annualRate < 0 || params.annualRate > 100) {
    errors.push('Annual rate must be between 0 and 100');
  }

  if (params.loanTermMonths <= 0) {
    errors.push('Loan term must be greater than 0 months');
  }

  if (params.downPayment && params.downPayment >= params.principal) {
    errors.push('Down payment must be less than principal');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
