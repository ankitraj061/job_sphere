import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EmployerStatCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <Skeleton height={20} width={100} className="mb-2" />
    <Skeleton height={28} width={80} /> 
  </div>
);

export const EmployerChartSkeleton = ({ title }: { title?: string }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    {title && <Skeleton height={20} width={150} className="mb-4" />}
    <Skeleton height={200} />
  </div>
);

export const EmployerTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b border-gray-200">
      <Skeleton height={24} width={200} />
    </div>
    <div className="p-6 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton height={32} width={32} circle />
          <Skeleton height={16} width={180} />
        </div>
      ))}
    </div>
  </div>
);

export const EmployerDashboardSkeleton = () => (
  <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
    <div className="flex justify-between items-center">
      <Skeleton height={32} width={180} />
      <Skeleton height={36} width={100} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <EmployerStatCardSkeleton key={i} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EmployerChartSkeleton title="Chart 1" />
      <EmployerChartSkeleton title="Chart 2" />
    </div>

    <EmployerTableSkeleton />
  </div>
);
