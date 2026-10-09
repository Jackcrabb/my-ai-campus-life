/* Original three-language learning scenarios. All people, records and AI outputs are fictional. */
window.GAME_CONTENT = {
  missions: [
    {
      id: "voice",
      icon: "wave",
      color: "teal",
      location: "corridor",
      portrait: 0,
      name: {
        zh: "一心",
        en: "Yat-sum",
        cn: "一心",
      },
      role: {
        zh: "學生・英語辯論隊隊員",
        en: "Student · English debate team member",
        cn: "学生・英语辩论队队员",
      },
      title: {
        zh: "失準的聲音評分",
        en: "The Voice Verdict",
        cn: "失准的声音评分",
      },
      tag: {
        zh: "公平與人類監督",
        en: "Fairness & human oversight",
        cn: "公平与人类监督",
      },
      subtitle: {
        zh: "走廊的評分單，究竟漏聽了甚麼？",
        en: "What did the score sheet fail to hear?",
        cn: "走廊的评分单，究竟漏听了什么？",
      },
      opening: [
        {
          zh: "同學，你看這張回饋單。AI 說我的英語不夠好，理由竟然是「不像母語者」！",
          en: "Hey, look at this feedback. The AI says my English is weak because I do not sound like a native speaker!",
          cn: "同学，你看这张反馈单。AI 说我的英语不够好，理由竟然是“不像母语者”！",
        },
        {
          zh: "可是隊友都聽懂了我的論點。我需要改善的，到底是表達，還是口音？",
          en: "But my teammates understood my argument. Am I meant to improve my communication, or change my accent?",
          cn: "可是队友都听懂了我的论点。我需要改善的，到底是表达，还是口音？",
        },
      ],
      scene: {
        zh: "明澄書院正在試用 AI 英語口說回饋。一心把一張評分單交給你：低評級旁寫着「口音不夠地道」。本案人物及紀錄均屬虛構。",
        en: "Ming Ching College is piloting AI speaking feedback. Yat-sum hands you a low-rated report marked “accent not native-like.” This case and its records are fictional.",
        cn: "明澄书院正在试用 AI 英语口语反馈。一心把一张评分单交给你：低评级旁写着“口音不够地道”。本案人物及记录均属虚构。",
      },
      task: {
        zh: "查明評分是否符合學習目標，再建議試行安排。",
        en: "Check whether the scoring matches the learning goal, then recommend how the pilot should proceed.",
        cn: "查明评分是否符合学习目标，再建议试行安排。",
      },
      evidence: [
        {
          label: {
            zh: "線索 01｜AI 回饋單",
            en: "Clue 01 | AI feedback",
            cn: "线索 01｜AI 反馈单",
          },
          text: {
            zh: "模擬輸入：「We should move practice indoors because of the rain.」AI 回饋：「口音不夠地道。」它沒有指出哪個詞難以理解。",
            en: "Simulated input: “We should move practice indoors because of the rain.” AI feedback: “Accent not native-like.” The report identifies no word that a listener could not understand.",
            cn: "模拟输入：“We should move practice indoors because of the rain.” AI 反馈：“口音不够地道。”它没有指出哪个词难以理解。",
          },
        },
        {
          label: {
            zh: "線索 02｜聽眾筆記",
            en: "Clue 02 | Listener notes",
            cn: "线索 02｜听众笔记",
          },
          text: {
            zh: "同伴能說出一心的建議及理由。老師指出一處停頓可以更清楚。這次紀錄值得追查，但不足以證明整個系統公平或不公平。",
            en: "Peers correctly restate Yat-sum’s proposal and reason. A teacher suggests one clearer pause. This classroom record warrants investigation, but cannot establish whether the whole system is fair or unfair.",
            cn: "同伴能说出一心的建议及理由。老师指出一处停顿可以更清楚。这次记录值得追查，但不足以证明整个系统公平或不公平。",
          },
        },
        {
          label: {
            zh: "線索 03｜任務評分準則",
            en: "Clue 03 | Task rubric",
            cn: "线索 03｜任务评分标准",
          },
          text: {
            zh: "課堂目標是清楚表達論點及讓聽眾理解。準則沒有要求模仿母語口音；這個試用工具的評分方式，亦尚未經老師檢查。",
            en: "The task rewards clear arguments and understandable speech. Its rubric does not require a native accent. Teachers have not yet checked whether the pilot tool’s scoring follows these learning goals.",
            cn: "课堂目标是清楚表达论点及让听众理解。标准没有要求模仿母语口音；这个试用工具的评分方式，也尚未经老师检查。",
          },
        },
      ],
      options: [
        {
          title: {
            zh: "照 AI 評級安排補習",
            en: "Let the AI assign extra practice",
            cn: "照 AI 评级安排补习",
          },
          text: {
            zh: "要求低評級同學模仿母語口音，直到分數提高。",
            en: "Ask low-rated students to copy a native accent until their scores improve.",
            cn: "要求低评级同学模仿母语口音，直到分数提高。",
          },
          quality: 0,
          feedback: {
            zh: "你把未經查核的評級當成能力證據。口音本身不能證明溝通能力；這樣也可能讓學生為了分數放棄自己的聲音。",
            en: "You treated an unchecked score as evidence of ability. Accent alone does not establish communication ability, and chasing the score may pressure learners to abandon their own voice.",
            cn: "你把未经查核的评级当成能力证据。口音本身不能证明沟通能力；这样也可能让学生为了分数放弃自己的声音。",
          },
        },
        {
          title: {
            zh: "查核準則，保留有用回饋",
            en: "Review the rubric and retain useful feedback",
            cn: "查核标准，保留有用反馈",
          },
          text: {
            zh: "暫停把 AI 評級計入成績，按可理解程度重審錄音，讓老師覆核並設申訴渠道。",
            en: "Pause AI ratings for grading, review recordings for understandability, and add teacher review and a way to challenge feedback.",
            cn: "暂停把 AI 评级计入成绩，按可理解程度重审录音，让老师复核并设申诉渠道。",
          },
          quality: 2,
          feedback: {
            zh: "你針對錯配的評分準則採取行動。經查核後，AI 仍可協助練習；老師須檢查不同說話方式的回饋，不能只看一個案例。",
            en: "You addressed the mismatch between the scoring and the goal. After review, AI can still support practice. Teachers should examine feedback across varied speaking styles, beyond this single case.",
            cn: "你针对错配的评分标准采取行动。经查核后，AI 仍可协助练习；老师须检查不同说话方式的反馈，不能只看一个案例。",
          },
        },
        {
          title: {
            zh: "永久停用所有口說 AI",
            en: "Permanently ban all speaking AI",
            cn: "永久停用所有口语 AI",
          },
          text: {
            zh: "刪除評級，也一併取消學生自選的 AI 練習。",
            en: "Remove the ratings and all optional AI speaking practice.",
            cn: "删除评级，也一并取消学生自选的 AI 练习。",
          },
          quality: 1,
          feedback: {
            zh: "你阻止了這次評級造成影響，但也失去可能有用的練習支援。應先查明問題，衡量風險及可行修正，而非憑一例判斷所有工具。",
            en: "You stopped this rating from causing harm, but also removed potentially useful support. Investigate the problem and possible safeguards before judging every tool from one case.",
            cn: "你阻止了这次评级造成影响，但也失去可能有用的练习支持。应先查明问题，衡量风险及可行修正，而非凭一例判断所有工具。",
          },
        },
      ],
      repair: {
        question: {
          zh: "重新測試時，哪項證據最切合學習目標？",
          en: "Which evidence best fits the learning goal in a retest?",
          cn: "重新测试时，哪项证据最切合学习目标？",
        },
        options: [
          {
            text: {
              zh: "錄音聽起來有多像某一種母語口音。",
              en: "How closely the recording resembles one native accent.",
              cn: "录音听起来有多像某一种母语口音。",
            },
            correct: false,
            feedback: {
              zh: "這會重複原來的準則錯配。口音相似程度不等於訊息是否清楚。",
              en: "That repeats the rubric mismatch. Accent similarity is not the same as a clear message.",
              cn: "这会重复原来的标准错配。口音相似程度不等于信息是否清楚。",
            },
          },
          {
            text: {
              zh: "聽眾能否理解論點，以及 AI 能否指出具體的表達問題。",
              en: "Whether listeners understand the argument and the AI identifies specific communication issues.",
              cn: "听众能否理解论点，以及 AI 能否指出具体的表达问题。",
            },
            correct: true,
            feedback: {
              zh: "對。檢查實際理解及可行回饋，並由老師比較不同錄音的結果。",
              en: "Yes. Check actual understanding and actionable feedback, with teachers comparing results across recordings.",
              cn: "对。检查实际理解及可行反馈，并由老师比较不同录音的结果。",
            },
          },
          {
            text: {
              zh: "更換工具後，所有人的分數是否都更高。",
              en: "Whether everyone receives a higher score with a different tool.",
              cn: "更换工具后，所有人的分数是否都更高。",
            },
            correct: false,
            feedback: {
              zh: "分數變高不代表評分更公平；你仍須查核它量度了甚麼。",
              en: "Higher scores do not establish fairness. You still need to check what the tool measures.",
              cn: "分数变高不代表评分更公平；你仍须查核它衡量了什么。",
            },
          },
        ],
      },
      takeaway: {
        zh: "先問「量度甚麼」，再看分數。AI 回饋要對準學習目標，並容許人類覆核及提出異議。",
        en: "Ask what is being measured before trusting a score. Align AI feedback with learning goals, and provide human review and a way to challenge it.",
        cn: "先问“衡量什么”，再看分数。AI 反馈要对准学习目标，并容许人类复核及提出异议。",
      },
      languageMove: {
        zh: "句式：「The evidence suggests ___, but it does not prove ___.」\n「證據顯示＿＿，但不能證明＿＿。」",
        en: "Sentence frame: “The evidence suggests ___, but it does not prove ___.”\n中文：「證據顯示＿＿，但不能證明＿＿。」",
        cn: "句式：“The evidence suggests ___, but it does not prove ___.”\n“证据显示＿＿，但不能证明＿＿。”",
      },
    },
    {
      id: "privacy",
      icon: "shield",
      color: "coral",
      location: "computer",
      portrait: 1,
      name: {
        zh: "允行",
        en: "Wan-hang",
        cn: "允行",
      },
      role: {
        zh: "學生・班刊編輯",
        en: "Student · Class magazine editor",
        cn: "学生・班刊编辑",
      },
      title: {
        zh: "未寄出的秘密",
        en: "The Unsent Secret",
        cn: "未寄出的秘密",
      },
      tag: {
        zh: "私隱與知情選擇",
        en: "Privacy & informed choice",
        cn: "隐私与知情选择",
      },
      subtitle: {
        zh: "一篇作文，藏着不該送出的線索。",
        en: "One essay holds more than a writing task.",
        cn: "一篇作文，藏着不该送出的线索。",
      },
      opening: [
        {
          zh: "我只想請 AI 幫忙改英文。上傳前才發現，作文寫了同學家裏的事。",
          en: "I only wanted AI feedback on the English. Before uploading, I noticed the essay describes a classmate’s family situation.",
          cn: "我只想请 AI 帮忙改英文。上传前才发现，作文写了同学家里的事。",
        },
        {
          zh: "把姓名刪掉就安全嗎？這個工具會保留多久，我完全不知道。",
          en: "Is removing the name enough? I have no idea how long this tool keeps our writing.",
          cn: "把姓名删掉就安全吗？这个工具会保留多久，我完全不知道。",
        },
      ],
      scene: {
        zh: "電腦室的上傳視窗仍未送出。允行正準備把一篇真人真事作文貼進新工具，換取即時寫作回饋。你的決定仍能改變資料去向。",
        en: "An upload window waits in the computer room. Wan-hang is about to send a personal essay to a new tool for instant writing feedback. You can still change what gets shared.",
        cn: "电脑室的上传窗口仍未发送。允行正准备把一篇真人真事作文贴进新工具，换取即时写作反馈。你的决定仍能改变资料去向。",
      },
      task: {
        zh: "保留寫作支援，同時減少不必要的個人資料外傳。",
        en: "Keep useful writing support while reducing unnecessary sharing of personal information.",
        cn: "保留写作支持，同时减少不必要的个人资料外传。",
      },
      evidence: [
        {
          label: {
            zh: "線索 01｜待上傳的段落",
            en: "Clue 01 | The draft upload",
            cn: "线索 01｜待上传的段落",
          },
          text: {
            zh: "虛構原稿寫有「我住在海榕樓，弟弟上週住院」，並提到班別及一次獨特事件。即使刪掉姓名，熟悉情況的人仍可能認出作者。",
            en: "The fictional draft mentions a home building, a sibling’s hospital visit, a class and a distinctive event. Even without a name, someone familiar with those details might identify the writer.",
            cn: "虚构原稿写有“我住在海榕楼，弟弟上周住院”，并提到班级及一次独特事件。即使删掉姓名，熟悉情况的人仍可能认出作者。",
          },
        },
        {
          label: {
            zh: "線索 02｜尚未查核的設定",
            en: "Clue 02 | Unchecked settings",
            cn: "线索 02｜尚未查核的设置",
          },
          text: {
            zh: "學校尚未查核工具的資料保留、存取及訓練用途。首頁寫着「安全」，但允行未能找到足以確認這些做法的設定或說明。",
            en: "The school has not checked the tool’s retention, access or training settings. Its homepage says “secure,” but Wan-hang cannot find enough information to confirm how this writing would be handled.",
            cn: "学校尚未查核工具的资料保留、访问及训练用途。首页写着“安全”，但允行未能找到足以确认这些做法的设置或说明。",
          },
        },
        {
          label: {
            zh: "線索 03｜真正需要的回饋",
            en: "Clue 03 | The actual learning need",
            cn: "线索 03｜真正需要的反馈",
          },
          text: {
            zh: "今次只需練習連接詞及段落組織。改用「一位角色遇到困難，朋友提供協助」的虛構短文，也可練習同一技巧，毋須上傳私人經歷。",
            en: "Today’s goals are linking words and paragraph structure. A fictional paragraph about a character receiving help can support the same practice without sending the writer’s personal experience to the tool.",
            cn: "这次只需练习连接词及段落组织。改用“一位角色遇到困难，朋友提供协助”的虚构短文，也可练习同一技巧，无须上传私人经历。",
          },
        },
      ],
      options: [
        {
          title: {
            zh: "刪姓名，立即上傳",
            en: "Remove names and upload now",
            cn: "删姓名，立即上传",
          },
          text: {
            zh: "保留事件、班別及地點，讓回饋維持完整。",
            en: "Keep the events, class and locations so the feedback stays detailed.",
            cn: "保留事件、班级及地点，让反馈维持完整。",
          },
          quality: 1,
          feedback: {
            zh: "刪姓名是一步，但其他線索仍可能辨認出人。你也未查核工具如何處理資料；「已刪姓名」不等於「已匿名」。",
            en: "Removing names helps, but other clues may still identify someone. The tool’s data handling also remains unchecked. Removing a name does not guarantee anonymity.",
            cn: "删姓名是一步，但其他线索仍可能辨认出人。你也未查核工具如何处理资料；“已删姓名”不等于“已匿名”。",
          },
        },
        {
          title: {
            zh: "先上傳，再研究條款",
            en: "Upload first and check later",
            cn: "先上传，再研究条款",
          },
          text: {
            zh: "趕及截稿後，才查工具是否保留作文。",
            en: "Meet the deadline first, then check whether the tool keeps the essay.",
            cn: "赶及截稿后，才查工具是否保留作文。",
          },
          quality: 0,
          feedback: {
            zh: "一旦送出，你可能無法收回所有副本。寫作回饋並不需要這些私人細節，應在分享前先減少資料及查核安排。",
            en: "Once sent, every copy may not be recoverable. The feedback task does not need these personal details. Minimise the data and check the arrangements before sharing.",
            cn: "一旦发送，你可能无法收回所有副本。写作反馈并不需要这些私人细节，应在分享前先减少资料及查核安排。",
          },
        },
        {
          title: {
            zh: "改用虛構短文，先查資料安排",
            en: "Use a fictional sample and check data handling",
            cn: "改用虚构短文，先查资料安排",
          },
          text: {
            zh: "先用虛構內容練習；由學校查核工具，說明傳送內容，並提供不用 AI 的回饋選項。",
            en: "Practise with fictional content, have the school review the tool, explain what is sent, and provide a non-AI feedback option.",
            cn: "先用虚构内容练习；由学校查核工具，说明传送内容，并提供不用 AI 的反馈选项。",
          },
          quality: 2,
          feedback: {
            zh: "你讓資料量配合教學需要，也保留選擇。虛構短文能先完成練習；任何後續分享仍須遵循學校經查核的安排。",
            en: "You matched the data shared to the learning need and preserved choice. A fictional sample supports practice now; later sharing still needs to follow the school’s reviewed arrangements.",
            cn: "你让资料量配合教学需要，也保留选择。虚构短文能先完成练习；任何后续分享仍须遵循学校经查核的安排。",
          },
        },
      ],
      repair: {
        question: {
          zh: "哪個修改最能保留今次練習，又減少私人資料？",
          en: "Which revision best preserves this exercise while reducing personal data?",
          cn: "哪个修改最能保留这次练习，又减少私人资料？",
        },
        options: [
          {
            text: {
              zh: "改成虛構角色及事件，保留需要練習的連接詞和段落結構。",
              en: "Use fictional people and events while retaining the linking words and paragraph structure to practise.",
              cn: "改成虚构角色及事件，保留需要练习的连接词和段落结构。",
            },
            correct: true,
            feedback: {
              zh: "對。你保留學習所需的語言特徵，移除不必要的真人細節。",
              en: "Yes. You retained the language features needed for learning and removed unnecessary personal details.",
              cn: "对。你保留学习所需的语言特征，移除不必要的真人细节。",
            },
          },
          {
            text: {
              zh: "以姓名縮寫代替全名，其餘內容全部保留。",
              en: "Replace full names with initials and keep everything else.",
              cn: "以姓名缩写代替全名，其余内容全部保留。",
            },
            correct: false,
            feedback: {
              zh: "縮寫仍可能與地點、班別及事件連起來辨認出人。",
              en: "Initials may still be linked with places, classes and events to identify someone.",
              cn: "缩写仍可能与地点、班级及事件连起来辨认出人。",
            },
          },
          {
            text: {
              zh: "加上「請保密」，便可上傳原稿。",
              en: "Add “please keep this confidential” and upload the original.",
              cn: "加上“请保密”，便可上传原稿。",
            },
            correct: false,
            feedback: {
              zh: "提示詞不能代替工具的資料處理設定或學校審查。",
              en: "A prompt cannot replace the tool’s data settings or the school’s review.",
              cn: "提示词不能代替工具的资料处理设置或学校审查。",
            },
          },
        ],
      },
      takeaway: {
        zh: "先減少資料，再查核工具。只分享學習所需的內容，並讓學生理解安排及保有選擇。",
        en: "Minimise data first, then check the tool. Share only what learning requires, and help students understand the arrangements and retain a choice.",
        cn: "先减少资料，再查核工具。只分享学习所需的内容，并让学生理解安排及保有选择。",
      },
      languageMove: {
        zh: "句式：「We can practise ___ without sharing ___.」\n「我們可以練習＿＿，而毋須分享＿＿。」",
        en: "Sentence frame: “We can practise ___ without sharing ___.”\n中文：「我們可以練習＿＿，而毋須分享＿＿。」",
        cn: "句式：“We can practise ___ without sharing ___.”\n“我们可以练习＿＿，而无须分享＿＿。”",
      },
    },
    {
      id: "culture",
      icon: "spark",
      color: "amber",
      location: "library",
      portrait: 2,
      name: {
        zh: "家寶",
        en: "Ka-po",
        cn: "家宝",
      },
      role: {
        zh: "學生・雙語展覽策展員",
        en: "Student · Bilingual exhibition curator",
        cn: "学生・双语展览策展员",
      },
      title: {
        zh: "被改寫的心意",
        en: "The Missing Meaning",
        cn: "被改写的心意",
      },
      tag: {
        zh: "文化聲音與透明度",
        en: "Cultural voice & transparency",
        cn: "文化声音与透明度",
      },
      subtitle: {
        zh: "譯文流暢，為何作者卻認不出自己？",
        en: "A fluent translation. An unfamiliar voice.",
        cn: "译文流畅，为何作者却认不出自己？",
      },
      opening: [
        {
          zh: "這是我們感謝校工的展板。AI 的英文很順，但把「飲水思源」改成了成功口號。",
          en: "This display thanks our school support staff. The AI’s English is smooth, but it turned “飲水思源” into a success slogan.",
          cn: "这是我们感谢校工的展板。AI 的英文很顺，但把“饮水思源”改成了成功口号。",
        },
        {
          zh: "同學說直接用就好。可是這樣展出的，還是我們想說的話嗎？",
          en: "Someone said we should just use it. But would the display still say what we mean?",
          cn: "同学说直接用就好。可是这样展出的，还是我们想说的话吗？",
        },
      ],
      scene: {
        zh: "圖書館將展出學生雙語作品。一段致謝文字經 AI 翻譯後變得流暢，卻換了重點。家寶請你找回文字原本的心意。",
        en: "The library is preparing a bilingual student display. An AI translation made a message fluent but shifted its purpose. Ka-po asks you to recover what the writers intended.",
        cn: "图书馆将展出学生双语作品。一段致谢文字经 AI 翻译后变得流畅，却换了重点。家宝请你找回文字原本的心意。",
      },
      task: {
        zh: "決定如何使用 AI 翻譯，同時保留作者意思及交代協助方式。",
        en: "Decide how to use AI translation while preserving the writers’ meaning and explaining the assistance used.",
        cn: "决定如何使用 AI 翻译，同时保留作者意思及交代协助方式。",
      },
      evidence: [
        {
          label: {
            zh: "線索 01｜原文與譯文",
            en: "Clue 01 | Before and after",
            cn: "线索 01｜原文与译文",
          },
          text: {
            zh: "虛構原文：「飲水思源，感謝每天照顧校園的人。」模擬 AI 譯文：「Aim higher and celebrate your success.」句子通順，卻失去了致謝對象及原意。",
            en: "Fictional source: “飲水思源，感謝每天照顧校園的人。” Simulated AI output: “Aim higher and celebrate your success.” The English is fluent, but drops both the thanks and the people receiving them.",
            cn: "虚构原文：“饮水思源，感谢每天照顾校园的人。” 模拟 AI 译文：“Aim higher and celebrate your success.” 句子通顺，却失去了致谢对象及原意。",
          },
        },
        {
          label: {
            zh: "線索 02｜作者的目的",
            en: "Clue 02 | The writers’ intention",
            cn: "线索 02｜作者的目的",
          },
          text: {
            zh: "學生想感謝校園工作人員，也讓不懂中文的訪客明白成語。他們願意加入短解說，並希望保留中文原句及共同審閱英文。",
            en: "The students want to thank school staff and help visitors understand the idiom. They welcome a short explanation, want the Chinese retained, and wish to review the English together.",
            cn: "学生想感谢校园工作人员，也让不懂中文的访客明白成语。他们愿意加入简短解说，并希望保留中文原句及共同审阅英文。",
          },
        },
        {
          label: {
            zh: "線索 03｜展覽指引",
            en: "Clue 03 | Exhibition guidance",
            cn: "线索 03｜展览指引",
          },
          text: {
            zh: "本次虛構展覽容許 AI 協助，但要求作者核對意思並交代使用方式。流暢的文字不能證明翻譯準確；也可能存在多個合適譯法。",
            en: "This fictional exhibition permits AI assistance when authors check meaning and explain its use. Fluent writing does not establish translation accuracy, and more than one rendering may suit the audience.",
            cn: "本次虚构展览容许 AI 协助，但要求作者核对意思并交代使用方式。流畅的文字不能证明翻译准确；也可能存在多个合适译法。",
          },
        },
      ],
      options: [
        {
          title: {
            zh: "讓作者比較、修訂及交代",
            en: "Let the authors compare, revise and disclose",
            cn: "让作者比较、修订及交代",
          },
          text: {
            zh: "比較多個譯法，保留中文並加短解說，由作者核對；註明 AI 草擬及人類修訂。",
            en: "Compare translations, retain the Chinese with a short explanation, check with the authors, and credit AI drafting and human revision.",
            cn: "比较多个译法，保留中文并加简短解说，由作者核对；注明 AI 草拟及人类修订。",
          },
          quality: 2,
          feedback: {
            zh: "你讓文化意思、讀者理解及作者決定權一起參與。AI 可提供選項，但最後版本應由人核對，並按這次展覽要求交代協助。",
            en: "You considered cultural meaning, reader understanding and author agency together. AI can suggest options, while people check the final version and disclose help under this exhibition’s guidance.",
            cn: "你让文化意思、读者理解及作者决定权一起参与。AI 可提供选项，但最后版本应由人核对，并按这次展览要求交代协助。",
          },
        },
        {
          title: {
            zh: "逐字翻譯，完全不解釋",
            en: "Translate word for word without explanation",
            cn: "逐字翻译，完全不解释",
          },
          text: {
            zh: "改成「Drink water, think of the source」，認為逐字對應就足夠。",
            en: "Use “Drink water, think of the source,” assuming matching each word is enough.",
            cn: "改成“Drink water, think of the source”，认为逐字对应就足够。",
          },
          quality: 1,
          feedback: {
            zh: "你保留了原文意象，但陌生讀者可能仍不明白致謝意思。逐字翻譯是一個起點，仍需要考慮語境、讀者及作者意圖。",
            en: "You preserved the original image, but unfamiliar readers may miss the thanks. A literal version is a starting point; context, audience and author intent still matter.",
            cn: "你保留了原文意象，但陌生读者可能仍不明白致谢意思。逐字翻译是一个起点，仍需要考虑语境、读者及作者意图。",
          },
        },
        {
          title: {
            zh: "採用最流暢版本，不註明 AI",
            en: "Use the smoothest version without crediting AI",
            cn: "采用最流畅版本，不注明 AI",
          },
          text: {
            zh: "直接展示成功口號，因為英文自然就代表翻譯好。",
            en: "Display the success slogan because natural English must mean a good translation.",
            cn: "直接展示成功口号，因为英文自然就代表翻译好。",
          },
          quality: 0,
          feedback: {
            zh: "文字雖流暢，卻改變了作者的意思；也沒有符合本次展覽的交代要求。流暢、忠於原意及透明度，必須分開檢查。",
            en: "The wording is fluent but changes the authors’ meaning and misses this exhibition’s disclosure requirement. Fluency, faithfulness and transparency need separate checks.",
            cn: "文字虽流畅，却改变了作者的意思；也没有符合本次展览的交代要求。流畅、忠于原意及透明度，必须分开检查。",
          },
        },
      ],
      repair: {
        question: {
          zh: "哪項展板修訂最能回應本案證據？",
          en: "Which display revision best responds to the evidence?",
          cn: "哪项展板修订最能回应本案证据？",
        },
        options: [
          {
            text: {
              zh: "只留下英文，避免讀者看見原文差異。",
              en: "Show only English so readers cannot see differences from the source.",
              cn: "只留下英文，避免读者看见原文差异。",
            },
            correct: false,
            feedback: {
              zh: "隱藏原文不能修正意思，也削弱了作者希望保留中文的選擇。",
              en: "Hiding the source does not repair the meaning and ignores the authors’ wish to retain Chinese.",
              cn: "隐藏原文不能修正意思，也削弱了作者希望保留中文的选择。",
            },
          },
          {
            text: {
              zh: "標示「AI 已驗證」，所以不再需要人類審閱。",
              en: "Label it “AI verified” so no human review is needed.",
              cn: "标示“AI 已验证”，所以不再需要人类审阅。",
            },
            correct: false,
            feedback: {
              zh: "這個標籤沒有提供準確性的證據；另一個 AI 判斷也不能代替作者確認意思。",
              en: "That label supplies no evidence of accuracy. Another AI judgement cannot replace checking meaning with the authors.",
              cn: "这个标签没有提供准确性的证据；另一个 AI 判断也不能代替作者确认意思。",
            },
          },
          {
            text: {
              zh: "保留中文，加入作者認可的致謝解說，並註明「AI 初譯；學生核對及修訂」。",
              en: "Retain Chinese, add an author-approved explanation of the thanks, and credit “AI draft; checked and revised by students.”",
              cn: "保留中文，加入作者认可的致谢解说，并注明“AI 初译；学生核对及修订”。",
            },
            correct: true,
            feedback: {
              zh: "對。這讓讀者理解心意，也具體交代 AI 與學生各自的貢獻。",
              en: "Yes. Readers can understand the intention and see the distinct contributions of AI and the students.",
              cn: "对。这让读者理解心意，也具体交代 AI 与学生各自的贡献。",
            },
          },
        ],
      },
      takeaway: {
        zh: "流暢不等於忠實。翻譯須照顧語境、讀者及作者聲音；按任務要求清楚交代 AI 協助。",
        en: "Fluency is not faithfulness. Translation needs context, audience and author voice, with AI assistance explained according to the task’s requirements.",
        cn: "流畅不等于忠实。翻译须照顾语境、读者及作者声音；按任务要求清楚交代 AI 协助。",
      },
      languageMove: {
        zh: "句式：「This version keeps ___, but changes ___.」\n「這個版本保留了＿＿，卻改變了＿＿。」",
        en: "Sentence frame: “This version keeps ___, but changes ___.”\n中文：「這個版本保留了＿＿，卻改變了＿＿。」",
        cn: "句式：“This version keeps ___, but changes ___.”\n“这个版本保留了＿＿，却改变了＿＿。”",
      },
    },
    {
      id: "access",
      icon: "path",
      color: "violet",
      location: "courtyard",
      portrait: 3,
      name: {
        zh: "思賢",
        en: "Sze-yin",
        cn: "思贤",
      },
      role: {
        zh: "學生・語言學習大使",
        en: "Student · Language learning ambassador",
        cn: "学生・语言学习大使",
      },
      title: {
        zh: "進不去的練習室",
        en: "The Locked Practice Room",
        cn: "进不去的练习室",
      },
      tag: {
        zh: "可及性與參與",
        en: "Accessibility & participation",
        cn: "可及性与参与",
      },
      subtitle: {
        zh: "入口寫着「所有人」，卻有人被擋在門外。",
        en: "It says “for everyone.” Who can actually join?",
        cn: "入口写着“所有人”，却有人被挡在门外。",
      },
      opening: [
        {
          zh: "新的 AI 對話練習很受歡迎，但只有語音輸入，還要倒數作答。",
          en: "The new AI conversation practice is popular, but it only takes voice input and has a countdown.",
          cn: "新的 AI 对话练习很受欢迎，但只有语音输入，还要倒数作答。",
        },
        {
          zh: "有同學只能用鍵盤，有人家中網絡不穩。他們不是不願意學，只是進不去。",
          en: "One learner uses a keyboard, and another has an unreliable connection at home. They want to learn. The design is blocking them.",
          cn: "有同学只能用键盘，有人家中网络不稳。他们不是不愿意学，只是进不去。",
        },
      ],
      scene: {
        zh: "小息時，思賢在庭院收集試用意見。學校想用 AI 對話練習「提出澄清問題」，但現有入口限制了部分同學參與。",
        en: "At break, Sze-yin collects pilot feedback in the courtyard. The school wants AI dialogue practice for asking clarification questions, but the current entry points exclude some learners.",
        cn: "课间时，思贤在庭院收集试用意见。学校想用 AI 对话练习“提出澄清问题”，但现有入口限制了部分同学参与。",
      },
      task: {
        zh: "在有限開發時間內，設計能保留學習目標的參與途徑。",
        en: "Within limited development time, design participation routes that preserve the learning goal.",
        cn: "在有限开发时间内，设计能保留学习目标的参与途径。",
      },
      evidence: [
        {
          label: {
            zh: "線索 01｜介面紀錄",
            en: "Clue 01 | Interface record",
            cn: "线索 01｜界面记录",
          },
          text: {
            zh: "模擬介面只能按住咪高峰錄音，指示只有聲音，倒數不能暫停。使用鍵盤的同學無法完成流程，其他同學也可能來不及閱讀及思考。",
            en: "The simulated interface requires holding a microphone button, plays audio-only instructions and has an unpausable timer. A keyboard user cannot finish the flow, and others may lack enough processing time.",
            cn: "模拟界面只能按住麦克风录音，指示只有声音，倒数不能暂停。使用键盘的同学无法完成流程，其他同学也可能来不及阅读及思考。",
          },
        },
        {
          label: {
            zh: "線索 02｜學習條件",
            en: "Clue 02 | Conditions for learning",
            cn: "线索 02｜学习条件",
          },
          text: {
            zh: "試用意見提到網絡不穩、共用裝置及沒有安靜錄音空間。這些是參與條件的差異，不能當作語言能力或學習動機的證據。",
            en: "Pilot feedback mentions unstable connections, shared devices and no quiet place to record. These are differences in participation conditions, not evidence of a learner’s language ability or motivation.",
            cn: "试用意见提到网络不稳、共用设备及没有安静录音空间。这些是参与条件的差异，不能当作语言能力或学习动机的证据。",
          },
        },
        {
          label: {
            zh: "線索 03｜共同學習目標",
            en: "Clue 03 | The shared learning goal",
            cn: "线索 03｜共同学习目标",
          },
          text: {
            zh: "這一課練習選用合適的澄清問題，不評核發音。文字或語音對話都可展示這個技巧；若日後評核口說，便需要另行安排合適支援。",
            en: "This lesson practises choosing appropriate clarification questions, not pronunciation. Text or voice dialogue can demonstrate that skill. A later speaking assessment would need its own suitable support arrangements.",
            cn: "这一课练习选用合适的澄清问题，不评核发音。文字或语音对话都可展示这个技巧；若日后评核口语，便需要另行安排合适支持。",
          },
        },
      ],
      options: [
        {
          title: {
            zh: "人人加時，保留單一入口",
            en: "Give everyone more time, keep one route",
            cn: "人人加时，保留单一入口",
          },
          text: {
            zh: "延長倒數，但仍要求錄音及持續連線。",
            en: "Extend the timer, but still require audio recording and a continuous connection.",
            cn: "延长倒数，但仍要求录音及持续连线。",
          },
          quality: 1,
          feedback: {
            zh: "加時可協助部分同學，但鍵盤操作、文字指示及連線問題仍未解決。一項調整未必回應所有障礙，需要逐項查核。",
            en: "Extra time may help some learners, but keyboard access, text instructions and connection barriers remain. One adjustment rarely addresses every barrier; inspect them individually.",
            cn: "加时可协助部分同学，但键盘操作、文字指示及连线问题仍未解决。一项调整未必回应所有障碍，需要逐项查核。",
          },
        },
        {
          title: {
            zh: "提供等值途徑，找學生試用",
            en: "Offer equivalent routes and test with learners",
            cn: "提供等值途径，找学生试用",
          },
          text: {
            zh: "加入鍵盤、文字指示及可調時間，提供低流量文字或校內練習，再請受影響同學試用。",
            en: "Add keyboard access, text instructions and adjustable timing, offer low-data text or in-school practice, and test with affected learners.",
            cn: "加入键盘、文字指示及可调时间，提供低流量文字或校内练习，再请受影响同学试用。",
          },
          quality: 2,
          feedback: {
            zh: "你按共同目標提供不同參與方式，也用試用檢查是否真正可行。資源有限時，先修正阻止完成任務的障礙，再持續改善。",
            en: "You offered different routes towards the same goal and used learner testing to check whether they work. With limited resources, first fix barriers that prevent completion, then keep improving.",
            cn: "你按共同目标提供不同参与方式，也用试用检查是否真正可行。资源有限时，先修正阻止完成任务的障碍，再持续改善。",
          },
        },
        {
          title: {
            zh: "不能錄音的同學免做",
            en: "Excuse learners who cannot record",
            cn: "不能录音的同学免做",
          },
          text: {
            zh: "不扣分，但也不提供練習或回饋。",
            en: "Avoid a grade penalty, but provide no alternative practice or feedback.",
            cn: "不扣分，但也不提供练习或反馈。",
          },
          quality: 0,
          feedback: {
            zh: "不扣分避免了一種傷害，卻仍剝奪學習機會。共融設計需要提供能達到目標的途徑，而不只是把同學從任務移走。",
            en: "Avoiding a penalty prevents one harm, but learners still lose a learning opportunity. Inclusion means offering a route towards the goal, beyond removing someone from the task.",
            cn: "不扣分避免了一种伤害，却仍剥夺学习机会。共融设计需要提供能达到目标的途径，而不只是把同学从任务移走。",
          },
        },
      ],
      repair: {
        question: {
          zh: "下一輪測試，哪個做法最能驗證可及性？",
          en: "Which next test best checks accessibility?",
          cn: "下一轮测试，哪个做法最能验证可及性？",
        },
        options: [
          {
            text: {
              zh: "只請最快完成原版的同學再玩一次。",
              en: "Ask only the fastest users of the original version to try again.",
              cn: "只请最快完成原版的同学再玩一次。",
            },
            correct: false,
            feedback: {
              zh: "這會漏掉已被排除的同學，也無法測試新增途徑是否有效。",
              en: "That misses learners already excluded and does not test whether the new routes work.",
              cn: "这会漏掉已被排除的同学，也无法测试新增途径是否有效。",
            },
          },
          {
            text: {
              zh: "讓有不同操作及連線需要的同學，以各種途徑完成同一澄清任務並給回饋。",
              en: "Have learners with varied input and connection needs complete the same clarification task through different routes and give feedback.",
              cn: "让有不同操作及连线需要的同学，以各种途径完成同一澄清任务并给反馈。",
            },
            correct: true,
            feedback: {
              zh: "對。觀察能否完成、理解及獲得回饋，也聽取學生意見；測試後仍可再修訂。",
              en: "Yes. Observe completion, understanding and access to feedback, and listen to learners. Revise again after testing.",
              cn: "对。观察能否完成、理解及获得反馈，也听取学生意见；测试后仍可再修订。",
            },
          },
          {
            text: {
              zh: "把按鈕改得更漂亮，就宣告所有人都能使用。",
              en: "Make the buttons prettier and announce that everyone can use it.",
              cn: "把按钮改得更漂亮，就宣告所有人都能使用。",
            },
            correct: false,
            feedback: {
              zh: "美感可以改善體驗，但不能證明鍵盤、文字、時間及連線障礙已解決。",
              en: "Visual polish can improve the experience, but does not establish that input, text, timing and connection barriers are resolved.",
              cn: "美感可以改善体验，但不能证明键盘、文字、时间及连线障碍已解决。",
            },
          },
        ],
      },
      takeaway: {
        zh: "公平不一定是人人使用同一方式。以共同學習目標設計不同途徑，並讓受影響的學生參與測試。",
        en: "Fairness does not always mean using the same route. Design varied routes to a shared learning goal, and involve affected learners in testing.",
        cn: "公平不一定是人人使用同一方式。以共同学习目标设计不同途径，并让受影响的学生参与测试。",
      },
      languageMove: {
        zh: "句式：「Could you clarify what you mean by ___?」\n「你可以澄清＿＿的意思嗎？」",
        en: "Sentence frame: “Could you clarify what you mean by ___?”\n中文：「你可以澄清＿＿的意思嗎？」",
        cn: "句式：“Could you clarify what you mean by ___?”\n“你可以澄清＿＿的意思吗？”",
      },
    },
  ],
};

window.TRANSFER_CONTENT = {
  scene: {
    zh: "結案前，你收到新委託：英文戲劇社想推出迎新聊天機械人，回答排練地點及報名問題。示範回答很流暢，但尚未核對資料，也未找不同需要的學生試用。",
    en: "A new case arrives: the English drama club wants a welcome chatbot for rehearsal locations and sign-up questions. Its demo is fluent, but the information is unchecked and learners with varied needs have not tested it.",
    cn: "结案前，你收到新委托：英文戏剧社想推出迎新聊天机器人，回答排练地点及报名问题。示范回答很流畅，但尚未核对资料，也未找不同需要的学生试用。",
  },
  question: {
    zh: "把四宗案件學到的思考方式帶到新情境。最合適的下一步是甚麼？",
    en: "Transfer your reasoning from the four cases. What is the most appropriate next step?",
    cn: "把四宗案件学到的思考方式带到新情境。最合适的下一步是什么？",
  },
  options: [
    {
      text: {
        zh: "只改善聊天介面外觀，然後向全校推出；自然的英文已足以證明可靠。",
        en: "Polish the chat interface, then launch school-wide; natural English is enough evidence of reliability.",
        cn: "只改善聊天界面外观，然后向全校推出；自然的英文已足以证明可靠。",
      },
      correct: false,
      feedback: {
        zh: "流暢及美觀都不能證明內容可靠或人人可用。需要查核資訊及參與障礙，而不是從表面推斷品質。",
        en: "Fluency and appearance do not establish reliability or access. Check the information and participation barriers instead of inferring quality from the surface.",
        cn: "流畅及美观都不能证明内容可靠或人人可用。需要查核信息及参与障碍，而不是从表面推断品质。",
      },
    },
    {
      text: {
        zh: "先小規模試行：核對社團資料、不索取不必要個人資料、提供文字及真人求助，邀請不同需要的學生測試並回報錯誤。",
        en: "Run a small pilot: verify club information, avoid unnecessary personal data, provide text and human help, and invite learners with varied needs to test and report errors.",
        cn: "先小规模试行：核对社团资料、不索取不必要个人资料、提供文字及真人求助，邀请不同需要的学生测试并回报错误。",
      },
      correct: true,
      feedback: {
        zh: "你把證據、私隱、可及性及人類監督一起帶到新情境。試行後仍要根據回饋修訂，並清楚標示機械人的用途及限制。",
        en: "You transferred evidence checking, privacy, accessibility and human oversight to a new context. Revise after the pilot and explain the chatbot’s purpose and limits clearly.",
        cn: "你把证据、隐私、可及性及人类监督一起带到新情境。试行后仍要根据反馈修订，并清楚标示机器人的用途及限制。",
      },
    },
    {
      text: {
        zh: "先收集所有同學的完整背景，讓 AI 自動判斷誰適合參加，之後才處理資料及公平問題。",
        en: "Collect every student’s full background so the AI can decide who should join, and address privacy and fairness later.",
        cn: "先收集所有同学的完整背景，让 AI 自动判断谁适合参加，之后才处理资料及公平问题。",
      },
      correct: false,
      feedback: {
        zh: "回答社團資訊不需要完整背景，也不應無故變成篩選學生。先界定任務，只使用必要資料，再查核風險及支援安排。",
        en: "Answering club questions does not need full backgrounds or an unexplained selection system. Define the task, use only necessary data, and check risks and support arrangements first.",
        cn: "回答社团信息不需要完整背景，也不应无故变成筛选学生。先界定任务，只使用必要资料，再查核风险及支持安排。",
      },
    },
  ],
};
