import Link from "next/link";

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

export default function EditDocument({ params }: { params: { id: string } }) {
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Edit Document
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update test documentation details
        </p>
      </div>

      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={document.title}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="document-type"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Document Type
                </label>
                <div className="mt-2">
                  <select
                    id="document-type"
                    name="document-type"
                    defaultValue={document.type}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Document type cannot be changed after creation
                </p>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="project"
                    id="project"
                    defaultValue={document.project.name}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Project cannot be changed after creation
                </p>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Content
                </label>
                <div className="mt-2">
                  <textarea
                    id="content"
                    name="content"
                    rows={20}
                    defaultValue={document.content}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Document Status
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update the document status
              </p>
            </div>
            <div className="mt-6">
              <fieldset>
                <legend className="sr-only">Status</legend>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="draft"
                      name="status"
                      type="radio"
                      defaultChecked={document.status === "DRAFT"}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="draft"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Draft
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="in-review"
                      name="status"
                      type="radio"
                      defaultChecked={document.status === "IN_REVIEW"}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="in-review"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      In Review
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="approved"
                      name="status"
                      type="radio"
                      defaultChecked={document.status === "APPROVED"}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="approved"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Approved
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="archived"
                      name="status"
                      type="radio"
                      defaultChecked={document.status === "ARCHIVED"}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="archived"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Archived
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end space-x-3">
            <Link
              href={`/dashboard/documents/${document.id}`}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
