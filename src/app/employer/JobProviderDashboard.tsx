'use client';

import { useEmployerDashboard } from './utils/useEmployerDashboard';
import { PieChart } from '@/app/jobseeker/utils/PieChart';
import { BarChart } from '@/app/jobseeker/utils/BarChart';
import { StatCard } from './utils/StatCard';
import { EmployerDashboardSkeleton } from './utils/EmployerDashboardSkeleton';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  RefreshCw,
  AlertCircle,
  Target,
  CheckCircle,
  UserCheck
} from 'lucide-react';

export const JobProviderDashboard: React.FC = () => {
  const { data, loading, error, refetch, lastUpdated } = useEmployerDashboard(5 * 60 * 1000);

  if (loading && !data) return <EmployerDashboardSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="text-red-700 font-medium">Error loading dashboard</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Pie chart: Application status distribution
  const candidateStatusData = data.applicationStats.statusDistribution.map(stat => ({
    label: stat.status,
    value: stat.count,
    color: stat.status === "ACCEPTED" ? "#10B981" :
           stat.status === "SHORTLISTED" ? "#8B5CF6" :
           stat.status === "PENDING" ? "#F59E0B" :
           stat.status === "REJECTED" ? "#EF4444" :
           "#3B82F6"
  }));

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Recruitment analytics and hiring insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
  <div className="min-w-[900px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
    <StatCard
      title="Total Jobs"
      value={data.overview.totalJobs}
      icon={<Briefcase className="w-4 h-4 text-blue-600" />}
      // consider: glassmorphism and rounded styling inside StatCard
    />
    <StatCard
      title="Active Jobs"
      value={data.overview.activeJobs}
      icon={<Briefcase className="w-6 h-6 text-green-600" />}
    />
    <StatCard
      title="Applicants"
      value={`${data.overview.totalApplicants} Total / ${data.overview.applicantsThisMonth} This month`}
      icon={<Users className="w-6 h-6 text-purple-600" />}
    />
    <StatCard
      title="Applications Status"
      value={`${data.overview.shortlistedCandidates} Shortlist / ${data.overview.pendingApplications} Pending`}
      icon={<UserCheck className="w-6 h-6 text-indigo-600" />}
    />
    <StatCard
      title="Conversion Rate"
      value={`${data.overview.conversionRate}%`}
      icon={<Target className="w-6 h-6 text-orange-600" />}
    />
  </div>
</div>


      {/* Application Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={candidateStatusData}
          title="Application Status Distribution"
        />

        <BarChart
          data={data.analytics.applicationsOverTime.map(d => ({
            label: d.monthName,
            value: d.applications
          }))}
          title="Applications Over Time"
          color="#3B82F6"
        />
      </div>

      {/* Top Roles and Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={data.analytics.topJobRoles.map(role => ({
            label: role.role,
            value: role.totalApplications
          }))}
          title="Top Job Roles"
          color="#10B981"
        />

        <BarChart
          data={data.analytics.hiringTrends.map(trend => ({
            label: trend.monthName,
            value: trend.hired
          }))}
          title="Hiring Trends"
          color="#8B5CF6"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
        </div>
        <div className="p-6 space-y-4">
          {data.recentActivity.map((app: any) => (
            <div key={app.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-gray-200">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {app.candidateName} applied for {app.jobTitle} ({app.jobRole})
                </p>
                <p className="text-xs text-gray-500">{app.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
