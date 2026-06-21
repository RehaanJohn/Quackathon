# Design Specification — Stripe
Generated from: https://stripe.com/ | Date: 2024-06-21

## Brand Identity
- **Tone:** Professional, Innovative, Authoritative, Empowering
- **Personality:** Reliable, Modern, Efficient, Global

## Color Palette
| Role       | Hex       | Usage                                                              |
|------------|-----------|--------------------------------------------------------------------|
| Primary    | #031323   | Headings, main body text, primary button backgrounds               |
| Secondary  | #F6F9FC   | Secondary button backgrounds, subtle section backgrounds           |
| Accent     | #635BFF   | Links, interactive elements, subtle brand highlights               |
| Surface    | #FFFFFF   | Main page background, card backgrounds                             |
| Text       | #031323   | General body text, dark text on light backgrounds                  |

## Typography
- **Display:** Sohne (Sans-serif), Large, Bold/Extra Bold (e.g., `hds-heading--xl`)
- **Heading:** Sohne (Sans-serif), Various sizes and weights (e.g., `hds-heading`, `h2`, `h3`)
- **Body:** Sohne (Sans-serif), Regular weight, comfortable reading size
- **Caption:** Source Code Pro (Monospace), Medium weight, smaller size (for code snippets, data, metadata)

## Spacing & Layout
- **Grid:** Multi-column grid system (implied by `hero-section__layout-grid` and various content blocks), likely responsive. Content is often centered within a max-width container.
- **Section padding:** Generous vertical padding between sections (e.g., `section` class), likely consistent across the site to create breathing room. Horizontal padding ensures content doesn't touch edges.
- **Border radius:** Small to medium border-radius on interactive elements like buttons (e.g., `hds-button`), input fields, and image containers, giving a soft, modern feel.

## Component Inventory
### Navigation
- **Layout:** Fixed top navigation bar with Stripe logo on the left, main menu items (Products, Solutions, Developers, Resources, Pricing) in the center, and action buttons (Sign in, Contact sales) on the right.
- **Style:** Clean, minimalist, with subtle hover effects on menu items. Hamburger menu for mobile.
- **Elements:** Stripe logo (SVG), text links, primary and secondary buttons.

### Hero
- **Layout:** Full-width section with a large, impactful headline, a descriptive sub-headline, and two prominent call-to-action buttons. Features an animated background (wave graphic) and a dynamic "Global GDP running on Stripe" metric.
- **Style:** High contrast with dark text on a light background, visually engaging background animation.
- **Elements:** `<h1>` title, descriptive text, primary button ("Get started"), secondary button ("Sign up with Google"), animated metric display.

### Logo Carousel
- **Layout:** Horizontal scrolling marquee of prominent customer logos.
- **Style:** Subtle, continuous animation, with logos in a neutral color (e.g., black or dark grey).
- **Elements:** List of `<a>` tags containing SVG logos.

### Feature Grid/Cards
- **Layout:** Sections presenting multiple product features or solutions, often in a grid of 2-3 columns. Each item typically includes an `<h3>` title, a short description, and a relevant image or interactive demo.
- **Style:** Clean, card-like presentation for individual features, often with distinct background imagery or illustrations.
- **Elements:** `<h3>` titles, paragraphs, images, sometimes interactive UI elements (e.g., payment forms, dashboards).

### Stats/Metrics Section
- **Layout:** A section dedicated to displaying key performance indicators or impressive statistics, often presented in a grid of large numbers with accompanying descriptions and icons/illustrations.
- **Style:** Bold numbers, clear descriptions, often with illustrative graphics.
- **Elements:** Large numerical values, short descriptive text, small icons/images.

### Customer Stories/Accordions
- **Layout:** A section showcasing customer success stories, sometimes presented as an accordion or a grid of clickable cards. Each item includes a customer logo/image, a brief highlight, and a link to the full story.
- **Style:** Visually distinct blocks for each customer, often with a unique image treatment (e.g., the parallelogram shape in the Hertz/URBN examples).
- **Elements:** Images, `<h3>` titles, short descriptions, "Read the story" links.

### Service Offerings
- **Layout:** A section detailing professional services, presented as a list of distinct blocks, each with a title, description, and a call-to-action link.
- **Style:** Simple, direct, text-focused blocks.
- **Elements:** `<h4>` titles, paragraphs, "View services/partners/plans" links.

### Testimonials
- **Layout:** A section featuring quotes from key individuals at customer companies, often accompanied by a headshot and a link to the full story.
- **Style:** Clean, focused on the quote and speaker, with small circular headshots.
- **Elements:** Quote text, speaker name and title, headshot image, "Read the story" link.

### Developer Infrastructure Section
- **Layout:** A section highlighting Stripe's developer-friendly aspects, including integration options, API performance, and support resources. Often includes code snippets, diagrams, and interactive elements.
- **Style:** Technical, clear, with emphasis on code examples and data.
- **Elements:** `<h3>` titles, descriptive text, code blocks, diagrams, buttons to documentation.

### News/Blog Carousel
- **Layout:** A horizontal carousel displaying recent articles, announcements, or reports. Each item includes an image, a headline, and a "Read more" link.
- **Style:** Card-like items within a carousel, allowing users to browse multiple content pieces.
- **Elements:** Images, headlines, descriptive text, "Read the [item]" links.

### Content Block (Book of the Week)
- **Layout:** A dedicated section for a featured content piece, including an image, title, author, and a detailed description.
- **Style:** Editorial feel, with a clear visual hierarchy.
- **Elements:** Image, `<h4>` title, author name, paragraph description, links to external content.

### Final Call to Action
- **Layout:** A prominent section at the bottom of the page, encouraging users to take action, with two main buttons and supporting information.
- **Style:** Clear, concise, with strong calls to action.
- **Elements:** Headline, descriptive text, primary button ("Start now"), secondary button ("Contact sales"), supporting links ("Pricing details", "Integration options").

## Interaction Patterns
- **Button Hover States:** Primary buttons likely show a subtle background change or arrow animation on hover. Secondary buttons might show a border or text color change.
- **Navigation Dropdowns:** Menu items like "Products", "Solutions", "Developers", "Resources" likely trigger dropdown menus on hover or click, indicated by chevron icons.
- **Number Animation:** The "Global GDP running on Stripe" metric features a dynamic, animated update of its numerical value.
- **Carousel Navigation:** Carousels (Logo, News) likely have left/right navigation controls or auto-scroll functionality.
- **Link Hover States:** Text links change color or underline on hover.

## Page Structure
1.  Navigation
2.  Hero Section (with Global GDP metric)
3.  Logo Carousel (Customer Logos)
4.  Flexible Solutions for Every Business Model (Feature Grid)
    *   Accept and optimize payments globally
    *   Enable any billing model
    *   Monetize through agentic commerce
    *   Create a card issuing program
    *   Access borderless money movement with stablecoins and crypto
    *   Embed payments in your platform
5.  Building the economic infrastructure for AI (Callout)
6.  The Backbone of Global Commerce (Stats/Metrics)
7.  Powering Businesses of All Sizes (Customer Stories/Accordions)
    *   Hertz
    *   URBN
    *   Instacart
    *   Le Monde
8.  Professional Services Offerings (Professional services, Stripe-certified experts, Support plans)
9.  More Customer Stories (Bulleted list of customer highlights)
10. Stripe Startups Program & Stripe Atlas (Promotional Blocks)
11. Platform Embeddable Components (Interactive dashboard examples)
12. Platform Feature Highlights (Get to market faster, Grow new lines of revenue, Manage platform risk)
13. Testimonials (Mindbody, Jobber, Substack, Lightspeed)
14. Reliable, Extensible Infrastructure for Every Stack (Developer-focused section)
15. Latest Happenings (News/Blog Carousel)
16. Book of the Week (Content Block)
17. Ready to Get Started? (Final Call to Action)
## Recreate Prompt
> Build a website matching the above design specification.
> Use the Brand Identity, Color Palette, and Typography details strictly.
> Ensure the layout follows the Component Inventory and Page Structure.
