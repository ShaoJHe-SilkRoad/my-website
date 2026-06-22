// Homepage bilingual content for shaotinghe.com.
// Keep this file data-only: no rendering logic, network calls, remote editorial hooks, or build tooling.
// Edit EN and zh-Hans together so public facts stay paired.
(function (window) {
  "use strict";

  window.SHAOTING_HOME_CONTENT = {
          en: {
            meta: {
              siteName: "Shaoting He, RN",
              role: "Registered Nurse",
              title: "Shaoting He, RN | Fresh Clinical Signal",
              description:
                "Fresh Clinical Signal for Shaoting He, RN, focused on critical care judgment, senior-health continuity, bilingual clinical communication, and practical systems support.",
              ogDescription:
                "A clinical dossier for RN practice shaped by ICU monitoring, senior-health continuity, bilingual communication, and practical workflow systems."
            },
            ui: {
              skip: "Skip to content",
              language: "Language",
              navLabel: "Primary",
              nav: [
                ["focus", "Current Focus"],
                ["practice", "Expertise"],
                ["capability", "Detail"],
                ["timeline", "Experience"],
                ["education", "Current Study"],
                ["language", "Languages"],
                ["systems", "Systems"],
                ["contact", "Contact"]
              ]
            },
            hero: {
              eyebrow: "Clinical Nursing Profile",
              title: "Shaoting He, RN",
              titleTail: "",
              role:
                "Registered nurse with ICU practice context, senior-health experience, and bilingual clinical communication.",
              intro:
                "Focused on calm observation, disciplined documentation, and escalation support for complex-care teams.",
              portraitLabel: "Shaoting He, RN",
              portraitText: "Bedside judgment with clear clinical communication.",
              actions: [
                ["#contact", "Contact"],
                ["#practice", "Expertise"]
              ],
              identity: [
                ["RN", "NSCN"],
                ["ICU Context", "Monitoring · escalation support"],
                ["Care Continuity", "Senior health · bilingual communication"]
              ]
            },
            sections: {
              focus: {
                eyebrow: "Now",
                title: "Current Focus",
                summary:
                  "What I am focused on now: bedside clinical judgment, senior-health continuity, and practical workflow clarity.",
                items: [
                  {
                    title: "Current Role",
                    text:
                      "RN practice focused on careful observation, disciplined documentation, senior-health continuity, and safe clinical communication in complex-care settings."
                  },
                  {
                    title: "Clinical Focus",
                    text:
                      "Monitoring, reassessment, escalation, rhythm awareness, care planning, and family communication across bedside and continuity-focused care."
                  },
                  {
                    title: "Recent Systems / Practice Build",
                    text:
                      "Small practical tools for clearer clinical reasoning, documentation structure, portfolio upkeep, and follow-through while keeping nursing practice central."
                  }
                ]
              },
              practice: {
                eyebrow: "Expertise Snapshot",
                title: "RN expertise, in one scan.",
                summary:
                  "Four bedside-readable signals: critical care observation, senior-health continuity, bilingual clinical communication, and secondary systems support.",
                items: [
                  {
                    title: "Critical Care Observation",
                    text:
                      "ICU RN context and ICU placement exposure support monitoring, reassessment, rhythm-aware documentation, neuro checks, respiratory-support exposure, and escalation.",
                    signals: ["ICU context", "Monitoring", "Rhythm-aware", "Escalation"]
                  },
                  {
                    title: "Senior-Health Continuity",
                    text:
                      "Senior-health and long-term care work support older-adult needs across dementia, dysphagia or aphasia, falls risk, pressure-injury prevention, ADLs, and family clarity.",
                    signals: ["Older-adult care", "Dementia", "Falls risk", "Family clarity"]
                  },
                  {
                    title: "Bilingual Clinical Communication",
                    text:
                      "Canadian and Chinese clinical environments support Mandarin clinical review, patient education, care-plan clarity, and dialect-aware elderly communication.",
                    signals: ["Canada / China", "Mandarin review", "Patient education", "Care plans"]
                  },
                  {
                    title: "Clinical Systems Support",
                    text:
                      "Secondary to nursing practice, clear notes, handoffs, follow-up structure, and small tools support continuity without replacing clinical judgment.",
                    signals: ["Documentation", "Handoffs", "Follow-through", "Secondary tools"]
                  }
                ]
              },
              timeline: {
                eyebrow: "Selected Evidence",
                title: "Clinical proof, kept concrete.",
                summary:
                  "Selected proof points support the snapshot without turning the homepage into a full resume timeline.",
                disclosureTitle: "Supporting role detail",
                disclosureSummary: "Open the fuller role and placement context.",
                aside:
                  "The default proof stays filtered: ICU observation and escalation, senior-health continuity, cross-system communication, and secondary documentation support.",
                asideList: ["RN-first proof", "Full timeline folded", "Systems stay secondary", "Evidence before labels"],
                evidence: [
                  {
                    kicker: "ICU RN practice",
                    title: "Markham Stouffville Hospital - 3WG ICU",
                    text:
                      "RN practice in the 3WG Intensive Care Unit is the clearest proof for monitoring, reassessment, rhythm-aware documentation, escalation, and unit coordination.",
                    signals: ["ICU", "Monitoring", "Reassessment", "Escalation"]
                  },
                  {
                    kicker: "Senior-health continuity",
                    title: "North York General Hospital - Senior Health Centre",
                    text:
                      "Older-adult care there supports the continuity track across ADLs, dementia needs, falls prevention, pressure-injury awareness, and family communication.",
                    signals: ["Older adults", "ADLs", "Falls risk", "Family clarity"]
                  },
                  {
                    kicker: "Cross-system clinical practice",
                    title: "Youyu County Hospital of Chinese Medicine - 3F Internal Medicine",
                    text:
                      "Supervised internal-medicine practice in China gives concrete proof for Mandarin documentation review, patient education, and follow-up clarity across clinical settings.",
                    signals: ["Internal medicine", "Mandarin review", "Patient education", "Follow-up"]
                  },
                  {
                    kicker: "Secondary systems support",
                    title: "Documentation and follow-through tools",
                    text:
                      "Small workflow supports are proof of documentation discipline and follow-through; they remain secondary to bedside nursing judgment.",
                    signals: ["Documentation", "Handoffs", "Follow-up", "Secondary"]
                  }
                ],
                items: [
                  {
                    kicker: "Registered Nurse",
                    title: "Markham Stouffville Hospital - 3WG Intensive Care Unit",
                    text:
                      "Critical care monitoring, reassessment, rhythm-aware documentation, escalation, and unit coordination.",
                    signals: ["ICU", "Monitoring", "Escalation"]
                  },
                  {
                    kicker: "Supervised Practice",
                    title: "Youyu County Hospital of Chinese Medicine - 3F Internal Medicine",
                    text:
                      "Internal medicine practice in China with Mandarin documentation review, patient education, and follow-up clarity.",
                    signals: ["Internal medicine", "Mandarin review", "Education"]
                  },
                  {
                    kicker: "Clinical Extern",
                    title: "Markham Stouffville Hospital - Surgical / Short Stay",
                    text:
                      "Perioperative and short-stay support across observation, communication, and unit flow.",
                    signals: ["Observation", "Unit flow", "Handoff"]
                  },
                  {
                    kicker: "Senior Health",
                    title: "North York General Hospital - Senior Health Centre",
                    text:
                      "Older-adult support across ADLs, dementia needs, fall prevention, pressure injury awareness, and family communication.",
                    signals: ["Dementia", "Falls", "Family communication"]
                  },
                  {
                    kicker: "ICU Placement",
                    title: "Humber River Hospital - 6E Intensive Care Unit",
                    text:
                      "Placement exposure to ventilated patients, hemodynamic observation, neurological assessment, and documentation.",
                    signals: ["Ventilation exposure", "Neuro checks", "Charting"]
                  },
                  {
                    kicker: "Acute Care",
                    title: "St. Michael's Hospital - Fracture Clinic and General Medicine",
                    text:
                      "Clinic and medicine placements across assessment, documentation, patient education, and care-team communication.",
                    signals: ["Assessment", "Documentation", "Education"]
                  }
                ]
              },
              capability: {
                eyebrow: "Detail Layer",
                title: "Detailed signal board.",
                summary:
                  "Grouped signals stay folded for readers who need more than the one-scan snapshot.",
                disclosureTitle: "Detailed capability groups",
                disclosureSummary: "Open the longer signal board.",
                groups: [
                  {
                    title: "Critical Care",
                    items: ["Hemodynamic monitoring", "Ventilation and airway exposure", "Neurological reassessment", "Escalation readiness"],
                    note: "Built around trend recognition and timely follow-through."
                  },
                  {
                    title: "Cardiac / Rhythm",
                    items: ["Rhythm interpretation", "ECG-aware notes", "Coronary Care 1", "BLS / ACLS training"],
                    note: "Cardiac signal is documented in practical bedside language."
                  },
                  {
                    title: "Senior Health",
                    items: ["Dementia", "Dysphagia and aphasia", "Falls and pressure injury risk", "Chronic-disease continuity"],
                    note: "Complex needs are handled with dignity and repeatable support."
                  },
                  {
                    title: "Cross-System",
                    items: ["Canada / China practice", "Internal medicine lens", "Mandarin clinical review", "Care-plan clarity"],
                    note: "System differences become context for clearer decisions."
                  },
                  {
                    title: "Communication",
                    items: ["SBAR-style escalation", "Patient education", "Bilingual listening", "Family updates"],
                    note: "Communication is treated as a safety tool, not an afterthought."
                  },
                  {
                    title: "Systems Practice",
                    items: ["Small tooling", "Revision habits", "Follow-up structure", "Workflow discipline"],
                    note: "Technical work supports clinical clarity in a secondary track."
                  }
                ]
              },
              education: {
                eyebrow: "Education & Registration",
                title: "Credentials, without overstatement.",
                summary:
                  "A concise view of registration, education, critical care training, and current study.",
                disclosureTitle: "Education & professional development",
                disclosureSummary: "Open credentials, training, and current study.",
                items: [
                  ["Registered Nurse", "NSCN."],
                  ["Bachelor of Science in Nursing", "Toronto Metropolitan University collaborative nursing program, minor in Psychology, graduated with Distinction."],
                  ["Critical Care Education", "Centennial College Intensive Care Training Program and Coronary Care 1."],
                  ["Current / Additional Learning", "Conestoga College NURS8963 Transition to Nursing Practice, ongoing; CIHI InterRAI LTCF Essentials 1 & 2."],
                  ["Cross-System Registration Context", "China nursing registration examination context, framed at a public professional level."]
                ]
              },
              language: {
                eyebrow: "Language & Cross-Cultural Practice",
                title: "Clinical communication across languages and systems.",
                summary:
                  "Language ability is presented as clinical context: clearer education, safer handoffs, and more precise listening.",
                disclosureTitle: "Language practice",
                disclosureSummary: "Open language and cross-cultural context.",
                items: [
                  ["English", "Professional clinical working proficiency."],
                  ["Mandarin", "Mother tongue, including clinical and regulatory review context."],
                  ["French", "A2 active learning."],
                  ["Spanish", "A1 leisure learning."],
                  ["Cross-Cultural Practice", "Canadian and Chinese clinical environments support flexible communication, dialect-aware elderly patient care, and awareness of system differences."]
                ]
              },
              systems: {
                eyebrow: "Technical Systems Support",
                title: "Tools stay secondary to clinical clarity.",
                summary:
                  "This support track shows practical follow-through habits that help documentation, care-plan clarity, and continuity.",
                disclosureTitle: "Technical Systems Practice",
                disclosureSummary: "Open secondary support links.",
                featureTitle: "Secondary support track",
                feature:
                  "Small tools, revision habits, and checklists are useful when they make clinical communication easier to continue.",
                links: [
                  ["professional-direction.html", "Professional Direction", "A concise note on current RN direction."],
                  ["systems-practice.html", "Technical Systems Practice", "Small tools and follow-through habits that support documentation clarity."]
                ]
              },
              contact: {
                eyebrow: "Contact",
                title: "Professional contact.",
                summary:
                  "For relevant nursing opportunities, referrals, or professional exchange, email is the clearest channel.",
                location: "Toronto, Ontario",
                text:
                  "Email is the preferred channel for relevant nursing opportunities, referrals, professional material requests, and professional exchange.",
                email: "shaotinghe2037@gmail.com",
                note: "Additional professional materials can be provided when relevant."
              }
            },
            footer: {
              text: "Registered Nurse focused on critical care judgment, senior-health continuity, and practical clinical systems.",
              copyright:
                "Copyright © 2026 Shaoting He. All rights reserved. Content and design may not be reproduced without permission."
            }
          },
          "zh-Hans": {
            meta: {
              siteName: "何少霆 RN",
              role: "注册护士",
              title: "何少霆 RN | 临床护理档案",
              description:
                "何少霆 RN 的临床档案：聚焦 ICU 实践经历、老年健康连续照护、双语临床沟通与文档清晰度。",
              ogDescription:
                "何少霆 RN 的临床档案，呈现 ICU 实践经历、老年健康连续照护与双语临床沟通。"
            },
            ui: {
              skip: "跳至主要内容",
              language: "语言",
              navLabel: "主导航",
              nav: [
                ["focus", "近期重点"],
                ["practice", "专长速览"],
                ["capability", "细节"],
                ["timeline", "经历"],
                ["education", "当前学习"],
                ["language", "语言"],
                ["systems", "系统支持"],
                ["contact", "联系"]
              ]
            },
            hero: {
              eyebrow: "临床护理档案",
              title: "何少霆，注册护士",
              titleTail: "",
              role:
                "ICU 实践经历 · 老年健康经验 · 双语临床沟通。",
              intro:
                "关注细致观察、规范记录，以及复杂照护团队中的及时上报与升级处理。",
              portraitLabel: "何少霆，RN",
              portraitText: "床旁判断与清晰临床沟通。",
              actions: [
                ["#contact", "联系"],
                ["#practice", "专长速览"]
              ],
              identity: [
                ["RN", "NSCN"],
                ["ICU 相关实践", "监测 · 升级处理"],
                ["连续照护", "老年健康 · 双语沟通"]
              ]
            },
            sections: {
              focus: {
                eyebrow: "当前",
                title: "近期重点",
                summary:
                  "当前重点：床旁临床判断、老年健康连续照护，以及支持临床工作流程和文档清晰度的实用工具。",
                items: [
                  {
                    title: "当前角色",
                    text:
                      "注册护士实践，重点是细致观察、规范记录、老年健康连续照护，以及复杂照护场景中的安全临床沟通。"
                  },
                  {
                    title: "临床重点",
                    text:
                      "关注监测、再评估、及时上报与升级处理、心律相关观察与记录意识，以及护理计划与家属沟通的连续性。"
                  },
                  {
                    title: "近期流程实践",
                    text:
                      "整理轻量级临床流程与文档支持，用于临床思考、记录结构、个人档案维护与后续跟进。"
                  }
                ]
              },
              practice: {
                eyebrow: "专长速览",
                title: "RN 专业重点一览。",
                summary:
                  "四项专业重点：重症护理观察与判断、老年健康连续照护、双语临床沟通，以及临床流程与文档支持。",
                items: [
                  {
                    title: "重症护理观察与判断",
                    text:
                      "ICU 注册护士实践与 ICU 实习接触，支持监测、再评估、心律相关记录意识、神经系统观察、呼吸支持相关照护，以及及时上报与升级处理。",
                    signals: ["ICU 相关实践", "监测", "心律记录意识", "及时上报"]
                  },
                  {
                    title: "老年健康连续照护",
                    text:
                      "老年照护经验覆盖失智相关需求、吞咽或沟通障碍、跌倒风险、压力性损伤预防、ADL 支持与家庭沟通。",
                    signals: ["失智照护", "吞咽支持", "跌倒预防", "家庭沟通"]
                  },
                  {
                    title: "双语临床沟通",
                    text:
                      "具备加拿大与中国临床环境下的沟通经验，可支持普通话临床沟通、资料审阅、患者教育、护理计划表达，以及面向老年患者的方言敏感沟通。",
                    signals: ["中加临床环境", "普通话沟通", "患者教育", "护理计划"]
                  },
                  {
                    title: "临床流程与文档支持",
                    text:
                      "记录结构、交接清晰度、跟进习惯与小型工具只作为辅助，用于支持照护连续性与文档清晰度。",
                    signals: ["文档清晰度", "交接清晰", "跟进习惯", "辅助工具"]
                  }
                ]
              },
              timeline: {
                eyebrow: "精选证据",
                title: "临床证据，保持具体。",
                summary:
                  "以下证据支持上方专业重点，同时避免首页默认呈现完整履历时间线。",
                disclosureTitle: "补充角色细节",
                disclosureSummary: "展开较完整的角色与实习经历。",
                aside:
                  "默认证据保持筛选：ICU 观察与及时上报、老年健康连续照护、跨体系临床实践，以及辅助性文档支持。",
                asideList: ["RN 优先", "完整时间线折叠", "系统支持为辅助", "证据先于标签"],
                evidence: [
                  {
                    kicker: "ICU 注册护士实践",
                    title: "Markham Stouffville Hospital - 3WG ICU",
                    text:
                      "3WG Intensive Care Unit 的 RN 实践，是支持重症监测、再评估、心律相关记录、及时上报与病区协作的最直接证据。",
                    signals: ["ICU", "监测", "再评估", "及时上报"]
                  },
                  {
                    kicker: "老年健康连续照护",
                    title: "North York General Hospital - Senior Health Centre",
                    text:
                      "这段老年健康照护经历覆盖 ADL 支持、失智相关需求、跌倒预防、压力性损伤意识与家庭沟通。",
                    signals: ["老年照护", "ADL", "跌倒预防", "家庭沟通"]
                  },
                  {
                    kicker: "中国内科受督导实践",
                    title: "右玉县中医院 - 3F 内科",
                    text:
                      "受督导内科实践支持普通话沟通、资料审阅、患者教育与随访沟通清晰度，也是跨体系临床实践的具体证据。",
                    signals: ["内科", "普通话审阅", "患者教育", "随访"]
                  },
                  {
                    kicker: "临床流程与文档支持",
                    title: "文档结构与跟进工具",
                    text:
                      "流程与工具只作为辅助证据，用于支持文档清晰度、交接清晰度与后续跟进，不替代临床判断。",
                    signals: ["文档清晰度", "交接清晰", "跟进", "辅助"]
                  }
                ],
                items: [
                  {
                    kicker: "注册护士",
                    title: "Markham Stouffville Hospital - 3WG Intensive Care Unit",
                    text:
                      "重症监测、再评估、心律相关记录、及时上报与病区协作。",
                    signals: ["ICU", "监测", "及时上报"]
                  },
                  {
                    kicker: "督导实践",
                    title: "右玉县中医院 - 3F 内科",
                    text:
                      "中国内科受督导实践，包括普通话沟通、资料审阅、患者教育与随访沟通清晰度。",
                    signals: ["内科", "普通话审阅", "患者教育"]
                  },
                  {
                    kicker: "临床助理实习",
                    title: "Markham Stouffville Hospital - Surgical / Short Stay",
                    text:
                      "围手术期与短住院支持，包括观察、沟通、交接与病区流转。",
                    signals: ["观察", "交接", "病区流转"]
                  },
                  {
                    kicker: "老年健康",
                    title: "North York General Hospital - Senior Health Centre",
                    text:
                      "老年照护支持，包括 ADL、失智相关需求、跌倒预防、压力性损伤意识与家庭沟通。",
                    signals: ["失智", "跌倒", "家庭沟通"]
                  },
                  {
                    kicker: "ICU 实习",
                    title: "Humber River Hospital - 6E Intensive Care Unit",
                    text:
                      "ICU 实习阶段接触机械通气患者、血流动力学观察、神经系统观察与记录。",
                    signals: ["机械通气相关接触", "神经观察", "记录"]
                  },
                  {
                    kicker: "急性照护",
                    title: "St. Michael's Hospital - Fracture Clinic and General Medicine",
                    text:
                      "门诊与内科实习，涉及评估、记录、患者教育与照护团队沟通。",
                    signals: ["评估", "记录", "教育"]
                  }
                ]
              },
              capability: {
                eyebrow: "能力细分",
                title: "能力要点细分。",
                summary:
                  "详细能力保持折叠，供需要更多证据的读者展开。",
                disclosureTitle: "详细能力要点",
                disclosureSummary: "展开较完整的能力分组。",
                groups: [
                  {
                    title: "重症护理",
                    items: ["血流动力学监测", "通气与气道相关接触", "神经系统再评估", "及时上报与升级处理准备"],
                    note: "以趋势识别与及时跟进为核心。"
                  },
                  {
                    title: "心脏 / 心律",
                    items: ["心律识别", "ECG 相关记录", "Coronary Care 1", "BLS / ACLS 训练"],
                    note: "心脏相关内容以床旁可用的语言记录。"
                  },
                  {
                    title: "老年健康",
                    items: ["失智", "吞咽困难与失语", "跌倒与压力性损伤风险", "慢性病连续性"],
                    note: "复杂需求需要有尊严、可持续的照护支持。"
                  },
                  {
                    title: "跨体系临床实践",
                    items: ["中加临床环境", "内科视角", "普通话沟通与资料审阅", "护理计划清晰度"],
                    note: "体系差异成为理解照护决策的临床背景。"
                  },
                  {
                    title: "沟通",
                    items: ["SBAR 式及时上报", "患者教育", "双语倾听", "家庭沟通"],
                    note: "沟通被视为安全工具，而不是附加环节。"
                  },
                  {
                    title: "临床系统实践",
                    items: ["小型工具", "修订习惯", "跟进结构", "流程执行一致性"],
                    note: "技术工作仅作为辅助，服务于临床清晰度。"
                  }
                ]
              },
              education: {
                eyebrow: "教育与注册",
                title: "专业资质与当前进修。",
                summary:
                  "简明呈现注册、教育背景、重症护理培训与当前学习。",
                disclosureTitle: "教育与专业发展",
                disclosureSummary: "展开资质、培训与当前学习。",
                items: [
                  ["注册护士", "NSCN。"],
                  ["护理学理学士", "Toronto Metropolitan University 护理学理学士（协作护理项目），辅修心理学，以 Distinction 毕业。"],
                  ["重症护理教育", "Centennial College 重症护理培训项目及 Coronary Care 1。"],
                  ["当前进修 / 额外学习", "Conestoga College NURS8963 Transition to Nursing Practice（进行中）；CIHI InterRAI LTCF Essentials 1 与 2。"],
                  ["跨体系注册背景", "中国护士注册考试背景，以公开专业层级呈现。"]
                ]
              },
              language: {
                eyebrow: "语言与跨文化实践",
                title: "跨语言与跨体系的临床沟通。",
                summary:
                  "语言能力作为临床实践背景呈现：支持更清晰的患者教育、更安全的交接，以及更准确的倾听。",
                disclosureTitle: "语言实践",
                disclosureSummary: "展开语言与跨文化实践。",
                items: [
                  ["英语", "专业临床工作熟练度。"],
                  ["普通话", "母语，可支持临床沟通与监管材料阅读。"],
                  ["法语", "A2 主动学习。"],
                  ["西班牙语", "A1 休闲学习。"],
                  ["跨文化实践", "中加临床环境经验，支持灵活沟通、面向老年患者的方言敏感照护，以及对体系差异的理解。"]
                ]
              },
              systems: {
                eyebrow: "临床系统实践",
                title: "工具始终服务于临床清晰度。",
                summary:
                  "本辅助板块展示用于支持记录、护理计划清晰度与照护连续性的实用习惯与工具。",
                disclosureTitle: "临床系统实践",
                disclosureSummary: "展开临床系统实践与相关链接。",
                featureTitle: "临床系统实践支持",
                feature:
                  "小型工具、修订习惯与清单，只有在能够提升临床沟通与跟进连续性时才有意义。",
                links: [
                  ["professional-direction.html", "职业方向说明", "关于当前 RN 方向的简短说明。"],
                  ["systems-practice.html", "临床系统实践", "小型工具与跟进习惯，用于支持文档清晰度。"]
                ]
              },
              contact: {
                eyebrow: "联系",
                title: "专业联系。",
                summary:
                  "如有相关护理机会、引荐或专业交流，电子邮件是最合适的联系渠道。",
                location: "加拿大安大略省多伦多",
                text:
                  "如有相关护理机会、引荐、专业材料请求或专业交流，电子邮件是首选联系渠道。",
                email: "shaotinghe2037@gmail.com",
                note: "可在相关情况下提供更多专业材料。"
              }
            },
            footer: {
              text: "注册护士，聚焦重症护理判断、老年健康连续照护，以及临床流程与文档支持。",
              copyright:
                "Copyright © 2026 何少霆。保留所有权利。未经许可，不得复制本站内容与设计。"
            }
          }
        };
})(window);
