import Link from "next/link";
import {
  DocumentTextIcon,
  FolderIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const documents = [
  {
    id: 1,
    title: "Overall Test Plan",
    type: "OVERALL_TEST_PLAN",
    project: "E-commerce Platform",
    status: "APPROVED",
    updatedAt: "2024-02-04",
  },
  {
    id: 2,
    title: "Payment Gateway Test Cases",
    type: "TEST_CASE",
    project: "E-commerce Platform",
    status: "IN_REVIEW",
    updatedAt: "2024-02-03",
  },
  {
    id: 3,
    title: "User Authentication Test Design",
    type: "TEST_DESIGN",
    project: "Mobile App",
    status: "DRAFT",
    updatedAt: "2024-02-02",
  },
];

const documentTypes = [
  { name: "Overall Test Plan", value: "OVERALL_TEST_PLAN" },
  { name: "Test Plan", value: "TEST_PLAN" },
  { name: "Test Design", value: "TEST_DESIGN" },
  { name: "Test Case", value: "TEST_CASE" },
  { name: "Test Log", value: "TEST_LOG" },
  { name: "Defect Report", value: "DEFECT_REPORT" },
  { name: "Progress Management", value: "PROGRESS_MANAGEMENT" },
  { name: "Test Summary", value: "TEST_SUMMARY" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "IN_REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "DRAFT":
      return "bg-gray-100 text-gray-800";
    case "ARCHIVED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Documents
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage test documentation across all projects
          </p>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0">
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Document
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DocumentTextIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Search documents"
                  />
                </div>
                <select
                  id="document-type"
                  name="document-type"
                  className="relative -ml-px rounded-none border-0 bg-transparent py-1.5 pl-3 pr-9 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">All Types</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <select
                  id="status"
                  name="status"
                  className="relative -ml-px rounded-none rounded-r-md border-0 bg-transparent py-1.5 pl-3 pr-9 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Project
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Updated
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {documents.map((document) => (
                      <tr key={document.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          <Link
                            href={`/dashboard/documents/${document.id}`}
                            className="hover:text-blue-600"
                          >
                            {document.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {
                            documentTypes.find((t) => t.value === document.type)
                              ?.name
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FolderIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            {document.project}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              document.status
                            )}`}
                          >
                            {document.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {document.updatedAt}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <Link
                            href={`/dashboard/documents/${document.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
