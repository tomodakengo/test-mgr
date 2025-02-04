import Link from "next/link";
import {
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Total Projects",
    value: "12",
    icon: FolderIcon,
    href: "/dashboard/projects",
  },
  {
    name: "Active Documents",
    value: "45",
    icon: DocumentTextIcon,
    href: "/dashboard/documents",
  },
  {
    name: "Test Progress",
    value: "78%",
    icon: ChartBarIcon,
    href: "/dashboard/progress",
  },
  {
    name: "Open Issues",
    value: "23",
    icon: ExclamationTriangleIcon,
    href: "/dashboard/issues",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "Test Plan",
    title: "E-commerce Platform Test Plan v2.0",
    project: "E-commerce Platform",
    date: "2024-02-04",
    status: "In Review",
  },
  {
    id: 2,
    type: "Test Case",
    title: "Payment Gateway Integration Tests",
    project: "E-commerce Platform",
    date: "2024-02-03",
    status: "Approved",
  },
  {
    id: 3,
    type: "Defect Report",
    title: "User Authentication Error",
    project: "Mobile App",
    date: "2024-02-02",
    status: "Open",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-6 flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="py-5">
                  <div className="relative focus-within:ring-2 focus-within:ring-blue-500">
                    <h3 className="text-sm font-semibold text-gray-800">
                      <a
                        href="#"
                        className="hover:underline focus:outline-none"
                      >
                        {activity.title}
                      </a>
                    </h3>
                    <div className="mt-1 flex space-x-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.project}
                      </p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          activity.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "In Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/activity"
              className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              View all activity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
