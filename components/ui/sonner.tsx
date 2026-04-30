"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      offset={20}
      gap={12}
      icons={{
        success: <CircleCheck className="h-[18px] w-[18px]" strokeWidth={2.25} />,
        info: <Info className="h-[18px] w-[18px]" strokeWidth={2.25} />,
        warning: <TriangleAlert className="h-[18px] w-[18px]" strokeWidth={2.25} />,
        error: <OctagonX className="h-[18px] w-[18px]" strokeWidth={2.25} />,
        loading: <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={2.25} />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group toast",
            // base card
            "!bg-[#0e0e11]/95 !backdrop-blur-xl",
            "!border !border-white/10",
            "!rounded-xl !shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.35)]",
            // size & layout
            "!w-[360px] !p-4 !pl-[18px] !gap-3",
            // text
            "!text-white !font-medium",
            // subtle left accent bar driven by --toast-accent (set per-type below)
            "before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:rounded-full",
            "before:bg-[var(--toast-accent,rgba(255,255,255,0.25))]",
            // smooth entrance
            "data-[mounted=true]:!animate-in data-[mounted=true]:fade-in-0 data-[mounted=true]:slide-in-from-left-2",
          ].join(" "),
          title: "!text-white !font-semibold !text-[14px] !leading-tight !tracking-tight",
          description: "!text-white/60 !text-[12.5px] !leading-snug !mt-0.5",
          icon: "!h-[28px] !w-[28px] !rounded-lg !flex !items-center !justify-center !shrink-0 !mr-1",
          // type-specific accents — sets the left bar colour and tints the icon chip
          success: [
            "[--toast-accent:#34d399]",
            "[&_[data-icon]]:!bg-emerald-400/12 [&_[data-icon]]:!text-emerald-400",
          ].join(" "),
          error: [
            "[--toast-accent:var(--ds-primary,#ee3536)]",
            "[&_[data-icon]]:!bg-[color-mix(in_srgb,var(--ds-primary,#ee3536)_15%,transparent)] [&_[data-icon]]:!text-[var(--ds-primary,#ee3536)]",
          ].join(" "),
          warning: [
            "[--toast-accent:#fbbf24]",
            "[&_[data-icon]]:!bg-amber-400/12 [&_[data-icon]]:!text-amber-400",
          ].join(" "),
          info: [
            "[--toast-accent:#38bdf8]",
            "[&_[data-icon]]:!bg-sky-400/12 [&_[data-icon]]:!text-sky-400",
          ].join(" "),
          loading: [
            "[--toast-accent:rgba(255,255,255,0.4)]",
            "[&_[data-icon]]:!bg-white/[0.06] [&_[data-icon]]:!text-white/70",
          ].join(" "),
          actionButton: [
            "!h-8 !px-3 !rounded-md !text-[12px] !font-semibold",
            "!bg-[var(--ds-primary,#ee3536)] !text-white",
            "hover:!brightness-110 transition-[filter] duration-150",
          ].join(" "),
          cancelButton: [
            "!h-8 !px-3 !rounded-md !text-[12px] !font-medium",
            "!bg-white/[0.06] !text-white/70 !border !border-white/10",
            "hover:!bg-white/[0.12] hover:!text-white",
          ].join(" "),
          closeButton: [
            "!left-auto !right-2 !top-2 !translate-x-0 !translate-y-0",
            "!h-6 !w-6 !rounded-md",
            "!bg-white/[0.06] !border !border-white/10 !text-white/55",
            "hover:!bg-white/[0.12] hover:!text-white",
          ].join(" "),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
