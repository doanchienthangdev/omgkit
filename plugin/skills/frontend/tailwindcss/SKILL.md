---
name: tailwindcss
description: Tailwind CSS utility-first styling with responsive design, dark mode, animations, and component patterns
category: frontend
triggers:
  - tailwind
  - tailwindcss
  - utility classes
  - css framework
  - styling
---

# Tailwind CSS

Enterprise-grade **utility-first CSS framework** following industry best practices. This skill covers responsive design, dark mode, custom configurations, animations, component patterns, and optimization strategies used by top engineering teams.

## Purpose

Build beautiful, responsive UIs efficiently:

- Write utility-first CSS
- Implement responsive designs
- Configure dark mode theming
- Create reusable component patterns
- Customize design tokens
- Optimize for production
- Build accessible interfaces

## Features

### 1. Configuration Setup

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media'
  theme: {
    extend: {
      // Custom colors
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#f8fafc",
          // ... other shades
        },
      },
      // Custom spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      // Custom fonts
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Custom font sizes
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      // Custom border radius
      borderRadius: {
        "4xl": "2rem",
      },
      // Custom animations
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      // Custom box shadows
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
      },
      // Custom breakpoints
      screens: {
        "xs": "475px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
```

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 2. Component Patterns

```tsx
// Button component with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      bg-secondary-100 text-secondary-900
      hover:bg-secondary-200
      focus:ring-secondary-500
      dark:bg-secondary-800 dark:text-secondary-100
    `,
    outline: `
      border-2 border-primary-600 text-primary-600
      hover:bg-primary-50
      focus:ring-primary-500
      dark:border-primary-400 dark:text-primary-400
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100
      focus:ring-gray-500
      dark:text-gray-300 dark:hover:bg-gray-800
    `,
    destructive: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-xl shadow-soft
        border border-gray-200 dark:border-gray-700
        ${hoverable ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2
          border rounded-lg
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-600"
          }
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
```

### 3. Responsive Design

```tsx
// Responsive layout patterns
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {children}
    </div>
  );
}

// Responsive navigation
export function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo className="h-8 w-auto" />
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="
                inline-flex items-center justify-center
                p-2 rounded-md
                text-gray-400 hover:text-gray-500 hover:bg-gray-100
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
              "
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/products">Products</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

// Responsive hero section
export function Hero() {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center lg:text-left lg:max-w-2xl">
          {/* Responsive typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Build amazing products
            <span className="block text-primary-300 mt-2">with confidence</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
            Start building your next project with our comprehensive component
            library and design system.
          </p>

          {/* Responsive button layout */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 4. Dark Mode

```tsx
// Dark mode toggle
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="
        p-2 rounded-lg
        text-gray-500 hover:text-gray-700
        dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors duration-200
      "
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

// Dark mode aware components
export function DarkModeCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="
        p-6 rounded-xl
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md
        transition-shadow duration-200
      "
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
```

### 5. Animation Patterns

```tsx
// Animated components
export function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-slide-up opacity-0"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
}

// Hover animations
export function HoverCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        group
        relative
        bg-white dark:bg-gray-800
        rounded-xl shadow-sm
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-2
        cursor-pointer
      "
    >
      {/* Gradient overlay on hover */}
      <div
        className="
          absolute inset-0 rounded-xl
          bg-gradient-to-br from-primary-500/0 to-primary-500/0
          group-hover:from-primary-500/5 group-hover:to-primary-500/10
          transition-all duration-300
        "
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Loading skeleton
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200 dark:bg-gray-700
        rounded
        ${className}
      `}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Transition group
export function FadeTransition({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
      `}
    >
      {children}
    </div>
  );
}
```

### 6. Utility Class Patterns

```tsx
// Using clsx/cn for conditional classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200":
            variant === "default",
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
            variant === "success",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":
            variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
            variant === "error",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

// Responsive spacing utility
export function Stack({
  children,
  spacing = "md",
  direction = "vertical",
}: {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
  direction?: "vertical" | "horizontal";
}) {
  const spacingClasses = {
    sm: direction === "vertical" ? "space-y-2" : "space-x-2",
    md: direction === "vertical" ? "space-y-4" : "space-x-4",
    lg: direction === "vertical" ? "space-y-6" : "space-x-6",
  };

  return (
    <div
      className={cn(
        direction === "horizontal" && "flex items-center",
        spacingClasses[spacing]
      )}
    >
      {children}
    </div>
  );
}
```

### 7. Form Patterns

```tsx
// Complete form example
export function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="First Name"
          name="firstName"
          placeholder="John"
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          required
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="john@example.com"
        required
      />

      <div className="space-y-1">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="
            w-full px-4 py-2
            border border-gray-300 dark:border-gray-600
            rounded-lg
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            resize-none
          "
          placeholder="Your message..."
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="
            h-4 w-4
            rounded
            border-gray-300
            text-primary-600
            focus:ring-primary-500
          "
        />
        <label
          htmlFor="terms"
          className="ml-2 text-sm text-gray-600 dark:text-gray-400"
        >
          I agree to the{" "}
          <a href="/terms" className="text-primary-600 hover:underline">
            terms and conditions
          </a>
        </label>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
```

## Use Cases

### Responsive Dashboard Layout

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className="
          fixed inset-y-0 left-0
          z-50 w-64
          bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transform -translate-x-full lg:translate-x-0
          transition-transform duration-300
        "
      >
        {/* Sidebar content */}
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

## Best Practices

### Do's

- Use mobile-first responsive design
- Leverage utility composition
- Create reusable component patterns
- Use CSS variables for theming
- Implement dark mode properly
- Use the cn() utility for conditional classes
- Configure purge/content correctly
- Use semantic class grouping
- Optimize for production build
- Follow consistent spacing scales

### Don'ts

- Don't overuse @apply
- Don't create overly specific utilities
- Don't ignore accessibility
- Don't repeat complex class combinations
- Don't hardcode colors outside theme
- Don't skip responsive testing
- Don't forget dark mode variants
- Don't use arbitrary values excessively
- Don't ignore the configuration file
- Don't mix styling paradigms

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)
- [Tailwind CSS Plugins](https://tailwindcss.com/docs/plugins)
