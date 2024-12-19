/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'light-purple': '#FCF4FF',
        'yellow-accent': '#F4DC57',
        'dark-purple': '#422B69',
        'purple-start': '#381AAB',
        'purple-end': '#6D088A',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#422B69",
          foreground: "#FCF4FF",
        },
        secondary: {
          DEFAULT: "#FCF4FF",
          foreground: "#422B69",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#FCF4FF",
          foreground: "#422B69",
        },
        accent: {
          DEFAULT: "#F4DC57",
          foreground: "#422B69",
        },
        popover: {
          DEFAULT: "#FCF4FF",
          foreground: "#422B69",
        },
        card: {
          DEFAULT: "#FCF4FF",
          foreground: "#422B69",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, rgba(56,26,171,1) 29%, rgba(109,8,138,0.9710477941176471) 97%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}