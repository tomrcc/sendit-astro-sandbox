# CloudCannon Astro Integration Specification

**Version:** 1.0  
**Last Updated:** November 2025  
**Target:** Agentic Code Editors & CloudCannon Developers  

## Specification Overview

This specification defines standardized patterns for implementing CloudCannon visual editing in Astro projects. It provides decision trees, validation rules, and implementation templates for automated code generation.

### Scope

- ✅ Astro components with CloudCannon editable regions
- ✅ Data file integration (JSON/YAML/TOML)
- ✅ Content file integration (Markdown with frontmatter)
- ✅ Component registration and lazy loading
- ❌ Non-Astro frameworks (see separate specs)

### Prerequisites

- Astro project (v2.0+)
- CloudCannon account with project configuration
- Node.js environment for package installation

## Quick Reference

### Decision Matrix: File Type → Implementation Pattern

| File Type | Data Source | Container Attributes | Property Syntax | Registration Required |
|-----------|-------------|---------------------|-----------------|---------------------|
| Content (.md) | Frontmatter | `data-editable="text/image/source"` | `data-prop="property"` | No |
| Data (.json/.yml/.toml) | Import statement | None required | `data-prop="@data[key].property"` | Yes (cloudcannon.config.yml) |
| Component (.astro/.jsx) | Props/imports | Varies by content type | Varies by content type | Yes (registration script) |

### Editable Region Types

| Type | Use Case | Container Attribute | Property Attribute | Special Requirements |
|------|----------|--------------------|--------------------|---------------------|
| `text` | Plain text editing | `data-editable="text"` | `data-prop="field"` | String values only |
| `image` | Image upload/editing | `data-editable="image"` | `data-prop-src="field"` | Requires `<img>` element |
| `source` | Rich text/HTML | `data-editable="source"` | `data-path` + `data-key` | For HTML content only |
| `array` | Add/remove/reorder | `data-editable="array"` | `data-prop="field"` | Requires `array-item` children |
| `array-item` | Individual array items | `data-editable="array-item"` | N/A | Must be inside `array` |

## Implementation Patterns

### Pattern 1: Content File Integration

**Use Case:** Markdown files with YAML frontmatter  
**File Types:** `.md` files in `src/content/` or `src/pages/`

```astro
---
// Layout component
const { title, image, content } = Astro.props;
---

<article>
  <h1 data-editable="text" data-prop="title">{title}</h1>
  <img data-editable="image" data-prop-src="image" src={image} alt="" />
  <div data-editable="source" data-prop="@content">
    <slot />
  </div>
</article>
```

**Requirements:**

- Use simple `data-prop="fieldName"` syntax
- No CloudCannon config required
- Use `@content` for markdown body

### Pattern 2: Data File Integration

**Use Case:** Components that import JSON/YAML/TOML data files  
**File Types:** `.json`, `.yml`, `.yaml`, `.toml` in `/data/` directory

```astro
---
import footer from "../../../data/footer.json";
---

<footer>
  <p>
    <editable-text data-prop="@data[footer].copyright">{footer.copyright}</editable-text>
  </p>
  <ul data-editable="array" data-prop="@data[footer].links">
    {footer.links.map((link) => (
      <li data-editable="array-item">
        <editable-text data-prop="text">{link.text}</editable-text>
      </li>
    ))}
  </ul>
</footer>
```

**Requirements:**

- CloudCannon config: `data_config: { footer: { path: "data/footer.json" } }`
- Use `@data[key].property` syntax for root properties
- Use simple property names inside array items

### Pattern 3: Component Registration

**Use Case:** React/Astro components for visual editing  
**File Types:** `.astro`, `.jsx`, `.tsx` components

```typescript
// src/scripts/register-components.ts
import { registerReactComponent } from "@cloudcannon/editable-regions/react";
import Button from "../components/Button.jsx";

registerReactComponent("shared/Button", Button);
export {};
```

**Requirements:**
- Lazy load in layout: `if (window.inEditorMode) import("../scripts/register-components.ts")`
- Components must include editable regions
- Use kebab-case naming convention

## Validation Rules

### Rule 1: Data Type Validation

**Rule:** Text/source editable regions require string values  
**Validation:** `typeof value === 'string'`  
**Common Error:** `number: 150` should be `number: "150"`

### Rule 2: Array Structure Validation

**Rule:** Arrays require container + item pattern  
**Validation:**
- Container: `data-editable="array" data-prop="arrayName"`
- Items: `data-editable="array-item"` (no data-prop)
- Each mapped element must have `array-item`

### Rule 3: Data File Configuration

**Rule:** Data files must be registered in CloudCannon config  
**Validation:**
- File exists at specified path
- Key in config matches `@data[key]` usage
- Path uses forward slashes: `data/file.json`

### Rule 4: Property Syntax Validation

**Rule:** Property syntax depends on file type  
**Validation:**
- Content files: `data-prop="property"`
- Data files: `data-prop="@data[key].property"`
- Array items: `data-prop="property"` (simple names)

## Error Dictionary

### E001: Text Region Type Error
**Message:** "Text editable regions expect to receive a value of type 'string'"  
**Cause:** Non-string value in text/source region  
**Solution:** Convert data to string: `number: "150"`

### E002: Missing Data Configuration
**Message:** "Unable to locate data"  
**Cause:** Data file not registered in cloudcannon.config.yml  
**Solution:** Add `data_config: { key: { path: "data/file.json" } }`

### E003: Array Structure Error
**Message:** Array editing not working  
**Cause:** Missing `data-editable="array-item"` on mapped elements  
**Solution:** Add `data-editable="array-item"` to each `.map()` result

### E004: Component Registration Error
**Message:** Components not appearing in editor  
**Cause:** Component not registered or registration script not loaded  
**Solution:** Verify registration script and lazy loading implementation

## Setup Guide

### Step 1: Install Package

```bash
npm install @cloudcannon/editable-regions
```

### Step 2: Configure TypeScript

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window { inEditorMode?: boolean; }
  namespace JSX {
    interface IntrinsicElements {
      'editable-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'data-prop'?: string; };
      'editable-image': React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { 'data-prop-src'?: string; };
      'editable-source': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'data-prop'?: string; 'data-path'?: string; 'data-key'?: string; };
    }
  }
}
export {};
```

### Step 3: Create Registration Script

Create `src/scripts/register-components.ts`:

```typescript
import { registerReactComponent } from "@cloudcannon/editable-regions/react";
import Button from "../components/Button.jsx";

registerReactComponent("shared/Button", Button);
export {};
```

### Step 4: Add Lazy Loading

Add to your main layout (`src/layouts/Layout.astro`):

```astro
<script>
  if (window.inEditorMode) {
    import("../scripts/register-components.ts");
  }
</script>
```

### Step 5: Configure Data Files (if needed)

Add to `cloudcannon.config.yml`:

```yaml
data_config:
  footer:
    path: data/footer.json
```

## Component Types

### Astro Components

- Use `registerAstroComponent(name, component)`
- Import path: `@cloudcannon/editable-regions/astro`

### React/JSX Components

- Use `registerReactComponent(name, component)`
- Import path: `@cloudcannon/editable-regions/react`
- Components must include CloudCannon editable regions (see examples below)

#### Making React Components Editable

When registering React components, ensure they include proper CloudCannon editable regions:

**Example TypeScript React Component with Editable Regions:**

```tsx
import { useEffect, useRef, useState } from "react";

interface ButtonProps {
  text: string;
  url?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  text,
  url = "#",
  className = "",
  style = {},
}) => {
  return (
    <a href={url} className={className} style={style}>
      <editable-text data-prop="text">{text}</editable-text>
    </a>
  );
};

export default Button;
```

**Example: Numeric Component without Editable Regions:**

For components that process numeric values (like animations), editable regions may not be appropriate:

```tsx
import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  numberValue: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  numberValue,
  className = "",
  style = {},
  duration = 1500,
}) => {
  const [displayNumber, setDisplayNumber] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // ... animation logic ...

  return (
    <span ref={elementRef} className={className} style={style}>
      {displayNumber}  {/* Direct display - no editable region */}
    </span>
  );
};

export default AnimatedNumber;
```

**JSX Alternative (JavaScript Projects):**

```jsx
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ number, className = "", style = {}, duration = 1500 }) => {
  // ... component logic ...

  return (
    <span ref={elementRef} className={className} style={style}>
      <editable-text data-prop="number">
        {formatNumber(displayNumber)}
      </editable-text>
    </span>
  );
};

export default AnimatedNumber;
```

**Registration:**

```typescript
// TypeScript
import AnimatedNumber from "../components/shared/AnimatedNumber.tsx";
registerReactComponent("shared/AnimatedNumber", AnimatedNumber);

// JavaScript
import AnimatedNumber from "../components/shared/AnimatedNumber.jsx";
registerReactComponent("shared/AnimatedNumber", AnimatedNumber);
```

**Usage in Array Context:**

When using editable React components within arrays, ensure proper array structure:

```astro
<div data-editable="array" data-prop="items">
  {items && items.map((item, i) => (
    <div data-editable="array-item">
      <AnimatedNumber
        number={item.number}
        className="text-5xl font-bold"
        client:load
      />
    </div>
  ))}
</div>
```

## Component Registration

Once components are registered, define editable areas using HTML attributes or web components. CloudCannon supports five types of editable regions:

### BookShop Migration

**Important:** When updating a component for CloudCannon visual editing that has an existing BookShop configuration file (`.bookshop.yml`), **remove the BookShop file** to avoid conflicts.

**Migration process:**

1. Convert component to use CloudCannon editable regions
2. Register component in registration script
3. **Delete the corresponding `.bookshop.yml` file**
4. Test visual editing functionality

**Example:**

```bash
# If converting src/components/about/team/team.jsx
# Delete the associated BookShop file:
rm src/components/about/team/team.bookshop.yml
```

**Why remove BookShop files:**

- Prevents configuration conflicts between BookShop and CloudCannon
- Avoids duplicate component definitions in the CMS
- Ensures CloudCannon's editable regions take precedence
- Simplifies the component architecture

### Editable Regions

### Region Types

1. **Text** — Edit text values with plain text or rich text formatting
2. **Image** — Upload/manage images with metadata (title, alt text)
3. **Source** — Edit rich text stored in HTML
4. **Array** — Add, remove, and reorder array values
5. **Component** — Edit registered Astro or React components

### ⚠️ CRITICAL: Data Type Requirements

**Text and Source editable regions require string values in your data.** Using number, boolean, or other data types will cause CloudCannon editor errors.

**❌ Common Error:**

```yaml
# Data with number value (causes error)
counter:
  number: 150  # ❌ Number type causes: "Text editable regions expect to receive a value of type 'string' but instead received a value of type 'number'"
  text: "Projects Completed"
```

```jsx
// Component that will fail in CloudCannon
<editable-text data-prop="number">{number}</editable-text>
// Error: Failed to render text editable region
```

**✅ Correct Solutions:**

Solution 1: String Data (Recommended)

```yaml
# Data with string value
counter:
  number: "150"  # ✅ String type works perfectly
  text: "Projects Completed"
```

Solution 2: Remove Editable Regions for Numbers (Current Implementation)

For components that require numeric processing (animations, calculations), editable regions may not be suitable. These components can accept numeric props but display the processed values directly without editor integration:

```tsx
// AnimatedNumber component - numbers handled without editable regions
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ numberValue }) => {
  // ... animation logic ...
  
  return (
    <span ref={elementRef} className={className} style={style}>
      {displayNumber}  {/* Direct display - no editable region */}
    </span>
  );
};
```

**Note:** This approach removes visual editing capability for the number value but ensures proper component functionality. The number value would need to be edited in the data files or through CloudCannon's data editing interface rather than inline visual editing. This will be fixed in the future with better support for dynamic components.

Solution 3: Conditional Rendering for Dynamic Components

```tsx
// Component that handles both editor and live modes
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ number }) => {
  const isInEditor = typeof window !== "undefined" && window.inEditorMode;

  return (
    <span>
      {isInEditor ? (
        // Editor mode: show editable string value
        <editable-text data-prop="number">{number.toString()}</editable-text>
      ) : (
        // Live mode: show processed/animated value
        formatNumber(animatedValue)
      )}
    </span>
  );
};
```

Solution 4: CloudCannon Configuration

```yaml
# cloudcannon.config.yml
_inputs:
  number:
    type: text
    comment: Enter the number to display
```

### Implementation Methods

**HTML Attributes:**

```html
<p data-editable="text">Editable text content</p>
<img data-editable="image" src="..." alt="..." />
<div data-editable="source">Rich text content</div>
```

**Web Components:**

```html
<editable-text>Editable text content</editable-text>
<editable-image src="..." alt="..." />
<editable-source>Rich text content</editable-source>
```

### Array Implementation

#### ⚠️ CRITICAL: Proper Array Implementation

Arrays are the most complex editable region type and require specific HTML attribute patterns. **Do NOT use `<editable-array>` or `<editable-array-item>` web components** - these do not exist in CloudCannon's implementation.

**✅ Correct Array Implementation:**

```astro
<!-- Container with data-editable="array" -->
<div data-editable="array" data-prop="items">
  {items && items.map((item, i) => (
    //Each mapped item needs data-editable="array-item"
    <div data-editable="array-item">
      <h3>
        <editable-text data-prop="title">{item.title}</editable-text>
      </h3>
      <p>
        <editable-text data-prop="description">{item.description}</editable-text>
      </p>
    </div>
  ))}
</div>
```

**❌ Incorrect Array Implementation:**

```astro
<!-- These web components DO NOT EXIST -->
<editable-array data-prop="items">
  {items && items.map((item, i) => (
    <editable-array-item>
    // Content
    </editable-array-item>
  ))}
</editable-array>
```

**Array Implementation Rules:**

1. **Container Element:** Use `data-editable="array"` on the container (div, ul, etc.)
2. **Array Property:** Add `data-prop="array_name"` to reference the data property
3. **Mapped Items:** Each `.map()` result needs `data-editable="array-item"`
4. **Nested Elements:** Use standard editable regions inside array items
5. **HTML Elements:** Use proper HTML elements (div, li, etc.), not custom web components

**Real-World Examples:**

```astro
<!-- Team Members Array -->
<div class="row" data-editable="array" data-prop="team_members">
  {team_members && team_members.map((member, i) => (
    <div class="col-lg-3 col-md-6" data-editable="array-item">
      <div class="team-member">
        <Image
          data-editable="image"
          data-prop-src="image"
          data-prop-alt="image_alt"
          src={member.image}
          alt={member.image_alt}
        />
        <h3>
          <editable-text data-prop="name">{member.name}</editable-text>
        </h3>
        <p>
          <editable-text data-prop="designation">{member.designation}</editable-text>
        </p>
      </div>
    </div>
  ))}
</div>

<!-- Social Links Array (using ul/li) -->
<ul class="list-unstyled" data-editable="array" data-prop="social">
  {social && social.map((link, i) => (
    <li data-editable="array-item">
      <a href={link.url} target="_blank" rel="noopener">
        <editable-text data-prop="name">{link.name}</editable-text>
        <i class={link.icon}></i>
      </a>
    </li>
  ))}
</ul>

<!-- Testimonials Array -->
<div class="row" data-editable="array" data-prop="slider">
  {slider && slider.map((slide, i) => (
    <div class="col-lg-4 col-md-6 mb-5" data-editable="array-item">
      <div class="testimonial-item">
        <Image
          data-editable="image"
          data-prop-src="image"
          data-prop-alt="image_alt"
          src={slide.image}
          alt={slide.image_alt}
        />
        <h3>
          <editable-text data-prop="author">{slide.author}</editable-text>
        </h3>
        <p>
          <editable-text data-prop="message">{slide.message}</editable-text>
        </p>
      </div>
    </div>
  ))}
</div>
```

**Nested Arrays:**

For arrays within arrays (like footer sections with links):

```astro
<!-- Outer array: sections -->
<div data-editable="array" data-prop="sections">
  {sections && sections.map((section, i) => (
    <div class="col-6 col-md-3 col-lg-2 order-1" data-editable="array-item">
      <h5>
        <editable-text data-prop="title">{section.title}</editable-text>
      </h5>
      <!-- Inner array: links within each section -->
      <ul class="list-unstyled" data-editable="array" data-prop="links">
        {section.links && section.links.map((link, j) => (
          <li data-editable="array-item">
            <a href={link.url}>
              <editable-text data-prop="text">{link.text}</editable-text>
            </a>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

### Best Practices for Editable Regions

- **Gradual Migration:** Start with key fields, expand as needed
- **No Restructuring:** Works with existing layouts and data formats
- **Seamless Integration:** Minimal disruption to current file structure
- **Progressive Enhancement:** Add regions incrementally to content files

## Data File Configuration

### ⚠️ CRITICAL: Components That Edit Data Files

When a component imports data from data files (JSON, YAML, TOML like `footer.json`, `navigation.yml`, `config.toml`, etc.) and you want that data to be editable in CloudCannon, you need a **completely different approach** than content files.

**Key Requirements:**

1. **CloudCannon Config:** Data file must be registered in `cloudcannon.config.yml`
2. **Special Syntax:** Use `@data[key]` syntax for `data-prop` attributes
3. **No Source Wrapper:** Don't use `data-editable="source"` on the container

### CloudCannon Config Setup

**First, register your data file in `cloudcannon.config.yml`:**

```yaml
data_config:
  footer:
    path: data/footer.json
  navigation:
    path: data/navigation.yml
  company:
    path: data/company.toml
  site:
    path: data/site.yaml
```

The key (`footer`, `navigation`, etc.) is what you'll reference in your `data-prop` attributes.

### Data File Editing Syntax

**❌ Wrong - This won't work for data files:**

```astro
---
import footer from "../../../data/footer.json";
// or import navigation from "../../../data/navigation.yml";  
// or import company from "../../../data/company.toml";
---

<footer>
  <!-- This syntax is for content files, not data files -->
  <editable-text data-prop="copyright">{footer.copyright}</editable-text>
</footer>
```

**✅ Correct - Use @data[key] syntax:**

```astro
---
import footer from "../../../data/footer.json";
// or import navigation from "../../../data/navigation.yml";
// or import company from "../../../data/company.toml";
---

<footer>
  <!-- Use @data[key] syntax for any data file type -->
  <editable-text data-prop="@data[footer].copyright">{footer.copyright}</editable-text>
  <!-- Works the same for YAML: @data[navigation].title -->
  <!-- Works the same for TOML: @data[company].name -->
</footer>
```

### Complete Data File Example

**Data files (JSON/YAML/TOML supported):**

```json
// data/footer.json
{
  "logo": "/images/footer-logo.svg",
  "copyright": "MyCompany. All rights reserved.",
  "social": [
    { "link": "https://facebook.com", "icon": "ph-facebook-logo", "icon_alt": "facebook" }
  ]
}
```

**CloudCannon Config:**

```yaml
data_config:
  footer:
    path: data/footer.json    # Also supports .yml, .yaml, .toml
```

**Component with correct data file editing:**

```astro
---
import footer from "../../../data/footer.json";
---

<footer>
  <!-- Logo image -->
  <img 
    data-editable="image" 
    data-prop-src="@data[footer].logo" 
    src={footer.logo} 
    alt="logo" 
  />
  
  <!-- Copyright text -->
  <p>
    © Copyright {new Date().getFullYear()} 
    <editable-text data-prop="@data[footer].copyright">{footer.copyright}</editable-text>
  </p>
  
  <!-- Social links array -->
  <ul data-editable="array" data-prop="@data[footer].social">
    {footer.social.map((link) => (
      <li data-editable="array-item">
        <a href={link.link}>
          <i class={link.icon}>
            <span class="sr-only">
              <editable-text data-prop="icon_alt">{link.icon_alt}</editable-text>
            </span>
          </i>
        </a>
      </li>
    ))}
  </ul>
</footer>
```

### Data File Syntax Rules

**Syntax rules:**

- **Root properties:** `data-prop="@data[key].property"` (works for JSON/YAML/TOML)
- **Array containers:** `data-editable="array" data-prop="@data[key].array"`
- **Array items:** `data-prop="property"` (simple names inside arrays)
- **Nested objects:** `data-prop="@data[key].section.property"`

### Data vs Content Files

**Use data file configuration for:**

- ✅ Site-wide components (header, footer, navigation)
- ✅ Global settings (company info, social links)
- ✅ Repeated data structures (team members, testimonials)
- ✅ Configuration data (feature flags, API settings)
- ✅ Multi-format data (JSON for complex structures, YAML for config, TOML for simple settings)

**Use content file configuration for:**

- ✅ Page content (blog posts, pages)
- ✅ Markdown content with front matter
- ✅ SEO metadata per page
- ✅ Page-specific settings

### Troubleshooting Data Files

**Symptoms of incorrect data file setup:**

- Editable regions don't appear in CloudCannon
- Changes don't save or revert on refresh
- Console errors about missing data references
- CloudCannon shows "Unable to locate data" errors

**Quick diagnostic checklist:**

- [ ] Data file is registered in `cloudcannon.config.yml` under `data_config`
- [ ] Using `@data[key]` syntax for root-level properties
- [ ] Using simple property names inside array items
- [ ] Data file key in config matches the key used in `@data[key]`
- [ ] Data file path in config is correct and file exists (supports .json, .yml, .yaml, .toml)

## Content File Configuration

Content files (e.g., Markdown with YAML front matter) are ideal starting points for visual editing. They typically contain structured data and content that populate layout templates.

### Front Matter Text Fields

**Simple text values:**

```astro
<!-- Layout file -->
<h1 data-editable="text" data-prop="title">{title}</h1>
```

**Text within other content:**

```astro
<!-- When text is mixed with static content -->
<p>By: <editable-text data-prop="author">{author}</editable-text></p>
```

### Markdown Content

**Main content area:**

```astro
<!-- Wrap slot content for Markdown editing -->
<editable-text data-prop="@content">
  <slot />
</editable-text>
```

**Note:** Use `@content` as the special value for Markdown body content.

### Front Matter Images

**Complete image configuration:**

```astro
<img
  data-editable="image"
  data-prop-src="heroImage"
  data-prop-alt="heroImageAlt"
  data-prop-title="heroImageTitle"
  src={heroImage}
  alt={heroImageAlt}
  title={heroImageTitle}
/>
```

### Data Property Attributes

- **`data-prop`** — Single value reference (e.g., `data-prop="title"`)
- **`data-prop-*`** — Key-value pairs for complex data (e.g., `data-prop-src="heroImage"`)
- **`@content`** — Special value for Markdown body content

### Common Content File Errors

- Missing `data-prop` or `data-prop-*` attributes
- **❌ CRITICAL: Invalid data types** — Text/Source editable regions require string values. Using `number: 150` instead of `number: "150"` causes "Failed to render text editable region" errors
- Missing `<img>` elements in image regions
- Nested editable regions (avoid nesting Image inside Text/Source)
- Using `<editable-array>` web components instead of `data-editable="array"` attributes
- Forgetting to remove `.bookshop.yml` files after CloudCannon conversion

## HTML-like File Configuration

Standalone pages (Home, About, etc.) vary in structure. This section applies only to pages that contain **direct HTML content** for editing, not component orchestration files.

### When to Use Source Editable Regions

**✅ Use for pages with direct HTML content:**

```astro
<!-- Pages with inline HTML text/content -->
<main>
  <h1>Welcome to Our Site</h1>
  <p>Lorem ipsum content that editors need to change...</p>
  <ul>
    <li>Direct HTML list items</li>
  </ul>
</main>
```

**❌ Don't use for component orchestration pages:**

```astro
---
import Hero from "../components/Hero.astro";
import Features from "../components/Features.astro";
const posts = await getCollection("blog");
---

<!-- Pages that only coordinate components and data -->
<Hero />
<Features />
{posts.map((post) => <BlogCard {post} />)}
```

### Source Editable Regions

**For pages with direct HTML content:**

```astro
<main data-editable="source" data-path="/src/pages/index.astro" data-key="main">
  <!-- Your direct HTML content here -->
</main>
```

**Required attributes:**

- **`data-editable="source"`** — Defines region as rich text HTML
- **`data-path`** — File path where content is stored (e.g., `/src/pages/index.astro`)
- **`data-key`** — Unique identifier for the region (e.g., `main`, `hero`, `sidebar`)

### Alternative Approaches for Component-Based Pages

**For pages that primarily use components:**

1. **Register components** (see Component Registration section)
2. **Add editable regions to the components themselves**
3. **Use front matter** for page-level configuration instead of Source regions

### Rich Text Types

Control formatting options with `data-type` attribute:

- **`data-type="span"`** — Plain text only (no formatting)
- **`data-type="text"`** — Paragraph-level formatting (bold, italic, links)
- **`data-type="block"`** — Full formatting (lists, blockquotes, images)

**Example:**

```astro
<h1
  data-editable="source"
  data-path="/src/pages/about.astro"
  data-key="title"
  data-type="span"
>
  Page Title
</h1>
```

### Default Behavior

CloudCannon automatically determines rich text level based on:

- **Content vs Front Matter:** Source regions default to rich text
- **HTML Element:** `<h1>` gets text-level, `<div>` gets block-level
- **Input Configuration:** Respects CloudCannon config settings

### Common HTML File Errors

- Missing `data-path` or `data-key` attributes
- Invalid file path in `data-path`
- Duplicate `data-key` values in same file
- Unsupported `data-type` values
- Nesting Text/Image regions inside Source regions

## Best Practices

### Performance

- Always use conditional loading with `window.inEditorMode`
- Implement lazy loading to avoid unnecessary bundle size
- Include proper error handling for failed imports

### TypeScript

- Extend Window interface for CloudCannon globals
- Use proper module exports (`export {}`) for type recognition
- Maintain type safety across all components

### Component Naming

- Use kebab-case naming for component identifiers
- Match component names with CloudCannon configuration
- Comment out unused registrations to keep bundle lean

## Common Patterns

### Registration Template

```javascript
// 1. Import registration functions
import { registerAstroComponent, registerReactComponent } from '@cloudcannon/editable-regions/[framework]';

// 2. Import components
import Component from '../path/to/Component.[ext]';

// 3. Register with descriptive names
register[Framework]Component('component-name', Component);

// 4. Export for module recognition
export {};
```

### Error Handling

```javascript
if (window.inEditorMode) {
  import("../scripts/register-components.js")
    .then(() => console.info("CloudCannon ready"))
    .catch((error) => console.warn("CloudCannon registration failed:", error));
}
```

## Validation Checklist

### Setup Validation

- [ ] `@cloudcannon/editable-regions` installed
- [ ] `src/env.d.ts` configured with CloudCannon types
- [ ] Registration script created at `src/scripts/register-components.ts`
- [ ] Lazy loading added to main layout
- [ ] Data files registered in `cloudcannon.config.yml` (if using data files)

### Implementation Validation

- [ ] Content files use `data-prop="property"` syntax
- [ ] Data files use `@data[key].property` syntax
- [ ] Array containers have `data-editable="array" data-prop="arrayName"`
- [ ] Array items have `data-editable="array-item"`
- [ ] Text regions use string values only
- [ ] Components registered with correct names

### Testing Validation

- [ ] Visual editing works in CloudCannon editor
- [ ] Data changes persist correctly
- [ ] Array add/remove/reorder functions work
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser

## Troubleshooting

### Common Issues

1. **TypeScript errors on `window.inEditorMode`**
   - Ensure Window interface is properly extended in `env.d.ts`
   - Add `export {}` to make file a proper module

2. **Module resolution errors**
   - Use correct import paths for CloudCannon packages
   - Ensure registration script exports properly
   - For TypeScript: verify the import path uses `.ts` extension in dynamic imports

3. **Components not appearing in editor**
   - Verify component registration matches CloudCannon config
   - Check console for registration success/failure messages
   - Ensure React components include proper editable regions (`<editable-text>`, etc.)

4. **TypeScript compilation errors**
   - Verify TypeScript types are properly defined in the registration script
   - Check that component imports resolve correctly
   - Ensure proper type annotations for the `forEach` method in component registration

5. **React component editing not working**
   - Ensure React components have `<editable-text>`, `<editable-image>`, or other editable regions
   - Verify `data-prop` attributes are correctly set
   - Check that components are registered with `registerReactComponent`
   - For TypeScript: ensure editable element types are declared in `env.d.ts`

6. **TypeScript errors with editable elements**
   - Add CloudCannon editable element declarations to `env.d.ts`
   - Ensure proper namespace declaration for `JSX.IntrinsicElements`
   - Verify React types are properly imported in TypeScript components
   - Use `.tsx` extensions for TypeScript React components

7. **"Failed to render text editable region" errors**
   - **Root cause:** Text editable regions require string values, not numbers/booleans
   - **Error message:** "Text editable regions expect to receive a value of type 'string' but instead received a value of type 'number'"
   - **Solution 1:** Change data to use string values: `number: "150"` instead of `number: 150`
   - **Solution 2:** Remove editable regions for complex numeric components (like AnimatedNumber)
   - **Solution 3:** Use conditional rendering in components to handle editor vs live modes
   - **Solution 4:** Configure CloudCannon inputs to treat numeric fields as text

8. **Components requiring numeric processing**
   - **Issue:** Components like AnimatedNumber that need to perform calculations or animations on numeric values
   - **Current limitation:** Cannot handle editable regions for number values due to string type requirements
   - **Future feature:** Visual editing for numbers is planned but not currently supported
   - **Workaround:** Edit numeric values through CloudCannon's data editor or configuration files rather than inline visual editing

9. **Data file editing not working**
   - **Issue:** Component imports data from files (JSON/YAML/TOML) but editable regions don't appear or changes don't save
   - **Root cause 1:** Data file not registered in `cloudcannon.config.yml`
   - **Root cause 2:** Incorrect `data-prop` syntax (using content file syntax instead of data file syntax)
   - **Solution 1:** Add to config: `data_config: { footer: { path: "data/footer.json" } }` (supports .json, .yml, .yaml, .toml)
   - **Solution 2:** Use `@data[key]` syntax: `data-prop="@data[footer].copyright"`
   - **Symptoms:** "Unable to locate data" errors, regions don't appear, changes revert on refresh

10. **Array editing not working**

- **Most common issue:** Using `<editable-array>` web components instead of HTML attributes
- **Solution:** Use `data-editable="array"` on container and `data-editable="array-item"` on mapped items
- **Check for:** Missing `data-prop` attribute on array container
- **Verify:** Each `.map()` result has `data-editable="array-item"`

### Array Implementation Debugging

**Symptoms of incorrect array implementation:**

- Array items cannot be added/removed in CloudCannon editor
- Drag-and-drop reordering doesn't work
- Console errors about unknown web components
- Array appears as regular content instead of editable list

**Common mistakes:**

```astro
<!-- ❌ Wrong: Non-existent web components -->
<editable-array data-prop="items">
  <editable-array-item>content</editable-array-item>
</editable-array>

<!-- ❌ Wrong: Missing array-item attribute -->
<div data-editable="array" data-prop="items">
  {items.map(item => (
    <div>content</div> <!-- Missing data-editable="array-item" -->
  ))}
</div>

<!-- ❌ Wrong: Missing data-prop -->
<div data-editable="array"> <!-- Missing data-prop="items" -->
  {items.map(item => (
    <div data-editable="array-item">content</div>
  ))}
</div>
```

**Quick fix checklist:**

- [ ] Container has `data-editable="array"`
- [ ] Container has `data-prop="property_name"`
- [ ] Each mapped item has `data-editable="array-item"`
- [ ] Using proper HTML elements (div, li, etc.)
- [ ] No `<editable-array>` web components used

## File Structure

**Flexible structure - adapt to your project:**

```text
src/
├── env.d.ts                           # TypeScript globals
├── scripts/                           # Component registration
│   └── register-components.ts         # (or .js - your preferred location)
├── layouts/
│   └── Layout.astro                   # Main layout with lazy loading
└── components/
    └── [your-components]/             # Components to register
```

**Alternative structures:**

- Registration script: `src/lib/`, `src/utils/`, or `src/cloudcannon/`
- **TypeScript projects (recommended):** Use `.ts` extensions for better type safety
- **JavaScript projects:** Use `.js` extensions if TypeScript is not desired
- Multiple layouts: Add the integration script to each layout that needs editing

## Adaptation Guidelines

### For Different Project Structures

- **Monorepo:** Adjust import paths for shared components
- **Custom directories:** Update all import paths accordingly
- **TypeScript projects (recommended):** Use `.ts` extensions, proper typing, and structured component registrations
- **JavaScript projects:** Use `.js` extensions with basic registration patterns
- **Multiple frameworks:** Register components per framework as needed

### Framework Support

- **Astro Components:** Use `registerAstroComponent`
- **React Components:** Use `registerReactComponent`

### Deployment Considerations

- Ensure the registration script is included in your build output
- Verify that conditional loading works in your hosting environment
- Test that CloudCannon can access registered components

---

_This specification provides a flexible foundation for CloudCannon integration. Adapt paths, naming, and structure to match your project's conventions while maintaining the core lazy-loading and type-safety principles._
