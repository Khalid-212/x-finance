"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ReportsViewProps {
  reportData: any;
}

export default function ReportsView({ reportData }: ReportsViewProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">
            Detailed financial analysis and insights
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Loading report data...</h3>
            <p className="text-muted-foreground">
              Please wait while we generate your financial reports.
            </p>
          </CardContent>
        </Card>
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
    "#FF6B6B",
    "#4ECDC4",
  ];

  const incomeChartData = reportData.incomeByCategory.map((item: any) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.categoryColor,
  }));

  const expenseChartData = reportData.expensesByCategory.map((item: any) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.categoryColor,
  }));

  const monthlyData = [
    { month: "Jan", income: 0, expenses: 0 },
    { month: "Feb", income: 0, expenses: 0 },
    { month: "Mar", income: 0, expenses: 0 },
    { month: "Apr", income: 0, expenses: 0 },
    { month: "May", income: 0, expenses: 0 },
    { month: "Jun", income: 0, expenses: 0 },
  ];

  const handleDateFilter = () => {
    // This would trigger a new report fetch with date filters
    console.log("Filtering by date:", { startDate, endDate });
  };

  const exportReport = () => {
    // This would generate and download a PDF/CSV report
    console.log("Exporting report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Reports</h2>
          <p className="text-muted-foreground">
            Detailed financial analysis and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
          <CardDescription>
            Select a date range to filter the report data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleDateFilter} className="mt-6">
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                reportData.totalIncome > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {reportData.totalIncome > 0
                ? `${(
                    (reportData.netProfit / reportData.totalIncome) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Net profit as % of income
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
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                  {incomeChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              Distribution of expenses across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                  {expenseChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>
            Monthly comparison of income and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Income Categories</CardTitle>
            <CardDescription>Highest earning categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeChartData
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 5)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            item.color || COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Highest spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseChartData
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 5)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            item.color || COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios</CardTitle>
          <CardDescription>
            Key financial performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.totalIncome > 0
                  ? `${(
                      (reportData.netProfit / reportData.totalIncome) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </div>
              <div className="text-sm text-muted-foreground">Profit Margin</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reportData.totalIncome > 0
                  ? `${(
                      (reportData.totalExpenses / reportData.totalIncome) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </div>
              <div className="text-sm text-muted-foreground">Expense Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(reportData.totalAccountsReceivable)}
              </div>
              <div className="text-sm text-muted-foreground">
                Accounts Receivable
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
