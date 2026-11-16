/* Bilingual homepage content. */
window.SHAOTING_HOME_CONTENT = {
  "en": {
    "meta": {
      "title": "Shaoting He — ICU Nurse. Independent Builder.",
      "description": "ICU nurse. Independent builder. The work of Shaoting He: AUV, QDigest and ScreenSnap."
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
        "Contact"
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
      "intro": "I work in intensive care and build software beyond it. Here is what I’ve made so far.",
      "primary": "See the work",
      "secondary": "Get in touch",
      "note": "ICU practice · Nova Scotia, Canada",
      "current": "CONTACT",
      "currentProjects": "Email"
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
        "status": "macOS 0.18.11 · Windows 0.18.7",
        "kind": "Windows & Mac app",
        "headline": "Know how much AI coding time you have left.",
        "description": "AUV is a desktop app for Mac and Windows that shows your Codex and Claude usage and limits at a glance, so you can pace your work.",
        "tags": [
          "English / 中文"
        ],
        "primary": "Download AUV",
        "url": "https://github.com/ShaoJHe-SilkRoad/UMA/releases/download/v0.18.11/AUV_Mac_0.18.11_Universal.dmg",
        "secondary": "Installation guide",
        "secondaryUrl": "/auv/install/",
        "caption": "AUV 0.18.4 on macOS · live Claude and Codex usage",
        "whyTitle": "What it is for",
        "why": "Seeing how much Codex and Claude time is left before starting a long piece of work, without opening each account.",
        "focusTitle": "The hardest parts",
        "focus": "Exact Claude usage comes from a signed-in Safari session, so AUV has to keep reading it when Safari is hidden, minimized or on another desktop. The other half of the work is shipping a signed, notarized Universal Mac app alongside a separate Windows version.",
        "inviteTitle": "Where it stands",
        "invite": "The Mac version is signed and notarized. Windows is the gap: it reads Claude through a Chrome or Edge companion, but it still ships unsigned and the companion loads in Developer mode. Feedback from people who use Codex or Claude every day is welcome.",
        "log": {
          "label": "AUV · Build log",
          "title": "My first public app, built in the open.",
          "note": "From the public GitHub repository · as of 16 Nov 2026",
          "stats": [
            [
              "327",
              "Commits"
            ],
            [
              "19",
              "Weeks in a row with commits"
            ],
            [
              "27",
              "Public releases"
            ],
            [
              "83%",
              "Written in Swift"
            ]
          ],
          "weeksLabel": "Commits per week, July to November 2026",
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
            35,
            18,
            30,
            41
          ],
          "languages": [
            [
              "Swift",
              82.6
            ],
            [
              "C#",
              7.4
            ],
            [
              "Shell",
              4.5
            ],
            [
              "JavaScript",
              3.5
            ],
            [
              "Python",
              1.3
            ],
            [
              "Other",
              0.6
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
        "status": "Reading Lab live · new version in progress",
        "trust": "Every explanation cites its original paper (journal, DOI, PubMed ID) and says when it relies on the abstract alone. Educational reading, not medical advice.",
        "kind": "Information tools · Bilingual reading",
        "headline": "Make room for understanding.",
        "description": "Source-grounded health research, explained in English and Simplified Chinese.",
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
        "focusTitle": "What I’m working on",
        "focus": "Polishing the articles. It is stuck for now: both the finished articles and the drafts sound too much like AI, and I’m not satisfied with them.",
        "inviteTitle": "Feedback",
        "invite": "If something is hard to read or looks wrong, please tell me.",
        "evolution": {
          "label": "QDigest · How it has changed",
          "title": "What changed, and what each change cost.",
          "note": "Two changes of direction, one narrowing, and the decisions along the way",
          "steps": [
            [
              "Direction change 1",
              "From a daily news roundup to medicine",
              "The roundup was messy and shallow, with little worth reading and no development value left. Strong competitors were everywhere, and I couldn’t go deeper while keeping costs under control. So I decided to focus on medicine.",
              "The automated daily email and news collection were already working. I changed direction anyway.",
              "turn"
            ],
            [
              "Early Sep",
              "From summaries to a bilingual reader",
              "Research summaries became web pages in English and Simplified Chinese.",
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
              "Saved reading preferences, more English and Chinese fonts (including OpenDyslexic), and a Reading Lab for comparing settings on fictional samples. Focus mode is hidden for now.",
              "Built, but it ships with the next edition rather than being bolted onto the old one."
            ],
            [
              "Direction change 2",
              "From daily papers to explaining concepts",
              "The quality of each day’s papers varied too much to explain them in depth. Content could repeat, and too many papers were repetitive or inconclusive, which made them hard to filter. So I started from knowledge instead: explain a specific concept, go deep, and support it with whatever research I can find.",
              "Papers are no longer the subject. They support the explanation.",
              "turn"
            ],
            [
              "Narrowing · Now",
              "Focusing on cognition",
              "I then found that what I really want to go deep on is cognition, so I narrowed further. That is the current direction.",
              "Stuck for now: both the finished articles and the drafts sound too much like AI, and I’m not satisfied with them, so none of them are online yet.",
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
        "status": "Windows 0.2.0",
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
        "caption": "ScreenSnap 0.2.0 · the lens floats above your windows",
        "whyTitle": "What it is for",
        "why": "Getting what is on your screen into a message or document in one motion, without saving files.",
        "focusTitle": "How to start",
        "focus": "Download ScreenSnap.exe from the ScreenSnap page and double-click it. The lens appears near the top-right of your screen.",
        "inviteTitle": "Good to know",
        "invite": "It uses the built-in Windows PowerShell, never saves or sends your screenshots, and hides itself so it is never in the picture."
      }
    ],
    "digest": {
      "label": "HEALTH RESEARCH",
      "title": "QDigest",
      "subtitle": "Research, explained",
      "edition": "Explained on the web.",
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
      "clinical": "Currently in a full-time ICU role. BScN, Toronto Metropolitan University collaborative nursing program, graduated with Distinction."
    },
    "contact": {
      "eyebrow": "03 / CONTACT",
      "title": "Get in touch.",
      "intro": "Tried something here, spotted a mistake, or want to build something together? Write to me.",
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
      "description": "我是何少霆，一名在 ICU 工作的注册护士，也是一名独立开发者。这里是我的作品：AUV、QDigest 和 ScreenSnap。"
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
        "联系"
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
      "intro": "我在 ICU 照护生命，也在工作之外创造软件。这里是我目前做出来的东西。",
      "primary": "看看作品",
      "secondary": "联系我",
      "note": "重症护理 · 加拿大新斯科舍省",
      "current": "联系",
      "currentProjects": "发邮件"
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
        "status": "macOS 0.18.11 · Windows 0.18.7",
        "kind": "Windows 与 Mac 应用",
        "headline": "一眼看清 AI 编程还剩多少额度。",
        "description": "AUV 是一款 Mac 与 Windows 桌面应用，随时显示 Codex 与 Claude 的用量和限额，帮你安排工作节奏。",
        "tags": [
          "English / 中文"
        ],
        "primary": "下载 AUV",
        "url": "https://github.com/ShaoJHe-SilkRoad/UMA/releases/download/v0.18.11/AUV_Mac_0.18.11_Universal.dmg",
        "secondary": "安装指南",
        "secondaryUrl": "/auv/install/",
        "caption": "AUV 0.18.4 · macOS 上的 Claude 与 Codex 实时用量",
        "whyTitle": "用来做什么",
        "why": "开始一段长时间的工作前，不用逐个打开账户，就能知道 Codex 与 Claude 还剩多少额度。",
        "focusTitle": "最难的部分",
        "focus": "Claude 的精确用量来自已登录的 Safari 会话，所以 Safari 被隐藏、最小化或在另一个桌面时，AUV 也要能继续读取。另一半工作，是在发布签名、公证的 Mac 通用版的同时，维护一个独立的 Windows 版。",
        "inviteTitle": "目前的情况",
        "invite": "Mac 版已签名并通过公证。Windows 是短板：它通过 Chrome 或 Edge 伴侣读取 Claude 用量，但仍未签名，伴侣也只能以开发者模式加载。欢迎每天使用 Codex 或 Claude 的人提供反馈。",
        "log": {
          "label": "AUV · 开发日志",
          "title": "我的第一个公开应用，开发过程全部公开。",
          "note": "数据来自公开的 GitHub 仓库 · 截至 2026 年 11 月 16 日",
          "stats": [
            [
              "327",
              "次提交"
            ],
            [
              "19",
              "周连续有提交"
            ],
            [
              "27",
              "个公开版本"
            ],
            [
              "83%",
              "Swift 代码"
            ]
          ],
          "weeksLabel": "每周提交次数，2026 年 7 月至 11 月",
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
            35,
            18,
            30,
            41
          ],
          "languages": [
            [
              "Swift",
              82.6
            ],
            [
              "C#",
              7.4
            ],
            [
              "Shell",
              4.5
            ],
            [
              "JavaScript",
              3.5
            ],
            [
              "Python",
              1.3
            ],
            [
              "Other",
              0.6
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
        "status": "阅读实验室已上线 · 新版开发中",
        "trust": "每篇解读都注明原始论文（期刊、DOI、PubMed 编号），并说明是否仅依据摘要。仅供学习阅读，不构成医疗建议。",
        "kind": "信息工具 · 双语阅读",
        "headline": "看见研究，也读懂研究。",
        "description": "用英文与简体中文解释有据可查的健康研究。",
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
        "focusTitle": "正在做的事",
        "focus": "润色文章。目前陷入瓶颈：成文和稿子的 AI 味道都太重，我不满意。",
        "inviteTitle": "欢迎反馈",
        "invite": "如果哪里难读或者写错了，请告诉我。",
        "evolution": {
          "label": "QDigest · 演变",
          "title": "每一次改动，以及它的代价。",
          "note": "两次方向改变、一次进一步细分，以及其间的决定",
          "steps": [
            [
              "方向改变 1",
              "从每日新闻汇总到专注医学",
              "信息杂乱、浅显，没有阅读价值，继续开发的价值也消失了。市场上强大的竞品太多，又无法在控制成本的情况下深入去做。于是决定专注医学。",
              "每日自动发送邮件和信息收集系统都已就位、正常运作，但还是决定转向。",
              "turn"
            ],
            [
              "9 月初",
              "从研究摘要到双语阅读器",
              "研究摘要变成英文与简体中文网页。",
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
              "可保存的阅读偏好，更多中英文字体（包括 OpenDyslexic），以及一个用虚构材料比较不同设置的阅读实验室。专注模式暂时隐藏。",
              "功能已经做好，但会随下一期一起上线，而不是硬接到旧的一期上。"
            ],
            [
              "方向改变 2",
              "从每日论文到知识科普",
              "每天找到的论文质量良莠不齐，无法深入讲解；内容可能重复，内容雷同、没有结论的论文又太多，难以筛选。于是改从知识科普出发：讲解特定概念并讲深，用能找到的研究来支撑。",
              "论文不再是内容本身，只用来支撑解释。",
              "turn"
            ],
            [
              "进一步细分 · 现在",
              "专注认知方面",
              "之后发现，我真正希望深入的是认知方面，于是进一步细分，这就是现在的开发方向。",
              "陷入瓶颈：成文和稿子的 AI 味道都太重，我不满意，所以都还没有上线。",
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
        "status": "Windows 0.2.0",
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
        "caption": "ScreenSnap 0.2.0 · 镜头浮在所有窗口上方",
        "whyTitle": "用来做什么",
        "why": "一个动作，把屏幕上的内容放进消息或文档，不用保存文件。",
        "focusTitle": "怎么开始",
        "focus": "在 ScreenSnap 页面下载 ScreenSnap.exe，双击运行，镜头会出现在屏幕右上方附近。",
        "inviteTitle": "值得知道",
        "invite": "它使用系统自带的 Windows PowerShell，不保存也不发送截图，截图时会自动隐藏，不会出现在画面里。"
      }
    ],
    "digest": {
      "label": "健康研究",
      "title": "QDigest",
      "subtitle": "读懂研究",
      "edition": "网页上读懂研究。",
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
      "clinical": "目前在 ICU 担任全职岗位。毕业于 Toronto Metropolitan University 协作护理项目，获护理学理学士学位，以 Distinction 毕业。"
    },
    "contact": {
      "eyebrow": "03 / 联系",
      "title": "联系我。",
      "intro": "用过这里的东西、发现了错误，或者想一起做点什么，都可以来信。",
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
