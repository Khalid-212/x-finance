export interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalAccountsReceivable: number;
  totalAccountsPayable: number;
  incomeByCategory: Array<{
    categoryName: string;
    categoryColor: string;
    amount: number;
  }>;
  expensesByCategory: Array<{
    categoryName: string;
    categoryColor: string;
    amount: number;
  }>;
  period: {
    startDate: string | null;
    endDate: string | null;
  };
}
