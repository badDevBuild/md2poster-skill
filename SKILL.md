---
name: markdown-to-image
description: Converts a markdown string or file into a high-quality PNG image using markdown-to-poster and Puppeteer.
---

# Markdown to Image Skill

This skill allows you to convert Markdown content into a visually appealing image (poster style). It spins up a temporary local Vite server to render the content with React and uses Puppeteer to capture a screenshot.

## Prerequisites

- Node.js (v18+)
- Dependencies installed within the skill directory:
  ```bash
  cd <skill-root>
  npm install
  ```

## Usage

You can use this skill by running the `render.js` script.

### Command

```bash
node <skill-root>/render.js <input_markdown_file> [output_image_file] [theme] [size] [template]
```

- `<input_markdown_file>`: Absolute path to the markdown file.
- `[output_image_file]`: (Optional) Defaults to `~/Downloads/markout/<filename>.png`.
- `[theme]`: (Optional) Theme name. See selection guide below.
- `[size]`: (Optional) `pc` (wide) or `mobile` (default, narrow).
- `[template]`: (Optional) `basic` (default) or others if implemented.

### Theme Selection Guide

When invoking this skill, **automatically select suitable themes** based on the content's tone and topic if the user hasn't specified one.

| Theme Name                      | Style Keywords                                   | Best For                                                   |
| :------------------------------ | :----------------------------------------------- | :--------------------------------------------------------- |
| **`notion`** / `notion-light`   | Minimalist, Clean, Light, Sans-serif             | Documentation, Notes, Daily Reports, General Knowledge     |
| **`lapis`**                     | Blue/White, Academic, Elegant, Serif/Sans mix    | Research Papers, Essays, Deep Dives, Technical Analysis    |
| **`bronya`**                    | Light Grey, IDEA Code style, Warm accents        | Devlogs, Tutorials, Coding heavy articles with a softer UI |
| **`neon`** / `lcars`            | Dark, Star Trek, Sci-Fi, High Contrast, Black BG | Tech News, Sci-Fi Reviews, "Geek" content, CLI logs        |
| **`cyberpunk`**                 | Dark, Glitch, Neon Blue/Pink, Retro-future       | Gaming, Cyber Security, Edgy Tech, Crypto                  |
| **`torillic`**                  | Parchment, Serif, Classic, Multi-column          | History, Literature, Poetry, Storytelling, Fantasy         |
| **`phycat-prussian`** (Default) | Prussian Blue, Professional, Clean               | Corporate Reports, Official Announcements, Business        |

### Examples

**1. Daily Report (Clean/Professional):**
```bash
node render.js input.md output.png notion mobile
```

**2. Coding Tutorial (Dev focused):**
```bash
node render.js input.md output.png bronya pc
```

**3. Sci-Fi Story:**
```bash
node render.js input.md output.png neon mobile
```

## Troubleshooting

- **Puppeteer Instablity**: Requires system Chromium libraries.
- **Port Conflict**: Automatically detects Vite port.
