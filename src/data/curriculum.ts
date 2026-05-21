import { CurriculumSection, Topic, LeaderboardUser, InterviewHubQuestion, CareerPath } from '../types';

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  { username: "Sarah_Dev", role: "Student", xp: 12450, level: 14, streak: 28 },
  { username: "AlexCodenoob", role: "Student", xp: 10800, level: 12, streak: 15 },
  { username: "TechGuru", role: "Mentor", xp: 9500, level: 10, streak: 9 },
  { username: "HackerOne", role: "Student", xp: 8750, level: 9, streak: 22 },
  { username: "ByteSized", role: "Student", xp: 7420, level: 8, streak: 6 },
  { username: "CodeSprint", role: "Student", xp: 6200, level: 7, streak: 12 }
];

export const INTERVIEW_QUESTIONS: InterviewHubQuestion[] = [
  {
    id: "int-1",
    question: "What is the difference between let, const, and var in JavaScript?",
    category: "JavaScript",
    difficulty: "Beginner",
    sampleAnswer: "var is function-scoped and undergoes hoisting with default value undefined. let and const are block-scoped and exist in a Temporal Dead Zone until initialized. const additionally prevents variable reallocation, though objects assigned with const remain mutable.",
    tips: ["Focus on block scope vs function scope.", "Explain hoisting behavior.", "Discuss mutability of const arrays/objects."]
  },
  {
    id: "int-2",
    question: "Explain the box model in CSS. How does box-sizing: border-box affect it?",
    category: "CSS",
    difficulty: "Beginner",
    sampleAnswer: "The CSS box model consists of content, padding, border, and margin. By default (content-box), width and height represent only the content size, meaning adding padding or borders increases the total visible element size. With border-box, the declared width and height include content, padding, and borders.",
    tips: ["List all four layers: content, padding, border, margin.", "Explain the formula: total width = content width + 2*padding + 2*border.", "Explain why border-box is universally preferred."]
  },
  {
    id: "int-3",
    question: "What are React Hooks and what rules must they follow?",
    category: "React",
    difficulty: "Intermediate",
    sampleAnswer: "React Hooks are functions that allow functional components to hook into React state and lifecycle features (e.g., useState, useEffect). The rules are: 1. Only call hooks at the top level (never inside loops, conditions, or nested functions); 2. Only call hooks from React function components or custom hooks.",
    tips: ["Explain why they were introduced (replacing class component boilerplate).", "Discuss the call order dependency.", "Mention the ESLint rules for hooks."]
  },
  {
    id: "int-4",
    question: "Explain event delegation in JavaScript and why it is useful.",
    category: "JavaScript",
    difficulty: "Intermediate",
    sampleAnswer: "Event delegation is a design pattern of attaching a single event listener to a parent element rather than individual listeners to multiple children. It relies on Event Bubbling, where events triggered on child elements bubble up to ancestral elements. It saves memory and handles dynamically added children.",
    tips: ["Explain Event Bubbling.", "Use target vs currentTarget.", "Mention memory optimization benefits."]
  },
  {
    id: "int-5",
    question: "How do you optimize React render performance? What are React.memo, useMemo, and useCallback?",
    category: "React",
    difficulty: "FAANG",
    sampleAnswer: "Optimization involves preventing unnecessary re-renders. React.memo is a higher-order component that shallow-compares component props. useMemo memoizes computed values between renders. useCallback memoizes callback function references, which is critical when downstream children rely on functional prop identities.",
    tips: ["Discuss physical trigger reasons for renders.", "Never over-optimize prematurely.", "Describe shallow vs deep comparisons."]
  }
];

export const CAREER_PATHS: CareerPath[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    salaryRange: "$75,000 - $145,000",
    description: "Build user-facing interfaces with exceptional interactivity, design fidelity, and semantic structure.",
    keySkills: ["HTML5", "CSS3 / Tailwind", "JS ES6", "React", "TypeScript", "Performance Tuning"],
    timeline: ["Learn fundamentals (HTML/CSS)", "Master JavaScript ES6 & DOM", "Learn React + Hooks", "Build responsive projects", "Optimize accessibility & SEO"]
  },
  {
    id: "backend",
    title: "Backend Engineer",
    salaryRange: "$85,000 - $160,000",
    description: "Design server architectures, database structures, security integrations, and clean REST/GraphQL APIs.",
    keySkills: ["Node.js", "Express", "PostgreSQL / SQL", "Authentication / JWT", "NoSQL", "Docker"],
    timeline: ["Learn Command Line", "Learn Git & Node.js", "Master Express server creation", "Learn Database Joins & schema creation", "Implement JWT Auth & Encryption"]
  },
  {
    id: "fullstack",
    title: "Full Stack Engineer",
    salaryRange: "$95,000 - $180,000",
    description: "Connect both client and server domains. Control full feature pipelines from UI down to server hosting.",
    keySkills: ["React / Next.js", "Node.js", "PostgreSQL", "OAuth / Security", "CI/CD Deployment", "APIs / Axios"],
    timeline: ["Master Frontend foundations", "Learn Backend API engineering", "Integrate databases with user auth", "Manage state across client/server", "Deploy unified code containers"]
  }
];

export const DATA_STRUCTURE_SECTIONS = [
  {
    id: "arrays",
    title: "Arrays",
    explanation: "An ordered collection of elements stored in contiguous memory locations. Retrievable in O(1) time using indices.",
    complexity: "Access: O(1) | Insertion: O(n) | Deletion: O(n) | Search: O(n)",
    visualization: "[ Element 0 | Element 1 | Element 2 | Element 3 | ... ]\n  Index 0     Index 1     Index 2     Index 3",
    startingCode: `// Reverse an array in-place\nfunction reverseArray(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left < right) {\n    let temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++;\n    right--;\n  }\n  return arr;\n}\nconsole.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]`
  },
  {
    id: "strings",
    title: "Strings",
    explanation: "A sequence of characters. Commonly treated as arrays in terms of indexing, but often immutable in languages like JS/TS.",
    complexity: "Access: O(1) | Concatenation: O(n) | Substring Search: O(n+m)",
    visualization: "\"H\" -> \"e\" -> \"l\" -> \"l\" -> \"o\"",
    startingCode: `// Check if a string is palindrome\nfunction isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-8]/g, '');\n  return clean === clean.split('').reverse().join('');\n}\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true`
  },
  {
    id: "linkedlists",
    title: "Linked Lists",
    explanation: "A linear collection of data nodes, where each node points to the next, instead of sitting in contiguous memory. Ideal for fast insertion/deletion.",
    complexity: "Access: O(n) | Insertion: O(1) | Deletion: O(1) | Search: O(n)",
    visualization: "[Head Node: Val, Next] -> [Node 1: Val, Next] -> [Node 2: Val, null]",
    startingCode: `class Node {\n  constructor(val) {\n    this.value = val;\n    this.next = null;\n  }\n}\n// Creating Linked List\nlet head = new Node(10);\nhead.next = new Node(20);\nhead.next.next = new Node(30);\n\n// Traverse\nlet current = head;\nwhile(current) {\n  console.log(current.value);\n  current = current.next;\n}`
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    explanation: "Stacks operate on LIFO (Last In First Out) principle, while Queues operate on FIFO (First In First Out) principle.",
    complexity: "Push/Enqueue: O(1) | Pop/Dequeue: O(1) | Search: O(n)",
    visualization: "Stack: | Top |\n       | Mid |\n       | Bot |\n\nQueue: [Front] <-- [Middle] <-- [Rear]",
    startingCode: `// Stack (LIFO) simulation\nconst stack = [];\nstack.push("Apples");\nstack.push("Bananas");\nconsole.log(stack.pop()); // Bananas\n\n// Queue (FIFO) simulation\nconst queue = [];\nqueue.push("User A");\nqueue.push("User B");\nconsole.log(queue.shift()); // User A`
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    explanation: "Non-linear layered structures. Trees are hierarchical graphs without cycles. Graphs contain nodes connected by edges.",
    complexity: "Binary Search Tree Search: O(log n) average, O(n) worst case.",
    visualization: "      [Root Node]\n      /         \\\n  [Left Child]  [Right Child]",
    startingCode: `// Tree Node implementation\nclass TreeNode {\n  constructor(val) {\n    this.value = val;\n    this.left = null;\n    this.right = null;\n  }\n}\nlet root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.right = new TreeNode(3);`
  }
];

export const SECTIONS: CurriculumSection[] = [
  {
    id: "sec-1",
    title: "SECTION 1: WEB DEVELOPMENT FUNDAMENTALS",
    topics: [
      {
        id: "fundamentals-intro",
        sectionId: "sec-1",
        title: "How Websites Work & DNS Basics",
        whyExists: "Understand the blueprint of browser-to-server networks, routing, client-server handshake, DNS mapping, and page delivery.",
        realWorldUse: "Diagnosing network outages, deploying apps in production, or setting up domain mappings with DNS custom configurations.",
        explanation: "Every web interaction begins with a client (such as your browser) making a request across the internet to a server. This communication follows the IP routing protocol. Since humans cannot remember physical IP addresses (e.g., 172.217.1.1), the Domain Name System (DNS) maps human-friendly domains (google.com) to network IPs. The browser then fetches static documents and renders them using parsing trees (DOM & CSSOM).",
        syntaxRef: {
          syntax: "Request: HTTP GET -> DNS Resolver -> Target Server IP\nResponse: HTML -> CSS -> JavaScript Renderer Engine",
          explanation: "Browser translates Domain to IP, establishing a TCP handshake, and parses fetched assets.",
          parameters: "Domain mapping (A-record, CNAME, TXT records)",
          example: "traceroute google.com",
          output: "Hop IPs representing routing legs towards destination.",
          notes: "DNS caching exists on browsers and local network routers to accelerate standard requests."
        },
        visualDiagram: `[ BROWSER CLINENT ]\n    | (1) GET google.com\n    v\n[ DNS SERVER ] ----> Maps Domain to IP 142.250.74.46\n    |\n    v (2) Handshake & fetch static files\n[ CLOUD HOSTING HOST ]`,
        commonMistakes: [
          "Confusing Client-Side versus Server-Side. The browser only runs client code (HTML/CSS/JS).",
          "Forgetting DNS propagation time. New DNS records can take up to 48 hours to cache globally.",
          "Assuming HTTP is encrypted. Always require HTTPS for SSL/TLS handshakes."
        ],
        practiceTask: {
          id: "task-f-1",
          instructions: "Define the visual DOM order sequence. Set HTML element, styling link, then JS module script correctly.",
          startingCode: `// Order the sequence of steps for browser rendering:\n// (A) Paint, (B) Parsing HTML to DOM, (C) Executing script modules, (D) Attachment of stylesheet rules\nconst renderOrder = ["B", "D", "C", "A"];\nconsole.log(renderOrder);`
        },
        mcqs: [
          {
            id: "mcq-f-1",
            question: "What system is responsible for converting domain names like google.com into IP addresses?",
            options: ["HTTP", "DNS", "TCP", "SSL"],
            correctAnswerIndex: 1,
            explanation: "DNS (Domain Name System) translates hostnames into device accessible IP addresses."
          }
        ],
        miniChallenge: {
          title: "Architecture Map",
          description: "Given a layout structure, draft an Express server response that matches fundamental requests.",
          startingCode: `console.log("Client fetches HTML, style, scripts");`
        },
        projectChallenge: {
          title: "DevTools Inspections",
          description: "Use your browser DevTools (F12) to trace a network GET request. Analyze response headers.",
          startingCode: `console.log("Completed network trace audit");`
        },
        youtubeVideos: [
          { title: "Internet Basics & Web Architectures", videoId: "hJHvdFoa9S4", level: "Beginner" }
        ],
        externalResources: [
          { title: "MDN: How the Web Works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_web_works" }
        ]
      }
    ]
  },
  {
    id: "sec-2",
    title: "SECTION 2: HTML5",
    topics: [
      {
        id: "html-boilerplate",
        sectionId: "sec-2",
        title: "HTML Boilerplate & Semantic Elements",
        whyExists: "HTML is the skeleton of all web applications. Semantic tags provide meaning to modern crawlers, screen readers, and developers.",
        realWorldUse: "Establishing clean accessibility, search indexing, metadata styling, and clear document segmentation.",
        explanation: "HTML (HyperText Markup Language) constructs the content layout of a web portal. Elements represent content blocks. Boilerplate contains necessary declarations (<DOCTYPE html>, <html>, <head>, <body>). Semantic elements (<header>, <nav>, <main>, <section>, <article>, <aside> and <footer>) describe their content meaning instead of generic <div> wrappers.",
        syntaxRef: {
          syntax: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello</title>\n  </head>\n  <body>\n    <main>\n      <h1>Asemantic markup is bad practice</h1>\n    </main>\n  </body>\n</html>",
          explanation: "Standard document skeleton including tab title and primary semantic main content segment.",
          parameters: "lang, charset, name, content, href",
          example: "<article><h2>Latest Web Trends</h2></article>",
          output: "A logically grouped article text segment.",
          notes: "Keep inline markup to zero. Style everything exclusively in external stylesheets."
        },
        visualDiagram: `<!DOCTYPE html>\n<html>\n  +-- <head> (Metadata, CSS links, tab title)\n  +-- <body>\n        +-- <header>\n        +-- <main> (Unique page core)\n              +-- <section>\n                    +-- <article>\n        +-- <footer>`,
        commonMistakes: [
          "Nesting semantic elements inside arbitrary containers incorrectly.",
          "Omitting the alt tag on <img> elements, breaking screen reader accessibility.",
          "Using headings <h1> to <h6> out of order purely to enlarge font sizes."
        ],
        practiceTask: {
          id: "task-html-1",
          instructions: "Fix the basic missing meta tag in head section.",
          startingCode: `<!-- Fix this snippet in playground -->\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n</head>\n<body>\n  <h1>Awesome platform</h1>\n</body>\n</html>`
        },
        mcqs: [
          {
            id: "mcq-html-1",
            question: "Which HTML5 tag is semantic and should house the unique core page content?",
            options: ["<div>", "<main>", "<section>", "<body>"],
            correctAnswerIndex: 1,
            explanation: "<main> designates the primary content section specific to that page."
          }
        ],
        miniChallenge: {
          title: "Form Creation",
          description: "Write an HTML form with email input, password input, and a submit button.",
          startingCode: `<form>\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Submit</button>\n</form>`
        },
        projectChallenge: {
          title: "Semantic Web Mockup",
          description: "Build a multi-page portal using header, main, section, aside, and footer semantic containers.",
          startingCode: `<header>Nav</header>\n<main>\n  <aside>Sidebar</aside>\n  <section>Body</section>\n</main>`
        },
        youtubeVideos: [
          { title: "HTML5 Crash Course for Beginners", videoId: "UB1O30fR-EE", level: "Beginner" }
        ],
        externalResources: [
          { title: "MDN Semantic HTML guide", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics" }
        ]
      }
    ]
  },
  {
    id: "sec-3",
    title: "SECTION 3: CSS3",
    topics: [
      {
        id: "css-boxmodel",
        sectionId: "sec-3",
        title: "CSS Box Model & Basic Properties",
        whyExists: "Every visual element is structured as a nested series of boxes. The box model controls visual flow, element spacing, and borders.",
        realWorldUse: "Controlling responsive spacing, layouts, overlapping components, buttons, menus, and borders.",
        explanation: "By default, every CSS element compiles as a layout rectangle. The Box Model consists of: Content (text/images), Padding (clear space around content), Border (wrapping frame), and Margin (outer spacing to divide target from neighboring elements). Default calculation is content-box, but border-box makes sizing highly predictable by packing padding and border sizes inside the declared dimensions.",
        syntaxRef: {
          syntax: ".box {\n  width: 300px;\n  padding: 20px;\n  border: 5px solid black;\n  margin: 15px;\n  box-sizing: border-box;\n}",
          explanation: "Declared width remains exactly 300px. Content width dynamically shrinks to 250px.",
          parameters: "top, right, bottom, left border alignments",
          example: "margin: 10px 20px 10px 20px; /* Top Right Bottom Left */",
          output: "Balanced surrounding space dimensions.",
          notes: "Margins collapse vertically in static document flows, which can be fixed with padding or border containers."
        },
        visualDiagram: `+-------------------------------------+ \n|               MARGIN                | \n|  +-------------------------------+  | \n|  |            BORDER             |  | \n|  |  +-------------------------+  |  | \n|  |  |         PADDING         |  |  | \n|  |  |  +-------------------+  |  |  | \n|  |  |  |      CONTENT      |  |  |  | \n|  |  |  +-------------------+  |  |  | \n|  |  +-------------------------+  |  | \n|  +-------------------------------+  | \n+-------------------------------------+`,
        commonMistakes: [
          "Forgetting box-sizing: border-box. Standard sizes will blowout layouts.",
          "Using margin instead of padding for inner spacing.",
          "Mixing inline and block layout properties without defining display mode."
        ],
        practiceTask: {
          id: "task-css-1",
          instructions: "Fix this style rules block. Add margin auto to center, box-sizing, and double padding.",
          startingCode: `/* Center block card in viewport safely */\n.card {\n  max-width: 400px;\n  margin: 0 auto;\n  box-sizing: border-box;\n  padding: 16px;\n}`
        },
        mcqs: [
          {
            id: "mcq-css-1",
            question: "With box-sizing: content-box, if width is 100px, padding is 10px, and border is 5px, what is total calculated width?",
            options: ["100px", "115px", "130px", "120px"],
            correctAnswerIndex: 2,
            explanation: "100px (content) + 20px (left+right padding) + 10px (left+right border) = 130px."
          }
        ],
        miniChallenge: {
          title: "Stunning Card Spacing",
          description: "Use CSS parameters to style a neat shadow container with standard inner margin and padding layers.",
          startingCode: `.alert-box {\n  padding: 24px;\n  border: 1px solid #ddd;\n  margin-bottom: 12px;\n}`
        },
        projectChallenge: {
          title: "Nested Card Layout",
          description: "Build an interactive grid of pricing cards, utilizing border-box and custom colors.",
          startingCode: `.price-grid { display: block; }`
        },
        youtubeVideos: [
          { title: "CSS Box Model Explained", videoId: "rIO53 Sy65s", level: "Beginner" }
        ],
        externalResources: [
          { title: "CSS Tricks Box Model guide", url: "https://css-tricks.com/the-css-box-model/" }
        ]
      }
    ]
  },
  {
    id: "sec-4",
    title: "SECTION 4: FLEXBOX",
    topics: [
      {
        id: "css-flexbox",
        sectionId: "sec-4",
        title: "Modern Flexbox Layouts",
        whyExists: "Traditional CSS struggled with flexible grid segments. Flexbox permits parent elements to govern item distribution, scaling, and alignment.",
        realWorldUse: "Navigation bars, centering cards, single-column alignment, row distributions, and highly adaptive forms.",
        explanation: "Flexbox (Flexible Box Layout) operates on the principle of a parent flex container and child flex items. You set `display: flex`. The flex-direction dictates the primary axis. Items can shrink, expand, align dynamically (using `justify-content` and `align-items`), wrap onto multiple lines (`flex-wrap`), and establish precise gap sizes.",
        syntaxRef: {
          syntax: ".container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}",
          explanation: "Creates a row layout, spreads children to outer bounds, centers them vertically.",
          parameters: "flex-direction (row | column), justify-content (center | space-between | flex-start), align-items",
          example: "flex-grow: 1; /* flex child dynamic expansion */",
          output: "Child extends to consume leftover space.",
          notes: "Flex wrap allows multi-row dynamic layouts which works beautifully with media-queries."
        },
        visualDiagram: `+--------------------------------------------------------+ \n|  FLEX CONTAINER                                        | \n|  +------------+     +------------+     +------------+  | \n|  | Flex Item  |     | Flex Item  |     | Flex Item  |  | \n|  +------------+     +------------+     +------------+  | \n+--------------------------------------------------------+`,
        commonMistakes: [
          "Confusing justify-content (main axis) with align-items (cross axis).",
          "Attempting to use float properties within display: flex elements.",
          "Using hardcoded width sizes on flex items, disabling responsive flow."
        ],
        practiceTask: {
          id: "task-flex-1",
          instructions: "Align the items inside container to be centered vertically and horizontally.",
          startingCode: `.center-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}`
        },
        mcqs: [
          {
            id: "mcq-flex-1",
            question: "Which flex directive aligns items along the default horizontal row main axis?",
            options: ["align-items", "justify-content", "align-content", "flex-wrap"],
            correctAnswerIndex: 1,
            explanation: "justify-content aligns children on the primary main axis."
          }
        ],
        miniChallenge: {
          title: "Dynamic NavBar",
          description: "Align a logo, center links, and an action button gracefully in a single top row wrapper.",
          startingCode: `<nav class="flex justify-between items-center bg-gray-900 text-white p-4">\n  <div>Logo</div>\n  <div class="flex gap-4"><a>Home</a><a>Docs</a></div>\n  <button>Login</button>\n</nav>`
        },
        projectChallenge: {
          title: "Flexbox Product Gallery",
          description: "Build a responsive grid of card listings that wraps dynamically as the container resizing updates.",
          startingCode: `.gallery {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}`
        },
        youtubeVideos: [
          { title: "Flexbox Masterclass", videoId: "u044iM9xsWU", level: "Intermediate" }
        ],
        externalResources: [
          { title: "Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
        ]
      }
    ]
  },
  {
    id: "sec-5",
    title: "SECTION 5: GRID",
    topics: [
      {
        id: "css-grid",
        sectionId: "sec-5",
        title: "CSS Grid Fundamentals",
        whyExists: "While Flexbox focuses on a single-dimensional layout (row or column), CSS Grid delivers robust nested layout control on two dimensions.",
        realWorldUse: "Multi-column magazine style columns, bento grids, landing page areas, dashboard grids.",
        explanation: "CSS Grid enables developers to establish layouts by partitioning elements into grid containers, columns, rows, and grid areas. You set `display: grid`. Define sizes using standard fraction values (`1fr`, `2fr`), `repeat(3, 1fr)`, dynamic boundaries with `minmax()`, and explicit items layout bounds.",
        syntaxRef: {
          syntax: ".dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 20px;\n}",
          explanation: "Builds a standard 12-column layout grid.",
          parameters: "grid-template-columns, grid-template-rows, grid-column, grid-row",
          example: "grid-column: span 4; /* Card spans 4 columns */",
          output: "Item resizes to consume exactly 4 divisions.",
          notes: "Use grid-template-areas for highly graphic editorial designs."
        },
        visualDiagram: `+-------------------------------------+ \n| GRID CONTAINER (repeat(3, 1fr))     | \n|  +--------+  +--------+  +--------+  | \n|  | Item 1 |  | Item 2 |  | Item 3 |  | \n|  +--------+  +--------+  +--------+  | \n|  +--------+  +--------+  +--------+  | \n|  | Item 4 |  | Item 5 |  | Item 6 |  | \n|  +--------+  +--------+  +--------+  | \n+-------------------------------------+`,
        commonMistakes: [
          "Overcomplicating layouts with Grid when a simple Flexbox is cleaner.",
          "Confusing browser sizes when mixing percentage layouts with standard fr fractions.",
          "Stating explicit positions for every element instead of using grid auto-flow."
        ],
        practiceTask: {
          id: "task-grid-1",
          instructions: "Build a bento style grid grid with repeatable templates.",
          startingCode: `.bento {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`
        },
        mcqs: [
          {
            id: "mcq-grid-1",
            question: "What does the 1fr unit represent in CSS Grid?",
            options: ["1 Free Pixel", "1 Fraction of free space", "1 Fixed Ratio size", "1 Frame element"],
            correctAnswerIndex: 1,
            explanation: "fr represents one fraction of the remaining free space inside our grid container."
          }
        ],
        miniChallenge: {
          title: "Bento Layout Card",
          description: "Form a 3-column dashboard where the header spans all columns, the sidebar spans 1, and content occupies 2.",
          startingCode: `.dashboard {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n}`
        },
        projectChallenge: {
          title: "Unified Grid Architecture",
          description: "Build a robust blog gallery grid with a leading featured big card stretching multi-column views.",
          startingCode: `.grid-gallery { display: grid; }`
        },
        youtubeVideos: [
          { title: "Complete CSS Grid Course", videoId: "jV8B9UxIn9g", level: "Advanced" }
        ],
        externalResources: [
          { title: "Complete Guide to CSS Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" }
        ]
      }
    ]
  },
  {
    id: "sec-6",
    title: "SECTION 6: BOOTSTRAP",
    topics: [
      {
        id: "bootstrap-intro",
        sectionId: "sec-6",
        title: "Bootstrap UI Elements & Containers",
        whyExists: "Accelerate production with pre-built interface modules, CSS rules, grids, buttons, and alert badges.",
        realWorldUse: "Fast styling layout mockups, building executive portals, admin control dashboards, and highly consistent utilities.",
        explanation: "Bootstrap is a framework of CSS utilities and interactive JavaScript code. It utilizes standard classes like `.container`, `.row`, `.col-[size]-[number]` to build fluid column grids, along with standard elements like Alert banners, modal panels, and navigations.",
        syntaxRef: {
          syntax: "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-6\">Column 1</div>\n    <div class=\"col-md-6\">Column 2</div>\n  </div>\n</div>",
          explanation: "Builds a responsive row of 2 equal columns on medium or larger screens.",
          parameters: "class names: btn, card, modal, carousel",
          example: "<button class=\"btn btn-primary\">Login</button>",
          output: "A well-designed blue action button.",
          notes: "Bootstrap requires loading its visual styles as well as its companion JS module files for modals and dropdowns to work properly."
        },
        visualDiagram: `+-----------------------------------------------+ \n| .container                                    | \n|  +-----------------------------------------+  | \n|  | .row                                    |  | \n|  |  +---------------+   +---------------+  |  | \n|  |  | .col-md-6     |   | .col-md-6     |  |  | \n|  |  +---------------+   +---------------+  |  | \n|  +-----------------------------------------+  | \n+-----------------------------------------------+`,
        commonMistakes: [
          "Loading the full bootstrap library when you only use standard button sizes.",
          "Mixing inline custom margins with bootstrap spacer classes like mt-3.",
          "Adding rows outside container parent shells, resulting in horizontal scrolling overlaps."
        ],
        practiceTask: {
          id: "task-bootstrap-1",
          instructions: "Create a modern premium bootstrap card tag with image, header, and description wrapper class.",
          startingCode: `<div class="card" style="width: 18rem;">\n  <div class="card-body">\n    <h5 class="card-title">Card Title</h5>\n    <p class="card-text">Some description.</p>\n  </div>\n</div>`
        },
        mcqs: [
          {
            id: "mcq-bs-1",
            question: "Which class yields a standard highlighted primary action button in Bootstrap?",
            options: ["btn-highlight", "btn-main", "btn-primary", "button-blue"],
            correctAnswerIndex: 2,
            explanation: "btn-primary styles the default interactive bootstrap primary action."
          }
        ],
        miniChallenge: {
          title: "Custom Grid Mockup",
          description: "Use tailwind equivalents to form standard Bootstrap utility columns.",
          startingCode: `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">Columns</div>`
        },
        projectChallenge: {
          title: "Complete Landing Structure",
          description: "Assemble a responsive navbar, hero banner card grid, and alert badge panel.",
          startingCode: `<nav>Bootstrap navbar</nav>`
        },
        youtubeVideos: [
          { title: "Bootstrap 5 Crash Course", videoId: "Jyvffr3aRy0", level: "Beginner" }
        ],
        externalResources: [
          { title: "Bootstrap Official Docs", url: "https://getbootstrap.com/docs/" }
        ]
      }
    ]
  },
  {
    id: "sec-7",
    title: "SECTION 7: WEB DESIGN + UI/UX",
    topics: [
      {
        id: "uiux-intro",
        sectionId: "sec-7",
        title: "Color Theory & Contrast Accessibility",
        whyExists: "Superb platforms marry functional backend integrity with pristine, safe aesthetic visual guidelines.",
        realWorldUse: "Selecting brand palettes, satisfying design guidelines (such as WCAG AAA accessibility scores), and enhancing page conversions.",
        explanation: "Color Theory helps form clean palettes based on relationships (such as complementary, analogous, and triadic schemes). visual hierarchy guides user attention using font size, color weight, and responsive negative whitespace. Accessibility rules ensure text elements retain a contrast ratio of at least 4.5:1 against backdrops.",
        syntaxRef: {
          syntax: "Primary: Deep Navy (60%) \nSecondary: Charcoal Slate (30%)\nAccent: High Contrast Amber (10%)",
          explanation: "Applying the 60-30-10 color rule for a balanced webpage layout.",
          parameters: "contrast, font-scale, spacing",
          example: "WCAG contrast ratio score >= 4.5:1",
          output: "Highly readable experience for visually impaired users.",
          notes: "Always define outline rings on focused interactive links to support keyboard navigation."
        },
        visualDiagram: `[ DOMINANT COLOR 60% (Canvas) ]\n     |---> [ SUPPORTING GRAY 30% (Cards, text structure) ]\n              |---> [ ACCENT GOLD 10% (Action buttons, badges) ]`,
        commonMistakes: [
          "Using light gray text on white backgrounds, rendering content unreadable.",
          "Using colored buttons to mean multiple things, confusing context.",
          "Throwing too many distinct layouts on a single page, breaking focus flow."
        ],
        practiceTask: {
          id: "task-design-1",
          instructions: "Style a high contrast CTA container with accessible colors.",
          startingCode: `<button class="bg-[#1e293b] text-[#f8fafc] px-4 py-2 font-semibold">Center Action</button>`
        },
        mcqs: [
          {
            id: "mcq-u-1",
            question: "What is the recommended design ratio guideline for balanced element coloring?",
            options: ["50-30-20", "60-30-10", "40-40-20", "80-10-10"],
            correctAnswerIndex: 1,
            explanation: "60-30-10 distributes colors harmoniously across backgrounds, text, and active accents."
          }
        ],
        miniChallenge: {
          title: "Wireframe Layout",
          description: "Establish a clear layout structure showing header, central grid, and footer.",
          startingCode: `console.log("Mock grid UI created with proper high contrast ratios.");`
        },
        projectChallenge: {
          title: "Palette Generator",
          description: "Draft code displaying 4 accessible nested elements showing off-white canvases and dark active texts.",
          startingCode: `console.log("Color palette designed");`
        },
        youtubeVideos: [
          { title: "UI/UX Fundamentals", videoId: "c9Wg6Ap_Y_A", level: "Beginner" }
        ],
        externalResources: [
          { title: "Refactoring UI Tips", url: "https://www.refactoringui.com/" }
        ]
      }
    ]
  },
  {
    id: "sec-8",
    title: "SECTION 8: JAVASCRIPT ES6",
    topics: [
      {
        id: "js-core",
        sectionId: "sec-8",
        title: "JavaScript ES6, Arrays & Async / Await",
        whyExists: "JavaScript breathes functional logic, math calculations, and networking actions into standard static browser documents.",
        realWorldUse: "Interacting with APIs, asynchronous state data management, UI state triggers, and dynamic canvas loops.",
        explanation: "JavaScript is a lightweight, dynamically-typed scripting language. ES6 (ECMAScript 2015) introduced modernized paradigms: block variables `let`/`const`, Arrow Functions, Rest/Spread operators, Destructuring, Classes, and array methods like `map`, `filter`, and `reduce`. For asynchronous actions, Promises and the clean `async`/`await` system replaced convoluted callback hierarchies.",
        syntaxRef: {
          syntax: "const fetchResult = async (url) => {\n  try {\n    const res = await fetch(url);\n    const list = await res.json();\n    return list.filter(item => item.active);\n  } catch (err) {\n    console.error(err);\n  }\n};",
          explanation: "Retrieves network API data, parses the JSON payload, and returns filtered items asynchronously.",
          parameters: "url, list, filter methods",
          example: "const [first, ...rest] = [1, 2, 3]; // Destructuring",
          output: "first = 1, rest = [2, 3]",
          notes: "Never use the deprecated 'var' variable container. Always prevent memory leaks in promises."
        },
        visualDiagram: `[ JS CALL STACK ] ---> calls fetch() API\n  [ WEB APIs (Async Browser background thread) ] ---> handles request\n  [ CALLBACK EVENT QUEUE ] ---> waits for main stack to clear\n[ EVENT LOOP ] ---> pushes responses back onto Stack`,
        commonMistakes: [
          "Forgetting that await can only be used inside nested 'async' functions.",
          "Mutating arrays directly instead of using pure methods like map/filter/spread.",
          "Confusing double equal '==' (evaluates values with coercion) with triple equal '===' (compares value and type strictly)."
        ],
        practiceTask: {
          id: "task-js-1",
          instructions: "Fix this array mapper. Multiply numbers by 2, keep values greater than 5.",
          startingCode: `const numbers = [1, 2, 3, 4, 5];\n// Map then filter safely\nconst result = numbers.map(x => x * 2).filter(x => x > 5);\nconsole.log(result);`
        },
        mcqs: [
          {
            id: "mcq-js-1",
            question: "Which array method creates a new array of only items that evaluate a test query to true?",
            options: ["map()", "reduce()", "find()", "filter()"],
            correctAnswerIndex: 3,
            explanation: "filter() returns a new subset containing the items passing custom test logic."
          }
        ],
        miniChallenge: {
          title: "Promises Race",
          description: "Write an async function wrapping setTimeout in a Promise that fires resolve after 1 second.",
          startingCode: `const wait = ms => new Promise(res => setTimeout(res, ms));\nasync function go() {\n  await wait(1000);\n  console.log("Fired!");\n}\ngo();`
        },
        projectChallenge: {
          title: "Array Data Pipeline",
          description: "Given a catalog list, return the total sum of pricing using map, filter, and reduce.",
          startingCode: `const catalog = [{ price: 10, buy: true }, { price: 20, buy: false }];\nconst total = catalog.filter(c => c.buy).reduce((acc, c) => acc + c.price, 0);`
        },
        youtubeVideos: [
          { title: "JS ES6 Complete Guide", videoId: "hdI2bqOjy3c", level: "Beginner" }
        ],
        externalResources: [
          { title: "MDN: JS Asynchronous patterns", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous" }
        ]
      }
    ]
  },
  {
    id: "sec-9",
    title: "SECTION 9: DOM",
    topics: [
      {
        id: "dom-manipulation",
        sectionId: "sec-9",
        title: "DOM Manipulation & Event Listeners",
        whyExists: "The Document Object Model (DOM) is the visual node tree of elements. Manipulating this tree lets JS dynamically adjust page interfaces.",
        realWorldUse: "Capturing input forms, triggering theme toggles, adding elements dynamically, and animating boxes on click.",
        explanation: "When you load a portal, the browser develops a node model representation. Using JS APIs like `querySelector`, `getElementById`, `createElement`, `appendChild`, and `addEventListener`, you can interactively redesign the user interface in real-time.",
        syntaxRef: {
          syntax: "const btn = document.querySelector(\"#theme-btn\");\nbtn.addEventListener(\"click\", (e) => {\n  document.body.classList.toggle(\"dark\");\n});",
          explanation: "Finds the element by ID, listens for desktop click events, and alters body styling class parameters.",
          parameters: "selector, event string, action callback",
          example: "const el = document.createElement(\"div\"); el.textContent = \"Hello\";",
          output: "A detached paragraph container containing string text.",
          notes: "Always clean up active event listeners on large apps to prevent browser memory leaks."
        },
        visualDiagram: ` [ window ]\n     |\n  [ document ]\n     |\n  <html>\n   /    \\\n<head>  <body>\n          /    \\\n       <main>  <nav>`,
        commonMistakes: [
          "Attempting to read querySelector results before the absolute DOM finishes loading.",
          "Repeatedly recreating elements in high performance loops instead of using Fragment wrappers.",
          "Using raw innerHTML, opening vulnerability loops to injection scripts (XSS)."
        ],
        practiceTask: {
          id: "task-dom-1",
          instructions: "Assemble a responsive element creation code block adding children containers.",
          startingCode: `const parent = document.getElementById("root");\nconst p = document.createElement("p");\np.textContent = "New element text";\nparent?.appendChild(p);`
        },
        mcqs: [
          {
            id: "mcq-dom-1",
            question: "Which API method attaches an interactive action trigger to a targeted DOM element?",
            options: ["onTrigger", "addEventListener", "captureMethod", "appendEvent"],
            correctAnswerIndex: 1,
            explanation: "addEventListener registers a custom listener to capture dynamic user visual browser actions."
          }
        ],
        miniChallenge: {
          title: "Dynamic List Adder",
          description: "Write code to fetch an input text and insert a new checklist item with a matching removal control.",
          startingCode: `console.log("Clean element inserted with functional remover.");`
        },
        projectChallenge: {
          title: "Ultimate Counter Application",
          description: "Build an interactive count widget containing increment, decrement, and reset controls.",
          startingCode: `// Use count variable in event triggers`
        },
        youtubeVideos: [
          { title: "Modern DOM Manipulation Guide", videoId: "y17RuWkWdn8", level: "Beginner" }
        ],
        externalResources: [
          { title: "Eloquent JavaScript DOM Guide", url: "https://eloquentjavascript.net/14_dom.html" }
        ]
      }
    ]
  },
  {
    id: "sec-10",
    title: "SECTION 10: UNIX TERMINAL",
    topics: [
      {
        id: "unix-terminal",
        sectionId: "sec-10",
        title: "Unix Shell Commands & Navigation",
        whyExists: "Developers interact with servers, compilers, databases, and deployment pipelines using shell command prompts.",
        realWorldUse: "Configuring continuous pipelines, checking host folders, pushing code revisions, executing server packages.",
        explanation: "The Unix Terminal is a command interface environment that communicates directly with the computer operating system. It allows lightning-fast filesystem mapping (using `cd`, `ls`, `pwd`), folder building (`mkdir`, `touch`), and asset administration (`rm`, `mv`, `cp`).",
        syntaxRef: {
          syntax: "pwd                # Print Working Directory\nls -la             # List all contents with permissions\ncd ../project      # Check child directory level\nmkdir src          # Make structured directory",
          explanation: "Basic commands to verify structural context, list directory items, traverse folders, and instantiate assets.",
          parameters: "-la (all files format), -rf (forced directory removal)",
          example: "touch server.js && echo \"console.log(3)\" > server.js",
          output: "Creates file containing declared log code.",
          notes: "Be careful with forced removals like rm -rf, which immediately wipe filesystem branches."
        },
        visualDiagram: `[ UNIX KERNEL CPU OPERATIONS ]\n     ^ \n     | (Communicates hardware-to-logic instructions)\n[ SHELL INTERFACE (Bash / Zsh) ]\n     ^ \n     | (Captures string inputs like mkdir or ls)\n[ WEB CONSOLE / TERMINAL EMULATOR ]`,
        commonMistakes: [
          "Forgetting your currently active terminal path and writing files to home directory structures.",
          "Using rm -rf relative to empty variables, which can recursively erase system folders.",
          "Not knowing that cd carries you home, or cd .. carries you up a level."
        ],
        practiceTask: {
          id: "task-term-1",
          instructions: "Fix this script chain. Enter src, create index.js, list contents.",
          startingCode: `// cd src && touch index.js && ls`
        },
        mcqs: [
          {
            id: "mcq-term-1",
            question: "Which terminal utility command shows path details of the current working directory folder?",
            options: ["ls", "mkdir", "pwd", "cd"],
            correctAnswerIndex: 2,
            explanation: "pwd (print working directory) displays the absolute path location representing your active session focus."
          }
        ],
        miniChallenge: {
          title: "File Pipeline script",
          description: "Simulate a command chain that creates a folder template and lists items.",
          startingCode: `// Write clean steps matching folder templates`
        },
        projectChallenge: {
          title: "Automation Task Scripting",
          description: "Write recursive instructions that setup code layouts, add configuration packages, and clear caches.",
          startingCode: `// Command pipeline automation`
        },
        youtubeVideos: [
          { title: "Unix Terminal Beginners Tutorial", videoId: "oxuRxtrO2Ag", level: "Beginner" }
        ],
        externalResources: [
          { title: "Linux Command handbook", url: "https://www.linuxcommand.org/" }
        ]
      }
    ]
  },
  {
    id: "sec-11",
    title: "SECTION 11: GIT AND GITHUB",
    topics: [
      {
        id: "git-basics",
        sectionId: "sec-11",
        title: "Git Workflows & Version Control",
        whyExists: "As programs scale, tracking edits, deploying features, and reviewing source code requires absolute organization across teams.",
        realWorldUse: "Protecting production branches through code reviews, tracking historical code versions, rollback plans during server outages.",
        explanation: "Git is a distributed version tracker. It stores snapshots of files as commits. GitHub serves as a secure storage container for these branches under collaborative cloud vaults. The flow is: Working Directory (edit code) -> Staging Area (`git add`) -> Local Repository (`git commit`) -> Remote Repo (`git push`).",
        syntaxRef: {
          syntax: "git init\ngit add .\ngit commit -m \"feat: initialize course layout\"\ngit push origin main",
          explanation: "Establishes tracker metadata, staging edits, records version snapshots, and synchronizes with cloud servers.",
          parameters: "commit message formats, branch indicators, upstream tags",
          example: "git checkout -b feature-ai",
          output: "Switches current focus to a sandbox features branch.",
          notes: "Write clean commit logs describing functional features, avoiding vague explanations like 'fixed bugs'."
        },
        visualDiagram: ` [ Working Directory ]\n        | (git add)\n        v\n   [ Staging Area ]\n        | (git commit)\n        v\n [ Local Repository ]\n        | (git push)\n        v\n[ Remote GitHub Host ]`,
        commonMistakes: [
          "Committing credentials inside git, exposing API keys to global GitHub feeds.",
          "Forgetting to pull remote changes before attempting to push, resulting in merge conflicts.",
          "Wiping dynamic branches using force pushes unnecessarily."
        ],
        practiceTask: {
          id: "task-git-1",
          instructions: "Correct spelling in common basic terminal checkout directives.",
          startingCode: `// git checkout -b feature-theme`
        },
        mcqs: [
          {
            id: "mcq-git-1",
            question: "Which command moves changes from the working directory to the staging area?",
            options: ["git commit", "git push", "git add", "git status"],
            correctAnswerIndex: 2,
            explanation: "git add stages selected modifications for compilation into the next snapshot."
          }
        ],
        miniChallenge: {
          title: "Resolution of Conflicts",
          description: "Compare conflict arrows and resolve the head code differences.",
          startingCode: `<<<<<<< HEAD\nconsole.log("Local Choice");\n=======\nconsole.log("Remote Choice");\n>>>>>>> main`
        },
        projectChallenge: {
          title: "Simulated Git Graph Workflow",
          description: "Establish a feature branch, execute mock commits, merge logic towards main.",
          startingCode: `console.log("Perfect feature pull-request merged");`
        },
        youtubeVideos: [
          { title: "Git for Absolute Beginners", videoId: "RGOj5yHY7pQ", level: "Beginner" }
        ],
        externalResources: [
          { title: "Atlassian Git Tutorials", url: "https://www.atlassian.com/git" }
        ]
      }
    ]
  },
  {
    id: "sec-12",
    title: "SECTION 12: REACT",
    topics: [
      {
        id: "react-hooks",
        sectionId: "sec-12",
        title: "React, Props, State & Component Lifecycle",
        whyExists: "Building expansive portals with manual DOM modifications quickly becomes highly error-prone. React introduces descriptive state declarations.",
        realWorldUse: "Building interactive, lightning-fast portals, SaaS dashboards, and streaming feeds.",
        explanation: "React is a modular UI renderer library. It divides user interfaces into reusable components. Using components, variables are passed through explicit read-only properties (Props). Stateful values inside components are declared using Hooks (`useState`). Visual updates happen when states or props modify.",
        syntaxRef: {
          syntax: "import { useState, useEffect } from 'react';\n\nexport const Counter = ({ step = 1 }) => {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    console.log('Count changed to', count);\n  }, [count]);\n\n  return <button onClick={() => setCount(count + step)}>+{step}</button>;\n};",
          explanation: "Hooks into component reactive state, registers post-render triggers, and returns declarative visual JSX markup.",
          parameters: "useState initialization, useEffect dependency array list",
          example: "<Counter step={5} />",
          output: "Interactive counter that increments components state by 5.",
          notes: "Always define stable values on useEffect dependency array to avoid infinite loops."
        },
        visualDiagram: `[ STATE OR PROPS CHANGE ]\n     |\n     v\n[ REACT RE-READS DECLARED JSX ]\n     |\n     v (Drafts virtual node model structure)\n[ VIRTUAL DOM ] ----> Computes minimum changes (Diffing)\n     |\n     v (Applies real updates to browser screen)\n[ ACTUAL BROWSER DOM ]`,
        commonMistakes: [
          "Mutating state directly (e.g., state.count = 5) instead of passing values to dispatchers.",
          "Adding unrequested state loops inside rendering scopes, triggering loop crashes.",
          "Missing hook imports or using them inside conditional loops."
        ],
        practiceTask: {
          id: "task-react-1",
          instructions: "Maintain a simple input controller binding input string text state safely.",
          startingCode: `import { useState } from 'react';\n\nexport function InputField() {\n  const [text, setText] = useState("");\n  return <input value={text} onChange={e => setText(e.target.value)} />;\n}`
        },
        mcqs: [
          {
            id: "mcq-r-1",
            question: "What is the primary role of the dependency array inside standard useEffect hooks?",
            options: ["Differentiate prop types", "Control render triggers conditionally", "Format state output strings", "Attach root containers"],
            correctAnswerIndex: 1,
            explanation: "The dependency array lists trigger triggers. Re-runs only run if these specific variables alter values."
          }
        ],
        miniChallenge: {
          title: "Interactive Toggle State",
          description: "Build a clickable panel showing and hiding a detailed information card.",
          startingCode: `import { useState } from 'react';\nexport function ToggleBox() {\n  const [open, setOpen] = useState(false);\n  return <button onClick={() => setOpen(!open)}>Toggle</button>;\n}`
        },
        projectChallenge: {
          title: "Interactive Live Task List",
          description: "Build an list component using map render routines, with addition inputs and deletion controls.",
          startingCode: `import { useState } from 'react';\nexport function Kanban() { return <div/>; }`
        },
        youtubeVideos: [
          { title: "React Crash Course 2026", videoId: "SqcY0GlETPk", level: "Beginner" }
        ],
        externalResources: [
          { title: "Official React Documentation", url: "https://react.dev/" }
        ]
      }
    ]
  },
  {
    id: "sec-13",
    title: "SECTION 13: NODEJS & EXPRESS",
    topics: [
      {
        id: "node-server",
        sectionId: "sec-13",
        title: "NodeJS Fundamentals & Express APIs",
        whyExists: "Browsers run client scripts locally. Node.js enables running server JS computations, database hosting, and secure asset streams.",
        realWorldUse: "Building secure application APIs, session authentications, file uploads, server controllers, payment checkouts.",
        explanation: "Node.js is open-source, backend JavaScript built on Chrome's V8 motor. Express.js is a streamlined server architecture designed over Node. It handles incoming requests, registers server paths (Routing), integrates middleware systems, and delivers response payloads (such as HTML or JSON blocks).",
        syntaxRef: {
          syntax: "import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/api/users', (req, res) => {\n  res.status(200).json({ success: true, list: [] });\n});",
          explanation: "Constructs server engine, processes middleware payloads, and registers GET routes Returning JSON feeds.",
          parameters: "request parameters, resource body payload variables, status status codes",
          example: "app.listen(3000, () => console.log('Live!'));",
          output: "Spins up server ready to receive API calls.",
          notes: "Always define HTTP status status codes correctly (e.g., 200 OK, 201 Created, 400 Bad Request, 500 Server Error)."
        },
        visualDiagram: ` [ HTTP GET PATH /api/users ]\n              |\n              v (Passed through middlewares: authentication triggers)\n [ EXPRESS MIDDLEWARE PIPELINE ]\n              |\n              v (Executes path control handler functions)\n [ ROUTE CONTROLLER ] ---> fetches logic ---> returns res.json()`,
        commonMistakes: [
          "Forgetting to call res.send() or res.json(), which leaves requests hanging forever.",
          "Sending multiple responses for a single route request, triggering execution errors.",
          "Forgetting express.json() parser middleware, resulting in undefined body data."
        ],
        practiceTask: {
          id: "task-node-1",
          instructions: "Fix route method spelling. Register a POST method processing user creation requests safely.",
          startingCode: `// const express = require('express');\n// const app = express();\n// app.post('/api/create', (req, res) => res.json({ status: "Created" }));`
        },
        mcqs: [
          {
            id: "mcq-node-1",
            question: "Which Express function acts as an interceptor processing requests before reaching target routes?",
            options: ["Router", "Middleware", "Model", "Database Schema"],
            correctAnswerIndex: 1,
            explanation: "Middleware acts as a server pipeline processing gate intercepting operations (e.g. loggers, authentication checks)."
          }
        ],
        miniChallenge: {
          title: "Custom Middleware Logger",
          description: "Write custom logging code tracking path names and query strings in background outputs.",
          startingCode: `const logger = (req, res, next) => {\n  console.log(req.path);\n  next();\n};`
        },
        projectChallenge: {
          title: "Fully Functional Express pipeline",
          description: "Build an API router returning status indices, dynamically filterable by ID querying requests.",
          startingCode: `// app.get('/api/users/:id')`
        },
        youtubeVideos: [
          { title: "Node.js & Express REST tutorial", videoId: "Oe421EPjeBE", level: "Beginner" }
        ],
        externalResources: [
          { title: "Express.js Official Guide", url: "https://expressjs.com/" }
        ]
      }
    ]
  },
  {
    id: "sec-15",
    title: "SECTION 15: APIs & NETWORKING",
    topics: [
      {
        id: "apis-networking",
        sectionId: "sec-15",
        title: "APIs, HTTP Methods, Fetch & Axios",
        whyExists: "Modern software acts as a network of connected subsystems. Applications fetch, process, and send data across APIs persistently.",
        realWorldUse: "Connecting authentication systems, reading Stripe accounts, displaying weather trackers, parsing database changes.",
        explanation: "API (Application Programming Interface) allows systems to communicate. REST APIs follow clean HTTP standard methods (GET reads, POST creates, PUT updates, DELETE removes). Clients execute network transfers using browser native `fetch` or the specialized `axios` client utilities.",
        syntaxRef: {
          syntax: "const fetchUser = async (id) => {\n  const res = await fetch(\`https://api.github.com/users/\${id}\`);\n  if (!res.ok) throw new Error('Data get failed!');\n  return await res.json();\n};",
          explanation: "Dispatches HTTP GET, validates response health metrics, formats JSON feeds.",
          parameters: "endpoint string, headers, HTTP methods",
          example: "axios.post('/api/todo', { task: 'React layout' })",
          output: "Constructed payload safely transferred to backend API streams.",
          notes: "Always handle and catch network dropouts or invalid status returns safely."
        },
        visualDiagram: ` [ CLIENT REACT CODE ]             [ DATABASE SERVER ]\n         |                                 ^\n         v (fetch() POST -> JSON body)      |\n   [ SERVER API ROUTES ] -----------------+ (Processes CRUD SQL)`,
        commonMistakes: [
          "Assuming fetch automatically rejects on HTTP error statuses (like 500 or 404). Always check res.ok.",
          "Sending body payloads on GET requests. Body data requires POST/PUT methods.",
          "Exposing secret tokens inside client application headers, leaking security keys."
        ],
        practiceTask: {
          id: "task-api-1",
          instructions: "Fix this fetch helper to execute POST method instead of default GET.",
          startingCode: `fetch('/api/tasks', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Web development' })\n})`
        },
        mcqs: [
          {
            id: "mcq-api-1",
            question: "Which HTTP request method represents the deletion of a specific resource?",
            options: ["POST", "GET", "PUT", "DELETE"],
            correctAnswerIndex: 3,
            explanation: "DELETE indicates the backend target database item should be removed."
          }
        ],
        miniChallenge: {
          title: "API Playground Route",
          description: "Mock a standard axios sequence sending user settings, parsing results, and managing errors.",
          startingCode: `axios.put('/api/settings', { theme: 'dark' }).then(res => console.log(res.data));`
        },
        projectChallenge: {
          title: "Interactive Weather API Client",
          description: "Establish structural API calls pulling geo location details, rendering cards dynamically.",
          startingCode: `console.log("Mock weather cards created");`
        },
        youtubeVideos: [
          { title: "REST APIs & Fetching Tutorial", videoId: "WXsD0ZgD8Gc", level: "Beginner" }
        ],
        externalResources: [
          { title: "MDN Fetch API guide", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" }
        ]
      }
    ]
  },
  {
    id: "sec-16",
    title: "SECTION 16: DATABASES",
    topics: [
      {
        id: "databases-sql",
        sectionId: "sec-16",
        title: "Relational SQL Databases & PostgreSQL Basics",
        whyExists: "Information disappears when container servers recycle. Databases provide structured, permanent data storage.",
        realWorldUse: "Tracking user progress records, leaderboards, blog articles, payment records, session histories.",
        explanation: "Databases are divided into Relational (SQL, like PostgreSQL) and flat NoSQL (like MongoDB). SQL structures tables in rows and columns, enforcing rigorous relations (Keys, Joins, relationships). CRUD (Create, Read, Update, Delete) are modeled using structured query phrases.",
        syntaxRef: {
          syntax: "SELECT u.id, u.username, p.xp\nFROM users u\nJOIN profiles p ON u.id = p.user_id\nWHERE p.xp > 5000\nORDER BY p.xp DESC;",
          explanation: "Reads distinct keys across linked user profiles, filtering by XP scores, sorted in descending layout order.",
          parameters: "SELECT, JOIN, WHERE, ORDER BY, GROUP BY",
          example: "INSERT INTO users (username, email) VALUES ('sam', 'sam@gmail.com');",
          output: "Successful row creation on users table index.",
          notes: "Primary keys uniquely identify a row, while foreign keys establish connections between multiple tables."
        },
        visualDiagram: `[ TABLE USERS ]                     [ TABLE PROFILES ]\n  id (PK) <-----------------------+   id (PK)\n  username                        |   user_id (FK)\n  email                           +-- xp`,
        commonMistakes: [
          "Forgetting proper indexes on columns, resulting in massive table scan dropouts as data grows.",
          "Storing values in flat text rows instead of leveraging relationships.",
          "Leaking plain text passwords directly to SQL rows instead of cryptographically hashed strings."
        ],
        practiceTask: {
          id: "task-db-1",
          instructions: "Fix this SQL query to update user level instead of inserting a new row.",
          startingCode: `UPDATE users SET level = 3 WHERE id = 'user-123';`
        },
        mcqs: [
          {
            id: "mcq-db-1",
            question: "Which database Join fetches all records matching overlapping relationships on keys across two tables?",
            options: ["RIGHT JOIN", "OUTER JOIN", "INNER JOIN", "CROSS JOIN"],
            correctAnswerIndex: 2,
            explanation: "INNER JOIN captures records with matching overlapping values on linked columns from both target tables."
          }
        ],
        miniChallenge: {
          title: "CRUD Schema Creation",
          description: "Model a baseline structured table showing typical student level accomplishments databases.",
          startingCode: `CREATE TABLE achievements (\n  id SERIAL PRIMARY KEY,\n  user_id INT REFERENCES users(id),\n  badge_name VARCHAR(50)\n);`
        },
        projectChallenge: {
          title: "SQL Query Lab Simulator",
          description: "Establish schemas validating student task tracking indices, grouping outputs correctly.",
          startingCode: `console.log("SQL schema mapped");`
        },
        youtubeVideos: [
          { title: "SQL & PostgreSQL Tutorial", videoId: "qw--VYLpxG4", level: "Beginner" }
        ],
        externalResources: [
          { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" }
        ]
      }
    ]
  },
  {
    id: "sec-17",
    title: "SECTION 17: WEB3 & BLOCKCHAIN",
    topics: [
      {
        id: "web3-intro",
        sectionId: "sec-17",
        title: "Blockchain Foundations & Smart Contracts",
        whyExists: "Decentralized trust systems introduce smart contracts, trustless ledgers, canisters, and asset cryptos.",
        realWorldUse: "Decentralized finance (DeFi), tracking asset ownership (NFTs), immutable identity verification.",
        explanation: "Web3 centers around secure blockchain environments. Smart Contracts are immutable, self-executing software programs deployed on-chain that run exactly as programmed without central controller servers.",
        syntaxRef: {
          syntax: "pragma solidity ^0.8.20;\n\ncontract Certifier {\n  mapping(address => string) public certs;\n  function assignCert(string memory hash) public {\n    certs[msg.sender] = hash;\n  }\n}",
          explanation: "A solidity program deployed on Ethereum mapping public address identities to certificates.",
          parameters: "contract, compiler parameters, visibility indicators",
          example: "certifier.assignCert('0xabc...')",
          output: "Cert validation transaction record permanently sealed inside on-chain blocks.",
          notes: "Web3 programs are fully public and immutable. Correct compilation security is vital because code cannot be modified once deployed."
        },
        visualDiagram: ` [ USER TRANSACTION ] ---> Signs wallet keys (MetaMask)\n          |\n          v\n [ BLOCK MINER / VALIDATORS ] ---> compiles contracts logic on EVM\n          |\n          v / State modified globally\n [ DISTRIBUTED CHAIN LEDGER ]`,
        commonMistakes: [
          "Exposing master secret keys in client smart script code.",
          "Thinking blockchain databases are fit for massive bulk record storage. On-chain memory remains extremely expensive.",
          "Forgetting high gas fee variables in deployment math calculations."
        ],
        practiceTask: {
          id: "task-w3-1",
          instructions: "Fix Solidity compiler declaration spelling errors in the playground draft.",
          startingCode: `pragma solidity ^0.8.0;\ncontract Hello {}\n`
        },
        mcqs: [
          {
            id: "mcq-w3-1",
            question: "What does the gas fee represent in standard smart contract execution pipelines?",
            options: ["Network storage capacity limit", "Server physical location rate", "Computation cost compensation for validators", "Cryptocurrency inflation tax"],
            correctAnswerIndex: 2,
            explanation: "Gas fees compensate miner validators for the processing electricity required to compile transactions in virtual machines."
          }
        ],
        miniChallenge: {
          title: "Token Balance Script",
          description: "Establish dummy lookup logic scanning active wallet address records.",
          startingCode: `function checkBalance(address) public view returns (uint) { return 100; }`
        },
        projectChallenge: {
          title: "On-Chain Certificate Registry",
          description: "Build an interface querying on-chain hashes validating graduation states.",
          startingCode: `console.log("Certificate contract deployed successfully");`
        },
        youtubeVideos: [
          { title: "Web3 Complete Course", videoId: "M576WGiDBdQ", level: "Beginner" }
        ],
        externalResources: [
          { title: "Ethereum developer guide", url: "https://ethereum.org/en/developers/" }
        ]
      }
    ]
  }
];
