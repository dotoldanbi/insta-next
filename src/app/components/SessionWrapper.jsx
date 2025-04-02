"use client";

import { SessionProvider } from "next-auth/react";

const SessionWrapper = ({ children, session }) => {
  return <SessionProvider options={{ session }}>{children}</SessionProvider>;
};

export default SessionWrapper;
