export const dictionaries = {
  en: {
    nav: {
      work: "Work",
      about: "About",
      stack: "Stack",
      journal: "Journal",
      contact: "Contact",
      toggle: "DE",
      menu: "Open menu",
      close: "Close menu",
    },
    a11y: {
      skipLink: "Skip to main content",
    },
    meta: {
      homeTitle: "Lechner Studios — Design-Led Digital Studio, Tirol",
      homeDescription:
        "Family-run, AI-native digital studio in Wattens, Tirol. Web & design, apps & automation, and SEO for SMB clients across DACH — brand & identity built into every build.",
      ogLocale: "en_US",
      orgDescription:
        "Family-run, AI-native digital studio. Web & design, apps & automation, and SEO for SMB clients across DACH, with brand & identity built into every build.",
      impressumTitle: "Impressum",
      impressumDescription:
        "Legal disclosure (Impressum) for Lechner Studios per § 5 ECG and § 25 MedienG.",
      privacyTitle: "Privacy",
      privacyDescription:
        "Privacy notice under GDPR for lechner-studios.at.",
      workTitle: "Work — Products & Projects",
      workDescription:
        "Selected products and projects from Lechner Studios — our own platforms and client work, built with editorial precision.",
      aboutTitle: "About the Studio",
      aboutDescription:
        "Lechner Studios is a family-run, AI-native digital studio in Wattens, Tirol, founded by Sonja Lechner.",
      stackTitle: "Our Stack & Philosophy — how Lechner Studios builds",
      stackDescription:
        "The tools and principles behind every Lechner Studios site: hand-written code, self-hosted and privacy-first, fast, accessible, and GDPR-compliant by construction.",
      contactTitle: "Contact",
      contactDescription:
        "Tell us what you're building — a straight answer within two business days. Lechner Studios, Wattens, Tirol.",
      startTitle: "Discuss a Project",
      startDescription:
        "Tell us about your project — web, apps, automation or SEO. The more you share, the sharper our first call. Lechner Studios, Wattens, Tirol.",
      blogTitle: "Journal",
      blogDescription:
        "Practical notes on web design, apps, automation and SEO for independent businesses.",
    },
    blog: {
      overline: "JOURNAL",
      headline: "Notes on craft, code & the web.",
      intro:
        "Occasional, practical writing on web design, apps, automation and SEO — what we've learned building digital products for independent businesses.",
      readMore: "Read →",
      backToBlog: "← All articles",
      empty: "Articles coming soon.",
      published: "Published",
    },
    hero: {
      overline: "DESIGN-LED · TIROL · AI-NATIVE",
      tagline: "Websites, apps & automation,\nbuilt to measure.",
      subline: "A design-led digital studio from Tirol, building for independent businesses across the DACH region.",
      ctaPrimary: "Discuss a project",
      ctaSecondary: "See the work",
      location: "WATTENS · TIROL · ÖSTERREICH",
      scroll: "SCROLL",
      proofOverline: "Live concept builds — see for yourself",
      proofCta: "View live",
      pillars: {
        eyebrow: "FOUR DISCIPLINES, ONE STUDIO",
        rest: "Four disciplines, one studio. Hover a discipline to see what each one delivers — tap on mobile.",
        // order matches dict.services.items: Apps, Web, Brand & Identity, SEO
        proofs: [
          "Full-stack apps & AI automation, in production today.",
          "Hand-built websites, designed to measure — no templates.",
          "Coherent visual systems — marks, palette, voice.",
          "Technical SEO that compounds over years, not quarters.",
        ],
      },
    },
    stance: {
      overline: "OUR STANCE",
      headline: "No builders. No templates.",
      body: "We hand-write every site on a modern stack — fast, self-hosted and privacy-first, GDPR-compliant by construction, and accessible by default. No page builder boxes you in, no template makes you look like everyone else. And you talk directly to the person who builds it.",
      moreLink: "See the stack and why it matters →",
      slider: {
        code: "Code",
        result: "Result",
        aria: "Before/after: source code and its rendered result — drag to reveal.",
      },
    },
    stack: {
      overline: "STACK & PHILOSOPHY",
      headline: "Hand-built, on a modern stack.",
      intro:
        "Most small-business sites today are assembled in a builder. We write every line ourselves, on the same tools large product teams use. There is a practical reason for it. It decides how fast your site loads and how quietly it handles your visitors' data, and whether you can still extend it in five years.",
      stackOverline: "WHAT WE BUILD ON",
      items: [
        { name: "Next.js & React", why: "The foundation. Server-rendered pages load fast and are legible to search engines from the first byte, not once a script has finished." },
        { name: "TypeScript", why: "Every function is typed. Mistakes surface while we build, not once they reach your customers." },
        { name: "Hand-written CSS", why: "No builder markup, no utility-framework weight. Only the styles your site needs, driven by a small set of design tokens." },
        { name: "Self-hosted fonts & assets", why: "No Google Fonts request, no external script. Everything lives on your own domain, which keeps the site fast and GDPR-clean without cookie-banner acrobatics." },
        { name: "Supabase", why: "When a project needs a database or logins, we reach for Supabase: an open Postgres foundation that can be hosted in the EU." },
        { name: "Vercel", why: "Hosted on infrastructure that delivers worldwide and scales on its own, with no server for you to maintain. Its analytics are cookieless, so there is no consent banner to manage." },
        { name: "Sentry", why: "Error monitoring, EU-region and without visitor IPs or cookies. It tells us when something breaks so we can fix it before you have to report it." },
      ],
      principlesOverline: "WHAT WE OPTIMISE FOR",
      principles: [
        { title: "Speed", body: "A slow site loses visitors before they read a word. We measure real load times on real devices and treat performance as a feature, not an afterthought." },
        { title: "Accessibility", body: "Contrast, keyboard navigation, and screen-reader structure are built in from the start, so the site works for every visitor and meets the WCAG basics." },
        { title: "Privacy by construction", body: "Self-hosted fonts and assets, no ad networks, no social embeds, no tracking cookies. The little that does reach an outside server is cookieless analytics and error monitoring, both privacy-friendly. That keeps GDPR compliance structural rather than a bolt-on." },
        { title: "Maintainability", body: "Clean, typed, documented code you are never locked out of. If our paths ever part, another engineer can pick it up without a rewrite." },
      ],
      buildersTitle: "Why not a page builder?",
      buildersBody: "Builders are quick to start and expensive to live with: heavy pages, third-party scripts you did not choose, and a ceiling you hit the moment you need something specific. We have written about the trade-off in more detail.",
      buildersLink1: "Custom site vs. website builder",
      buildersLink2: "A website without a page builder",
      ctaText: "Have a project in mind?",
      ctaLabel: "Discuss it with us",
    },
    about: {
      overline: "ABOUT THE STUDIO",
      headline: "A family-run studio building digital products with editorial precision.",
      body: "Lechner Studios is a family-run digital studio in Wattens, Tirol. Founded by Sonja Lechner, we design and ship digital products for SMB clients across DACH — built on craft, restraint, and an AI-native operating model. Quiet, precise, on the long horizon.",
      stat1n: "5", stat1l: "Products built",
      stat2n: "2026", stat2l: "Founded",
      stat3n: "4", stat3l: "Disciplines",
    },
    founder: {
      overline: "FOUNDER",
      headline: "A founder with a clear pattern.",
      photoAlt: "Sonja Lechner — Founder, Lechner Studios",
      sonjaName: "Sonja Lechner",
      sonjaRole: "Founder",
      body: "Sonja Lechner is a founder with a clear pattern: when she sees a problem and no satisfying solution exists, she builds one.\n\nBorn in Grenada and Tyrolean-by-adoption since 2009, she studied Softwareentwicklung und Management at IT-Kolleg Imst. Years of relocation under difficult conditions planted the idea for Vistera — a spatial-web platform for walking through a space before visiting it in person. She built it alone between 2025 and 2026, using AI as her team, while holding a full-time role in banking-sector IT.\n\nThe same pattern runs through a growing set of products she's built — each a missing thing, made real, several launching publicly soon.\n\nIn 2026, Lechner Studios was formed to house and continue these creations. The vision has grown from solo founder to family business. Family members contribute internally, by choice not publicly positioned.",
    },
    howWeWork: {
      overline: "HOW WE WORK",
      headline: "AI-native, transparently.",
      statement: "Every leader at Lechner Studios has a disclosed AI twin. Every twin operates inside a declared, revocable autonomy scope. Inside it, the twin acts; outside it, the twin drafts — and a human decides.",
    },
    work: {
      overline: "SELECTED WORK",
      headline: "Products & Projects",
      lead: "We don't only build for clients — we build our own products, too. The same craft goes into every project.",
      statusLive: "Live",
      statusDev: "In Development",
      statusPaused: "Paused",
      statusPlanned: "Planned",
      statusService: "Active Service",
      statusMaintenance: "Maintenance",
      statusComingSoon: "Coming Soon",
      visit: "Visit →",
      viewAll: "All work →",
      sampleCards: "Sample cards",
      flipFront: "Show answer",
      flipBack: "Show question",
      items: [
        {
          id: "websites",
          title: "Werk",
          category: "Service · Web Design",
          year: "2026",
          status: "service",
          desc: "Custom websites for independent businesses. No templates, no builders — every site is designed to measure for the client's market and voice.",
          url: "https://werk.lechner-studios.at",
        },
        {
          id: "vistera",
          title: "Vistera",
          category: "PropTech · VR",
          year: "2025",
          status: "comingSoon",
          desc: "4K cinema and VR property walkthroughs for real estate. A global platform built for the Austrian market — the DUO Standard.",
          url: "#",
        },
        {
          id: "virtual-office",
          title: "Virtual Office Tirol",
          category: "SaaS · AI Systems",
          year: "2026",
          status: "comingSoon",
          desc: "A platform in development for Innsbruck businesses — a legally usable business address, with AI phone answering and back-office automation on the roadmap.",
          url: "#",
        },
        {
          id: "codeflash",
          title: "CodeFlash",
          category: "SaaS · EdTech",
          year: "2026",
          status: "live",
          desc: "Developer flashcards across 45 topics — from HTML and Git to OWASP and kernel exploits. Spaced repetition, bilingual, foundations free. An AI-native product we designed, built and shipped end-to-end — payments included.",
          url: "https://codeflash.lechner-studios.at",
        },
        {
          id: "ai-flash",
          title: "AI Flash",
          category: "SaaS · EdTech",
          year: "2026",
          status: "maintenance",
          desc: "Spaced-repetition packs for the AI/ML engineering stack — LLMs, prompt engineering, RAG, MLOps.",
          url: "#",
        },
      ],
    },
    demos: {
      overline: "DEMO PORTFOLIO",
      headline: "What a custom site looks like.",
      lead: "Four working demos, each hand-coded from scratch — no builders, no templates. They're concept designs for fictional businesses, built to show exactly how a bespoke site looks, loads and behaves.",
      conceptLabel: "Concept",
      visit: "Open demo →",
      // The demos are concepts for fictional businesses. This row points at the
      // real, priced offer behind each one, on the werk storefront.
      offersOverline: "THE OFFER BEHIND EACH DEMO",
      items: [
        { slug: "pension", title: "Pension Musterhof", category: "Concept · Hospitality", desc: "A small-hotel site with a direct-booking calendar and a commission-savings calculator — built to keep guests off the booking portals." },
        { slug: "gasthof", title: "Gasthof Musterwirt", category: "Concept · Restaurant", desc: "A guesthouse site with a seasonal menu and an interactive table-reservation flow." },
        { slug: "skischule", title: "Skischule Musteralm", category: "Concept · Ski school", desc: "A ski-school site with clear course tiers and a season-aware course configurator." },
        { slug: "tischlerei", title: "Tischlerei Musterholz", category: "Concept · Carpentry", desc: "A carpentry site with a material-led portfolio and a project-scoping intake — no pricing implied." },
      ],
    },
    services: {
      overline: "WHAT WE DO",
      headline: "Four disciplines.\nOne studio.",
      // Order = the 2×2 grid (TL, TR, BL, BR): Apps(sky) · Web(stone) / Identity(navy) · SEO(green).
      items: [
        {
          title: "Apps & Automation",
          desc: "The repetitive work that eats your week, software can take off your hands. We build full-stack apps and AI automation — from content pipelines we run in production today to PropTech VR and virtual-office systems in development.",
        },
        {
          title: "Web & Design",
          desc: "A template makes you look like everyone else. We design and build websites to measure — for independent businesses, and for the platforms we've built ourselves. No builders, no compromises.",
        },
        {
          title: "Brand & Identity",
          desc: "An inconsistent look undercuts good work. We build coherent visual systems — names, marks, palettes, voice — and the content that carries them, woven into a build or as a brand project in its own right.",
        },
        {
          title: "SEO & Growth",
          desc: "Most good businesses are invisible on Google. We fix that the durable way — technical SEO and search optimisation that compound over years, not quarters.",
        },
      ],
    },
    serviceDetail: {
      web: {
        slug: "webdesign",
        metaTitle: "Web Design Tirol — custom websites for SMBs",
        metaDescription:
          "Web design studio in Tirol. Custom, hand-built websites for SMBs across DACH — no templates, no builders. Designed to measure, built to last.",
        overline: "WEB & DESIGN",
        headline: "Custom websites for independent businesses.",
        intro:
          "A template makes you look like everyone else, and a builder boxes you in the moment you grow. As a web design studio in Tirol, we design and build every website to measure — for SMBs across the DACH region who want a site that fits their market, their voice, and the way they actually work.",
        sections: [
          {
            h: "Designed to measure, not assembled",
            p: "No templates, no page builders. Every layout, typeface and interaction is decided for your business — so the site reads as yours, not as another instance of the same theme.",
            artifact: { src: "/proof/gasthof.webp", alt: "Gasthof — built to measure" },
          },
          {
            h: "Built on a fast, durable foundation",
            p: "Every site is hand-coded — React and Next.js, the same stack we build our own platforms on — never a page builder or a generic marketing wrapper. Assets are self-hosted and privacy-first, so the result is fast, GDPR-compliant by construction, accessible (WCAG AA), and maintainable enough to age well rather than need a rebuild in two years.",
            artifact: { src: "/proof/tischlerei.webp", alt: "Tischlerei — hand-coded, self-hosted" },
          },
          {
            h: "Bilingual and ready for Tirol & DACH",
            p: "German and English from the same source, with the structure search engines and local visitors expect — proper headings, accessible markup, and a clear path to contact you.",
          },
          {
            h: "Brand consistency built in",
            p: "A coherent visual system — marks, palette, type and voice — is part of the build from the start, so your site looks of a piece rather than stitched together.",
          },
        ],
        proof:
          "We don't only build for clients — Werk is our own custom-website service, and every product we build for ourselves is held to the same standard. The work is the proof.",
        ctaLabel: "Discuss your project",
        heroArtifact: { src: "/proof/pension.webp", alt: "Pension Musterhof — a website we designed and built", caption: "Live demo · pension" },
        includedLabel: "What's included",
        included: ["Hand-coded", "Self-hosted", "DSGVO by construction", "WCAG AA accessible", "Responsive", "Brand built in"],
        proofArtifact: {
          images: [
            { src: "/proof/pension.webp", alt: "Pension demo" },
            { src: "/proof/gasthof.webp", alt: "Gasthof demo" },
            { src: "/proof/skischule.webp", alt: "Skischule demo" },
            { src: "/proof/tischlerei.webp", alt: "Tischlerei demo" },
          ],
          workLabel: "See the work",
        },
      },
      apps: {
        slug: "apps-automation",
        metaTitle: "App Development & Automation Tirol — for SMBs",
        metaDescription:
          "App development and process automation in Tirol. We build full-stack apps and AI automation that take repetitive work off SMB teams across DACH.",
        overline: "APPS & AUTOMATION",
        headline: "Apps and automation that do the actual work.",
        intro:
          "The repetitive work that eats your week — re-keying data, chasing forms, answering the same questions — is work software can take off your hands. We build full-stack apps and AI automation for SMBs in Tirol and across DACH, aimed squarely at the tasks that drain time today.",
        sections: [
          {
            h: "Start from the bottleneck",
            p: "We look at where time actually goes and automate the specific, repeatable steps — not a vague \"digital transformation,\" but the concrete process that's costing you hours each week.",
          },
          {
            h: "Full-stack apps, built to fit",
            p: "Custom web applications and internal tools designed around your workflow, integrated with the systems you already use, rather than forcing your business into off-the-shelf software.",
          },
          {
            h: "AI automation, used responsibly",
            p: "We use AI where it earns its place — content automation today, with phone answering and back-office routing in development — always inside clear, reviewable scopes, so a human stays in control of anything that matters.",
          },
          {
            h: "Maintainable and observable",
            p: "Clean code, sensible logging and documentation, so what we build keeps running and can be handed over or extended without a rewrite.",
          },
        ],
        steps: [
          { n: "01", label: "Map the workflow that eats your time" },
          { n: "02", label: "Build the tool around it" },
          { n: "03", label: "It runs; you review" },
        ],
        includedLabel: "What we build",
        included: ["Custom web apps", "Workflow automation", "Content pipelines", "Internal tools"],
        proof:
          "The automation we describe here we run in our own studio first — built in-house, the same way we'd build yours.",
        ctaLabel: "Discuss your project",
      },
      seo: {
        slug: "seo",
        metaTitle: "SEO Tirol — technical search optimisation for SMBs",
        metaDescription:
          "Technical SEO in Tirol. On-page and technical search optimisation for SMBs — clean markup, fast load times, structured data and local findability.",
        overline: "SEO",
        headline: "Technical SEO that makes good businesses findable.",
        intro:
          "Most good businesses are effectively invisible in search — not because the work is poor, but because the site isn't built to be found. We focus strictly on technical and on-page search optimisation for SMBs in Tirol and across DACH: the structural foundations that let search engines crawl, understand and surface your pages.",
        sections: [
          {
            h: "Technical audit & crawlability",
            p: "We check what search engines actually see — indexability, crawl paths, redirects, canonical tags and sitemaps — and fix the technical issues that quietly keep pages out of results.",
          },
          {
            h: "On-page optimisation",
            p: "Clean heading structure, descriptive titles and meta descriptions, semantic HTML and internal linking, so each page clearly signals what it's about.",
          },
          {
            h: "Core Web Vitals & performance",
            p: "Load time and page experience are ranking and usability factors. We optimise performance — Core Web Vitals, image and asset handling — so pages are fast on real devices.",
          },
          {
            h: "Structured data & local findability",
            p: "Schema markup and a clean local setup (consistent business details, proper bilingual hreflang) help search engines present your pages correctly and surface them for local, regional searches.",
          },
        ],
        schemaArtifact: {
          lines: [
            '<span class="k">"@type"</span>: <span class="v">"Service"</span>,',
            '<span class="k">"areaServed"</span>: <span class="v">"Tirol"</span>,',
            '<span class="k">"@type"</span>: <span class="v">"FAQPage"</span>,',
            '<span class="k">"@type"</span>: <span class="v">"BreadcrumbList"</span>',
          ],
          note: "Rich-result eligible · live on our own pages",
        },
        includedLabel: "What we implement",
        included: ["Semantic HTML", "JSON-LD schema", "Sitemap / robots", "Internal linking"],
        proof:
          "The technical foundations of search visibility — semantic markup, fast load times, structured data, bilingual hreflang — are built into every site we ship, including our own platforms. We optimise on the same fundamentals we apply to our own work; we don't promise rankings or sell business strategy.",
        ctaLabel: "Discuss your project",
      },
      brand: {
        slug: "brand",
        metaTitle: "Brand & Identity Tirol — coherent visual systems for SMBs",
        metaDescription:
          "Brand and identity design in Tirol. Coherent visual systems — names, marks, palettes, type and voice — plus the content that carries them, built into a website or delivered as a standalone brand project.",
        overline: "Brand & Identity",
        headline: "A coherent identity, not a one-off logo.",
        intro:
          "An inconsistent look quietly undercuts good work — a logo here, a different colour there, a tone that shifts from page to post. We build coherent visual systems for SMBs in Tirol and across DACH: the marks, palettes, type and voice that make a business recognisable everywhere it appears — plus the content that carries them. Woven into a website build, or delivered as a brand project in its own right.",
        sections: [
          {
            h: "A system, not a single asset",
            p: "A logo is the start, not the brand. We design the whole system — wordmark and marks, a colour palette with accessible pairings, type, spacing and the rules that hold it together — so every surface, from the website to a business card, reads as one business.",
          },
          {
            h: "Voice & content",
            p: "How a business sounds matters as much as how it looks. We define a clear, honest tone — no hype, no buzzwords — and write the content that carries it: site copy, section text and the words that do the actual work, in German and English.",
          },
          {
            h: "Built into the build",
            p: "Brand and website are strongest designed together. When we build a site, the identity is part of it from the first screen — tokens in the code, consistent components, one visual language — rather than a logo bolted onto a template afterwards.",
          },
          {
            h: "Or a brand project on its own",
            p: "Keeping the site you have? We can deliver the identity as a standalone project — the system, the assets and a short set of guidelines — so whoever builds next has a clear, consistent foundation to work from.",
          },
        ],
        includedLabel: "What you get",
        included: ["Wordmark & marks", "Colour palette (AA)", "Type system", "Brand voice", "Usage guidelines", "Self-hosted assets"],
        proof:
          "We hold our own identity to the standard we'd build for you — a coherent system, accessible colour, consistent type, applied the same way on every surface and self-hosted. Brand is craft we do by hand, never a stock kit; it's the same eye we bring to every studio and product we build.",
        ctaLabel: "Discuss your project",
      },
    },
    contact: {
      overline: "CONTACT",
      headline: "Let's talk.",
      body: "Tell us what you're building. We'll get back to you within two business days to set up a short first call — in person or online — and figure out what's possible together. No pitch, no obligation.",
      startNudge: "Already know exactly what you want? Discuss a project →",
      ctaLine: "The easiest way to reach us — a message, an email, or WhatsApp. We reply within two business days.",
      optMessage: "Write a message",
      optEmail: "Email",
      optWhatsapp: "WhatsApp",
      whatsappNumber: "436641534653",
      email: "hallo@lechner-studios.at",
      location: "Wattens, Tirol, Österreich",
      form: {
        nameLabel: "Name",
        emailLabel: "Email",
        messageLabel: "Message",
        messageHint: "At least 20 characters.",
        submit: "Send message",
        submitting: "Sending…",
        responseTime: "We'll reply within two business days.",
        success: "Thank you. Your message has reached us — we'll be in touch shortly.",
        errorValidation: "Please check your entries — all fields are required and your message must be at least 20 characters.",
        errorRateLimit: "Too many requests from your address — please try again in an hour.",
        errorGeneric: "Something went wrong. Please try again, or email us directly.",
        consent: "By submitting this enquiry you consent to the processing of the data you provide (name, email address, message) for the purpose of handling your contact request. Legal basis: Art. 6(1)(b) GDPR (pre-contractual steps) and/or Art. 6(1)(a) GDPR (consent). You can withdraw this consent at any time for future processing. The lawfulness of processing carried out before withdrawal remains unaffected. Withdrawal is informal — an email to hallo@lechner-studios.at is sufficient. See Privacy for details.",
        mailtoFallback: "Or email directly:",
        bookCall: "Or book a 20-min call →",
      },
    },
    homeOffers: {
      overline: "START HERE",
      headline: "A clear entry point, at a fixed price.",
      lead: "Not ready for a full project? Start small. Two productized, fixed-price ways to work with us — no open-ended quotes, no guesswork.",
      items: [
        { label: "Fixed-price audit", desc: "A focused audit of your existing site — technical SEO, speed, accessibility and DSGVO. Written report plus a call, and the fee is credited toward a project.", cta: "Book a Website-Check" },
        { label: "Productized package", desc: "Complete direct-booking websites for guesthouses and holiday lets in Tirol — live in two weeks, with the portal commission back in your pocket.", cta: "See Direktbucher" },
      ],
    },
    foundation: {
      overline: "FOUNDATION PARTNERS",
      headline: "Deliberately few clients. Exactly the right moment.",
      body: "We take on only a small number of clients — and that's a choice in your favour: more attention, founder-stage terms, and a real partnership rather than a slot in a queue. Yes, we're a young studio — and that's precisely the advantage. The craft isn't a promise: it shows in what we've already built and run ourselves, from Werk to a growing set of products, several launching publicly soon. The same hands that built those will build yours.",
      est: "Founder-stage",
      place: "Wattens · Tirol · Österreich",
    },
    start: {
      overline: "DISCUSS A PROJECT",
      headline: "Let's build the right thing.",
      intro:
        "Tell us about your project. The more you share, the sharper our first call — we'll come prepared with a clear sense of what's possible and what it takes.",
      nameLabel: "Name",
      emailLabel: "Email",
      companyLabel: "Company (optional)",
      projectTypeLabel: "What do you need? (select all that apply)",
      projectType: {
        web: "Website",
        apps: "App / automation",
        seo: "SEO",
        brand: "Brand, identity & content",
        unsure: "Not sure yet",
      },
      goalLabel: "What are you trying to achieve?",
      timelineLabel: "Timeline (optional)",
      timeline: {
        asap: "ASAP",
        q1_3: "1–3 months",
        q3_6: "3–6 months",
        flexible: "Flexible",
      },
      budgetLabel: "Budget (Euro, optional)",
      budget: {
        unsure: "Not sure yet",
        low: "Under 5,000",
        mid: "5,000–15,000",
        high: "Over 15,000",
      },
      currentSiteLabel: "Current website or references (optional)",
      detailsLabel: "Anything else? (optional)",
      submit: "Send enquiry",
    },
    studioDirector: {
      launchLabel: "Chat with The Studio Director",
      title: "The Studio Director",
      subtitle: "AI twin · Lechner Studios",
      greeting:
        "Hi — I'm The Studio Director, the AI twin for Sonja Lechner at Lechner Studios. Happy to help directly; I'll bring Sonja in when the stakes need it.",
      placeholder: "Ask about services & pricing…",
      send: "Send",
      close: "Close",
      privacyNote: "AI assistant. Messages aren't stored. Please don't enter sensitive data.",
      errorRate: "One moment — that was a lot of messages. Please try again shortly.",
      errorGlobal: "I'm taking a short break. Please reach us via the contact form.",
      errorGeneric: "Something went wrong. Please try again or use the contact form.",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Built with precision. Tirol, Österreich.",
      endorsement: "A LECHNER STUDIOS PRODUCT",
      impressum: "Impressum",
      privacy: "Privacy",
    },
  },

  de: {
    nav: {
      work: "Arbeiten",
      about: "Über uns",
      stack: "Stack",
      journal: "Journal",
      contact: "Kontakt",
      toggle: "EN",
      menu: "Menü öffnen",
      close: "Menü schließen",
    },
    a11y: {
      skipLink: "Zum Inhalt springen",
    },
    meta: {
      homeTitle: "Lechner Studios — Design-orientiertes Digitalstudio, Tirol",
      homeDescription:
        "Familiengeführtes, KI-natives Digitalstudio in Wattens, Tirol. Web & Design, Apps & Automation und SEO für KMU im DACH-Raum — Marke & Identität in jedes Projekt integriert.",
      ogLocale: "de_AT",
      orgDescription:
        "Familiengeführtes, KI-natives Digitalstudio. Web & Design, Apps & Automation und SEO für KMU im DACH-Raum, mit Marke & Identität in jedes Projekt integriert.",
      impressumTitle: "Impressum",
      impressumDescription:
        "Offenlegung gem. § 5 ECG und § 25 MedienG für Lechner Studios.",
      privacyTitle: "Datenschutz",
      privacyDescription:
        "Datenschutzerklärung gem. DSGVO für lechner-studios.at.",
      workTitle: "Arbeiten — Produkte & Projekte",
      workDescription:
        "Ausgewählte Produkte und Projekte von Lechner Studios — eigene Plattformen und Kundenarbeit, mit editorischer Präzision gebaut.",
      aboutTitle: "Über das Studio",
      aboutDescription:
        "Lechner Studios ist ein familiengeführtes, KI-natives Digitalstudio in Wattens, Tirol, gegründet von Sonja Lechner.",
      stackTitle: "Stack & Philosophie — wie Lechner Studios baut",
      stackDescription:
        "Die Werkzeuge und Prinzipien hinter jeder Website von Lechner Studios: von Hand geschrieben, selbst gehostet und datenschutzfreundlich, schnell, barrierearm und DSGVO-konform von Grund auf.",
      contactTitle: "Kontakt",
      contactDescription:
        "Erzählen Sie uns, was Sie vorhaben — eine klare Antwort innerhalb von zwei Werktagen. Lechner Studios, Wattens, Tirol.",
      startTitle: "Projekt besprechen",
      startDescription:
        "Erzählen Sie uns von Ihrem Projekt — Web, Apps, Automatisierung oder SEO. Je mehr Sie teilen, desto präziser unser erstes Gespräch. Lechner Studios, Wattens, Tirol.",
      blogTitle: "Journal",
      blogDescription:
        "Praktische Notizen zu Webdesign, Apps, Automatisierung und SEO für unabhängige Unternehmen.",
    },
    blog: {
      overline: "JOURNAL",
      headline: "Notizen zu Handwerk, Code & Web.",
      intro:
        "Gelegentliche, praxisnahe Texte zu Webdesign, Apps, Automatisierung und SEO — was wir beim Bauen digitaler Produkte für unabhängige Unternehmen gelernt haben.",
      readMore: "Lesen →",
      backToBlog: "← Alle Beiträge",
      empty: "Beiträge folgen in Kürze.",
      published: "Veröffentlicht",
    },
    hero: {
      overline: "DESIGN-LED · TIROL · KI-NATIV",
      tagline: "Websites, Apps & Automatisierung,\nmaßgeschneidert.",
      subline: "Ein design-orientiertes Digitalstudio aus Tirol — für unabhängige Unternehmen im DACH-Raum.",
      ctaPrimary: "Projekt besprechen",
      ctaSecondary: "Arbeiten ansehen",
      location: "WATTENS · TIROL · ÖSTERREICH",
      scroll: "SCROLLEN",
      proofOverline: "Live-Beispielentwürfe — sehen Sie selbst",
      proofCta: "Live ansehen",
      pillars: {
        eyebrow: "VIER DISZIPLINEN, EIN STUDIO",
        rest: "Vier Disziplinen, ein Studio. Fahren Sie über eine Disziplin, um zu sehen, was sie leistet — am Handy antippen.",
        // Reihenfolge wie dict.services.items: Apps, Web, Marke & Identität, SEO
        proofs: [
          "Full-Stack-Apps & KI-Automatisierung, heute in Produktion.",
          "Handgebaute Websites nach Maß — keine Vorlagen.",
          "Stimmige visuelle Systeme — Marke, Farben, Stimme.",
          "Technisches SEO, das sich über Jahre auszahlt, nicht über Quartale.",
        ],
      },
    },
    stance: {
      overline: "UNSERE HALTUNG",
      headline: "Kein Baukasten. Keine Vorlage.",
      body: "Wir programmieren jede Seite von Hand — auf einem modernen Stack: schnell, selbst gehostet und datenschutzfreundlich, DSGVO-konform von Grund auf und barrierefrei. Kein Baukasten engt Sie ein, keine Vorlage lässt Sie aussehen wie alle anderen. Und Sie sprechen direkt mit dem Menschen, der baut.",
      moreLink: "Der Stack und warum er zählt →",
      slider: {
        code: "Code",
        result: "Ergebnis",
        aria: "Vorher/Nachher: Quellcode und gerendertes Ergebnis – ziehen zum Aufdecken.",
      },
    },
    stack: {
      overline: "STACK & PHILOSOPHIE",
      headline: "Von Hand gebaut, auf einem modernen Stack.",
      intro:
        "Die meisten Websites für kleine Betriebe entstehen heute im Baukasten. Wir schreiben stattdessen jede Zeile selbst, auf denselben Werkzeugen, mit denen große Produktteams arbeiten. Dahinter steckt ein praktischer Grund. Es entscheidet darüber, wie schnell Ihre Seite lädt und wie sparsam sie mit den Daten Ihrer Besucher umgeht, und ob sie sich in fünf Jahren noch erweitern lässt.",
      stackOverline: "WORAUF WIR BAUEN",
      items: [
        { name: "Next.js & React", why: "Das Fundament. Server-gerenderte Seiten laden schnell und sind vom ersten Byte an für Suchmaschinen lesbar, nicht erst, wenn ein Skript fertig geladen hat." },
        { name: "TypeScript", why: "Jede Funktion ist typisiert. Fehler zeigen sich beim Bauen, nicht erst beim Kunden." },
        { name: "Handgeschriebenes CSS", why: "Kein Baukasten-Markup, kein Framework-Ballast. Nur die Stile, die Ihre Seite wirklich braucht, gesteuert über einen kleinen Satz zentraler Design-Tokens." },
        { name: "Selbst gehostete Schriften & Assets", why: "Keine Google-Fonts-Anfrage, kein externes Skript. Alles liegt auf Ihrer eigenen Domain. Das hält die Seite schnell und DSGVO-sauber, ohne Cookie-Banner-Akrobatik." },
        { name: "Supabase", why: "Wenn ein Projekt eine Datenbank oder Logins braucht, setzen wir auf Supabase: eine offene Postgres-Basis, die sich in der EU hosten lässt." },
        { name: "Vercel", why: "Gehostet auf einer Infrastruktur, die weltweit ausliefert und von selbst skaliert, ohne dass Sie einen Server pflegen müssen. Die Statistik ist cookielos, es gibt also kein Consent-Banner zu verwalten." },
        { name: "Sentry", why: "Fehler-Monitoring, in der EU-Region und ohne Besucher-IPs oder Cookies. Es meldet uns Fehler, damit wir sie beheben, bevor Sie sie melden müssen." },
      ],
      principlesOverline: "WORAUF WIR OPTIMIEREN",
      principles: [
        { title: "Tempo", body: "Eine langsame Seite verliert Besucher, bevor sie ein Wort gelesen haben. Wir messen echte Ladezeiten auf echten Geräten und behandeln Performance als Funktion, nicht als nachträgliche Kür." },
        { title: "Barrierefreiheit", body: "Kontrast, Tastaturbedienung und eine für Screenreader lesbare Struktur sind von Anfang an eingebaut. So funktioniert Ihre Seite für alle Besucher und erfüllt die WCAG-Grundlagen." },
        { title: "Datenschutz von Grund auf", body: "Selbst gehostete Schriften und Assets, keine Werbenetzwerke, keine Social-Embeds, keine Tracking-Cookies. Das Wenige, das nach außen geht, sind cookielose Statistik und Fehler-Monitoring, beide datenschonend. Das macht DSGVO-Konformität baulich statt nachträglich." },
        { title: "Wartbarkeit", body: "Sauberer, typisierter, dokumentierter Code, aus dem Sie nie ausgesperrt sind. Sollten sich unsere Wege trennen, kann ein anderer Entwickler ihn ohne Neubau übernehmen." },
      ],
      buildersTitle: "Warum kein Baukasten?",
      buildersBody: "Baukästen sind schnell begonnen und teuer im Alltag: schwere Seiten, Skripte von Dritten, die Sie nicht gewählt haben, und eine Decke, an die Sie stoßen, sobald Sie etwas Bestimmtes brauchen. Über diesen Kompromiss haben wir ausführlicher geschrieben.",
      buildersLink1: "Maßgeschneidert vs. Baukasten",
      buildersLink2: "Eine Website ohne Baukasten",
      ctaText: "Ein Projekt im Kopf?",
      ctaLabel: "Sprechen wir darüber",
    },
    about: {
      overline: "ÜBER DAS STUDIO",
      headline: "Ein familiengeführtes Studio, das digitale Produkte mit editorischer Präzision baut.",
      body: "Lechner Studios ist ein familiengeführtes Digitalstudio aus Wattens, Tirol. Gegründet von Sonja Lechner, gestalten und entwickeln wir digitale Produkte für KMU im DACH-Raum — gebaut auf Handwerk, Zurückhaltung und einem KI-nativen Betriebsmodell. Leise, präzise, auf lange Sicht.",
      stat1n: "5", stat1l: "Projekte gebaut",
      stat2n: "2026", stat2l: "Gegründet",
      stat3n: "4", stat3l: "Disziplinen",
    },
    founder: {
      overline: "GRÜNDERIN",
      headline: "Gründerin mit einem klaren Muster.",
      photoAlt: "Sonja Lechner — Gründerin, Lechner Studios",
      sonjaName: "Sonja Lechner",
      sonjaRole: "Gründerin",
      body: "Sonja Lechner ist Gründerin mit einem klaren Muster: Sie sieht ein Problem — und wenn es keine passende Lösung gibt, baut sie eine.\n\nGeboren in Grenada, seit 2009 in Tirol zu Hause, ausgebildet am IT-Kolleg Imst in Softwareentwicklung und Management. Mehrere Umzüge unter schwierigen Bedingungen wurden zur Grundlage für Vistera — eine Spatial-Web-Plattform, mit der man einen Raum durchläuft, bevor man ihn physisch besichtigt. Zwischen 2025 und 2026 alleine gebaut, mit KI als Team — parallel zu einer Vollzeitstelle in der Banken-IT.\n\nDasselbe Muster zieht sich durch eine wachsende Reihe von Produkten, die sie gebaut hat — jedes eine fehlende Lösung, umgesetzt, einige davon bald öffentlich.\n\n2026 entstand Lechner Studios als Dach für diese Arbeiten — und um weiterzubauen. Aus der Solo-Gründerin ist ein Familienunternehmen geworden. Familienmitglieder tragen intern bei — bewusst ohne öffentliche Rolle.",
    },
    howWeWork: {
      overline: "WIE WIR ARBEITEN",
      headline: "KI-nativ, transparent.",
      statement: "Jede Führungsperson bei Lechner Studios hat einen öffentlich deklarierten KI-Zwilling. Jeder Zwilling operiert innerhalb eines deklarierten und widerrufbaren Autonomie-Bereichs. Innerhalb dieses Bereichs handelt der Zwilling selbst; außerhalb entwirft er — und ein Mensch entscheidet.",
    },
    work: {
      overline: "AUSGEWÄHLTE ARBEITEN",
      headline: "Produkte & Projekte",
      lead: "Wir bauen nicht nur für Kunden — wir entwickeln auch eigene Produkte. Dieselbe Sorgfalt steckt in jedem Projekt.",
      statusLive: "Live",
      statusDev: "In Entwicklung",
      statusPaused: "Pausiert",
      statusPlanned: "Geplant",
      statusService: "Aktiver Service",
      statusMaintenance: "In Wartung",
      statusComingSoon: "Demnächst",
      visit: "Besuchen →",
      viewAll: "Alle Arbeiten →",
      sampleCards: "Beispielkarten",
      flipFront: "Antwort zeigen",
      flipBack: "Frage zeigen",
      items: [
        {
          id: "websites",
          title: "Werk",
          category: "Service · Webdesign",
          year: "2026",
          status: "service",
          desc: "Maßgeschneiderte Websites für unabhängige Unternehmen. Keine Vorlagen, kein Baukasten — jede Site wird für Markt und Stimme des Kunden entworfen.",
          url: "https://werk.lechner-studios.at",
        },
        {
          id: "vistera",
          title: "Vistera",
          category: "PropTech · VR",
          year: "2025",
          status: "comingSoon",
          desc: "4K-Kino und VR-Rundgänge für Immobilien. Eine globale Plattform für den österreichischen Markt — der DUO Standard.",
          url: "#",
        },
        {
          id: "virtual-office",
          title: "Virtual Office Tirol",
          category: "SaaS · KI-Systeme",
          year: "2026",
          status: "comingSoon",
          desc: "Eine Plattform in Entwicklung für Innsbrucker Betriebe — eine ladungsfähige Geschäftsadresse, mit KI-Telefon-Assistenz und Back-Office-Automatisierung auf der Roadmap.",
          url: "#",
        },
        {
          id: "codeflash",
          title: "CodeFlash",
          category: "SaaS · EdTech",
          year: "2026",
          status: "live",
          desc: "Entwickler-Lernkarten über 45 Themen — von HTML und Git bis OWASP und Kernel-Exploits. Spaced Repetition, zweisprachig, Grundlagen kostenlos. Ein KI-natives Produkt, das wir End-to-End gestaltet, gebaut und live gebracht haben — inkl. Zahlungen.",
          url: "https://codeflash.lechner-studios.at",
        },
        {
          id: "ai-flash",
          title: "AI Flash",
          category: "SaaS · EdTech",
          year: "2026",
          status: "maintenance",
          desc: "Lernkarten-Packs für den AI/ML-Stack — LLMs, Prompt Engineering, RAG, MLOps.",
          url: "#",
        },
      ],
    },
    demos: {
      overline: "DEMO-PORTFOLIO",
      headline: "Wie eine maßgeschneiderte Seite aussieht.",
      lead: "Vier funktionierende Demos, jede von Hand programmiert — kein Baukasten, keine Vorlage. Es sind Konzept-Entwürfe für fiktive Betriebe, gebaut um zu zeigen, wie sich eine maßgeschneiderte Seite anfühlt, lädt und verhält.",
      conceptLabel: "Konzept",
      visit: "Demo öffnen →",
      // Die Demos sind Konzepte für fiktive Betriebe. Diese Zeile führt zum
      // echten, bepreisten Angebot dahinter, im werk-Storefront.
      offersOverline: "DAS ANGEBOT HINTER JEDER DEMO",
      items: [
        { slug: "pension", title: "Pension Musterhof", category: "Konzept · Hotellerie", desc: "Eine Pensions-Seite mit Direktbuchungs-Kalender und Provisions-Rechner — gebaut, um Gäste von den Buchungsportalen fernzuhalten." },
        { slug: "gasthof", title: "Gasthof Musterwirt", category: "Konzept · Gastronomie", desc: "Eine Gasthof-Seite mit saisonaler Karte und interaktiver Tisch-Reservierung." },
        { slug: "skischule", title: "Skischule Musteralm", category: "Konzept · Skischule", desc: "Eine Skischul-Seite mit klaren Kursstufen und einem saisonabhängigen Kurs-Konfigurator." },
        { slug: "tischlerei", title: "Tischlerei Musterholz", category: "Konzept · Tischlerei", desc: "Eine Tischlerei-Seite mit material-geführtem Portfolio und Projekt-Scoping — ganz ohne Preisangabe." },
      ],
    },
    services: {
      overline: "LEISTUNGEN",
      headline: "Vier Disziplinen.\nEin Studio.",
      items: [
        {
          title: "Apps & Automation",
          desc: "Die wiederkehrende Arbeit, die Ihre Woche frisst, kann Software übernehmen. Wir bauen Full-Stack-Apps und KI-Automatisierung — von Content-Pipelines, die heute in Produktion laufen, bis zu PropTech-VR und Virtual-Office-Systemen in Entwicklung.",
        },
        {
          title: "Web & Design",
          desc: "Eine Website von der Stange lässt Sie aussehen wie alle anderen. Wir gestalten und bauen Websites nach Maß — für unabhängige Unternehmen und für die Plattformen, die wir selbst gebaut haben. Keine Baukästen, keine Kompromisse.",
        },
        {
          title: "Marke & Identität",
          desc: "Ein uneinheitlicher Auftritt schwächt gute Arbeit. Wir gestalten stimmige visuelle Systeme — Namen, Marken, Farben, Stimme — und die Inhalte, die sie tragen: in ein Projekt integriert oder als eigenständige Markenarbeit.",
        },
        {
          title: "SEO & Growth",
          desc: "Die meisten guten Unternehmen sind bei Google unsichtbar. Wir ändern das nachhaltig — technisches SEO und Suchmaschinen-Optimierung, die sich über Jahre auszahlen, nicht über Quartale.",
        },
      ],
    },
    serviceDetail: {
      web: {
        slug: "webdesign",
        metaTitle: "Webdesign Tirol — maßgeschneiderte Websites für KMU",
        metaDescription:
          "Webagentur in Tirol & Innsbruck. Maßgeschneiderte Websites für KMU im DACH-Raum — keine Vorlagen, kein Baukasten, nach Maß gebaut.",
        overline: "WEB & DESIGN",
        headline: "Maßgeschneiderte Websites für unabhängige Unternehmen.",
        intro:
          "Eine Website von der Stange lässt Sie aussehen wie alle anderen, und ein Baukasten engt Sie ein, sobald Sie wachsen. Als Webagentur aus Tirol gestalten und bauen wir jede Website nach Maß — für KMU im DACH-Raum, die eine Site wollen, die zu ihrem Markt, ihrer Stimme und ihrer tatsächlichen Arbeitsweise passt.",
        sections: [
          {
            h: "Nach Maß gestaltet, nicht zusammengesteckt",
            p: "Keine Vorlagen, kein Baukasten. Jedes Layout, jede Schrift und jede Interaktion wird für Ihr Unternehmen entschieden — damit die Site nach Ihnen aussieht und nicht nach dem nächsten Exemplar desselben Themes.",
            artifact: { src: "/proof/gasthof.webp", alt: "Gasthof — maßgeschneidert gebaut" },
          },
          {
            h: "Auf schnellem, langlebigem Fundament gebaut",
            p: "Jede Seite ist von Hand programmiert — mit React und Next.js, demselben Stack, auf dem auch unsere eigenen Plattformen laufen — nie mit einem Baukasten oder einer generischen Marketing-Hülle. Alle Inhalte sind selbst gehostet und datenschutzfreundlich: schnell, DSGVO-konform von Grund auf, barrierefrei (WCAG AA) und wartbar — gebaut, um zu bleiben, statt in zwei Jahren neu gebaut zu werden.",
            artifact: { src: "/proof/tischlerei.webp", alt: "Tischlerei — handgeschrieben, selbst gehostet" },
          },
          {
            h: "Zweisprachig und bereit für Tirol & DACH",
            p: "Deutsch und Englisch aus einer Quelle, mit der Struktur, die Suchmaschinen und lokale Besucher erwarten — saubere Überschriften, barrierearmes Markup und ein klarer Weg zur Kontaktaufnahme.",
          },
          {
            h: "Markenkonsistenz von Anfang an",
            p: "Ein stimmiges visuelles System — Marken, Farben, Schrift und Stimme — ist von Beginn an Teil des Projekts, damit Ihre Site aus einem Guss wirkt statt zusammengeflickt.",
          },
        ],
        proof:
          "Wir bauen nicht nur für Kunden — Werk ist unser eigener Service für maßgeschneiderte Websites, und jedes Produkt, das wir für uns selbst bauen, entsteht nach demselben Standard. Die Arbeit ist der Beweis.",
        ctaLabel: "Projekt besprechen",
        heroArtifact: { src: "/proof/pension.webp", alt: "Pension Musterhof — eine von uns gestaltete und gebaute Website", caption: "Live-Demo · Pension" },
        includedLabel: "Enthalten",
        included: ["Handgeschrieben", "Selbst gehostet", "DSGVO-konform by construction", "WCAG-AA-barrierefrei", "Responsiv", "Marke integriert"],
        proofArtifact: {
          images: [
            { src: "/proof/pension.webp", alt: "Pension-Demo" },
            { src: "/proof/gasthof.webp", alt: "Gasthof-Demo" },
            { src: "/proof/skischule.webp", alt: "Skischule-Demo" },
            { src: "/proof/tischlerei.webp", alt: "Tischlerei-Demo" },
          ],
          workLabel: "Arbeiten ansehen",
        },
      },
      apps: {
        slug: "apps-automation",
        metaTitle: "App-Entwicklung & Automatisierung Tirol — für KMU",
        metaDescription:
          "App-Entwicklung und Prozessautomatisierung in Tirol. Full-Stack-Apps und KI-Automatisierung, die wiederkehrende Arbeit von KMU-Teams im DACH-Raum übernehmen.",
        overline: "APPS & AUTOMATION",
        headline: "Apps und Automatisierung, die die Arbeit wirklich erledigen.",
        intro:
          "Die wiederkehrende Arbeit, die Ihre Woche frisst — Daten neu eintippen, Formularen hinterherlaufen, dieselben Fragen beantworten — kann Software übernehmen. Wir bauen Full-Stack-Apps und KI-Automatisierung für KMU in Tirol und im DACH-Raum, gezielt für die Aufgaben, die heute Zeit kosten.",
        sections: [
          {
            h: "Beim Engpass ansetzen",
            p: "Wir schauen, wohin die Zeit tatsächlich fließt, und automatisieren die konkreten, wiederholbaren Schritte — keine vage „digitale Transformation“, sondern genau den Prozess, der Sie jede Woche Stunden kostet.",
          },
          {
            h: "Full-Stack-Apps, passgenau gebaut",
            p: "Maßgeschneiderte Web-Applikationen und interne Tools rund um Ihren Arbeitsablauf, integriert mit den Systemen, die Sie bereits nutzen — statt Ihr Unternehmen in Software von der Stange zu zwingen.",
          },
          {
            h: "KI verantwortungsvoll eingesetzt",
            p: "Wir setzen KI dort ein, wo sie ihren Platz verdient — Content-Automatisierung heute, Telefon-Assistenz und Back-Office-Routing in Entwicklung — immer innerhalb klarer, überprüfbarer Grenzen, damit bei allem Wesentlichen ein Mensch die Kontrolle behält.",
          },
          {
            h: "Wartbar und nachvollziehbar",
            p: "Sauberer Code, sinnvolles Logging und Dokumentation, damit das Gebaute weiterläuft und sich übergeben oder erweitern lässt — ohne Neuschreiben.",
          },
        ],
        steps: [
          { n: "01", label: "Den Arbeitsablauf erfassen, der Ihre Zeit frisst" },
          { n: "02", label: "Das Werkzeug darum herum bauen" },
          { n: "03", label: "Es läuft; Sie prüfen" },
        ],
        includedLabel: "Was wir bauen",
        included: ["Individuelle Web-Apps", "Workflow-Automatisierung", "Content-Pipelines", "Interne Tools"],
        proof:
          "Die Automatisierung, von der hier die Rede ist, setzen wir zuerst im eigenen Studio ein — im Haus gebaut, so, wie wir auch Ihres bauen würden.",
        ctaLabel: "Projekt besprechen",
      },
      seo: {
        slug: "seo",
        metaTitle: "SEO Tirol — technische Suchmaschinenoptimierung für KMU",
        metaDescription:
          "Technisches SEO in Tirol & Innsbruck. On-Page- und technische Suchmaschinenoptimierung für KMU — sauberes Markup, schnelle Ladezeiten, lokale Sichtbarkeit.",
        overline: "SEO",
        headline: "Technisches SEO, das gute Unternehmen auffindbar macht.",
        intro:
          "Die meisten guten Unternehmen sind in der Suche praktisch unsichtbar — nicht, weil die Arbeit schlecht wäre, sondern weil die Site nicht aufs Gefundenwerden gebaut ist. Wir konzentrieren uns strikt auf technische und On-Page-Suchmaschinenoptimierung für KMU in Tirol und im DACH-Raum: die strukturellen Grundlagen, die Suchmaschinen erlauben, Ihre Seiten zu crawlen, zu verstehen und anzuzeigen.",
        sections: [
          {
            h: "Technisches Audit & Crawlbarkeit",
            p: "Wir prüfen, was Suchmaschinen tatsächlich sehen — Indexierbarkeit, Crawl-Pfade, Weiterleitungen, Canonical-Tags und Sitemaps — und beheben die technischen Probleme, die Seiten still aus den Ergebnissen halten.",
          },
          {
            h: "On-Page-Optimierung",
            p: "Saubere Überschriftenstruktur, aussagekräftige Titel und Meta-Beschreibungen, semantisches HTML und interne Verlinkung, damit jede Seite klar signalisiert, worum es geht.",
          },
          {
            h: "Core Web Vitals & Performance",
            p: "Ladezeit und Seitenerlebnis sind Ranking- und Usability-Faktoren. Wir optimieren die Performance — Core Web Vitals, Bild- und Asset-Handling — damit Seiten auf echten Geräten schnell sind.",
          },
          {
            h: "Strukturierte Daten & lokale Auffindbarkeit",
            p: "Schema-Markup und ein sauberes lokales Setup (konsistente Unternehmensangaben, korrektes zweisprachiges hreflang) helfen Suchmaschinen, Ihre Seiten korrekt darzustellen und für lokale, regionale Suchanfragen anzuzeigen.",
          },
        ],
        schemaArtifact: {
          lines: [
            '<span class="k">"@type"</span>: <span class="v">"Service"</span>,',
            '<span class="k">"areaServed"</span>: <span class="v">"Tirol"</span>,',
            '<span class="k">"@type"</span>: <span class="v">"FAQPage"</span>,',
            '<span class="k">"@type"</span>: <span class="v">"BreadcrumbList"</span>',
          ],
          note: "Rich-Snippet-fähig · live auf unseren eigenen Seiten",
        },
        includedLabel: "Was wir umsetzen",
        included: ["Semantisches HTML", "JSON-LD-Schema", "Sitemap / robots", "Interne Verlinkung"],
        proof:
          "Die technischen Grundlagen der Sichtbarkeit — semantisches Markup, kurze Ladezeiten, strukturierte Daten, zweisprachiges hreflang — sind in jeder Site enthalten, die wir ausliefern, auch in unseren eigenen Plattformen. Wir optimieren auf denselben Grundlagen, die wir auf unsere eigene Arbeit anwenden; wir versprechen keine Rankings und verkaufen keine Unternehmensberatung.",
        ctaLabel: "Projekt besprechen",
      },
      brand: {
        slug: "brand",
        metaTitle: "Marke & Identität Tirol — stimmige visuelle Systeme für KMU",
        metaDescription:
          "Marken- und Identitätsgestaltung in Tirol. Stimmige visuelle Systeme — Namen, Marken, Farben, Typografie und Stimme — samt den Inhalten, die sie tragen. In eine Website integriert oder als eigenständiges Markenprojekt.",
        overline: "Marke & Identität",
        headline: "Eine stimmige Identität, kein einzelnes Logo.",
        intro:
          "Ein uneinheitlicher Auftritt schwächt gute Arbeit — hier ein Logo, dort eine andere Farbe, ein Ton, der von Seite zu Beitrag wechselt. Wir gestalten stimmige visuelle Systeme für KMU in Tirol und im DACH-Raum: Marken, Farben, Typografie und Stimme, die ein Unternehmen überall wiedererkennbar machen — samt den Inhalten, die sie tragen. In einen Website-Build integriert oder als eigenständiges Markenprojekt.",
        sections: [
          {
            h: "Ein System, kein Einzelstück",
            p: "Ein Logo ist der Anfang, nicht die Marke. Wir gestalten das ganze System — Wortmarke und Zeichen, eine Farbpalette mit barrierefreien Kombinationen, Typografie, Abstände und die Regeln, die alles zusammenhalten — damit jede Fläche, von der Website bis zur Visitenkarte, als ein Unternehmen wirkt.",
          },
          {
            h: "Stimme & Inhalt",
            p: "Wie ein Unternehmen klingt, zählt so viel wie sein Aussehen. Wir definieren einen klaren, ehrlichen Ton — ohne Hype, ohne Floskeln — und schreiben die Inhalte, die ihn tragen: Website-Texte, Abschnitte und die Worte, die wirklich arbeiten, auf Deutsch und Englisch.",
          },
          {
            h: "In den Build integriert",
            p: "Marke und Website sind am stärksten, wenn sie gemeinsam entstehen. Wenn wir eine Seite bauen, ist die Identität von der ersten Ansicht an Teil davon — Tokens im Code, einheitliche Komponenten, eine visuelle Sprache — statt ein Logo, das nachträglich auf eine Vorlage gesetzt wird.",
          },
          {
            h: "Oder ein Markenprojekt für sich",
            p: "Sie behalten Ihre bestehende Seite? Wir liefern die Identität als eigenständiges Projekt — das System, die Assets und eine kurze Richtlinie — damit alle, die danach bauen, eine klare, stimmige Grundlage haben.",
          },
        ],
        includedLabel: "Das bekommen Sie",
        included: ["Wortmarke & Zeichen", "Farbpalette (AA)", "Typo-System", "Markenstimme", "Anwendungsrichtlinie", "Selbst gehostete Assets"],
        proof:
          "Wir halten unsere eigene Identität an dem Standard, den wir für Sie bauen würden — ein stimmiges System, barrierefreie Farben, konsistente Typografie, auf jeder Fläche gleich angewendet und selbst gehostet. Marke ist für uns Handarbeit, nie ein Baukasten-Set; es ist derselbe Blick, den wir in jedes Studio und Produkt legen, das wir bauen.",
        ctaLabel: "Projekt besprechen",
      },
    },
    contact: {
      overline: "KONTAKT",
      headline: "Sprechen wir.",
      body: "Erzählen Sie uns, was Sie vorhaben. Wir melden uns innerhalb von zwei Werktagen für ein kurzes erstes Gespräch — vor Ort oder online — und finden gemeinsam heraus, was möglich ist. Kein Verkaufsgespräch, keine Verpflichtung.",
      startNudge: "Wissen Sie schon genau, was Sie wollen? Projekt besprechen →",
      ctaLine: "Der einfachste Weg zu uns — eine Nachricht, eine E-Mail oder WhatsApp. Wir antworten innerhalb von zwei Werktagen.",
      optMessage: "Nachricht schreiben",
      optEmail: "E-Mail",
      optWhatsapp: "WhatsApp",
      whatsappNumber: "436641534653",
      email: "hallo@lechner-studios.at",
      location: "Wattens, Tirol, Österreich",
      form: {
        nameLabel: "Name",
        emailLabel: "E-Mail",
        messageLabel: "Nachricht",
        messageHint: "Mindestens 20 Zeichen.",
        submit: "Nachricht senden",
        submitting: "Wird gesendet…",
        responseTime: "Wir melden uns innerhalb von zwei Werktagen.",
        success: "Danke. Ihre Nachricht ist bei uns angekommen — wir melden uns in Kürze.",
        errorValidation: "Bitte prüfen Sie Ihre Angaben — alle Felder sind erforderlich und Ihre Nachricht muss mindestens 20 Zeichen lang sein.",
        errorRateLimit: "Zu viele Anfragen von Ihrer Adresse — bitte in einer Stunde erneut versuchen.",
        errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder uns direkt per E-Mail kontaktieren.",
        consent: "Mit dem Absenden Ihrer Anfrage stimmen Sie zu, dass Ihre Angaben (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihrer Kontaktaufnahme verarbeitet werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Diese Einwilligung können Sie jederzeit für die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt vom Widerruf unberührt. Ein Widerruf ist formlos per E-Mail an hallo@lechner-studios.at möglich. Details siehe Datenschutz.",
        mailtoFallback: "Oder direkt per E-Mail:",
        bookCall: "Oder ein 20-Min-Gespräch buchen →",
      },
    },
    homeOffers: {
      overline: "EINSTIEG",
      headline: "Ein klarer Einstieg — zum Festpreis.",
      lead: "Noch nicht bereit für ein ganzes Projekt? Fangen Sie klein an. Zwei produktisierte Festpreis-Wege, mit uns zu arbeiten — keine offenen Angebote, kein Rätselraten.",
      items: [
        { label: "Festpreis-Analyse", desc: "Eine fokussierte Analyse Ihrer bestehenden Website — technisches SEO, Tempo, Barrierefreiheit und DSGVO. Schriftlicher Bericht plus Gespräch, und die Gebühr wird auf ein Projekt angerechnet.", cta: "Website-Check buchen" },
        { label: "Produktisiertes Paket", desc: "Komplette Direktbuchungs-Websites für Pensionen und Ferienwohnungen in Tirol — live in zwei Wochen, mit der Portal-Provision zurück in Ihrer Tasche.", cta: "Direktbucher ansehen" },
      ],
    },
    foundation: {
      overline: "FRÜHPHASEN-PARTNER",
      headline: "Bewusst wenige Kunden. Genau der richtige Moment.",
      body: "Wir nehmen bewusst nur eine kleine Zahl an Kunden an — das spricht für Sie: mehr Aufmerksamkeit, Konditionen der Gründungsphase und eine echte Partnerschaft statt eines Platzes in der Warteschlange. Ja, wir sind ein junges Studio — und genau das ist der Vorteil. Das Handwerk ist kein Versprechen: Es zeigt sich in dem, was wir bereits selbst gebaut haben und betreiben, von Werk bis zu einer wachsenden Reihe von Produkten, von denen einige bald öffentlich starten. Dieselben Hände, die diese gebaut haben, bauen auch Ihres.",
      est: "Gründungsphase",
      place: "Wattens · Tirol · Österreich",
    },
    start: {
      overline: "PROJEKT BESPRECHEN",
      headline: "Lassen Sie uns das Richtige bauen.",
      intro:
        "Erzählen Sie uns von Ihrem Projekt. Je mehr Sie teilen, desto präziser unser erstes Gespräch — wir kommen vorbereitet, mit einem klaren Bild davon, was möglich ist und was es braucht.",
      nameLabel: "Name",
      emailLabel: "E-Mail",
      companyLabel: "Unternehmen (optional)",
      projectTypeLabel: "Was brauchen Sie? (Mehrfachauswahl möglich)",
      projectType: {
        web: "Website",
        apps: "App / Automatisierung",
        seo: "SEO",
        brand: "Marke, Identität & Content",
        unsure: "Noch unklar",
      },
      goalLabel: "Was möchten Sie erreichen?",
      timelineLabel: "Zeitrahmen (optional)",
      timeline: {
        asap: "So bald wie möglich",
        q1_3: "1–3 Monate",
        q3_6: "3–6 Monate",
        flexible: "Flexibel",
      },
      budgetLabel: "Budget (Euro, optional)",
      budget: {
        unsure: "Noch unklar",
        low: "Unter 5.000",
        mid: "5.000–15.000",
        high: "Über 15.000",
      },
      currentSiteLabel: "Aktuelle Website oder Referenzen (optional)",
      detailsLabel: "Sonst noch etwas? (optional)",
      submit: "Anfrage senden",
    },
    studioDirector: {
      launchLabel: "Mit The Studio Director chatten",
      title: "The Studio Director",
      subtitle: "KI-Zwilling · Lechner Studios",
      greeting:
        "Hallo — ich bin The Studio Director, der KI-Zwilling von Sonja Lechner bei Lechner Studios. Ich helfe Ihnen gern direkt; bei heiklen Themen hole ich Sonja dazu.",
      placeholder: "Fragen Sie zu Leistungen & Preisen…",
      send: "Senden",
      close: "Schließen",
      privacyNote: "KI-Assistent. Nachrichten werden nicht gespeichert. Bitte keine sensiblen Daten eingeben.",
      errorRate: "Einen Moment — das waren viele Nachrichten. Bitte versuchen Sie es gleich erneut.",
      errorGlobal: "Ich mache eine kurze Pause. Bitte erreichen Sie uns über das Kontaktformular.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder das Kontaktformular nutzen.",
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      tagline: "Mit Präzision gebaut. Tirol, Österreich.",
      endorsement: "EIN LECHNER STUDIOS PRODUKT",
      impressum: "Impressum",
      privacy: "Datenschutz",
    },
  },
};

export type Dictionary = typeof dictionaries.en;

export type ServiceDetailEntry = {
  // base fields — match the current serviceDetail entry shape exactly
  slug: string;
  metaTitle: string;
  metaDescription: string;
  overline: string;
  headline: string;
  intro: string;
  sections: { h: string; p: string; artifact?: { src: string; alt: string; caption?: string } }[];
  proof: string;
  ctaLabel: string;
  // hybrid-showcase additions — optional, populated per service in later tasks
  heroArtifact?: { src: string; alt: string; caption?: string };
  steps?: { n: string; label: string }[];
  included?: string[];
  includedLabel?: string;
  schemaArtifact?: { lines: string[]; note: string };
  proofArtifact?: { images: { src: string; alt: string }[]; workLabel: string };
};

// Compile-time guard: every serviceDetail entry must satisfy the renderer's typed shape.
const _serviceDetailEntryGuard: ServiceDetailEntry[] = [
  dictionaries.en.serviceDetail.web,
  dictionaries.en.serviceDetail.apps,
  dictionaries.en.serviceDetail.seo,
  dictionaries.en.serviceDetail.brand,
];
void _serviceDetailEntryGuard;

export type { Locale } from "./config";
