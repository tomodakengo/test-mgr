import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "End-to-end testing for the new e-commerce platform",
    members: 8,
    documents: 15,
    progress: 75,
  },
  {
    id: 2,
    name: "Mobile App",
    description: "Quality assurance for the mobile application",
    members: 5,
    documents: 12,
    progress: 60,
  },
  {
    id: 3,
    name: "API Gateway",
    description: "Integration testing for the API gateway services",
    members: 4,
    documents: 8,
    progress: 40,
  },
];

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Projects
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your test projects
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="flex-1 p-6">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-lg font-medium text-gray-900">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </h3>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {project.description}
              </p>
              <div className="mt-6">
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Members:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {project.members}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Documents:
                    </span>
                    <span className="ml-2 text-sm text-gray-900">
                      {project.documents}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href={`/dashboard/projects/${project.id}/documents`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View documents
                </Link>
                <Link
                  href={`/dashboard/projects/${project.id}/settings`}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
