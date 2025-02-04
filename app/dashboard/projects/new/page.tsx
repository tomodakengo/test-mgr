"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("project-name") as string;
    const description = formData.get("description") as string;
    const teamMembers = (formData.get("team-members") as string)
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");
    const isPrivate = formData.get("access-control") === "private";

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          members: teamMembers,
          isPrivate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "プロジェクトの作成に失敗しました");
      }

      router.push("/dashboard/projects");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "プロジェクトの作成に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

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

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
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
                    required
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
                      value="private"
                      defaultChecked
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
                      value="public"
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
              disabled={loading}
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? "作成中..." : "Create project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
