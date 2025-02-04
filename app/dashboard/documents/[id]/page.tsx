import Link from "next/link";
import {
  ClockIcon,
  DocumentTextIcon,
  FolderIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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

export default function Document({ params }: { params: { id: string } }) {
  // このデータは実際にはAPIから取得します
  const document = {
    id: params.id,
    title: "E-commerce Platform Test Plan v2.0",
    type: "OVERALL_TEST_PLAN",
    content: `# Overall Test Plan

## 1. Introduction
This test plan outlines the testing approach for the e-commerce platform.

## 2. Test Objectives
- Ensure all core functionalities work as expected
- Verify system performance under load
- Validate security measures

## 3. Test Strategy
### 3.1 Unit Testing
- Component level testing
- Integration points verification

### 3.2 Integration Testing
- API endpoints testing
- Third-party service integration

### 3.3 Performance Testing
- Load testing
- Stress testing
- Scalability testing`,
    status: "IN_REVIEW",
    version: 2,
    project: {
      id: 1,
      name: "E-commerce Platform",
    },
    updatedAt: "2024-02-04T12:00:00Z",
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {document.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FolderIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {document.project.name}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <DocumentTextIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {documentTypes.find((t) => t.value === document.type)?.name}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              Version {document.version}
            </div>
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                  document.status
                )}`}
              >
                {document.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
          <Link
            href={`/dashboard/documents/${document.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilSquareIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Edit
          </Link>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap">{document.content}</pre>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Document History
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Last updated at {new Date(document.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
