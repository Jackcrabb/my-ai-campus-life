import type { CampusQuestion } from "./campus-types";
export const CAMPUS_CASES: CampusQuestion[] = [
    {
        "id": "case-voice",
        "grade": 0,
        "subjectId": "ai-ethics",
        "roomId": "corridor",
        "category": "case",
        "level": "repair",
        "stars": 5,
        "maxScore": 1,
        "title": {
            "zh": "失準的聲音評分",
            "en": "The Voice Verdict",
            "cn": "失准的声音评分"
        },
        "question": {
            "zh": "重新測試時，哪項證據最切合學習目標？",
            "en": "Which evidence best fits the learning goal in a retest?",
            "cn": "重新测试时，哪项证据最切合学习目标？"
        },
        "options": [
            {
                "text": {
                    "zh": "錄音聽起來有多像某一種母語口音。",
                    "en": "How closely the recording resembles one native accent.",
                    "cn": "录音听起来有多像某一种母语口音。"
                },
                "correct": false,
                "feedback": {
                    "zh": "這會重複原來的準則錯配。口音相似程度不等於訊息是否清楚。",
                    "en": "That repeats the rubric mismatch. Accent similarity is not the same as a clear message.",
                    "cn": "这会重复原来的标准错配。口音相似程度不等于信息是否清楚。"
                },
                "id": "0"
            },
            {
                "text": {
                    "zh": "聽眾能否理解論點，以及 AI 能否指出具體的表達問題。",
                    "en": "Whether listeners understand the argument and the AI identifies specific communication issues.",
                    "cn": "听众能否理解论点，以及 AI 能否指出具体的表达问题。"
                },
                "correct": true,
                "feedback": {
                    "zh": "對。檢查實際理解及可行回饋，並由老師比較不同錄音的結果。",
                    "en": "Yes. Check actual understanding and actionable feedback, with teachers comparing results across recordings.",
                    "cn": "对。检查实际理解及可行反馈，并由老师比较不同录音的结果。"
                },
                "id": "1"
            },
            {
                "text": {
                    "zh": "更換工具後，所有人的分數是否都更高。",
                    "en": "Whether everyone receives a higher score with a different tool.",
                    "cn": "更换工具后，所有人的分数是否都更高。"
                },
                "correct": false,
                "feedback": {
                    "zh": "分數變高不代表評分更公平；你仍須查核它量度了甚麼。",
                    "en": "Higher scores do not establish fairness. You still need to check what the tool measures.",
                    "cn": "分数变高不代表评分更公平；你仍须查核它衡量了什么。"
                },
                "id": "2"
            }
        ],
        "takeaway": {
            "zh": "先問「量度甚麼」，再看分數。AI 回饋要對準學習目標，並容許人類覆核及提出異議。",
            "en": "Ask what is being measured before trusting a score. Align AI feedback with learning goals, and provide human review and a way to challenge it.",
            "cn": "先问“衡量什么”，再看分数。AI 反馈要对准学习目标，并容许人类复核及提出异议。"
        }
    },
    {
        "id": "case-privacy",
        "grade": 0,
        "subjectId": "ai-ethics",
        "roomId": "corridor1",
        "category": "case",
        "level": "repair",
        "stars": 5,
        "maxScore": 1,
        "title": {
            "zh": "未寄出的秘密",
            "en": "The Unsent Secret",
            "cn": "未寄出的秘密"
        },
        "question": {
            "zh": "哪個修改最能保留今次練習，又減少私人資料？",
            "en": "Which revision best preserves this exercise while reducing personal data?",
            "cn": "哪个修改最能保留这次练习，又减少私人资料？"
        },
        "options": [
            {
                "text": {
                    "zh": "改成虛構角色及事件，保留需要練習的連接詞和段落結構。",
                    "en": "Use fictional people and events while retaining the linking words and paragraph structure to practise.",
                    "cn": "改成虚构角色及事件，保留需要练习的连接词和段落结构。"
                },
                "correct": true,
                "feedback": {
                    "zh": "對。你保留學習所需的語言特徵，移除不必要的真人細節。",
                    "en": "Yes. You retained the language features needed for learning and removed unnecessary personal details.",
                    "cn": "对。你保留学习所需的语言特征，移除不必要的真人细节。"
                },
                "id": "0"
            },
            {
                "text": {
                    "zh": "以姓名縮寫代替全名，其餘內容全部保留。",
                    "en": "Replace full names with initials and keep everything else.",
                    "cn": "以姓名缩写代替全名，其余内容全部保留。"
                },
                "correct": false,
                "feedback": {
                    "zh": "縮寫仍可能與地點、班別及事件連起來辨認出人。",
                    "en": "Initials may still be linked with places, classes and events to identify someone.",
                    "cn": "缩写仍可能与地点、班级及事件连起来辨认出人。"
                },
                "id": "1"
            },
            {
                "text": {
                    "zh": "加上「請保密」，便可上傳原稿。",
                    "en": "Add “please keep this confidential” and upload the original.",
                    "cn": "加上“请保密”，便可上传原稿。"
                },
                "correct": false,
                "feedback": {
                    "zh": "提示詞不能代替工具的資料處理設定或學校審查。",
                    "en": "A prompt cannot replace the tool’s data settings or the school’s review.",
                    "cn": "提示词不能代替工具的资料处理设置或学校审查。"
                },
                "id": "2"
            }
        ],
        "takeaway": {
            "zh": "先減少資料，再查核工具。只分享學習所需的內容，並讓學生理解安排及保有選擇。",
            "en": "Minimise data first, then check the tool. Share only what learning requires, and help students understand the arrangements and retain a choice.",
            "cn": "先减少资料，再查核工具。只分享学习所需的内容，并让学生理解安排及保有选择。"
        }
    },
    {
        "id": "case-culture",
        "grade": 0,
        "subjectId": "ai-ethics",
        "roomId": "corridor2",
        "category": "case",
        "level": "repair",
        "stars": 5,
        "maxScore": 1,
        "title": {
            "zh": "被改寫的心意",
            "en": "The Missing Meaning",
            "cn": "被改写的心意"
        },
        "question": {
            "zh": "哪項展板修訂最能回應這次活動的證據？",
            "en": "Which display revision best responds to the evidence?",
            "cn": "哪项展板修订最能回应这次活动的证据？"
        },
        "options": [
            {
                "text": {
                    "zh": "只留下英文，避免讀者看見原文差異。",
                    "en": "Show only English so readers cannot see differences from the source.",
                    "cn": "只留下英文，避免读者看见原文差异。"
                },
                "correct": false,
                "feedback": {
                    "zh": "隱藏原文不能修正意思，也削弱了作者希望保留中文的選擇。",
                    "en": "Hiding the source does not repair the meaning and ignores the authors’ wish to retain Chinese.",
                    "cn": "隐藏原文不能修正意思，也削弱了作者希望保留中文的选择。"
                },
                "id": "0"
            },
            {
                "text": {
                    "zh": "標示「AI 已驗證」，所以不再需要人類審閱。",
                    "en": "Label it “AI verified” so no human review is needed.",
                    "cn": "标示“AI 已验证”，所以不再需要人类审阅。"
                },
                "correct": false,
                "feedback": {
                    "zh": "這個標籤沒有提供準確性的證據；另一個 AI 判斷也不能代替作者確認意思。",
                    "en": "That label supplies no evidence of accuracy. Another AI judgement cannot replace checking meaning with the authors.",
                    "cn": "这个标签没有提供准确性的证据；另一个 AI 判断也不能代替作者确认意思。"
                },
                "id": "1"
            },
            {
                "text": {
                    "zh": "保留中文，加入作者認可的致謝解說，並註明「AI 初譯；學生核對及修訂」。",
                    "en": "Retain Chinese, add an author-approved explanation of the thanks, and credit “AI draft; checked and revised by students.”",
                    "cn": "保留中文，加入作者认可的致谢解说，并注明“AI 初译；学生核对及修订”。"
                },
                "correct": true,
                "feedback": {
                    "zh": "對。這讓讀者理解心意，也具體交代 AI 與學生各自的貢獻。",
                    "en": "Yes. Readers can understand the intention and see the distinct contributions of AI and the students.",
                    "cn": "对。这让读者理解心意，也具体交代 AI 与学生各自的贡献。"
                },
                "id": "2"
            }
        ],
        "takeaway": {
            "zh": "流暢不等於忠實。翻譯須照顧語境、讀者及作者聲音；按任務要求清楚交代 AI 協助。",
            "en": "Fluency is not faithfulness. Translation needs context, audience and author voice, with AI assistance explained according to the task’s requirements.",
            "cn": "流畅不等于忠实。翻译须照顾语境、读者及作者声音；按任务要求清楚交代 AI 协助。"
        }
    },
    {
        "id": "case-access",
        "grade": 0,
        "subjectId": "ai-ethics",
        "roomId": "corridor3",
        "category": "case",
        "level": "repair",
        "stars": 5,
        "maxScore": 1,
        "title": {
            "zh": "進不去的練習室",
            "en": "The Locked Practice Room",
            "cn": "进不去的练习室"
        },
        "question": {
            "zh": "下一輪測試，哪個做法最能驗證可及性？",
            "en": "Which next test best checks accessibility?",
            "cn": "下一轮测试，哪个做法最能验证可及性？"
        },
        "options": [
            {
                "text": {
                    "zh": "只請最快完成原版的同學再玩一次。",
                    "en": "Ask only the fastest users of the original version to try again.",
                    "cn": "只请最快完成原版的同学再玩一次。"
                },
                "correct": false,
                "feedback": {
                    "zh": "這會漏掉已被排除的同學，也無法測試新增途徑是否有效。",
                    "en": "That misses learners already excluded and does not test whether the new routes work.",
                    "cn": "这会漏掉已被排除的同学，也无法测试新增途径是否有效。"
                },
                "id": "0"
            },
            {
                "text": {
                    "zh": "讓有不同操作及連線需要的同學，以各種途徑完成同一澄清任務並給回饋。",
                    "en": "Have learners with varied input and connection needs complete the same clarification task through different routes and give feedback.",
                    "cn": "让有不同操作及连线需要的同学，以各种途径完成同一澄清任务并给反馈。"
                },
                "correct": true,
                "feedback": {
                    "zh": "對。觀察能否完成、理解及獲得回饋，也聽取學生意見；測試後仍可再修訂。",
                    "en": "Yes. Observe completion, understanding and access to feedback, and listen to learners. Revise again after testing.",
                    "cn": "对。观察能否完成、理解及获得反馈，也听取学生意见；测试后仍可再修订。"
                },
                "id": "1"
            },
            {
                "text": {
                    "zh": "把按鈕改得更漂亮，就宣告所有人都能使用。",
                    "en": "Make the buttons prettier and announce that everyone can use it.",
                    "cn": "把按钮改得更漂亮，就宣告所有人都能使用。"
                },
                "correct": false,
                "feedback": {
                    "zh": "美感可以改善體驗，但不能證明鍵盤、文字、時間及連線障礙已解決。",
                    "en": "Visual polish can improve the experience, but does not establish that input, text, timing and connection barriers are resolved.",
                    "cn": "美感可以改善体验，但不能证明键盘、文字、时间及连线障碍已解决。"
                },
                "id": "2"
            }
        ],
        "takeaway": {
            "zh": "公平不一定是人人使用同一方式。以共同學習目標設計不同途徑，並讓受影響的學生參與測試。",
            "en": "Fairness does not always mean using the same route. Design varied routes to a shared learning goal, and involve affected learners in testing.",
            "cn": "公平不一定是人人使用同一方式。以共同学习目标设计不同途径，并让受影响的学生参与测试。"
        }
    },
    {
        "id": "transfer",
        "grade": 0,
        "subjectId": "ai-ethics",
        "roomId": "library",
        "category": "transfer",
        "level": "transfer",
        "stars": 5,
        "maxScore": 1,
        "title": {
            "zh": "應用所學",
            "cn": "应用所学",
            "en": "Apply your learning"
        },
        "question": {
            "zh": "把四項校園活動學到的思考方式帶到新情境。最合適的下一步是甚麼？",
            "en": "Transfer your reasoning from the four campus activities. What is the most appropriate next step?",
            "cn": "把四项校园活动学到的思考方式带到新情境。最合适的下一步是什么？"
        },
        "options": [
            {
                "text": {
                    "zh": "只改善聊天介面外觀，然後向全校推出；自然的英文已足以證明可靠。",
                    "en": "Polish the chat interface, then launch school-wide; natural English is enough evidence of reliability.",
                    "cn": "只改善聊天界面外观，然后向全校推出；自然的英文已足以证明可靠。"
                },
                "correct": false,
                "feedback": {
                    "zh": "流暢及美觀都不能證明內容可靠或人人可用。需要查核資訊及參與障礙，而不是從表面推斷品質。",
                    "en": "Fluency and appearance do not establish reliability or access. Check the information and participation barriers instead of inferring quality from the surface.",
                    "cn": "流畅及美观都不能证明内容可靠或人人可用。需要查核信息及参与障碍，而不是从表面推断品质。"
                },
                "id": "0"
            },
            {
                "text": {
                    "zh": "先小規模試行：核對社團資料、不索取不必要個人資料、提供文字及真人求助，邀請不同需要的學生測試並回報錯誤。",
                    "en": "Run a small pilot: verify club information, avoid unnecessary personal data, provide text and human help, and invite learners with varied needs to test and report errors.",
                    "cn": "先小规模试行：核对社团资料、不索取不必要个人资料、提供文字及真人求助，邀请不同需要的学生测试并回报错误。"
                },
                "correct": true,
                "feedback": {
                    "zh": "你把證據、私隱、可及性及人類監督一起帶到新情境。試行後仍要根據回饋修訂，並清楚標示機械人的用途及限制。",
                    "en": "You transferred evidence checking, privacy, accessibility and human oversight to a new context. Revise after the pilot and explain the chatbot’s purpose and limits clearly.",
                    "cn": "你把证据、隐私、可及性及人类监督一起带到新情境。试行后仍要根据反馈修订，并清楚标示机器人的用途及限制。"
                },
                "id": "1"
            },
            {
                "text": {
                    "zh": "先收集所有同學的完整背景，讓 AI 自動判斷誰適合參加，之後才處理資料及公平問題。",
                    "en": "Collect every student’s full background so the AI can decide who should join, and address privacy and fairness later.",
                    "cn": "先收集所有同学的完整背景，让 AI 自动判断谁适合参加，之后才处理资料及公平问题。"
                },
                "correct": false,
                "feedback": {
                    "zh": "回答社團資訊不需要完整背景，也不應無故變成篩選學生。先界定任務，只使用必要資料，再查核風險及支援安排。",
                    "en": "Answering club questions does not need full backgrounds or an unexplained selection system. Define the task, use only necessary data, and check risks and support arrangements first.",
                    "cn": "回答社团信息不需要完整背景，也不应无故变成筛选学生。先界定任务，只使用必要资料，再查核风险及支持安排。"
                },
                "id": "2"
            }
        ],
        "takeaway": {
            "zh": "你把證據、私隱、可及性及人類監督一起帶到新情境。試行後仍要根據回饋修訂，並清楚標示機械人的用途及限制。",
            "en": "You transferred evidence checking, privacy, accessibility and human oversight to a new context. Revise after the pilot and explain the chatbot’s purpose and limits clearly.",
            "cn": "你把证据、隐私、可及性及人类监督一起带到新情境。试行后仍要根据反馈修订，并清楚标示机器人的用途及限制。"
        }
    }
];
export const CASE_RULES: Record<string, {
    evidenceCount: number;
    decisionCount: number;
}> = {
    "voice": {
        "evidenceCount": 3,
        "decisionCount": 3
    },
    "privacy": {
        "evidenceCount": 3,
        "decisionCount": 3
    },
    "culture": {
        "evidenceCount": 3,
        "decisionCount": 3
    },
    "access": {
        "evidenceCount": 3,
        "decisionCount": 3
    }
};
