"use client";

import { NextUIProvider } from "@nextui-org/react";
import { DataProvider } from "@/context/DataContext";
import { SessionProvider } from "next-auth/react";
import { MotionDiv } from "@/utils/MotionDiv";
import { usePathname } from "next/navigation";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function Providers({ children, session }) {
  const pathname = usePathname();

  return (
    <NextUIProvider>
      <SessionProvider session={session}>
        <DataProvider>
          <MotionDiv
            key={pathname}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProgressBar
              height="3px"
              color="#CA1313"
              options={{ showSpinner: true }}
              // shallowRouting // by enabling this progressbar does not show on query params change
            />
            {children}
          </MotionDiv>
        </DataProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
