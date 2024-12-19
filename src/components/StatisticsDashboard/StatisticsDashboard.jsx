import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer 
} from 'recharts';

// Updated color palette with navy blue instead of yellow
const CHART_COLORS = ['#422B69', '#5B3D8C', '#9F7FE5', '#D4B3FF', '#000080'];
const STATUS_COLORS = {
  'Complete': '#422B69',    // Dark Purple
  'In Progress': '#000080', // Navy Blue
  'Dead': '#9F7FE5'        // Muted Purple
};

export default function StatisticsDashboard({ deals, teamMembers }) {
  // Calculate aggregate statistics
  const statistics = useMemo(() => {
    const stats = {
      totalDeals: deals.length,
      totalAssignmentFees: 0,
      dealsByStatus: {},
      teamMemberStats: {},
      monthlyTrends: {},
      avgTimeToClose: 0,
      totalClosedDeals: 0
    };

    // Initialize team member statistics
    teamMembers.forEach(member => {
      stats.teamMemberStats[member.name] = {
        earnings: 0,
        dealCounts: {
          'Complete': 0,
          'In Progress': 0,
          'Dead': 0,
          total: 0
        }
      };
    });

    deals.forEach(deal => {
      // Deal Status Distribution
      stats.dealsByStatus[deal.status] = (stats.dealsByStatus[deal.status] || 0) + 1;

      // Total Assignment Fees
      stats.totalAssignmentFees += deal.assignmentFee;

      // Team Member Earnings and Deal Counts
      Object.entries(deal.roles).forEach(([role, memberId]) => {
        if (memberId) {
          const member = teamMembers.find(m => m.id === memberId);
          if (member) {
            stats.teamMemberStats[member.name].earnings += deal.calculations.roleFees[role];
            stats.teamMemberStats[member.name].dealCounts[deal.status]++;
            stats.teamMemberStats[member.name].dealCounts.total++;
          }
        }
      });

      // Monthly Trends
      if (deal.dateFirstContact) {
        const month = new Date(deal.dateFirstContact).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!stats.monthlyTrends[month]) {
          stats.monthlyTrends[month] = {
            month,
            deals: 0,
            revenue: 0
          };
        }
        stats.monthlyTrends[month].deals++;
        stats.monthlyTrends[month].revenue += deal.assignmentFee;
      }

      // Average Time to Close
      if (deal.status === 'Complete' && deal.dateFirstContact && deal.dateClosed) {
        const firstContact = new Date(deal.dateFirstContact);
        const closed = new Date(deal.dateClosed);
        const daysToClose = (closed - firstContact) / (1000 * 60 * 60 * 24);
        stats.avgTimeToClose += daysToClose;
        stats.totalClosedDeals++;
      }
    });

    // Calculate final average time to close
    if (stats.totalClosedDeals > 0) {
      stats.avgTimeToClose = Math.round(stats.avgTimeToClose / stats.totalClosedDeals);
    }

    return stats;
  }, [deals, teamMembers]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Prepare data for charts
  const statusData = Object.entries(statistics.dealsByStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // Prepare earnings data for horizontal bar chart
  const earningsData = Object.entries(statistics.teamMemberStats)
  .reduce((acc, [name, stats]) => {
    const existingEntry = acc.find(entry => entry.earnings === stats.earnings);
    if (existingEntry) {
      existingEntry.name = `${existingEntry.name}, ${name}`;
    } else {
      acc.push({
        name,
        earnings: stats.earnings
      });
    }
    return acc;
  }, [])
  .sort((a, b) => b.earnings - a.earnings);

  // Prepare deals per member data for stacked bar chart
  const dealsPerMemberData = Object.entries(statistics.teamMemberStats)
    .map(([name, stats]) => ({
      name,
      Complete: stats.dealCounts.Complete,
      'In Progress': stats.dealCounts['In Progress'],
      Dead: stats.dealCounts.Dead,
      total: stats.dealCounts.total
    }))
    .sort((a, b) => b.total - a.total);

  const trendData = Object.values(statistics.monthlyTrends)
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // Custom styles for charts
  const chartStyles = {
    text: {
      fill: '#422B69', // Deep purple for labels
      fontSize: '12px'
    },
    tooltip: {
      backgroundColor: '#FCF4FF',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }
  };

  return (
    <div className="grid gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-dark-purple to-[#5B3D8C]">
          <CardHeader>
            <CardTitle className="text-light-purple">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-purple">{statistics.totalDeals}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-dark-purple to-[#5B3D8C]">
          <CardHeader>
            <CardTitle className="text-light-purple">Total Assignment Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-purple">
              {formatCurrency(statistics.totalAssignmentFees)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-dark-purple to-[#5B3D8C]">
          <CardHeader>
            <CardTitle className="text-light-purple">Avg. Days to Close</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-light-purple">
              {statistics.avgTimeToClose || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Member Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#422B69] font-bold">Team Member Earnings</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={earningsData} 
                layout="vertical"
                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D5F5" />
                <XAxis 
                  type="number" 
                  tickFormatter={formatCurrency}
                  tick={chartStyles.text}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={125}
                  interval={0}
                  tick={chartStyles.text}
                />
                <Tooltip 
                  contentStyle={chartStyles.tooltip}
                  formatter={(value) => formatCurrency(value)} 
                />
                <Bar dataKey="earnings" fill="#000080" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deals per Team Member */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#422B69] font-bold">Deals per Team Member</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsPerMemberData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D5F5" />
                <XAxis type="number" tick={chartStyles.text} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150}
                  tick={chartStyles.text}
                />
                <Tooltip contentStyle={chartStyles.tooltip} />
                <Legend />
                <Bar dataKey="Complete" stackId="status" fill={STATUS_COLORS.Complete} />
                <Bar dataKey="In Progress" stackId="status" fill={STATUS_COLORS['In Progress']} />
                <Bar dataKey="Dead" stackId="status" fill={STATUS_COLORS.Dead} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#422B69] font-bold">Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={STATUS_COLORS[entry.name]} 
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartStyles.tooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#422B69] font-bold">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D5F5" />
                <XAxis dataKey="month" tick={chartStyles.text} />
                <YAxis yAxisId="left" tick={chartStyles.text} />
                <YAxis yAxisId="right" orientation="right" tick={chartStyles.text} />
                <Tooltip contentStyle={chartStyles.tooltip} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="deals"
                  stroke="#000080"
                  strokeWidth={2}
                  name="Number of Deals"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#422B69"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}