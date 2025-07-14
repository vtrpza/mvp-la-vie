import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Modern card with glass morphism and depth
        "bg-card text-card-foreground flex flex-col rounded-xl overflow-hidden",
        "modern-card transition-modern sophisticated-hover",
        "group relative",
        // Enhanced spacing and layout
        "container-adaptive",
        // Interactive effects
        "glow-effect progressive-blur",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Enhanced header with modern styling
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-3",
        "px-6 py-6 relative",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        // Modern border treatment
        "[.border-b]:pb-6 [.border-b]:border-gray-100/60",
        // Gradient background for headers
        "has-[.bg-gradient]:bg-gradient-to-r has-[.bg-gradient]:from-transparent has-[.bg-gradient]:to-gray-50/30",
        // Micro-interactions
        "transition-modern",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        // Enhanced typography
        "font-heading text-title text-shadow-soft",
        "text-balanced leading-tight",
        // Modern color treatment
        "text-gray-900 group-hover:text-gradient",
        "transition-modern",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        // Enhanced description styling
        "text-gray-600 text-caption",
        "text-pretty leading-relaxed",
        // Subtle animations
        "transition-modern opacity-90 group-hover:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        // Enhanced action styling
        "transition-modern micro-bounce",
        "opacity-80 group-hover:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Enhanced content spacing
        "px-6 py-4 flex-1",
        // Modern layout
        "space-y-4",
        // Subtle animations
        "transition-modern",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Enhanced footer styling
        "flex items-center justify-between px-6 py-4",
        // Modern border treatment
        "[.border-t]:pt-6 [.border-t]:border-gray-100/60",
        // Gradient background option
        "has-[.bg-gradient]:bg-gradient-to-r has-[.bg-gradient]:from-gray-50/30 has-[.bg-gradient]:to-transparent",
        // Subtle animations
        "transition-modern",
        className
      )}
      {...props}
    />
  )
}

// Specialized Card Variants
function GlassCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "glass-morphism backdrop-blur-xl",
        "border border-white/20",
        "shadow-2xl",
        className
      )}
      {...props}
    />
  )
}

function ElevatedCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "shadow-strong hover:shadow-2xl",
        "hover:scale-[1.02] hover:-translate-y-1",
        "element-3d",
        className
      )}
      {...props}
    />
  )
}

function InteractiveCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "cursor-pointer",
        "magnetic-hover",
        "pulse-glow",
        "hover:border-primary/30",
        className
      )}
      {...props}
    />
  )
}

function FloatingCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "floating-element",
        "shadow-medium",
        "border-0",
        "bg-gradient-to-br from-white to-gray-50",
        className
      )}
      {...props}
    />
  )
}

function FeatureCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        "border-2 border-transparent hover:border-primary/20",
        "breathing-animation",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  // Specialized variants
  GlassCard,
  ElevatedCard,
  InteractiveCard,
  FloatingCard,
  FeatureCard,
}
