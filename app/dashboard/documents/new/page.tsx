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

const projects = [
  { id: 1, name: "E-commerce Platform" },
  { id: 2, name: "Mobile App" },
  { id: 3, name: "API Gateway" },
];

export default function NewDocument() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create New Document
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create a new test documentation
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Enter document title"
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select type</option>
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project
                </label>
                <div className="mt-2">
                  <select
                    id="project"
                    name="project"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                    rows={15}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Enter document content"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Document Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure document settings and permissions
              </p>
            </div>
            <div className="mt-6">
              <fieldset>
                <legend className="text-sm font-medium leading-6 text-gray-900">
                  Initial Status
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="draft"
                      name="status"
                      type="radio"
                      defaultChecked
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
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="in-review"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Submit for Review
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
              href="/dashboard/documents"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Create document
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
