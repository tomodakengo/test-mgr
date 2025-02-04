import Link from "next/link";

export default function NewProject() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Create New Project
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Set up a new test management project
        </p>
      </div>

      <form className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Enter project description"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="team-members"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Team members
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="team-members"
                    id="team-members"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="Enter email addresses (comma separated)"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Add team members by their email addresses
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Project Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure additional project settings
              </p>
            </div>
            <div className="mt-6">
              <fieldset>
                <legend className="text-sm font-medium leading-6 text-gray-900">
                  Access Control
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="private"
                      name="access-control"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="private"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Private - Only invited members can access
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="public"
                      name="access-control"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="public"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                    >
                      Public - All organization members can access
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
              href="/dashboard/projects"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Create project
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
