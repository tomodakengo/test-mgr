"use client";

import { Session } from "@auth/core/types";
import { SessionProvider } from "@auth/core/react";
import { ReactNode } from "react";

interface AuthContextProps {
  children: ReactNode;
  session?: Session | null;
}

export default function AuthContext({ children, session }: AuthContextProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
