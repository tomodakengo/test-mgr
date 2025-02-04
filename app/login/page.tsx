import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "ログイン - Document Manager",
  description: "ログインしてドキュメント管理を始めましょう",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              新規登録はこちら
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
