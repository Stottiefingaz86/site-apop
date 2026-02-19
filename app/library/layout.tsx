import React from 'react'

// Library pages get a clean layout — no chat, betslip, or app chrome.
// Just the component showcase, like Storybook / shadcn docs.
export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
