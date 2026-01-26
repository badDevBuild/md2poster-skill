import { useEffect, useState } from 'react'
import { Md2PosterContent } from 'markdown-to-poster'
import 'markdown-to-poster/dist/style.css'

interface Content {
    markdown: string;
    theme?: string;
    size?: string;
    template?: string;
}

function App() {
    const [content, setContent] = useState<Content | null>(null)

    useEffect(() => {
        fetch('/content.json')
            .then(res => res.json())
            .then(data => setContent(data))
            .catch(err => console.error("Failed to load content", err))
    }, [])

    if (!content) return <div className="p-10">Loading...</div>

    const isCyberpunk = content.theme === 'cyberpunk';
    const isTorillic = content.theme === 'torillic';
    const isPhycatPrussian = content.theme === 'phycat-prussian';
    const isLcars = content.theme === 'lcars' || content.theme === 'neon'; // Map 'neon' to lcars
    const isLapis = content.theme === 'lapis';
    const isNotion = content.theme === 'notion' || content.theme === 'notion-light';
    const isBronya = content.theme === 'bronya';

    const themeColors: Record<string, { primary: string; bg: string }> = {
        cyberpunk: { primary: '#00f5ff', bg: '#0a0a0f' },
        torillic: { primary: '#822000', bg: '#fcf5e5' },
        'phycat-prussian': { primary: '#1D4E89', bg: '#ffffff' },
        lcars: { primary: '#ff9900', bg: '#000000' },
        lapis: { primary: '#4870ac', bg: '#ffffff' },
        notion: { primary: '#37352f', bg: '#ffffff' },
        bronya: { primary: '#0079bb', bg: '#f3f2ee' },
    };

    const activeTheme = themeColors[content.theme || 'phycat-prussian'] || themeColors['phycat-prussian'];

    const premiumCleanCSS = `
        /* Premium Font Stack */
        body {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        /* Theming targets */
        .prose h1, .prose h2, .prose h3, .prose h4 {
            color: ${activeTheme.primary} !important;
            font-weight: 800 !important;
            letter-spacing: -0.025em;
        }
        .prose strong {
            color: ${activeTheme.primary} !important;
        }
        .prose a {
            color: ${activeTheme.primary} !important;
            text-decoration: none !important;
            border-bottom: 2px solid ${activeTheme.primary}20; /* Faint underline */
        }
        .prose blockquote {
            border-left: 4px solid ${activeTheme.primary} !important;
            background-color: ${activeTheme.bg} !important;
            color: #374151 !important; /* Dark grey text */
            font-style: normal !important;
            padding: 1rem 1.5rem !important;
            border-radius: 0.5rem;
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .prose li::marker {
            color: ${activeTheme.primary} !important;
        }
        .prose code {
            color: ${activeTheme.primary} !important;
            background-color: ${activeTheme.bg} !important;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-weight: 600;
        }

        /* Force override any library background */
        .md2poster-container, .md2poster-container > div, .md2poster-content {
            background-color: white !important;
            background-image: none !important;
            box-shadow: none !important;
            border: none !important;
        }
        
        /* Ensure code blocks keep their background */
        .prose pre {
            background-color: #1e1e1e !important;
        }
    `;

    const cyberpunkCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;700&family=Fira+Code&display=swap');

        :root {
            --cyber-black: #0a0a0f;
            --cyber-dark: #161620;
            --cyber-darker: #0d0d15;
            --cyber-grid: #1a1a2e;
            --neon-pink: #ff006e;
            --neon-cyan: #00f5ff;
            --neon-purple: #b300ff;
            --neon-green: #39ff14;
            --neon-yellow: #ffed00;
            --neon-orange: #ff4500;
            --glow-cyan: rgba(0, 245, 255, 0.5);
            --glow-pink: rgba(255, 0, 110, 0.5);
            --glow-purple: rgba(179, 0, 255, 0.5);
            --glow-green: rgba(57, 255, 20, 0.5);
            --text-primary: #e0e0ff;
            --text-secondary: #a0a0c0;
        }

        body {
            background-color: var(--cyber-black) !important;
            color: var(--text-primary);
            font-family: 'Rajdhani', sans-serif;
        }

        /* Grid Background Pattern */
        body::before {
            content: '';
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image:
                linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: -1;
            pointer-events: none;
        }

        /* Glitch Border Removed */


        .prose {
             max-width: 92% !important; /* Retaining user preference for layout width in cyberpunk */
             color: var(--text-primary) !important;
        }

        .prose h1, .prose h2, .prose h3, .prose h4 {
            font-family: 'Orbitron', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 2.5em;
        }

        .prose h1 {
            color: var(--neon-cyan) !important;
            text-shadow: 0 0 20px var(--glow-cyan);
            border-bottom: 2px solid var(--neon-cyan);
            padding-bottom: 0.5rem;
        }
        .prose h1::before { content: '▸ '; color: var(--neon-pink); }

        .prose h2 {
            color: var(--neon-pink) !important;
            text-shadow: 0 0 15px var(--glow-pink);
        }
        .prose h2::before { content: '// '; color: var(--neon-purple); }

        .prose h3 {
            color: var(--neon-purple) !important;
            text-shadow: 0 0 15px var(--glow-purple);
            font-size: 1.5em;
            margin-top: 1.5em;
        }
        .prose h3::before { content: '> '; color: var(--neon-cyan); }

        .prose h4 {
            color: var(--neon-green) !important;
            text-shadow: 0 0 10px var(--glow-green);
            font-size: 1.25em;
            margin-top: 1.5em;
        }
        .prose h4::before { content: ':: '; color: var(--neon-yellow); }

        .prose h5 { color: var(--neon-yellow) !important; }
        .prose h6 { color: var(--neon-orange) !important; }

        .prose strong { color: var(--neon-pink) !important; text-shadow: 0 0 5px var(--glow-pink); }
        
        .prose a {
            color: var(--neon-cyan) !important;
            text-decoration: none !important;
            border-bottom: 1px solid var(--neon-cyan);
            transition: all 0.3s ease;
        }
        
        .prose blockquote {
            border-left: 4px solid var(--neon-purple) !important;
            background: rgba(179, 0, 255, 0.05) !important;
            color: var(--text-secondary) !important;
            box-shadow: -5px 0 10px rgba(179, 0, 255, 0.2);
            border-radius: 0;
        }

        .prose code {
            color: var(--neon-green) !important;
            background: #1a1a2e !important; /* dark grid */
            border: 1px solid var(--neon-green);
            box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
            border-radius: 4px;
            padding: 0.2rem 0.5rem;
            font-family: 'Fira Code', monospace;
        }
        
        .prose pre {
            background: #0d0d15 !important;
            border: 1px solid var(--neon-green);
            position: relative;
            padding-top: 2rem;
        }
        .prose pre::before {
            content: '[ CODE ]';
            position: absolute;
            top: 0; left: 0;
            background: var(--neon-green);
            color: black;
            font-size: 0.7rem;
            padding: 2px 8px;
            font-family: 'Orbitron', monospace;
        }

        /* Container Overrides */
        .md2poster-container, .md2poster-content {
            background-color: transparent !important;
        }
        
        /* List markers */
        .prose ul > li::marker { color: var(--neon-cyan) !important; }
        .prose ol > li::marker { color: var(--neon-pink) !important; }
    `;

    const torillicCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400;1,700&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        :root {
            --head: 'Crimson Text', serif;
            --body: 'Alegreya', serif;
            --mono: 'Source Code Pro', monospace;
            --offwhite: #fcf5e5;
            --green: #e0e5c1;
            --yellow: #c9ad6a;
            --red: #822000;
            --purple: #704cd9;
            --text-color: #2b2b2b;
        }

        body {
            font-family: var(--body);
            background-color: var(--offwhite);
            color: var(--text-color);
            background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png"); /* Simulated paper texture */
        }

        /* Column Layout for Torillic */
        .prose {
            max-width: none !important;
            column-count: 2;
            column-gap: 2rem;
            color: var(--text-color) !important;
        }

        .prose h1, .prose h2, .prose h3, .prose h4 {
            font-family: var(--head);
            font-weight: 700;
            font-variant: small-caps;
            color: var(--red) !important;
            break-after: avoid;
        }

        .prose h1 {
            font-size: 2.5rem;
            column-span: all;
            text-align: center;
            border-bottom: 2px solid var(--red);
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .prose h2 {
            font-size: 1.8rem;
            column-span: all; /* Optional: headings span columns */
            border-bottom: 1px solid var(--yellow);
            margin-top: 1.5rem;
        }

        .prose h3 { font-size: 1.5rem; }
        .prose h4 { 
            font-size: 1.2rem;
            border-bottom: 1px solid var(--yellow);
        }

        .prose p {
            text-align: justify;
            margin-bottom: 1rem;
        }

        .prose strong { color: var(--red) !important; }
        
        .prose a {
            color: var(--text-color) !important;
            text-decoration: underline;
            text-decoration-color: var(--yellow);
            text-decoration-thickness: 1px;
        }
        .prose a:hover {
            color: var(--purple) !important;
            text-decoration-color: var(--purple);
        }

        .prose blockquote {
            background-color: var(--green) !important;
            border-left: none !important;
            border-top: 2px solid var(--red);
            border-bottom: 2px solid var(--red);
            padding: 1rem !important;
            font-style: italic;
            border-radius: 0;
            margin: 1.5rem 0;
            break-inside: avoid;
        }

        .prose code {
            font-family: var(--mono);
            background-color: transparent !important;
            color: var(--red) !important;
        }

        .prose pre {
            background-color: var(--green) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--yellow);
            font-family: var(--mono);
            padding: 1rem;
            break-inside: avoid;
            box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
        }

        .prose ul, .prose ol {
            padding-left: 1.5rem;
        }
        .prose li::marker {
            color: var(--red) !important;
            font-weight: bold;
        }

        /* Container Overrides */
        .md2poster-container, .md2poster-content {
            background-color: transparent !important;
            box-shadow: none !important;
        }

        /* Image styling */
        .prose img {
            border: 5px solid var(--yellow);
            box-shadow: 3px 3px 5px rgba(0,0,0,0.2);
            margin: 1rem auto;
        }
    `;

    const phycatPrussianCSS = `
        @import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-web/style.css');
        @import url('https://fonts.googleapis.com/css2?family=Cascadia+Code&display=swap');

        :root {
            --h1-icon-shape: url("data:image/svg+xml;utf8,<svg fill='rgba(255, 176, 176, 0.5)' height='24' viewBox='0 0 32 32' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M4.8 29.714v0c-1.371 0-2.514-1.143-2.514-2.514v0c0-1.371 1.143-2.514 2.514-2.514v0c1.371 0 2.514 1.143 2.514 2.514v0c0.114 1.371-1.029 2.514-2.514 2.514z'/></svg>") no-repeat center;
            --h2-icon-shape: url("data:image/svg+xml;utf8,<svg fill='rgba(255, 176, 176, 0.5)' height='24' viewBox='0 0 32 32' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M11.429 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286z'/></svg>") no-repeat center;
            --h3-icon-shape: url("data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M4.571 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286z'/></svg>");
            --h4-icon-shape: url("data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M4.571 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 22.857c1.257 0 2.286-1.029 2.286-2.286s-1.029-2.286-2.286-2.286-2.286 1.029-2.286 2.286 1.029 2.286 2.286 2.286z'/></svg>");
            --h5-icon-shape: url("data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M4.571 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 22.857c1.257 0 2.286-1.029 2.286-2.286s-1.029-2.286-2.286-2.286-2.286 1.029-2.286 2.286 1.029 2.286 2.286 2.286zM4.571 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 11.429c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286z'/></svg>");
            --h6-icon-shape: url("data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><path d='M4.571 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM4.571 11.429c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 18.286c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 25.143c-1.257 0-2.286 1.029-2.286 2.286s1.029 2.286 2.286 2.286 2.286-1.029 2.286-2.286-1.029-2.286-2.286-2.286zM11.429 16c1.257 0 2.286-1.029 2.286-2.286s-1.029-2.286-2.286-2.286-2.286 1.029-2.286 2.286 1.029 2.286 2.286 2.286z'/></svg>");

            --bg-shape-cross: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0z' fill='none'/%3E%3Cpath d='M0 0L15 15M30 0L15 15M0 30L15 15M30 30L15 15' stroke='black' stroke-width='0.4'/%3E%3C/svg%3E");
            --bg-style: var(--bg-shape-cross);
            --head-title-color: #1D4E89;
            --head-title-h2-color: #fff;
            --head-title-h2-background: linear-gradient(to right, #6BA3CC, #1D4E89, #6BA3CC);
            --element-color: #1D4E89;
            --element-color-deep: #003153;
            --element-color-shallow: #6BA3CC;
            --element-color-so-shallow: #E1EDF5;
            --element-color-soo-shallow: #F0F6FA;
            --glass-bg-color: #b7d8ff15;
            --element-color-linecode: #0F3057;
            --element-color-linecode-background: #EBF5FA;
            --appui-color: #1D4E89;
            --appui-color-icon: #1D4E89;
            --appui-color-text: #003153; 
            --primary-color: #1D4E89;
        }

        body {
            font-family: "LXGW WenKai", "Microsoft YaHei", sans-serif;
            background-color: #fff !important;
        }

        /* Container Overrides to match #write */
        .md2poster-container {
             background-color: transparent !important;
             position: relative;
             z-index: 0;
        }

        /* Background Pattern on Prose Container */
        .md2poster-container::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: -1;
            background-color: var(--element-color);
            opacity: .12;
            -webkit-mask-image: var(--bg-style);
            mask-image: var(--bg-style);
            -webkit-mask-size: 20px 20px;
            mask-size: 20px 20px;
            -webkit-mask-repeat: repeat;
            mask-repeat: repeat;
            -webkit-mask-position: center;
            mask-position: center;
        }

        .prose {
            max-width: 950px !important;
            margin: 0 auto;
            color: #000 !important;
            letter-spacing: 1.1px;
            text-align: left;
            font-family: "LXGW WenKai", sans-serif !important;
        }

        .prose p {
            color: #333;
            margin: 10px 0;
            font-size: 1rem;
            word-spacing: 2px;
        }

        .prose h1 {
            text-align: center;
            font-size: 1.8rem;
            font-weight: 700;
            margin: 1em auto .8em;
            line-height: 1.4;
            color: #222 !important;
            border-bottom: none;
            position: relative;
            padding-bottom: 12px;
            width: fit-content;
        }
        .prose h1::after {
            content: '';
            position: absolute;
            bottom: 0; left: 50%;
            width: 40px; height: 4px;
            border-radius: 4px;
            background: var(--head-title-h2-background);
            background-size: 100% auto;
            transform: translateX(-50%);
        }

        .prose h2 {
            color: var(--head-title-h2-color) !important;
            font-size: 1.4rem;
            font-weight: 700;
            margin: 20px 0;
            padding: 5px 12px;
            border-radius: 8px;
            background: var(--head-title-h2-background);
            background-size: 200% auto;
            width: fit-content;
            box-shadow: 0 2px 5px rgba(61, 184, 211, .15);
        }

        .prose h3 {
            position: relative;
            width: fit-content;
            margin: 20px 0;
            text-align: left;
            font-size: 1.3rem;
            padding-left: 10px;
            color: #333 !important;
        }
        .prose h3::before {
            content: '';
            position: absolute;
            left: -6px; top: 50%;
            transform: translateY(-50%);
            width: 5px; height: 61%;
            border-radius: 4px;
            background-color: var(--head-title-color);
        }
        /* Icon after headings */
        .prose h3::after {
            content: " ";
            display: inline-block;
            height: 2em; width: 2em;
            vertical-align: top;
            background-color: var(--element-color-shallow);
            -webkit-mask-image: var(--h3-icon-shape);
            mask-image: var(--h3-icon-shape);
            -webkit-mask-size: 24px 24px;
            mask-size: 24px 24px;
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            mask-position: center;
        }

        .prose h4 {
            margin: 20px 0;
            font-size: 1.15rem;
            text-align: left;
            display: flex; /* Flex to align dot */
            align-items: center;
        }
        .prose h4::before {
            content: "";
            margin-right: 7px;
            display: inline-block;
            background-color: var(--head-title-color);
            width: 10px; height: 10px;
            border-radius: 100%;
            border: var(--head-title-color) 1px solid;
        }
        .prose h4::after {
            content: " ";
            display: inline-block;
            height: 2em; width: 2em;
            background-color: var(--element-color-shallow);
            -webkit-mask-image: var(--h4-icon-shape);
            mask-image: var(--h4-icon-shape);
            -webkit-mask-size: 24px 24px;
            mask-size: 24px 24px;
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            mask-position: center;
        }

        .prose blockquote {
            position: relative;
            margin: 20px 0;
            padding: 18px 20px 18px 48px !important;
            background-color: var(--element-color-soo-shallow) !important;
            border: none;
            border-radius: 16px;
            color: #555 !important;
        }
        .prose blockquote::before {
            content: "✨";
            position: absolute;
            left: 16px; top: 18px;
            font-size: 20px;
        }

        .prose strong {
            color: var(--element-color) !important;
            font-weight: 700;
        }
        
        .prose code {
            font-family: 'Cascadia Code', monospace;
            color: var(--element-color-linecode) !important;
            background-color: var(--element-color-linecode-background) !important;
            padding: 5px;
            border-radius: 6px;
        }
        
        .prose ul > li::marker { color: var(--element-color-deep) !important; }
        .prose ol { list-style-type: decimal; }
        .prose ul { list-style-type: disc; }
    `;

    const lcarsCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&display=swap');

        :root {
            --lcars-black: #000000;
            --lcars-space-white: #f5f6fa;
            --lcars-mars: #ff2200;
            --lcars-tomato: #ff5555;
            --lcars-orange: #ff8800;
            --lcars-golden-orange: #ff9900;
            --lcars-lilac: #cc55ff;
            --lcars-moonlit-violet: #9966ff;
            --lcars-blue: #5566ff;
            --lcars-ice: #99ccff;
            --lcars-sunflower: #ffcc99;
            --lcars-gray: #666688;

            --bg-color: var(--lcars-black);
            --text-color: var(--lcars-space-white);
        }

        body {
            background-color: var(--lcars-black) !important;
            color: var(--text-color);
            font-family: 'Antonio', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* LCARS Layout Frame */
        .md2poster-container {
            background-color: transparent !important;
            padding: 2rem !important;
            position: relative;
        }

        /* Sidebar removed as per user request */


        .prose {
            max-width: 92% !important;
            color: var(--text-color) !important;
            font-family: 'Antonio', sans-serif !important;
        }

        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            font-family: 'Antonio', sans-serif;
            font-weight: 700;
            margin: 2rem 0 1rem 0;
            padding: 0.8rem 1.5rem;
            text-transform: uppercase;
            border-radius: 20px;
            color: var(--lcars-black) !important;
            width: fit-content;
        }

        .prose h1 { background: var(--lcars-orange); font-size: 2rem; border-radius: 40px; padding-left: 2rem; }
        .prose h2 { background: var(--lcars-lilac); font-size: 1.6rem; border-radius: 30px; }
        .prose h3 { background: var(--lcars-ice); font-size: 1.4rem; border-radius: 25px; }
        .prose h4 { background: var(--lcars-sunflower); font-size: 1.2rem; border-radius: 20px; }
        .prose h5 { background: var(--lcars-blue); color: var(--lcars-space-white) !important; font-size: 1.1rem; border-radius: 18px; }
        .prose h6 { background: var(--lcars-mars); font-size: 1rem; border-radius: 15px; }

        .prose p {
            text-transform: none;
            letter-spacing: 0.02em;
            color: var(--lcars-space-white);
        }

        .prose blockquote {
            border-left: 6px solid var(--lcars-lilac) !important;
            background: rgba(204, 85, 255, 0.1) !important;
            color: var(--lcars-sunflower) !important;
            border-radius: 0 15px 15px 0;
            padding: 1rem 1.5rem !important;
            text-transform: none;
        }

        .prose strong { color: var(--lcars-orange) !important; }
        .prose a { color: var(--lcars-ice) !important; border-bottom: 2px solid var(--lcars-ice); text-decoration: none; }
        
        .prose code {
            font-family: 'Courier New', monospace;
            background: #1a1a1a !important;
            color: var(--lcars-orange) !important;
            border: 1px solid var(--lcars-blue);
        }

        .prose pre {
            background: #1a1a1a !important;
            border: 2px solid var(--lcars-blue);
            border-radius: 10px;
            padding: 1.5rem;
            position: relative;
        }
        .prose pre::before {
            content: 'CODE BLOCK';
            position: absolute;
            top: -10px; left: 20px;
            background: var(--lcars-blue);
            color: var(--lcars-black);
            padding: 2px 12px;
            font-size: 0.7rem;
            font-weight: 700;
            border-radius: 5px;
        }

        .prose ul > li::marker { content: ''; }
        .prose ul > li { position: relative; padding-left: 1rem; list-style: none; }
        .prose ul > li::before {
            content: '';
            position: absolute;
            left: -1rem; top: 0.4em;
            width: 1em; height: 1em;
            background: var(--lcars-orange);
            border-radius: 8px;
        }
        
        .prose ol { counter-reset: list-counter; list-style: none; padding-left: 0; }
        .prose ol > li { position: relative; counter-increment: list-counter; margin-bottom: 0.5rem; padding-left: 2rem; }
        .prose ol > li::before {
            content: counter(list-counter);
            position: absolute; left: 0; top: 0;
            background: var(--lcars-orange);
            color: var(--lcars-black);
            font-weight: 700;
            width: 1.5rem; height: 1.5rem;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.8em;
        }
    `;

    const lapisCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Cantarell:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Noto+Serif+SC:wght@400;700&display=swap');

        :root {
            --text-color: #40464f;
            --primary-color: #4870ac;
            --bg-color: #ffffff;
            --side-bar-bg-color: var(--bg-color);
            --marker-color: #a2b6d4;
            --source-color: #a8a8a9;
            --highlight-color: #ffffb5c2;
            --header-span-color: var(--primary-color);
            --block-bg-color: #f6f8fa;
            --img-shadow-color: #e3e8f0;
            --search-hit-bg-color: #ffe9cc;
            --search-select-bg-color: #5bb3ff;
            --control-text-hover-color: #a2b6d4;
            --active-file-bg-color: var(--block-bg-color);
        }

        body {
            font-family: 'Cantarell', 'Noto Serif SC', 'JetBrains Mono', sans-serif;
            background-color: var(--bg-color) !important;
            color: var(--text-color);
        }

        /* Container Overrides */
        .md2poster-container {
            background-color: transparent !important;
        }

         .prose {
            max-width: 950px !important;
            font-size: 1.1rem;
            color: var(--text-color) !important;
            line-height: 1.6;
            text-align: justify;
            font-family: 'Cantarell', 'Noto Serif SC', 'JetBrains Mono';
            margin: 0 auto;
        }

        /* Strong */
        .prose strong { color: var(--primary-color) !important; }

        /* Link */
        .prose a {
            color: var(--primary-color) !important;
            text-decoration: underline solid;
            text-underline-offset: 4px;
            text-decoration-thickness: 1px;
        }

        /* TOC */
        .md-toc-content { font-family: 'Noto Serif SC'; }
        .md-toc-content:empty:before { color: var(--primary-color); }

        /* Mark */
        .prose mark {
            background: var(--highlight-color);
            padding: 1px .15rem;
            border-radius: 1px;
            color: inherit;
        }

        /* Paragraph */
        .prose p {
            font-size: 1.1rem;
            padding-top: .2rem;
            padding-bottom: .2rem;
            margin: 0;
            line-height: 1.8rem;
            color: var(--text-color);
        }

        /* Header */
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            font-family: 'Noto Serif SC';
            padding: 0px;
            color: var(--primary-color) !important;
            font-weight: normal;
        }

        .prose h1 { text-align: center; font-size: 2rem; padding-top: 0.9rem; margin-bottom: 2.3rem; }
        .prose h2 {
            padding: 1px 12.5px;
            border-radius: 4px;
            display: inline-block;
            background-color: var(--header-span-color);
            color: var(--bg-color) !important;
            font-size: 1.5rem;
            margin: .3em 0;
        }
        .prose h2 a { border-bottom-color: var(--bg-color) !important; color: var(--bg-color) !important; }
        .prose h3 { font-size: 1.4rem; margin: 1em 0 1em; }
        .prose h4 { font-size: 1.2rem; margin: 0.8em 0 0.8em; }
        .prose h5 { font-size: 1.1rem; margin: 0.6em 0 0.6em; }
        .prose h6 { font-size: 1.1rem; margin: 0.4em 0 0.4em; }

        /* List */
        .prose ul > li::marker { font-weight: bold; color: var(--marker-color) !important; }
        .prose ul, .prose ol { margin-top: 8px; margin-bottom: 8px; padding-left: 20px; }
        .prose ul { list-style-type: disc; }
        .prose ol { list-style-type: decimal; }
        
        /* Quote */
        .prose blockquote {
            display: block;
            font-size: .9em;
            overflow: auto;
            border-left: 3px solid var(--primary-color) !important;
            padding: 15px 30px 15px 20px !important;
            margin-bottom: 20px;
            margin-top: 20px;
            background: var(--block-bg-color) !important;
            border-radius: 0;
        }

        /* Code */
        .prose code {
            color: var(--primary-color) !important;
            font-size: 94%;
            font-weight: normal;
            word-wrap: break-word;
            padding: 2px 4px 2px;
            border-radius: 3px;
            margin: 2px;
            background-color: var(--block-bg-color) !important;
            font-family: 'JetBrains Mono', monospace;
            word-break: break-all;
        }

        .prose pre {
            background-color: var(--block-bg-color) !important;
            font-family: 'JetBrains Mono', monospace;
            border-radius: 10px;
            padding: 1.2rem .8rem;
            color: #4f5467;
        }
        
        .prose img {
             filter: drop-shadow(var(--img-shadow-color) 0px 6px 6px);
             display: block;
             margin: 0 auto;
             padding: 1rem;
             max-width: 100%;
        }
        
        .prose hr {
            margin-top: 20px;
            margin-bottom: 20px;
            border: 0;
            border-top: 2px solid #eef2f5;
            border-radius: 2px;
        }
        
        /* Table */
        .prose table {
            display: table;
            text-align: justify;
            border-collapse: collapse;
            border-spacing: 0px;
            font-size: 1em;
            margin: 0px 0px 20px;
            width: 100%;
        }
        .prose table tr { border: 0; border-top: 1px solid #ccc; }
        .prose table tr th, .prose table tr td {
            font-size: 1rem;
            border: 1px solid #d9dfe4;
            padding: 5px 10px;
            text-align: justify;
        }
        .prose table tr th {
            font-family: 'Noto Serif SC';
            text-align: center;
            font-weight: bold;
            color: var(--primary-color) !important;
        }
    `;

    // Notion Light Theme
    const notionCSS = `
        :root {
            /* Colors */
            --bg-color: rgba(255, 255, 255, 1);
            --text-color: rgba(55, 53, 47, 1);
            --accent-color: rgba(193, 202, 204, 1);
            --accented-background-color: rgba(247, 246, 243, 1);
            --title-color: rgba(55, 53, 47, 1);
            --text-grey: rgba(115, 113, 109, 1);
            --border-color: rgba(225, 231, 232, 1);
            --link-color: rgba(43, 115, 217, 1);
            --link-hover-color: rgba(31, 92, 184, 1);
            --link-hover-bg: rgba(43, 115, 217, 0.12);
            --selection-bg: rgba(255, 238, 160, 1);
            --selection-color: rgba(0, 0, 0, 1);
            --highlight-bg: rgba(255, 238, 160, 1);
            --search-highlight-bg: rgba(233, 188, 54, 1);
            --h1-color: rgba(26, 26, 26, 1);
            --h2-color: rgba(46, 46, 46, 1);
            --h3-color: rgba(55, 53, 47, 1);
            --h4-color: rgba(90, 90, 90, 1);
            --h5-color: rgba(110, 110, 110, 1);
            --h6-color: rgba(120, 119, 116, 1);
            --body-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "Noto Sans SC", "Microsoft JhengHei", "Noto Sans TC", "Meiryo", "Yu Gothic", "Noto Sans JP", "Malgun Gothic", "Noto Sans KR", sans-serif;
            --monospace-font: "Sarasa Mono SC", "Source Han Mono", "Space Mono", "Inconsolata", monospace;
            --font-size: 16px;
            --h1-fontsize: 30px;
            --h2-fontsize: 24px;
            --h3-fontsize: 20px;
            --h4-fontsize: 18px;
            --h5-fontsize: 16px;
            --h6-fontsize: 16px;
            --monospace-font-size: 85%;
            --line-height: 1.6;
            --paragraph-spacing: 19.2px;
            --code-font: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            --code-bg-color: rgba(135, 131, 120, 0.15);
            --code-color: rgba(235, 87, 87, 1);
            --code-border-radius: 3px;
            --code-block-bg-color: rgba(247, 246, 243, 1);
            --code-block-font-size: 15.2px;
            --code-block-line-height: 1.65;
            --todo-bg-color: rgba(36, 131, 226, 1);
            --todo-check-color: rgba(255, 255, 255, 1);
        }

        body {
            font-size: var(--font-size);
            background-color: var(--bg-color) !important;
            color: var(--text-color);
            font-family: var(--body-font);
            line-height: var(--line-height);
        }

        /* Container Overrides */
        .md2poster-container {
            background-color: transparent !important;
        }

        .prose {
            max-width: 900px !important;
            margin: 0 auto;
            color: var(--text-color) !important;
            font-family: var(--body-font);
        }

        .prose p {
            margin: var(--paragraph-spacing) 0;
            line-height: var(--line-height);
            color: var(--text-color);
        }

        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            font-weight: 600;
            line-height: 1.3;
            margin-top: 24px;
            margin-bottom: 8px;
        }

        .prose h1 { font-size: var(--h1-fontsize); color: var(--h1-color); margin-top: 48px; margin-bottom: 24px; }
        .prose h2 { font-size: var(--h2-fontsize); color: var(--h2-color); margin-top: 40px; margin-bottom: 19px; }
        .prose h3 { font-size: var(--h3-fontsize); color: var(--h3-color); margin-top: 32px; margin-bottom: 16px; }
        .prose h4 { font-size: var(--h4-fontsize); color: var(--h4-color); }
        .prose h5 { font-size: var(--h5-fontsize); color: var(--h5-color); }
        .prose h6 { font-size: var(--h6-fontsize); color: var(--h6-color); font-style: italic; }

        .prose strong { font-weight: 700; color: inherit; }
        .prose a { color: var(--link-color) !important; text-decoration: none; border-bottom: 1px solid transparent; }
        .prose a:hover { color: var(--link-hover-color); background-color: var(--link-hover-bg); }

        .prose ul, .prose ol { padding-left: 24px; margin: 8px 0; }
        .prose li { margin: 4px 0; }
        .prose ul > li::marker { color: var(--accent-color); font-weight: 600; }
        .prose ol > li::marker { color: var(--accent-color); font-weight: 600; }

        .prose blockquote {
             margin: 24px 0;
             padding: 16px 20px 16px 48px !important;
             position: relative;
             border-left: 3px solid var(--accent-color) !important;
             background-color: rgba(241, 241, 239, 0.5) !important;
             border-radius: 5px;
             font-style: italic;
             color: rgba(55, 53, 47, 0.85);
        }
        .prose blockquote::before {
            content: '"';
            position: absolute;
            left: 12px;
            top: 8px;
            font-size: 40px;
            line-height: 1;
            color: var(--accent-color);
            opacity: 0.3;
            font-family: Georgia, serif;
        }

        .prose code {
            font-family: var(--code-font);
            font-size: var(--monospace-font-size);
            color: var(--code-color) !important;
            background-color: var(--code-bg-color) !important;
            padding: 3.2px 6.4px;
            border-radius: var(--code-border-radius);
            font-weight: 400;
        }

        .prose pre {
            background: var(--code-block-bg-color) !important;
            border: 1px solid rgba(15, 15, 15, 0.12);
            border-radius: 6px;
            padding: 20px 24px;
            margin: 20px 0;
            color: var(--text-color);
        }
        
        .prose img {
            border-radius: 8px;
            max-width: 100%;
            display: block;
            margin: 16px auto;
        }

        .prose table {
            margin: 24px 0;
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        .prose th, .prose td {
            border-right: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 12px 16px;
            font-size: 15.2px;
        }
        .prose th {
            background-color: rgba(55, 53, 47, 0.08) !important;
            font-weight: 600;
            color: rgba(55, 53, 47, 0.9);
        }
        .prose tr:last-child td { border-bottom: none; }
        .prose th:last-child, .prose td:last-child { border-right: none; }
    `;

    // Bronya Theme
    const bronyaCSS = `
        :root {
            --bg-color: #f3f2ee;
            --text-color: #1f0909;
            --primary-color: #065588;
            --code-bg: #2B2B2B;
            --code-text: #A9B7C6;
            --select-text-bg-color: #36284e;
            --select-text-font-color: #fff;
        }

        body {
            background-color: var(--bg-color) !important;
            font-family: Arial, "Microsoft YaHei", sans-serif;
            color: var(--text-color);
            line-height: 1.5em;
            font-size: 16px;
        }

        /* Container Overrides */
        .md2poster-container {
            background-color: transparent !important;
        }

        .prose {
            max-width: 960px !important;
            margin: 0 auto;
            color: var(--text-color) !important;
        }

        .prose p { margin: 1em 0; }
        
        .prose img {
             margin: 0 !important;
             max-width: 100%;
             border-radius: 4px; /* Optional slight radius */
        }

        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            font-family: "Microsoft YaHei", sans-serif;
            padding-bottom: 0.3em;
            border-bottom: 1px solid #d8dee4;
            font-weight: bold;
            margin-bottom: 1.5em;
            color: #000;
        }

        .prose h1 { font-size: 30px; line-height: 1.6em; margin-top: 2em; }
        .prose h2 { font-size: 25px; line-height: 1.15; margin-top: 2.28em; margin-bottom: 1.15em; }
        .prose h3 { font-size: 20px; line-height: 1.15; margin-top: 2.28em; margin-bottom: 1.15em; }
        .prose h4, .prose h5, .prose h6 { font-size: 16px; margin-top: 2.67em; }

        .prose a { text-decoration: none; color: #065588; }
        .prose a:hover, .prose a:active { text-decoration: underline; }

        .prose blockquote {
            border-left: 3px solid #bababa;
            margin-left: 1em;
            padding-left: 1em;
            color: #555;
        }

        .prose table {
            margin-bottom: 1.5em;
            font-size: 1em;
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
        }
        .prose tbody tr { background: #e8e7e7; border: 1px solid #ddd; }
        .prose thead { background-color: #dadada; }
        .prose th, .prose td {
            padding: .25em .25em .25em .4em;
            vertical-align: top;
            border: 1px solid #ddd;
        }
        .prose th { text-align: left; text-transform: uppercase; font-weight: bold; }

        .prose code {
            background: #ce601c1a !important;
            color: #9e3f00 !important;
            padding: 2px 3px;
            font-family: consolas, "Microsoft YaHei", monospace;
            border-radius: 4px;
            font-size: 0.9em;
        }

        .prose pre {
            background: #2B2B2B !important;
            color: #A9B7C6;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-family: Consolas, Menlo, Monaco, monospace;
            font-size: 0.9em;
        }
        
        .prose pre code {
            background: transparent !important;
            color: inherit !important;
            padding: 0;
            border-radius: 0;
        }

        .prose ul, .prose ol { padding-left: 2em; }
        .prose li { margin: 0.2em 0; }
        
        .prose hr {
            border-top: none; 
            border-right: none; 
            border-bottom: 1px solid #c5c5c5; 
            border-left: none;
            margin: 2em 0;
        }
        
        /* Task lists */
        .prose ul > li.task-list-item { list-style: none; margin-left: -1.5em; }
        
        /* IDEA Darcula Syntax Highlight Mappings for basic highlighting if library supports */
        /* Since we don't control the highlighter class names fully, we rely on basic overrides if possible */
    `;

    // Select styling logic
    let activeCSS = premiumCleanCSS;
    if (isCyberpunk) activeCSS = cyberpunkCSS;
    if (isTorillic) activeCSS = torillicCSS;
    if (isPhycatPrussian) activeCSS = phycatPrussianCSS;
    if (isLcars) activeCSS = lcarsCSS;
    if (isLapis) activeCSS = lapisCSS;
    if (isNotion) activeCSS = notionCSS;
    if (isBronya) activeCSS = bronyaCSS;

    return (
        <div className={`w-full min-h-screen ${isCyberpunk || isLcars ? 'bg-[#000000]' : isTorillic ? 'bg-[#fcf5e5] torillic-bg' : isPhycatPrussian || isLapis || isNotion ? 'bg-[#fff]' : isBronya ? 'bg-[#f3f2ee]' : 'bg-white'}`} id="capture-container">
            <style>{activeCSS}</style>



            {/* Wrapper logic */}
            <div className={`w-full max-w-none 
                ${isCyberpunk ? 'p-8' : isTorillic || isPhycatPrussian ? 'p-12' : isLcars ? 'py-12 pr-12 pl-20' : 'p-12 bg-white'} 
                md2poster-container`}
            >
                <Md2PosterContent
                    className={`!shadow-none !border-none !p-0 
                        ${isCyberpunk || isTorillic || isPhycatPrussian || isLcars || isLapis || isNotion || isBronya ? '!bg-transparent' : '!bg-white'} 
                        md2poster-content`}
                    articleClassName={`prose prose-xl max-w-none 
                        ${isCyberpunk || isLcars ? '' : isTorillic ? '' : isPhycatPrussian ? '' : 'text-slate-700'}`}
                >
                    {content.markdown}
                </Md2PosterContent>
            </div>
        </div>
    )
}

export default App
