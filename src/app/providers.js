'use client'

import { NextUIProvider } from '@nextui-org/react'
import { DataProvider } from '@/context/DataContext'
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </SessionProvider>
    </NextUIProvider>
  )
}