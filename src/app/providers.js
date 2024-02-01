'use client'

import { NextUIProvider } from '@nextui-org/react'
import { DataProvider } from '@/context/DataContext'
import { SessionProvider } from "next-auth/react";
import { MotionDiv } from '@/utils/MotionDiv';
import { usePathname } from 'next/navigation'

export function Providers({ children, session }) {
  const pathname = usePathname()

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
            {children}
          </MotionDiv>
        </DataProvider>
      </SessionProvider>
    </NextUIProvider>
  )
}