/* Bilingual homepage content. */
window.SHAOTING_HOME_CONTENT = {
  "en": {
    "meta": {
      "title": "Shaoting He — ICU Nurse. Independent Builder.",
      "description": "ICU nurse. Independent builder. Shaoting He brings a nurse’s attention to the software he creates. Explore AUV, QDigest, and ways to collaborate."
    },
    "nav": [
      [
        "projects",
        "Work"
      ],
      [
        "about",
        "About"
      ],
      [
        "contact",
        "Collaborate"
      ]
    ],
    "ui": {
      "skip": "Skip to content",
      "language": "Language",
      "light": "Switch to light theme",
      "motion": "Pause background motion",
      "motionShort": "Pause",
      "resume": "Resume background motion",
      "resumeShort": "Play",
      "dark": "Switch to dark theme",
      "reduced": "Motion reduced by your device",
      "reducedShort": "Still",
      "menu": "Main navigation",
      "github": "GitHub",
      "back": "Back to top",
      "more": "Behind the project",
      "copy": "Copy email",
      "copied": "Email copied",
      "copyFailed": "Copy unavailable. Use the email link.",
      "close": "Close",
      "projectPreview": "View AUV screenshot",
      "codeBlue": "Code blue",
      "codeBlueOn": "Nurse joke: switch the waveform to V-Fib",
      "codeBlueOff": "Deliver a shock and restore sinus rhythm",
      "shock": "Shock",
      "desktopOnly": "AUV runs on Mac and Windows computers. Open this page on your computer to download it.",
      "shareLink": "Send the link to my computer",
      "linkCopied": "Link copied",
      "readingLab": "Reading Lab",
      "readingLabTitle": "Open the QDigest Reading Lab",
      "readingLabUrl": "/qdigest/"
    },
    "hero": {
      "eyebrow": "SHAOTING HE / REGISTERED NURSE",
      "line1": "Nurse.",
      "line2": "Builder.",
      "intro": "I work in intensive care and build software beyond it. Next: tools for nursing, and health research anyone can read. I’m looking for people to build them with.",
      "primary": "Work with me",
      "secondary": "See the work",
      "note": "ICU practice · Nova Scotia, Canada",
      "current": "OPEN TO",
      "currentProjects": "New collaborations"
    },
    "work": {
      "eyebrow": "01 / FROM OBSERVATION TO SOFTWARE",
      "title": "The work speaks.",
      "intro": "Native AI usage tools for Windows and Mac. A bilingual research digest. A one-click screenshot lens for Windows. Making information easier to use.",
      "all": "Explore my GitHub"
    },
    "projects": [
      {
        "id": "uma",
        "number": "01",
        "name": "AUV",
        "subtitle": "Agent Usage Viewer",
        "status": "macOS 0.18.4 · Windows 0.18.4",
        "kind": "Windows & Mac app",
        "headline": "Know how much AI coding time you have left.",
        "description": "AUV is a desktop app for Mac and Windows that shows your Codex and Claude usage and limits at a glance, so you can pace your work.",
        "tags": [
          "English / 中文"
        ],
        "primary": "Download AUV",
        "url": "https://github.com/ShaoJHe-SilkRoad/UMA/releases/download/v0.18.4/AUV_Mac_0.18.4_Universal.zip",
        "secondary": "Installation guide",
        "secondaryUrl": "/auv/install/",
        "caption": "AUV 0.18.4 on macOS · live Claude and Codex usage",
        "whyTitle": "What it is for",
        "why": "Seeing how much Codex and Claude time is left before starting a long piece of work, without opening each account.",
        "focusTitle": "The hardest parts",
        "focus": "Exact Claude usage comes from a signed-in Safari session, so AUV has to keep reading it when Safari is hidden, minimized or on another desktop. The other half of the work is shipping a signed, notarized Universal Mac app alongside a separate Windows version.",
        "inviteTitle": "Where help is needed",
        "invite": "Windows is the gap: 0.18.4 now matches the Mac wherever Windows can, but it ships unsigned and has no Claude reading yet. A developer who knows Windows packaging and code signing would make the biggest difference. Testing and design feedback from people who use Codex or Claude every day is just as welcome.",
        "log": {
          "label": "AUV · Build log",
          "title": "My first public app, built in the open.",
          "note": "From the public GitHub repository · as of 31 Oct 2026",
          "stats": [
            [
              "235",
              "Commits"
            ],
            [
              "16",
              "Weeks in a row with commits"
            ],
            [
              "15",
              "Public releases"
            ],
            [
              "88%",
              "Written in Swift"
            ]
          ],
          "weeksLabel": "Commits per week, July to October 2026",
          "weeks": [
            13,
            3,
            15,
            12,
            16,
            6,
            8,
            17,
            14,
            5,
            9,
            13,
            18,
            5,
            39,
            35
          ],
          "languages": [
            [
              "Swift",
              88.4
            ],
            [
              "Shell",
              5
            ],
            [
              "C#",
              3.1
            ],
            [
              "JavaScript",
              1.8
            ],
            [
              "Python",
              1.3
            ],
            [
              "Other",
              0.4
            ]
          ],
          "milestones": [
            [
              "12 Jul 2026",
              "First commit: a menu-bar Codex usage monitor"
            ],
            [
              "6 Sep",
              "First public release, UMA 0.14.0"
            ],
            [
              "3 Oct",
              "Added tools for my own agent workflow (0.14.1)"
            ],
            [
              "10 Oct",
              "Renamed AUV; signed and Apple-notarized (0.15.1)"
            ],
            [
              "11 Oct",
              "First Windows 11 build (0.16.2)"
            ],
            [
              "20 Oct",
              "Universal Mac build for Apple silicon and Intel (0.17.2)"
            ],
            [
              "28 Oct",
              "Redesigned window and Settings (0.18.0)"
            ]
          ]
        }
      },
      {
        "id": "bid",
        "number": "02",
        "name": "QDigest",
        "subtitle": "Research, explained",
        "status": "Published · 2 editions",
        "trust": "Every explanation cites its original paper (journal, DOI, PubMed ID) and says when it relies on the abstract alone. Educational reading, not medical advice.",
        "kind": "Information tools · Bilingual reading",
        "headline": "Make room for understanding.",
        "description": "Source-grounded health research, explained in English and Simplified Chinese: concise email briefs with fuller explanations on the web.",
        "tags": [
          "English + 中文",
          "Source-conscious",
          "Mobile-friendly"
        ],
        "primary": "Open the Reading Lab",
        "url": "/qdigest/",
        "caption": "Latest edition · 16 September 2026",
        "whyTitle": "The question",
        "why": "How can health research become easier to understand while keeping its evidence and uncertainty visible?",
        "focusTitle": "What I’m working toward",
        "focus": "Getting new papers from an automated draft to an explanation I can trust, without rescuing each one by hand, so editions can come out on a regular schedule.",
        "inviteTitle": "Where you can help",
        "invite": "I’d like to hear from curious readers, editorial thinkers, and people who care about how information is presented.",
        "evolution": {
          "label": "QDigest · How it has changed",
          "title": "What changed, and what each change cost.",
          "note": "Two changes of direction, and the decisions from September to October 2026",
          "steps": [
            [
            "Direction change 1",
            "From a daily news roundup to reading papers closely",
            "QDigest began as a daily health news roundup, then turned to reading the papers themselves.",
            "Gave up daily breadth for depth on each study.",
            "turn"
          ],
          [
              "Early Sep",
              "From summaries to a bilingual reader",
              "Research summaries became web pages in English and Simplified Chinese, with an email brief for each edition.",
              "Every article is now written and checked twice, once per language."
            ],
            [
              "14 Sep",
              "First edition: five topics, fifteen articles",
              "The articles were accepted one by one.",
              "Correct articles did not add up to a good read. Fifteen pieces across five topics was too much to take in."
            ],
            [
              "16 Sep",
              "Three topics, nine articles",
              "Alzheimer’s disease, stroke, and cancer prevention and research.",
              "Fewer subjects, so each article can go deeper. Earlier editions stay online."
            ],
            [
              "16–17 Sep",
              "Two depths: Lazy and Full",
              "Lazy puts a short, plain takeaway for every article on one page. Full explains each paper in depth, explains its terms, and leads on to the next article. Going back returns you to where you were.",
              "Two texts per paper to keep in step. I dropped the one-sentence rule for Lazy: a short paragraph that reads naturally beats a sentence squeezed to fit."
            ],
            [
              "Sep–Oct",
              "Automating new papers",
              "Model-written drafts led with statistics, got facts wrong, and slipped past automated review. I now record what the model wrote first, what it corrected, and what a person changed.",
              "Slower, and no new edition since 16 September. I won’t hide a weak pipeline by rewriting its drafts myself."
            ],
            [
              "Oct",
              "Reading settings and Reading Lab",
              "Saved reading preferences, more English and Chinese fonts (including OpenDyslexic and Traditional Chinese), and a Reading Lab for comparing settings on fictional samples. Focus mode is hidden for now.",
              "Built, but it ships with the next edition rather than being bolted onto the old one."
            ],
          [
            "Direction change 2 · Now",
            "From reading papers to teaching health knowledge",
            "The focus now is making health knowledge easy to understand. Papers move to a supporting role: they back the explanation instead of being the subject.",
            "Papers are no longer the main character of each piece, but they remain the evidence.",
            "turn"
          ]
          ]
        }
      },
      {
        "id": "screensnap",
        "number": "03",
        "name": "ScreenSnap",
        "subtitle": "Screenshot lens",
        "status": "Windows 0.1.0",
        "kind": "Windows utility",
        "headline": "One click. Whole screen. On your clipboard.",
        "description": "A small floating lens that copies a screenshot of every monitor to your clipboard. Click it or press Alt+C in any app, then paste.",
        "tags": [
          "Windows 10 / 11",
          "Alt+C shortcut",
          "Nothing to install"
        ],
        "primary": "Get ScreenSnap",
        "url": "/screensnap/",
        "caption": "ScreenSnap 0.1.0 · the lens floats above your windows",
        "whyTitle": "What it is for",
        "why": "Getting what is on your screen into a message or document in one motion, without saving files.",
        "focusTitle": "How to start",
        "focus": "Download the ZIP from the ScreenSnap page, unblock it, extract it and open ScreenSnap.vbs. The lens appears near the top-right of your screen.",
        "inviteTitle": "Good to know",
        "invite": "It uses the built-in Windows PowerShell, never saves or sends your screenshots, and hides itself so it is never in the picture."
      }
    ],
    "digest": {
      "label": "HEALTH RESEARCH",
      "title": "QDigest",
      "subtitle": "Research, explained",
      "edition": "Brief in email. Explained on the web.",
      "topics": [
        "Heart, metabolism & kidneys",
        "Hearing & cognition",
        "Stroke",
        "Respiratory health",
        "Cancer risk"
      ],
      "bottom": "Evidence and uncertainty, kept in view.",
      "language": "EN ↔ 中文"
    },
    "about": {
      "eyebrow": "02 / NURSING IS THE FOUNDATION",
      "title": "A person behind\nevery signal.",
      "intro": "I’m Shaoting He, a registered nurse working in intensive care in Nova Scotia.",
      "body": "In the ICU, a small change can deserve your full attention. Nursing has shaped how I observe, communicate, and take responsibility.",
      "end": "I bring that discipline to building software: understand the problem, make the details count, and keep improving what people use.",
      "facts": [
        "Registered Nurse · NSCN",
        "Nova Scotia, Canada",
        "English / Mandarin"
      ],
      "caption": "Shaoting He · 何少霆",
      "detail": "Nursing background",
      "clinical": "Currently in a full-time ICU role at Valley Regional Hospital in Kentville. BScN, Toronto Metropolitan University collaborative nursing program, graduated with Distinction."
    },
    "contact": {
      "eyebrow": "03 / COLLABORATE",
      "title": "Bring your perspective.\nLet’s build something.",
      "intro": "Next, I want to build tools for nursing and clinical work, and keep making health research easier to read in English and Chinese. If you can help with either, write to me. I reply to every message.",
      "offer": {
        "bringTitle": "What I bring",
        "bring": [
          "A working ICU nurse’s eye for where tools fail the people using them",
          "Shipped desktop software: 15 public releases for Mac and Windows since July",
          "English and Mandarin, in the product and in the conversation"
        ],
        "seekTitle": "Who I’m looking for",
        "seek": [
          "Nurses and clinicians with a problem worth solving",
          "Developers and designers to build with",
          "People who want to support independent tools",
          "Entrepreneurial communities with ideas worth testing"
        ]
      },
      "paths": [
        {
          "number": "01",
          "title": "Build together",
          "text": "Have a complementary skill or an idea we should explore?",
          "label": "Discuss a collaboration",
          "subject": "Let’s collaborate"
        },
        {
          "number": "02",
          "title": "Share a perspective",
          "text": "Try AUV, talk about QDigest, or tell me what could work better.",
          "label": "Start a conversation",
          "subject": "A thought about your projects"
        },
        {
          "number": "03",
          "title": "Support the work",
          "text": "Interested in backing independent tools and the time it takes to build them?",
          "label": "Talk about supporting",
          "subject": "Supporting your independent work"
        }
      ],
      "email": "Locutus1207@outlook.com"
    },
    "footer": {
      "identity": "Shaoting He · RN & independent builder",
      "copyright": "© 2026 Shaoting He."
    }
  },
  "zh-Hans": {
    "meta": {
      "title": "何少霆 | 护理 - 创造",
      "description": "我是何少霆，一名在 ICU 工作的注册护士，也是一名独立开发者。了解 AUV、QDigest，以及合作与支持创作的方式。"
    },
    "nav": [
      [
        "projects",
        "作品"
      ],
      [
        "about",
        "关于我"
      ],
      [
        "contact",
        "合作"
      ]
    ],
    "ui": {
      "skip": "跳至主要内容",
      "language": "语言",
      "light": "切换浅色主题",
      "motion": "暂停背景动效",
      "motionShort": "暂停",
      "resume": "继续背景动效",
      "resumeShort": "播放",
      "dark": "切换深色主题",
      "reduced": "已遵循设备的减少动态效果设置",
      "reducedShort": "静止",
      "menu": "主导航",
      "github": "GitHub",
      "back": "回到顶部",
      "more": "项目背后的想法",
      "copy": "复制邮箱",
      "copied": "邮箱已复制",
      "copyFailed": "暂时无法复制，请使用邮件链接。",
      "close": "关闭",
      "projectPreview": "查看 AUV 界面截图",
      "codeBlue": "Code blue",
      "codeBlueOn": "护理彩蛋：将波形切换为室颤",
      "codeBlueOff": "电击除颤，恢复窦性心律",
      "shock": "除颤",
      "desktopOnly": "AUV 适用于 Mac 与 Windows 电脑。请在电脑上打开本页下载。",
      "shareLink": "把链接发到我的电脑",
      "linkCopied": "链接已复制",
      "readingLab": "阅读实验室",
      "readingLabTitle": "打开 QDigest 阅读实验室",
      "readingLabUrl": "/qdigest/2026-09-16/zh-CN/"
    },
    "hero": {
      "eyebrow": "何少霆 / 注册护士",
      "line1": "护理 - ",
      "line2": "创造",
      "intro": "我在 ICU 照护生命，也在工作之外创造软件。接下来想做：护理工具，以及人人读得懂的健康研究。我在寻找一起把它们做出来的人。",
      "primary": "一起合作",
      "secondary": "看看作品",
      "note": "重症护理 · 加拿大新斯科舍省",
      "current": "开放",
      "currentProjects": "新的合作"
    },
    "work": {
      "eyebrow": "01 / 从观察到作品",
      "title": "让作品说话。",
      "intro": "Windows 与 Mac 原生 AI 用量工具、双语研究简报，以及一键截屏的 Windows 小镜头。让信息更便于使用。",
      "all": "探索我的 GitHub"
    },
    "projects": [
      {
        "id": "uma",
        "number": "01",
        "name": "AUV",
        "subtitle": "Agent Usage Viewer",
        "status": "macOS 0.18.4 · Windows 0.18.4",
        "kind": "Windows 与 Mac 应用",
        "headline": "一眼看清 AI 编程还剩多少额度。",
        "description": "AUV 是一款 Mac 与 Windows 桌面应用，随时显示 Codex 与 Claude 的用量和限额，帮你安排工作节奏。",
        "tags": [
          "English / 中文"
        ],
        "primary": "下载 AUV",
        "url": "https://github.com/ShaoJHe-SilkRoad/UMA/releases/download/v0.18.4/AUV_Mac_0.18.4_Universal.zip",
        "secondary": "安装指南",
        "secondaryUrl": "/auv/install/",
        "caption": "AUV 0.18.4 · macOS 上的 Claude 与 Codex 实时用量",
        "whyTitle": "用来做什么",
        "why": "开始一段长时间的工作前，不用逐个打开账户，就能知道 Codex 与 Claude 还剩多少额度。",
        "focusTitle": "最难的部分",
        "focus": "Claude 的精确用量来自已登录的 Safari 会话，所以 Safari 被隐藏、最小化或在另一个桌面时，AUV 也要能继续读取。另一半工作，是在发布签名、公证的 Mac 通用版的同时，维护一个独立的 Windows 版。",
        "inviteTitle": "需要帮手的地方",
        "invite": "Windows 是短板：0.18.4 已在 Windows 能做到的地方与 Mac 版对齐，但仍未签名，也还读不到 Claude 用量。最能帮上忙的，是一位熟悉 Windows 打包与代码签名的开发者。也同样欢迎每天使用 Codex 或 Claude 的人提供测试和设计反馈。",
        "log": {
          "label": "AUV · 开发日志",
          "title": "我的第一个公开应用，开发过程全部公开。",
          "note": "数据来自公开的 GitHub 仓库 · 截至 2026 年 10 月 31 日",
          "stats": [
            [
              "235",
              "次提交"
            ],
            [
              "16",
              "周连续有提交"
            ],
            [
              "15",
              "个公开版本"
            ],
            [
              "88%",
              "Swift 代码"
            ]
          ],
          "weeksLabel": "每周提交次数，2026 年 7 月至 10 月",
          "weeks": [
            13,
            3,
            15,
            12,
            16,
            6,
            8,
            17,
            14,
            5,
            9,
            13,
            18,
            5,
            39,
            35
          ],
          "languages": [
            [
              "Swift",
              88.4
            ],
            [
              "Shell",
              5
            ],
            [
              "C#",
              3.1
            ],
            [
              "JavaScript",
              1.8
            ],
            [
              "Python",
              1.3
            ],
            [
              "Other",
              0.4
            ]
          ],
          "milestones": [
            [
              "2026 年 7 月 12 日",
              "第一次提交：菜单栏 Codex 用量监视器"
            ],
            [
              "9 月 6 日",
              "首个公开版本 UMA 0.14.0"
            ],
            [
              "10 月 3 日",
              "加入自用的智能体工作流工具（0.14.1）"
            ],
            [
              "10 月 10 日",
              "更名 AUV，完成签名与 Apple 公证（0.15.1）"
            ],
            [
              "10 月 11 日",
              "首个 Windows 11 版本（0.16.2）"
            ],
            [
              "10 月 20 日",
              "支持 Apple 芯片与 Intel 的通用 Mac 版（0.17.2）"
            ],
            [
              "10 月 28 日",
              "重新设计主窗口与设置（0.18.0）"
            ]
          ]
        }
      },
      {
        "id": "bid",
        "number": "02",
        "name": "QDigest",
        "subtitle": "读懂研究",
        "status": "已发布 · 2 期",
        "trust": "每篇解读都注明原始论文（期刊、DOI、PubMed 编号），并说明是否仅依据摘要。仅供学习阅读，不构成医疗建议。",
        "kind": "信息工具 · 双语阅读",
        "headline": "看见研究，也读懂研究。",
        "description": "用英文与简体中文解释有据可查的健康研究：邮件简报用于发现，网页提供更完整的研究解释。",
        "tags": [
          "English + 中文",
          "重视来源",
          "移动端阅读"
        ],
        "primary": "进入阅读实验室",
        "url": "/qdigest/2026-09-16/zh-CN/",
        "caption": "最新一期 · 2026年9月16日",
        "whyTitle": "我在思考的问题",
        "why": "怎样让健康研究更容易理解，同时保留证据与不确定性？",
        "focusTitle": "正在努力的方向",
        "focus": "让新论文从自动生成的初稿，变成我信得过的解读，而不必一篇篇手工救稿，这样才能按固定节奏出刊。",
        "inviteTitle": "欢迎你的参与",
        "invite": "希望听到好奇的读者、关注内容的人，以及对信息呈现有想法的伙伴的反馈。",
        "evolution": {
          "label": "QDigest · 演变",
          "title": "每一次改动，以及它的代价。",
          "note": "两次方向改变，以及 2026 年 9 月至 10 月的决定",
          "steps": [
            [
            "方向改变 1",
            "从每日新闻汇总到论文细读",
            "QDigest 最初汇总每日健康新闻，后来转向细读论文本身。",
            "放弃每日更新的广度，换来对单篇研究的深度。",
            "turn"
          ],
          [
              "9 月初",
              "从研究摘要到双语阅读器",
              "研究摘要变成英文与简体中文网页，每期另有一封邮件简报。",
              "每篇文章都要用两种语言各写一遍、各核一遍。"
            ],
            [
              "9 月 14 日",
              "第一期：五个栏目，十五篇",
              "每篇文章都逐一通过了审核。",
              "文章都对，整体却不好读：五个栏目十五篇，信息量太大。"
            ],
            [
              "9 月 16 日",
              "三个栏目，九篇",
              "阿尔茨海默病、脑卒中、癌症预防与研究进展。",
              "栏目更少，每篇能讲得更深。往期内容继续保留。"
            ],
            [
              "9 月 16–17 日",
              "两种深度：Lazy 与 Full",
              "Lazy 把每篇的简短白话结论放在同一页；Full 深入解释论文和术语，并能接着读下一篇；返回时回到刚才读到的位置。",
              "每篇论文要维护两份文字。我放弃了 Lazy 必须一句话的规定：自然的短段落，好过硬压成一句。"
            ],
            [
              "9–10 月",
              "自动处理新论文",
              "模型初稿会以统计数字为主线、写错事实，还能躲过自动审核。现在我分开记录模型第一次写了什么、自己改了什么、人又改了什么。",
              "进度变慢，9 月 16 日之后还没有出新一期。我不会靠亲手改稿，掩盖流程本身的不可靠。"
            ],
            [
              "10 月",
              "阅读设置与阅读实验室",
              "可保存的阅读偏好，更多中英文字体（包括 OpenDyslexic 和繁体中文），以及一个用虚构材料比较不同设置的阅读实验室。专注模式暂时隐藏。",
              "功能已经做好，但会随下一期一起上线，而不是硬接到旧的一期上。"
            ],
          [
            "方向改变 2 · 现在",
            "从论文细读到知识普及",
            "现在的重心是普及健康知识，论文退到辅助位置：用来支撑解释，不再是内容本身。",
            "论文不再是每篇内容的主角，但仍然是依据。",
            "turn"
          ]
          ]
        }
      },
      {
        "id": "screensnap",
        "number": "03",
        "name": "ScreenSnap",
        "subtitle": "截屏镜头",
        "status": "Windows 0.1.0",
        "kind": "Windows 小工具",
        "headline": "点一下，整屏截图就进剪贴板。",
        "description": "一枚浮在屏幕上的小镜头，把所有显示器的画面截取到剪贴板。在任何应用中点击它或按 Alt+C，然后粘贴即可。",
        "tags": [
          "Windows 10 / 11",
          "Alt+C 快捷键",
          "无需安装"
        ],
        "primary": "获取 ScreenSnap",
        "url": "/screensnap/",
        "caption": "ScreenSnap 0.1.0 · 镜头浮在所有窗口上方",
        "whyTitle": "用来做什么",
        "why": "一个动作，把屏幕上的内容放进消息或文档，不用保存文件。",
        "focusTitle": "怎么开始",
        "focus": "在 ScreenSnap 页面下载 ZIP，解除锁定后解压，打开 ScreenSnap.vbs，镜头会出现在屏幕右上方附近。",
        "inviteTitle": "值得知道",
        "invite": "它使用系统自带的 Windows PowerShell，不保存也不发送截图，截图时会自动隐藏，不会出现在画面里。"
      }
    ],
    "digest": {
      "label": "健康研究",
      "title": "QDigest",
      "subtitle": "读懂研究",
      "edition": "邮件发现，网页理解。",
      "topics": [
        "心脏、代谢与肾脏",
        "听力与认知",
        "卒中",
        "呼吸健康",
        "癌症风险"
      ],
      "bottom": "保留证据，也保留不确定性。",
      "language": "EN ↔ 中文"
    },
    "about": {
      "eyebrow": "02 / 护理，是我的根基",
      "title": "每一个信号背后，\n都是一个人。",
      "intro": "我是何少霆，在加拿大新斯科舍省从事重症护理的注册护士。",
      "body": "在 ICU，一个细微的变化，也值得全神贯注。护理塑造了我观察、沟通与承担责任的方式。",
      "end": "创造软件时，我也坚持同样的事：理解问题，认真对待细节，持续改善人们真正会用到的东西。",
      "facts": [
        "注册护士 · NSCN",
        "加拿大 · 新斯科舍省",
        "英语 / 普通话"
      ],
      "caption": "何少霆 · Shaoting He",
      "detail": "护理背景",
      "clinical": "目前在 Kentville 的 Valley Regional Hospital ICU 担任全职岗位。毕业于 Toronto Metropolitan University 协作护理项目，获护理学理学士学位，以 Distinction 毕业。"
    },
    "contact": {
      "eyebrow": "03 / 一起合作",
      "title": "带上你的视角，\n一起把想法做出来。",
      "intro": "接下来我想做两件事：为护理和临床工作做工具；继续让健康研究更容易被中英文读者读懂。如果你能在其中任何一件事上帮忙，欢迎来信。每一封我都会回复。",
      "offer": {
        "bringTitle": "我能带来什么",
        "bring": [
          "一线 ICU 护士的视角：看见工具在哪里让使用者为难",
          "已发布的桌面软件：自 7 月以来为 Mac 与 Windows 发布 15 个公开版本",
          "英语与普通话，用在产品里，也用在沟通中"
        ],
        "seekTitle": "我在寻找",
        "seek": [
          "有问题想解决的护士与临床同行",
          "一起动手的开发者与设计师",
          "愿意支持独立工具的人",
          "有想法、想验证的创业社群"
        ]
      },
      "paths": [
        {
          "number": "01",
          "title": "一起创造",
          "text": "你有互补的技能，或一个值得共同探索的想法？",
          "label": "聊聊合作",
          "subject": "Let’s collaborate"
        },
        {
          "number": "02",
          "title": "交换视角",
          "text": "试试 AUV，聊聊 QDigest，或告诉我哪里还能更好。",
          "label": "开始交流",
          "subject": "A thought about your projects"
        },
        {
          "number": "03",
          "title": "支持创作",
          "text": "愿意支持独立工具，以及把它们做出来所需要的时间？",
          "label": "聊聊支持方式",
          "subject": "Supporting your independent work"
        }
      ],
      "email": "Locutus1207@outlook.com"
    },
    "footer": {
      "identity": "何少霆 · 注册护士与独立开发者",
      "copyright": "© 2026 何少霆。"
    }
  }
};
if (window.AUV_RELEASES) ['en','zh-Hans'].forEach(function(lang) {
  var p=window.SHAOTING_HOME_CONTENT[lang].projects.find(function(p){return p.id==='uma';});
  p.downloads=['windows','macos'].map(function(platform){var r=window.AUV_RELEASES[platform];return {platform:platform,url:r.url,label:(lang==='en'?'Download for '+(platform==='windows'?'Windows':'macOS'):'下载 '+(platform==='windows'?'Windows':'macOS')+' 版')+' · v'+r.version,description:r.requirements[lang]};});
  p.releaseUrl=window.AUV_RELEASES.macos.release;
});
