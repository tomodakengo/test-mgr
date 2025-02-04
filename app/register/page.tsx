import { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "新規登録 - Document Manager",
  description: "新規登録してドキュメント管理を始めましょう",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規アカウント登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              既存のアカウントでログイン
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
