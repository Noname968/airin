'use client'

import { NextUIProvider } from '@nextui-org/react'
import { DataProvider } from '@/context/DataContext'

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </NextUIProvider>
  )
}