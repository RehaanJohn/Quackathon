# Design Specification — Stripe
Generated from: https://stripe.com/in | Date: 2024-07-30

## Brand Identity
- **Tone:** Professional, Innovative, Empowering, Global
- **Personality:** Modern, Trustworthy, Efficient, Sophisticated

## Color Palette
| Role       | Hex       | Usage                                        |
|------------|-----------|----------------------------------------------|
| Primary    | #635BFF   | Call-to-action buttons (background)          |
| Secondary  | #F6F9FC   | Secondary button backgrounds, subtle surfaces|
| Accent     | #00D4FF   | (Inferred) Interactive elements, highlights  |
| Surface    | #FFFFFF   | Main page backgrounds, card backgrounds      |
| Text       | #031323   | Headings, body text, primary button text (on light backgrounds) |

## Typography
- **Display:** Sohne (Sans-serif, likely bold/extra bold for large titles)
- **Heading:** Sohne (Sans-serif, various weights, e.g., `hds-heading--xl` for main headings)
- **Body:** Sohne (Sans-serif, regular weight)
- **Caption:** Sohne (Sans-serif, smaller size, e.g., "Global GDP running on Stripe"), Source Code Pro (Monospace, for technical/code-like text)

## Spacing & Layout
- **Grid:** Multi-column grid system evident in feature sections, customer stories, and news blocks. Content is typically contained within a `section-container` (implied max-width).
- **Section padding:** Consistent vertical padding between major sections (e.g., `section` class).
- **Border radius:** Subtle border-radius on interactive elements like buttons and cards (e.g., `hds-button`). Exact value not specified, but likely 4-8px for a modern, soft aesthetic.

## Component Inventory
### Navigation
- Top bar with Stripe logo (left).
- Horizontal menu items: "Products", "Solutions", "Developers", "Resources", "Pricing". Each with a chevron icon, suggesting dropdowns.
- Action buttons on the right: "Sign in" (secondary style) and "Contact sales" (primary style).
- Hamburger menu icon for mobile navigation.

### Hero
- Large, bold headline: "Financial infrastructure to grow your revenue." with a secondary descriptive line.
- Primary call-to-action button: "Request an invite" (Primary color, white text, animated arrow on hover).
- Eyebrow text with animated numerical value: "Global GDP running on Stripe: [percentage]".
- Dynamic background graphic (wave animation).

### Feature/Solution Grid
- Sections introduced by `<h2>` (e.g., "Flexible solutions for every business model.").
- Sub-sections with `<h3>` titles and descriptive text, often accompanied by illustrative images or UI snippets (e.g., "Accept and optimise payments globally", "Enable any billing model").
- Layout appears to be a flexible grid, adapting to content type.

### Promotional Block
- Standalone blocks with a headline and a call-to-action link, often accompanied by a background image (e.g., "Building the economic infrastructure for AI").

### Stats Section
- Section with a `<h2>` title (e.g., "The backbone of global commerce").
- Displays key metrics with large numbers and descriptive text (e.g., "135+ currencies and payment methods supported").
- Accompanied by a data visualization graphic.

### Customer Stories/Case Studies
- Section with a `<h2>` title (e.g., "Powering businesses of all sizes.").
- Detailed case study cards featuring a company logo/image, key statistics, and a "Read the story" link.
- A grid of smaller customer logos/stories with images, short descriptions, and "Read [Company]'s story" links.

### Service Offerings
- Section with a `<h4>` title (e.g., "Professional services.").
- Cards describing different service types (e.g., "Professional services", "Stripe-certified experts", "Support plans"), each with a descriptive paragraph and a "View services/partners/plans" link.

### Program Cards
- Distinct cards promoting Stripe programs (e.g., "Stripe Startups programme", "Stripe Atlas").
- Each card includes a title, description, image, and a call-to-action link.

### Testimonial Block
- Large quote from a customer, with attribution (name, title, company).
- Accompanied by a "Read the story" link.

### Developer Section
- Section with a `<h2>` title (e.g., "Reliable, extensible infrastructure for every stack.").
- Links to developer documentation and GitHub.
- Sub-sections describing integration options and benefits (e.g., "Connect to existing systems", "Scale with confidence", "Choose an integration path").
- Displays API usage statistics.

### News/Insights Carousel
- A section presenting multiple news articles, blog posts, or reports.
- Each item includes an image, title, descriptive text, and a "Read/Watch" link.
- Indicated as a carousel with "Item X of Y" navigation.

### Content Promotion
- Section for promoting in-house publications (e.g., "Book of the week", "Stripe Press", "Works in Progress").

### Call to Action (Footer-like)
- Prominent call-to-action with a headline ("Ready to get started?").
- Two buttons: "Start now" (primary) and "Contact sales" (secondary).

### Promotional Cards (Small)
- Smaller cards highlighting specific benefits or actions (e.g., "See what you'll pay", "Start building").
- Each with a title, short description, and a link.

### Location Switcher
- A banner or small section informing the user about their detected location and offering to switch to a different regional site.

## Interaction Patterns
- **Navigation Hover/Focus:** Menu items likely show hover/focus states, and chevron icons animate or rotate when dropdowns are active.
- **Button Hover:** Primary buttons feature a subtle arrow animation (`hds-icon-hover-arrow`) on hover. Secondary buttons likely have background or text color changes.
- **Number Animation:** The "Global GDP running on Stripe" metric in the hero section displays a dynamic, animating number.
- **Carousel Navigation:** The "Item X of Y" indicator suggests interactive controls for browsing news/insights.

## Page Structure
1.  Hero Section (with Global GDP Eyebrow, Main Heading, CTA, and background graphic)
2.  Flexible solutions for every business model (Feature/Solution Grid)
3.  Building the economic infrastructure for AI (Promotional Block)
4.  The backbone of global commerce (Stats Section)
5.  Powering businesses of all sizes (Customer Stories/Case Studies)
6.  Realise value faster with dedicated experts (Service Offerings)
7.  Customer Stories Grid (Lovable, Gamma, Runway, etc.)
8.  Stripe Startups programme & Stripe Atlas (Program Cards)
9.  Platform Guides (Get to market faster, Grow new lines of revenue, Manage platform risk)
10. Testimonial Block (Mindbody, Jobber, Substack, Lightspeed)
11. Reliable, extensible infrastructure for every stack (Developer Section)
12. News/Insights Carousel (Businesses on Stripe generated US$1.9tn in 2025, etc.)
13. Book of the week / Stripe Press (Content Promotion)
14. Ready to get started? (Call to Action)
15. Pricing & Integration Promos (See what you'll pay, Start building)
16. Location Switcher