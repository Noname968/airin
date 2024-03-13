"use client";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";

export function NextUiProvider({ children }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
