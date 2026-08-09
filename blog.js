/* ==========================================================================
   Blog Engine — localStorage-backed posts + simple hardcoded-credential login.
   Shared by blog.html (public) and admin.html (login + dashboard).
   ========================================================================== */

const BLOG_STORAGE_KEY = 'dh_blog_posts';
const BLOG_AUTH_KEY = 'dh_blog_auth';

const ADMIN_CREDENTIALS = {
    email: 'danish@gmail.com',
    password: 'pw-blog.danish123'
};

const SEED_POSTS = [
    {
        id: 1700000000001,
        slug: 'ai-is-rewriting-the-recruiter-workflow',
        title: 'AI Is Rewriting the Recruiter Workflow, Not Replacing Recruiters',
        excerpt: 'After deploying three AI agents across sourcing, engagement, and evaluation, here is what actually changed for the team — and what stayed stubbornly human.',
        cover: 'Assests/Desk.png',
        tags: ['AI', 'Recruitment', 'Leadership'],
        date: '2026-06-12',
        author: 'Syed Danish Hasan',
        content: `## The bottleneck was never talent, it was time

Every recruiter I've managed is capable of doing more high-value work. The problem was always the 60% of the day lost to repetitive sourcing, follow-ups, and manual screening.

We built three agents — The Sourcer, The Caller, and The Validator — to remove that drag from the pipeline, not to remove the recruiter from the loop.

## What changed

- Sourcing time per requisition dropped sharply once profile discovery and enrichment became automatic.
- Candidate engagement stayed warm at scale because the outreach agent handled the first few touchpoints across WhatsApp, email, and voice.
- Screening became consistent — every candidate scored against the same rubric, every time.

## What didn't change

Negotiation, judgment calls on culture fit, and closing candidates on offer day are still entirely human. AI compressed the funnel; it didn't replace the moments that actually decide whether a candidate joins.

> The recruiters who embraced the tooling now run 2-3x the requisition load without burning out. That's the real productivity story — not headcount reduction, capacity expansion.

## Takeaway for TA leaders

Don't buy AI tools to cut your team. Buy them to give your team room to do the parts of the job only people can do.`
    },
    {
        id: 1700000000002,
        slug: 'building-a-nine-stage-hiring-pipeline',
        title: 'Building a Nine-Stage Hiring Pipeline That Actually Holds Up at Scale',
        excerpt: 'A breakdown of the operational stack — screening frameworks, SLAs, and banding — that got us to 90%+ SLA performance and 100% client retention.',
        cover: 'Assests/Business.png',
        tags: ['Operations', 'TA Strategy'],
        date: '2026-04-03',
        author: 'Syed Danish Hasan',
        content: `## Why most pipelines break

Most hiring pipelines fail quietly — not from lack of candidates, but from unclear ownership at each handoff. A recruiter sources, a coordinator schedules, a manager decides, and no one owns the whole journey.

## The nine stages

1. Intake and role scoping
2. Sourcing and enrichment
3. Initial screening
4. Recruiter shortlist
5. Client submission
6. Interview coordination
7. Feedback loop
8. Offer negotiation
9. Onboarding handoff

Each stage has a named owner, an SLA, and a defined exit criterion before a candidate moves forward.

## Governance that makes it stick

- Weekly SLA governance reviews across every active requisition.
- A banding framework so recruiters are evaluated on quality of shortlist, not just volume.
- A single source of truth in the ATS (Zoho Recruit) so nothing lives in someone's inbox.

## Result

90-93% SLA performance sustained across a €5M multi-region portfolio, and 100% client retention over the measurement period. Structure isn't glamorous, but it's what lets a team scale past its founder's personal bandwidth.`
    },
    {
        id: 1700000000003,
        slug: 'notes-on-leading-distributed-recruitment-teams',
        title: 'Notes on Leading Distributed Recruitment Teams Across Time Zones',
        excerpt: 'Managing 135+ consultants across Europe, APAC, and LATAM taught me that leadership at distance is a design problem, not a willpower problem.',
        cover: 'Assests/Nego.png',
        tags: ['Leadership', 'Global Teams'],
        date: '2026-02-18',
        author: 'Syed Danish Hasan',
        content: `## Distance exposes weak communication habits

When a team is co-located, sloppy communication gets patched over by hallway conversations. Spread that same team across five time zones and every gap turns into a delay, a missed handoff, or a client escalation.

## What I changed

- Moved from status meetings to async written updates with a hard daily cutoff, so no region waits on another to unblock.
- Built regional "anchors" — senior consultants empowered to make delivery calls without waiting for my sign-off overnight.
- Standardized reporting so a client in the UK and a client in Singapore get the same quality of update, on the same cadence.

## The leadership shift

The instinct is to hold onto control when you can't see your team. The opposite works better: give clearer boundaries and more autonomy, then check outcomes rather than activity.

## What I'd tell a new manager doing this for the first time

Your job stops being "answer every question" and becomes "make sure the right person doesn't need to ask." Document decisions once, well, instead of explaining them five times across five time zones.`
    }
];

function getPosts() {
    try {
        const raw = localStorage.getItem(BLOG_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(SEED_POSTS));
            return [...SEED_POSTS];
        }
        return JSON.parse(raw);
    } catch (e) {
        return [...SEED_POSTS];
    }
}

function savePosts(posts) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function isLoggedIn() {
    return sessionStorage.getItem(BLOG_AUTH_KEY) === 'true';
}

function login(email, password) {
    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password.trim() === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem(BLOG_AUTH_KEY, 'true');
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem(BLOG_AUTH_KEY);
}

/* Escape raw HTML before running the tiny markdown-lite parser over it */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* Minimal markdown-lite: ## headings, > blockquotes, - lists, **bold**, *italic*, [text](url), paragraphs */
function mdToHtml(raw) {
    const escaped = escapeHtml(raw);
    const lines = escaped.split(/\r?\n/);
    let html = '';
    let inList = false;
    let paragraphBuffer = [];

    const flushParagraph = () => {
        if (paragraphBuffer.length) {
            html += `<p>${paragraphBuffer.join(' ')}</p>`;
            paragraphBuffer = [];
        }
    };
    const closeList = () => {
        if (inList) { html += '</ul>'; inList = false; }
    };
    const inline = (text) => text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) { flushParagraph(); closeList(); return; }

        if (/^##\s+/.test(trimmed)) {
            flushParagraph(); closeList();
            html += `<h2>${inline(trimmed.replace(/^##\s+/, ''))}</h2>`;
        } else if (/^>\s+/.test(trimmed)) {
            flushParagraph(); closeList();
            html += `<blockquote>${inline(trimmed.replace(/^>\s+/, ''))}</blockquote>`;
        } else if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
            flushParagraph();
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${inline(trimmed.replace(/^([-*]|\d+\.)\s+/, ''))}</li>`;
        } else {
            closeList();
            paragraphBuffer.push(inline(trimmed));
        }
    });
    flushParagraph();
    closeList();
    return html;
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function allTags(posts) {
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return [...set];
}
