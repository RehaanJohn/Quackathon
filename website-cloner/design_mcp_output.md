# Design Specification — GitHub
Generated from: https://github.com | Date: 2026-06-21 (inferred from cachedAt)

## Brand Identity
- **Tone:** Professional, Innovative, Empowering
- **Personality:** Collaborative, Forward-thinking, Reliable, Modern

## Color Palette
| Role       | Hex     | Usage                                        |
|------------|---------|----------------------------------------------|
| Primary    | #1e2327 | Dark background (theme-color, dark mode)     |
| Secondary  | #f2f2f2 | Light surface/background (light mode)        |
| Accent 1   | #0067b8 | Primary interactive elements (buttons, links) |
| Accent 2   | #d8b9ff | Highlight/glow, dark mode links/accents      |
| Surface    | #ffffff | Default background, card backgrounds         |
| Text       | #000000 | Primary text color (light mode)              |
| Text (Dark)| #ffffff | Primary text color (dark mode)               |
| Gray Text  | #666666 | Secondary text, captions                     |

## Typography
- **Display:** Mona Sans VF (Variable Font), large sizes (e.g., 24px+), semi-bold to bold. Used for main page titles.
- **Heading:** Mona Sans VF (Variable Font) or "Segoe UI", SegoeUI, Arial, sans-serif; sizes like 18px, 20px, semi-bold (600). Used for section titles.
- **Body:** Mona Sans VF (Variable Font) or "Segoe UI", SegoeUI, Arial, sans-serif; 15px, normal weight. Used for paragraph text and descriptions.
- **Caption:** Mona Sans VF (Variable Font) or "Segoe UI", SegoeUI, Arial, sans-serif; 13px, normal weight. Used for small descriptive text, footnotes.

## Spacing & Layout
- **Grid:** Implied responsive grid for feature sections and customer stories (e.g., 3-column layout on desktop, stacking on mobile). Content appears to be centered within a max-width container.
- **Section padding:** Responsive padding, often `tmp-px-3` (small), `tmp-px-md-4` (medium), `tmp-px-lg-5` (large) horizontally. Vertical padding varies, e.g., `py-3` for header, `margin-top: 8%` for modals.
- **Border radius:** Subtle rounding for most interactive elements and containers (e.g., `rounded`, `rounded-2`). Circular for radio buttons (`border-radius: 50%`).

## Component Inventory
### Navigation
- **Header:** Fixed at top, contains GitHub logo (Octocat), a mobile toggle button, and "Sign in" link.
- **Global Navigation:** (Inferred from `MarketingNavigation-module__nav__W0KYY`) Likely includes dropdowns for "Platform", "Solutions", "Open Source", "Pricing", etc.

### Hero
- **Layout:** Large heading, descriptive paragraph, email input field, "Sign up for GitHub" primary button, and "Try GitHub Copilot" secondary link. Features a prominent illustrative image (Mona the Octocat, Copilot, Ducky with a purple glow).

### Feature Section (GitHub features)
- **Layout:** Section title, a demonstration animation (video), and a tabbed interface (Code, Plan, Collaborate, Automate, Secure). Each tab reveals a description related to the feature.

### Customer Logos
- **Layout:** A horizontal display of prominent customer logos, likely a scrolling or responsive grid.

### AI Partner/Copilot Section
- **Layout:** Heading, descriptive text, an image demonstrating Copilot, and an "Explore GitHub Copilot" call-to-action link.

### Customer Story/Report Cards
- **Layout:** Smaller cards featuring a company logo, a headline summarizing a benefit, and a "Read customer story" or "Read industry report" link.

### Feature Blocks (e.g., Automate, Code Instantly, Keep Momentum, Shape Toolchain)
- **Layout:** Each block consists of a sub-heading, a descriptive paragraph, and an "Explore [Feature]" call-to-action link. Often accompanied by a relevant image or illustration.

### Security Section
- **Layout:** Similar to feature blocks, but focused on security aspects (Autofix, Code Security, Dependabot, Secret Protection). Includes statistics (e.g., "70% MTTR reduction") with footnotes. Each sub-section has a heading, description, image, and "Learn about..." link.

### Testimonial
- **Layout:** A blockquote with a customer quote, followed by the customer's name and title/company.

### Customer Stories Grid
- **Layout:** A grid of customer stories, each with a background image, company logo, industry tag, a headline, and a "Read customer story" link. Filterable by industry, size, use case.

### Bottom Call to Action
- **Layout:** Similar to the Hero section, with a large heading, descriptive text, email input, "Sign up for GitHub" primary button, and "Try GitHub Copilot" secondary link. Features a subtle background illustration.

### Footnotes
- **Layout:** Small text section at the bottom, providing references for statistics.

### Back to Top
- **Layout:** A simple link to return to the top of the page.

### Alerts
- **Layout:** Dismissible alert banners for session-related messages (e.g., "You signed in with another tab or window.").

## Interaction Patterns
- **Button Hover/Focus:** Buttons change background color, may gain a box-shadow on hover, and a distinct border on focus. Disabled buttons have reduced opacity and altered colors.
- **Link Hover/Focus:** Links are underlined. Radio buttons show a filled circle on hover and focus, with a border change.
- **Mobile Navigation:** A hamburger menu icon toggles the visibility of the navigation menu on smaller screens.
- **Scroll Transitions:** `data-scroll-watcher="true"` suggests elements may animate or change visibility based on scroll position.
- **Progress Bar:** A `turbo-progress-bar` indicates a loading state at the top of the page during navigation.

## Page Structure
1.  Header (Navigation)
2.  Hero Section
3.  GitHub Features Section
4.  GitHub Customers (Logo Grid)
5.  AI Partner/Copilot Section
6.  Customer Story/Report Cards (Duolingo, Gartner)
7.  Feature Blocks (Automate, Code Instantly, Keep Momentum, Shape Toolchain)
8.  Security Section (Autofix, Code Security, Dependabot, Secret Protection)
9.  Testimonial (Mercedes-Benz)
10. Collaboration Feature Blocks (Keep track, Share ideas, Review code, Fund open source)
11. Customer Stories Grid (By industry, size, use case)
12. Bottom Call to Action
13. Footnotes
14. Back to Top Link