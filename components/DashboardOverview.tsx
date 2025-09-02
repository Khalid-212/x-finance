"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReportData } from "@/lib/types";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface DashboardOverviewProps {
  reportData: ReportData | null;
  loading?: boolean;
  error?: string | null;
}

export default function DashboardOverview({
  reportData,
  loading = false,
  error = null,
}: DashboardOverviewProps) {
  console.log("🎯 DashboardOverview render:", { reportData, loading, error });

  if (loading) {
    console.log("⏳ Showing loading state");
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loading...
                </CardTitle>
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">Loading data...</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              Please check your database connection and try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accounts Receivable
              </CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  console.log("📊 Chart data preparation:", {
    incomeByCategory: reportData.incomeByCategory,
    expensesByCategory: reportData.expensesByCategory
  });

  const incomeChartData = reportData.incomeByCategory.map((item) => ({
    name: item.categoryName,
    value: Number(item.amount),
    color: item.categoryColor,
  }));

  const expenseChartData = reportData.expensesByCategory.map((item) => ({
    name: item.categoryName,
    value: Number(item.amount),
    color: item.categoryColor,
  }));

  console.log("🎯 Processed chart data:", {
    incomeChartData,
    expenseChartData
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{reportData.incomeByCategory.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{reportData.expensesByCategory.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(reportData.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.netProfit >= 0 ? "Positive" : "Negative"} balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accounts Receivable
            </CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(reportData.totalAccountsReceivable)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
            <CardDescription>
              Distribution of income across categories
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Debug: {incomeChartData.length} items, total: {incomeChartData.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>
          <CardContent>
            {incomeChartData.length > 0 ? (
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeChartData.map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No income data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              Distribution of expenses across categories
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Debug: {expenseChartData.length} items, total: {expenseChartData.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>
          <CardContent>
            {expenseChartData.length > 0 ? (
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseChartData.map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Payable</CardTitle>
            <CardDescription>Outstanding debts you owe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(reportData.totalAccountsPayable)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total amount owed to creditors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Key financial indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Profit Margin:</span>
              <span
                className={`font-semibold ${
                  reportData.totalIncome > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {reportData.totalIncome > 0
                  ? `${(
                      (reportData.netProfit / reportData.totalIncome) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Expense Ratio:</span>
              <span className="font-semibold text-red-600">
                {reportData.totalIncome > 0
                  ? `${(
                      (reportData.totalExpenses / reportData.totalIncome) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
