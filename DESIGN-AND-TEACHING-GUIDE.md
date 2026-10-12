# 我的 AI 校園生活 · My AI Campus Life

設計與教學指南 · Design and teaching guide  
MEDD8934 — Artificial Intelligence and Language Education · HKU MEd

**現行實作 · Current implementation.** 玩家是一名普通新生，在虛構「明澄書院」探索五層、18 個地點。遊戲提供繁中、簡中及英文，六個年級共 234 道起始題、四項 AI 校園情境及遷移反思；學科題庫可由授權教師管理。自由探索保留本機進度，班級模式以 Sites / Vinext 與 Cloudflare D1 儲存跨裝置紀錄。當前技術與來源說明見 [README](README.md) 及 [資源來源索引](ASSET-PROVENANCE.md)。本文件不把本地整合當作已公開發佈，也不把自動測試當作學生學習成效。The player is an ordinary new student. The implemented architecture supports local free play and authenticated class records, with a curated six-grade question bank. Deployment and learner effectiveness are separate claims requiring separate evidence.

**美術與介面 · Art and interface.** 原有 Version 1: Crafted Pixel RPG 是獲選美術方向；後續校園生活人物、自然比例和像素對話／音訊控制按新的核准提案製作。造型、對話、作答及教師工作台均在遊戲畫面內。參考圖不是功能或測試證據；實際資源及版本以來源紀錄和程式登記為準。The selected art direction informs the campus; subsequent approved references refine the character proportions and interface. Mock-ups do not establish implementation or verification.

## 1. 一頁學習設計 · Learning design at a glance

**對象與時間 · Learners and timing.** 支援中一至中六（S1–S6），每個年級可選 A–D 班。題庫按年級提供不同情境與概念，但仍須科任老師審閱適切性；它不是完整課程。核心 AI 語言教育情境可按約 12–15 歲學生需要調整；年長學生宜增加論證與反例。四項核心情境及反思預計 20–30 分鐘，全校園預計 45–75 分鐘或更長，均未經學生實測。可個人或二人協作，毋須編程知識。網站可切換繁體中文（zh）、簡體中文（cn）及英文（en），進度保留；英文學習文本可保留英文。The bank supports S1–S6 with different content for each grade, subject to teacher review. The core language-education route can be adapted for younger secondary learners and extended with argumentation for older learners. Timing is an unvalidated planning estimate, not a measured result.

**學習問題 · Learning problem.** 學生可能將流暢的 AI 輸出視為可靠答案，卻未追問誰受到影響、資料是否需要分享、語言文化是否被保留，以及所有同學能否參與。遊戲讓學生練習根據證據作決定，並修訂有問題的 AI 使用安排。Students practise examining evidence, considering affected people, and repairing problematic uses of AI in language learning.

**故事與角色 · Story and role.** 玩家以普通新生身份進入「明澄書院」，選擇年級、班別、學號、姓名和外觀，與同學及教職員處理校園 AI 問題；不再以偵探身份活動。所有人物、情境和學校均為虛構。The player joins fictional Ming Ching College as an ordinary new student, choosing grade, class, student number, name and appearance before meeting peers and staff.

**角色選擇與介面 · Character choice and interface.** 男生及女生各四款原創校服風格、兩款髮型與三種膚色，共 **48 個外觀組合**；這不表示有 48 套獨立生成的圖集。男生採恤衫長褲和短髮，女生採連身校裙及短髮／馬尾；外觀不影響題目、能力或得分。現行款式以虛構風格命名，不代表真實學校認可。遊戲填滿可用視窗，以 WASD／四方向鍵移動、Space／Enter 互動，或點擊人物及入口自動走近。所有作答與設定留在遊戲畫面內。Two character categories × four outfits × two hairstyles × three skin tones yield 48 selectable combinations, with identical learning access. Outfit names describe fictional styles. Move with WASD/all arrows or click to approach; Space/Enter interacts.

**核心循環 · Core loop.** 探索校園 → 與 NPC 對話 → 查看證據 → 作出決定 → 理解後果 → 選擇修正 → 說明可轉移的行動。每宗案件以短篇視覺小說對話呈現；探索服務於學習，避免靠快速反應或長時間找路才能取得必需證據。Explore → talk → inspect evidence → decide → examine consequences → repair → transfer. Required evidence should remain accessible without speed or navigation skill barriers.

**預期學習成果 · Intended learning outcomes.** 完成後，學生應能：

1. 找出 AI 語言學習情境中至少一項具體風險，並引用相關證據。Identify a specific concern and support it with evidence.
2. 解釋一項 AI 決定對不同學習者的影響。Explain how a decision affects different learners.
3. 提出包含人類覆核、資料保護或參與選擇的可行修正。Propose a practical repair involving human review, data protection, or participation options.
4. 將原則應用到新情境，寫出自己下一次使用 AI 時會採取的行動。Transfer a principle and name a personal next action.

這些是設計目標，並非已證實的學習成效。遊戲完成、點擊答案或得分本身不足以證明學生能在真實情境作出倫理判斷。These are intended outcomes, not measured effects. Completion and scores alone do not establish ethical competence.

## 2. 設計心態 · Design mindset

**以人為本 · Start with people.** 先問「誰會受影響？誰的聲音未被聽見？」再考慮效率。學生有權提出疑問、要求解釋及尋求人類協助。Ask whose needs and voices are missing before optimising convenience.

**查證而非盲信 · Investigate before accepting.** 流暢文字、分數及信心標示都不是正確性的保證；也不應將一次失誤推論成所有 AI 都無用。判斷須連繫具體任務、證據及限制。Evaluate the actual task and evidence rather than assuming either universal reliability or universal failure.

**公平需要情境 · Fairness needs context.** 同一安排未必讓所有人有相同參與機會；額外支援也不等於降低學習目標。共同目標、適切支援和可申訴程序要一起考慮。A shared learning goal can coexist with different access supports and a review process.

**允許修正 · Make room for repair.** 錯誤選擇應帶來具體後果解釋和重試機會，不把學生標籤為「不道德」。反思重點是下一步如何改進。Feedback should explain consequences and enable revision without labelling a learner's character.

## 3. 四項 AI 校園情境 · Four AI campus scenarios

| 地點與案件 / Location and case | 調查焦點 / Evidence to examine | 可辯護的修正 / Defensible repair | 教師追問 / Debrief prompt |
|---|---|---|---|
| G/F 走廊：口音與評分 / Ground-floor corridor: accent and assessment | AI 評語是否把口音當成能力？是否有實際溝通表現和共同評分準則？ / Does feedback confuse accent with proficiency? What does the shared rubric assess? | 依學習目標覆核語音證據；安排教師或第二評閱者；提供解釋和申訴機會。 / Review against the intended construct, include human moderation and an appeal route. | 「我們要評的是像誰，還是能否清楚表達？」 / Are we assessing resemblance to a speaker or successful communication? |
| 1/F 課室層：寫作回饋與私隱 / First-floor classrooms: writing feedback and privacy | 上載文字有沒有姓名、家庭故事或可識別背景？哪些內容並非回饋所需？ / Which details are identifiable or unnecessary? | 先用虛構或最少必要內容；刪除不必要細節；確認學校工具安排及可用替代方法。 / Use fictional or minimal content, remove unnecessary details, and retain an alternative route. | 「拿走姓名後，別人仍能認出這個人嗎？」 / Could someone still identify the person after the name is removed? |
| 2/F 探究層：翻譯與文化聲音 / Second-floor inquiry area: translation and cultural voice | AI 是否改變文化詞語、作者意思或未經查證加入細節？ / Has AI changed the author's cultural meaning or invented details? | 保留作者選擇，查核語境，必要時加簡短解釋；由作者決定並披露合適的 AI 協助。 / Preserve meaning, check context, consult the writer, and acknowledge relevant AI help. | 「更流暢的文字，還是這位作者的意思嗎？」 / Does a fluent revision still express this writer's meaning? |
| 3/F 藝文層：每個人都能參與 / Third-floor arts and humanities area: accessible language practice | 裝置、連線、聲音、閱讀及操作需求有甚麼差異？ / Who is excluded by device, connection, audio, reading, or control requirements? | 提供文字支援、可調步速、共用裝置或教師協助；保持清楚的共同學習目標。 / Offer suitable access supports while preserving the learning goal. | 「支援改變了參與方式，還是改變了我們要評量的能力？」 / Does an accommodation change access or the assessed construct? |

口音差異本身不是錯誤證據；聆聽理解與語音辨識也不是同一能力。若目標是口語表達，純文字作答未必能完全替代口語證據，教師須按學生需要設計適切支援。Accent differences alone do not establish an error. For an oral-language objective, written responses alone may not demonstrate the same construct; plan accommodations carefully.

## 4. 課堂流程 · A 25-minute lesson

| 時間 / Time | 活動 / Activity | 教師觀察 / Evidence to notice |
|---|---|---|
| 0–3 分鐘 / min | 前測短情境：AI 把同學的文化用語改成較熟悉的英文；你會怎樣做？個別寫兩句，不先提供標準答案。 / Brief pre-task: respond individually to an AI revision that changes cultural meaning. | 是否引用證據、指出受影響的人、提出具體行動。 / Evidence, affected people, and action. |
| 3–5 分鐘 / min | 示範步行、樓層轉換／替代導覽、互動、閱讀證據及語言選擇；說明案例及結果是教學模擬。 / Introduce walking, floor navigation, access options, language support, and the simulation label. | 學生能否在不依賴遊戲經驗下開始。 / Can everyone begin? |
| 5–19 分鐘 / min | 完成四宗案件；二人組每案輪替「操作者」和「證據解釋者」。教師問理由，不只公布答案。 / Investigate four cases; pairs alternate navigator and evidence-explainer roles. | 選擇前有否看證據？修正是否回應問題？ / Evidence use and quality of repair. |
| 19–23 分鐘 / min | 小組比較一項有爭議的選擇，再完成新的轉移題。 / Discuss one contested decision and attempt a new transfer scenario. | 能否處理權衡，而非只重複口號。 / Reasoning about trade-offs. |
| 23–25 分鐘 / min | 寫一句「下次我使用 AI 時，我會先……，因為……」。 / Exit reflection: “Next time I use AI, I will first … because …”. | 行動是否具體、可實行、連繫理由。 / Specific, feasible action with a reason. |

20 分鐘版本可把共同討論縮短；30 分鐘版本可加入同儕比較與重玩一宗案件。較慢閱讀者可分兩節完成，毋須時間扣分。For a shorter lesson, reduce plenary discussion; for a longer lesson, add peer comparison and a replay. Permit completion across two sessions without speed penalties.

## 5. 評量與試行 · Assessment and pilot evaluation

以下規準用於教師閱讀學生的解釋、修正和轉移題；不是程式自動判定的倫理分數。每項 0–2 分，共 8 分，只作形成性回饋。Use this 0–2 rubric for teacher review of reasoning, repairs, and transfer. The total of 8 supports formative feedback and is not an automated ethical rating.

| 向度 / Dimension | 0 | 1 | 2 |
|---|---|---|---|
| 證據 / Evidence | 只重述選項 / Repeats an option | 指出風險但證據含糊 / Names a concern with vague evidence | 引用具體證據並解釋其意義 / Connects specific evidence to the concern |
| 受影響的人 / People | 未辨認 / Not identified | 說出一方但影響籠統 / Names a stakeholder, general effect | 解釋不同需要或具體影響 / Explains a concrete effect or differing needs |
| 修正 / Repair | 無修正或無關 / Absent or unrelated | 方向合適但難執行 / Relevant but underspecified | 可執行且直接回應問題 / Feasible and responsive |
| 轉移 / Transfer | 只背誦原則 / Repeats a slogan | 新情境中提出大致行動 / Broad action in a new context | 新情境中提出具理由的具體行動 / Specific justified action in a new context |

**可行的試行方案 · Feasible pilot.** 先請 2–3 位同組同學檢查內容與操作，再於合適的學校程序下邀請 4–6 位目標年齡學生試玩。觀察閱讀困難、迷路、誤觸、證據跳讀、回饋理解及鍵盤／觸控操作；記錄問題而非只問「喜歡嗎」。The proposed sequence is peer review followed by a small, appropriately arranged learner pilot focused on comprehension and access.

前後測使用兩個不同但難度相近的短情境，同樣要求「證據、受影響的人、修正」；兩位組員先獨立評閱部分答案再比較分歧。報告樣本數、完成時間、常見誤解及個案改變；不可把小型無對照試行寫成因果證明。Use comparable but different pre/post scenarios. Have two reviewers compare a subset of scores. Report sample size and limitations; a small uncontrolled pilot does not establish causal effectiveness.

**目前狀態 · Current status.** 本指南提供評量方案；尚未提供學生試行資料，不能聲稱已改善學習成效，亦不能推廣為對一般中學生有效。日後任何結果須註明樣本、情境、方法及限制。技術測試、無障礙檢查及學生學習評估是不同證據，應分開報告。Learner outcomes remain unevaluated. Do not claim the game improves learning for secondary students in general. Any later result must identify its sample, context, method, and limitations. Report software checks, access checks, and learning evidence separately.

## 6. MEDD8934 作業對齊 · Assignment alignment

根據使用者提供的課程大綱第 4 頁，最吻合本小組作品的項目是 Task 1「Hand-on AI tool demonstration」：20%，1–3 人，10 分鐘簡報加 2 分鐘問答，於第 4–7 週按登記安排。要求包括即時操作真實 AI 工具、實際語言學習內容、輸入／輸出對照、觀眾互動、問題解決及失效／限制分析。The supplied syllabus identifies Task 1 as a 20% demonstration for 1–3 students, with 10 minutes plus 2 minutes of Q&A, including real-time tool use and analysis of limitations.

**遊戲的劇情、AI 輸出範例及後果是預設教學模擬；它本身不能代替作業要求的即時 AI 工具示範。** 公開網站可獨立供學生使用；大學簡報須另加下一節的真實工具操作。**The scripted game is not a live AI system and does not, by itself, satisfy the real-time tool requirement.** Add the actual-tool demonstration below to the university presentation.

課程大綱的 Task 1 正式對應 CLO 1、2、3。此設計亦可支持課程整體 CLO 5，但不要將 CLO 5 寫成 Task 1 表格的正式對應。Task 1 officially maps to CLOs 1, 2, and 3; CLO 5 is an additional course-level connection.

| 課程連繫 / Course connection | 本作品的證據 / Design evidence |
|---|---|
| CLO 1: Explain AI concepts and applications | 區分 AI 生成內容、人工撰寫模擬及人類判斷。 / Distinguish generated output, authored simulation, and human judgement. |
| CLO 2: Integrate AI into pedagogy for diverse learners | 語言學習情境、三語切換、差異需要與教師帶領。 / Language-learning cases, three selectable languages, learner needs, and facilitation. |
| CLO 3: Evaluate effectiveness, ethics, and limitations | 檢查真實輸出、比較前後版本、討論偏誤及限制。 / Examine actual output, compare versions, discuss bias and limits. |
| CLO 5: Ethical, inclusive, culturally sensitive practice | 私隱、文化聲音、公平和參與選擇。 / Privacy, cultural voice, fairness, and participation options. |

大綱有一項須向授課老師核實的內部不一致：第 4 頁表格把 Task 3 列為 50%，第 5 頁標題卻寫 30%；這不影響 Task 1 的 20% 記載。另須確認本組登記週次與任何課堂補充要求。The Task 3 weight is inconsistent: 50% in the assessment table and 30% in its section heading. Confirm that discrepancy and any later course instructions with the instructor.

## 7. 真實 AI 示範 · Actual-tool demonstration

使用網站教師區的提示詞實驗室，由組員操作一個學校或課程允許使用的文字 AI 工具。自由探索毋須帳戶；班級模式使用教師提供的班級代碼及學生恢復碼。兩種模式均毋須學生使用生成式 AI API；簡報中的外部工具則按其適用條款與學校安排使用。以下段落全屬虛構，不輸入真實學生作品或個人資料。Use the website's teacher prompt lab and an appropriately approved text AI tool operated by a presenter. The example below is fictional.

**原文 · Original language-learning content**

> At our school’s language festival, I helped run a yum cha stall. My grandma taught me to welcome guests by asking, ‘Have you eaten yet?’ I want visitors to understand why this greeting matters to us.

**現場輸入提示詞 · Live prompt**

> Give feedback to a 13-year-old English learner on the paragraph below. Keep the student’s meaning and cultural voice. Do not invent details. Suggest two changes and explain each in simple English. If a phrase is culturally specific, ask the writer before replacing it. Then provide one possible revision. Paragraph: At our school’s language festival, I helped run a yum cha stall. My grandma taught me to welcome guests by asking, ‘Have you eaten yet?’ I want visitors to understand why this greeting matters to us.

1. 展示原文，請觀眾指出一項應保留的意思或文化細節。Show the original and invite one detail that should be preserved.
2. 現場複製提示詞至實際 AI 工具，展示工具名稱及日期，等待真實輸出。Run the prompt live and identify the actual tool and date.
3. 對照原文與真實輸出：保留了甚麼？改變了甚麼？有否虛構？回饋是否適合 13 歲學習者？Compare meaning, cultural voice, invented details, and suitability of feedback.
4. 由人類決定接受、拒絕或改寫其中一項建議，解釋理由；必要時再追問。Accept, reject, or revise one suggestion with an explicit human rationale.
5. 將老師預先撰寫的好／壞例子清楚標示為模擬。不要把它們冒稱為工具的現場輸出。Label teacher-authored examples as simulations, never as live results.

「yum cha」被改成「tea party」、文化問候被改成「How are you?」可用作預先撰寫的討論案例，**不代表實際工具必然出現這些錯誤**。若現場輸出沒有觀察到問題，應如實說明，再討論仍須覆核的項目或測試另一個模糊語境；不得捏造失敗。These are possible teaching examples, not predictions of a tool's output. Report actual observations honestly.

若網絡中斷，可展示先前真實測試的紀錄，標示工具、日期和「預先錄製」，並交代未完成現場操作；此替代是否符合要求須由授課老師判斷。A dated recording is a transparent contingency, but it is not a completed live demonstration. Teacher-lab pasted output should be treated as temporary working text; do not put sensitive content there.

## 8. 10 分鐘簡報流程 · Ten-minute run of show

| 時間 / Time | 內容 / Content |
|---|---|
| 0:00–1:00 | 說明學習問題、學生對象和一項可觀察目標。 / State the learner need and an observable objective. |
| 1:00–2:15 | 展示校園與一宗文化語言案件，說明證據—決定—修正循環。 / Show the campus and one case. |
| 2:15–3:15 | 觀眾作選擇並說出理由；揭示後果。 / Invite a decision and rationale, then reveal consequences. |
| 3:15–6:15 | 使用虛構段落操作真實 AI 工具；呈現輸入、輸出及人類覆核。 / Conduct the live tool demonstration and comparison. |
| 6:15–7:45 | 分析一項觀察到的限制或明確標示的模擬失誤；示範修正。 / Analyse an observed limit or a labelled hypothetical and repair it. |
| 7:45–9:00 | 解釋包容設計、形成性評量和試行方案；勿聲稱已有成效。 / Explain access, assessment, and the planned pilot. |
| 9:00–10:00 | 展示分享連結、AI 使用聲明、關鍵來源及一項待驗證問題。 / Share the link, declaration, sources, and an open evaluation question. |
| 10:00–12:00 | 問答。 / Q&A. |

## 9. 小組分工與完成路線 · Team workflow

| 階段 / Phase | 交付與完成條件 / Deliverable and completion check |
|---|---|
| 定義 / Define | 確定對象、語言學習問題、四項成果和 20–30 分鐘範圍；不要將功能清單當作教學目標。 / Agree audience, problem, outcomes, and scope. |
| 撰寫 / Author | 每案備有證據、至少兩種合理考量、後果、修正和追問；所有語言版本意思一致。 / Review case logic, nuance, and language parity. |
| 製作 / Build | 完成探索、對話、互動、進度與結局；美術用原創資源，控制清楚，必需內容可容易取得。 / Build and polish the complete learning loop. |
| 審核 / Review | 檢查手機／桌面、鍵盤、閱讀比例、色彩與文字提示、重新開始、語言切換及不連外部 AI 的學生流程。 / Check devices, access, state, and the student flow. |
| 試行 / Pilot | 先同儕後小型學生試行；按觀察修訂，保存問題與修改紀錄。 / Pilot and document evidence-driven revisions. |
| 示範與發佈 / Demonstrate and publish | 核實公開連結可由別人開啟；排練真實 AI 示範及 10 分鐘時限；附來源與聲明。 / Verify access and rehearse the timed presentation. |

三人組建議：A 負責教學與來源、B 負責故事及三語內容、C 負責互動與測試；每人互審另一範疇並各自參與現場解說。二人組可合併 B/C；不要只由一人理解全部程式或學習設計。For three members, split pedagogy/evidence, narrative/language, and implementation/testing, with cross-review and shared presentation ownership.

## 10. 資料、教師工作台與聲音 · Data, teacher workspace, and audio

**兩種資料模式 · Two data modes.** 自由探索把造型、語言、進度及反思留在同一瀏覽器；不將既有自由探索得分匯入正式班級紀錄。班級模式把姓名、班別、學號、作答及必要進度存至 D1，並可同步造型、位置與反思。學生以班級代碼加入，取得一次顯示的恢復碼；在另一裝置以班級代碼、學號和恢復碼繼續。這是紀錄持有憑證，並不是學校身份核實或 SSO。授權教師可重設恢復碼並撤銷舊登入。共用裝置使用後登出。Free play is local; class mode stores identifiable learning records and progress in D1. Recovery enables another device to access the same student record. It does not independently verify school identity.

**權限與版本 · Access and versions.** 獨立 Cloudflare 網站以管理員提供的教師登入碼開啟工作台，毋須平台帳戶；另行保留的 Sites 版本仍使用其原有身份名單與 PIN 流程。教師登入碼由伺服器核對，有錯誤速率限制及 30 分鐘登入期限。使用同一共用登入碼的人，都能管理所屬工作台的班級、題目、工作紙及學生成績，系統不能藉此分辨個別教師；不同擁有者的獨立登入碼仍維持資料隔離。學生 API 只回傳自己的紀錄。教師可明確建立班級、管理與封存題目、開始新活動、查看歷史活動和按學科匯出 Excel。每次活動凍結題目版本；之後修改不改寫舊活動分母。The independent Cloudflare site uses an administrator-issued teacher code, with server verification, rate limits and a 30-minute session. Everyone holding a shared code has the same workspace permissions; separate owner credentials remain isolated. The retained Sites deployment keeps its earlier account-and-PIN flow. Assignments freeze question revisions. No class roster is publicly listed.

**學科成績 · Subject results.** Excel 固定四欄：**班別／學號／學生姓名／學科得分**。伺服器依每題首次作答計算班級學科得分；重試仍可取得首次答對星數，但不改寫首次分數。未完成的學科保留未完成狀態，不以零分代替。這是形成性紀錄；公開學習題庫含答案，不能當成防作弊考試。Cloud subject scores retain first responses, while progress stars reward eventual first correct completion. An unfinished subject is not reported as a zero. These records sample performance and do not prove independent work or ethical competence.

**聲音與私隱 · Audio and privacy.** 對話語音由瀏覽器 Web Speech 在播放當下合成，並非預錄音檔。繁中只使用粵語（`zh-HK`／`yue`），簡中只使用普通話（`zh-CN` 優先，可用 `zh-SG`／`zh-TW`），英文只使用英文（`en-GB` 優先）。缺少指定語種時保留文字並提示不可用，粵語與普通話互不替代。精確地區語音及角色聲線取決於裝置；同語言偏好本機聲線，但部分瀏覽器聲線使用供應商遠端服務。文字始終保留，語音及音樂可獨立調節、靜音和試聽。首次播放須使用者手勢，對白時音樂降低、頁面隱藏時暫停。Web Speech availability varies by device and may involve a remote voice service. Preserve text access; do not promise recorded voices, guaranteed Cantonese, or fully offline speech.

背景《Greensleeves》依 [Mutopia 公版旋律](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf) 以本專案的 Web Audio 樂器及伴奏重新合成，沒有採用 DSE 錄音。原始 [LilyPond 樂譜](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly) 和來源記於資源索引。The music is newly synthesized from a public-domain score, not a reused examination recording.

**發布與可用性 · Sharing and usability.** 部署程式不可包含課程 PDF、私人筆記、憑證或學生匯出。班級模式需要後端設定與連線；不能以舊靜態 `dist/` 分享方式假設雲端功能存在。教師實際 AI 輸出比較欄只暫存當次頁面，不自動送交 AI。公開說明必須區分本機與雲端模式。以文字加圖像、可見焦點、非限時對話、減少動態及替代導覽支持參與；完整無障礙標準、實際音訊聽感和各裝置相容性仍須對應測試，不可由自動測試推定。Keep deployment, accessibility, audio-device checks and learner evaluation as separate evidence.

## 11. AI 協助聲明範本 · AI assistance declaration

> 本組使用 [工具名稱／版本，如可取得]，於 [日期] 協助 [構思、原型程式、語言修訂等實際用途]。本組成員已覆核 [內容、來源、程式、翻譯及測試項目]，並作出 [具體修改]。遊戲中的案例、人物及預設 AI 輸出均為虛構教學模擬；現場示範另行標示所用工具及實際結果。本組對提交內容及學術論證負責。尚未完成的驗證包括 [項目]。
>
> Our group used [tool/version if available] on [dates] for [actual purposes]. We reviewed [content, sources, code, translations, and checks] and made [specific revisions]. Characters, cases, and scripted AI outputs are fictional teaching simulations. The live demonstration separately identifies its tool and actual results. We take responsibility for the submission. Outstanding validation includes [items].

按真實工作填寫，勿聲稱已親自驗證未曾檢查的內容。課程大綱要求對提交作業負責及承認 AI 協助；本聲明不取代授課老師指定格式。Complete this accurately and follow any instructor-specific declaration requirements.

## 12. 來源與設計依據 · Sources and rationale

- **HKU MEDD8934 syllabus, 2026–2027**, supplied by the user: pp. 2–3 course aims and CLOs; p. 4 Week 6 and Task 1; p. 5 assessment details and academic integrity. 私人課程文件，不隨網站公開。Private course document; excluded from public assets.
- **UNESCO (2024), [AI competency framework for students](https://www.unesco.org/en/articles/ai-competency-framework-students).** 框架涵蓋以人為本心態、AI 倫理、技術與應用、系統設計，以及理解、應用、創造三層次。本遊戲主要聚焦前兩範疇的理解與應用，並不聲稱涵蓋完整框架。The game draws mainly on understanding and applying a human-centred mindset and AI ethics; it does not cover the whole framework.
- **UNICEF (2025), [Guidance on AI and children, Version 3.0](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children).** 指引重視兒童私隱、公平、透明、問責及包容；本設計把這些關注轉化成具體校園決策。These concerns inform the case design; the framework is not evidence that this game improves outcomes.

情境、角色對話、同儕解釋、後果回饋及修正機會的結合，是本組擬採用的教學設計理由：讓抽象原則有具體應用機會，並把學生的推理呈現出來。這是需要試行驗證的設計假設。The pedagogical rationale is to make principles concrete and reasoning visible through cases, explanation, consequences, and revision. This remains a design hypothesis to evaluate.

## 13. 人物與服裝來源 · Character and wardrobe provenance

現行校園生活衣櫥採八套原創像素圖集，男、女生各四款；每套有兩款髮型與步行動作，三種膚色由明確皮膚區域著色。角色造型不影響學習權限。16 位教職員和四位情境同學有各自身份；走路、停下和對話動作由狀態機控制。來源與版本見 [資源索引](ASSET-PROVENANCE.md)，包含核准人物名冊、身體比例參考、精確生成提示及裁切 metadata。The current wardrobe uses eight original atlases with two hair variants and controlled skin-tone rendering. Staff and students retain distinct identities and explicit movement states. Follow the asset index for actual files and versions.

早期原型曾參考 [Queen's College 校規](https://www.qc.edu.hk/en/site/view?name=School+Regulations)、[香港中國婦女會中學校服](https://www.hkcwcc.edu.hk/en/school-uniform)、[聖貞德中學訓輔政策](https://www.sja.edu.hk/download/Resource/fileDoc/%E5%AD%B8%E6%A0%A1%E8%A8%93%E8%BC%94%E5%B0%8E%E6%94%BF%E7%AD%96%E5%8F%8A%E7%A8%8B%E5%BA%8F2025Updated_24_9_2025.pdf) 及 [培道中學校服資料](https://www.pooito.edu.hk/en/%E6%A0%A1%E5%BE%BD%E3%80%81%E6%A0%A1%E7%AB%A0%E5%8F%8A%E6%A0%A1%E6%9C%8D)。這些是歷史來源，不是目前選單或學校合作名單。現行款式沒有校徽、真實學校名稱或官方照片，不聲稱等同各校完整儀容規定。Earlier school-specific references remain archived for traceability; they do not identify the current fictional wardrobe or imply endorsement.

## 14. 五層校園與學科延伸 · Five-floor campus and subject extensions

**教學定位 · Purpose.** 擴展校園提供香港中學的學習情境；MEDD8934 的主線仍是語言教育中的 AI 倫理及共融。房間題目是選用延伸，不取代四宗語言學習案件、結案反思或大學簡報的真實 AI 操作。The larger campus supplies secondary-school contexts, with grade-specific starter questions. Language education, ethical AI, and inclusion remain the core. Room activities are optional extensions, not substitutes for the cases, reflection, or live tool demonstration.

**空間與內容 · Spaces and content.** 校園設 G/F、1/F、2/F、3/F、4/F 五層；每層可步行探索，房間可進入。樓梯／升降機與替代導覽需有清楚標示；快捷入口提供相同學習內容。自由探索不應被閱讀速度、運動操作能力或學科答題成績鎖住。All five floors and rooms are walkable and explorable. Clearly identify floor transitions and equivalent direct navigation. Access should not depend on reading speed, dexterity, or subject quiz performance.

| 樓層 / Floor | 核心故事 / Core story | 延伸房間或空間 / Extension spaces | 題目數 / Checks |
|---|---|---|---|
| G/F | 聲音評分與公平 / Voice assessment and fairness | 操場：體育；禮堂：公民、經濟與社會 / Playground: PE; hall: Citizenship, Economics and Society | 2 個空間 × 3 題 = 6 / 2 spaces × 3 |
| 1/F | 寫作回饋與私隱 / Writing feedback and privacy | 中文、英文、數學課室 / Chinese, English, and mathematics classrooms | 3 × 3 = 9 |
| 2/F | 翻譯與文化聲音 / Translation and cultural voice | 科學實驗室（化學主題）、地理室、電腦室 / Science lab (chemistry focus), geography room, computer room | 3 × 3 = 9 |
| 3/F | 可及性與共融 / Accessibility and inclusion | 歷史室（中國歷史及世界史情境）、視覺藝術室、音樂室 / History room (Chinese and world-history contexts), visual arts room, music room | 3 × 3 = 9 |
| 4/F | 最終整合與反思 / Synthesis and reflection | 圖書館、天台 / Library and rooftop | 2 × 3 = 6 |
| 合計 / Total | 四宗案件及結案反思 / Four cases and final reflection | **13 個延伸空間 / 13 extension spaces** | **每年級 39 題 / 39 checks per grade** |

圖書館與天台是綜合學習空間，不是教育局訂立的兩門學科；同一歷史室包含兩類歷史情境，也不代表中國歷史與歷史是同一科。房間名稱不表示所有香港學校採用相同課表或房間配置。Library and rooftop activities are interdisciplinary spaces, not separate prescribed subjects. Sharing a history room does not merge Chinese History and History into one curriculum. The layout is fictional and does not represent a universal school timetable.

**年級與三級題目 · Grades and task levels.** `data/grade-bank.json` 收錄六個年級 × 13 個空間 × 三題 = **234 道三語起始題**。年級內容包含不同學科概念、AI 查證及理由選擇，並非只更換年級標籤；但仍只抽樣部分概念，不宣稱完整涵蓋任何年級的課程。教師可按授課需要管理題庫及開始新活動。每個空間預設提供 1 星、2 星及 3 星各一題，共三題：由基礎理解或辨認，進展至應用，再至比較證據或處理較複雜情境。這是題目所需推理的差異，不是「弱／強學生」分類；學生可使用提示、重試及自行選擇順序。The curated bank contains 234 questions, with 39 per grade; it samples concepts rather than covering complete curricula. Each space has one 1-star, one 2-star, and one 3-star check, moving from recognition to application and more demanding reasoning. These describe task demand, not learner ability. Support choice, hints, retries, and flexible sequencing.

**教師選路 · Teacher-selected routes.** 20–30 分鐘課堂採用四案主線；如安排學科延伸，可選一至兩個切合當日目標的空間，並調整其他活動時間，或留作另一節。全校園探索預計需 45–75 分鐘，閱讀、討論及重試較多時可以更長；此時間仍須以目標學生試行校準。避免要求所有學生在 25 分鐘內完成四案和全部 39 題。Use the core route for a 20–30 minute session. Select one or two relevant rooms when useful, adjust other activities or schedule a separate session. The 45–75 minute full-campus estimate may be longer with discussion and must be calibrated through a learner pilot.

**星數與離校門檻 · Stars and the exit threshold.** 星數記錄首次完成的遊戲活動，不是道德、智力或學科能力分數。同一題或案件重玩不再獲星。13 個房間各有 1、2、3 星題，合共 13 × (1 + 2 + 3) = **78 星**；四宗倫理案件各 5 星，共 **20 星**；遷移挑戰 **5 星**。預設活動最高 **103 星**，正式離校結局需要至少 **100 星**。教師自訂活動會按題目數改變上限，門檻為 100 與該活動總星數的較小值。Stars record first completion, not morality, intelligence, or subject proficiency. Replays award no additional stars. The default maximum is 78 from rooms + 20 from scenarios + 5 from transfer = **103**, with **100** required for the exit. Custom assignments use the lower of 100 and their available total.

預設題庫的門檻要求接近完整探索：即使學科題全完成，缺少任何一宗 5 星案件或 5 星遷移挑戰，最高也只有 98 星。短課堂可完成四案、作反思及保存進度，而不要求觸發正式離校結局；教師須在活動開始前說明兩者的分別。不要為了湊星而壓縮討論或以未離校判斷學生未達學習目標。For the default bank, the threshold requires near-complete exploration: missing any 5-star case or the transfer task caps the total at 98. A short lesson can complete the ethics route and reflection without reaching the formal game ending. Explain this beforehand and do not equate an unfinished exit with failure to meet the lesson objective.

**角色與迎新 · Characters and onboarding.** 原創校門主選單中央呈現現行名稱，下方為「新開始／繼續遊戲／設定」，右上角 A 控制切換語言。未有已開始的遊戲時，繼續按鈕停用；取代既有進度前會在遊戲內確認，並提供下載報告和取消。玩家在準備室選好角色身份、校服與造型後，閱讀可略過及重播、自行控制步速的故事引言，了解新生校園生活、五層導覽、星數和離校條件。校園已有學生、教師、校務處職員、校長及副校長的動態／對話呈現；人物身份不構成答案正確的保證，仍須查證。The centered gate menu offers New Game, Continue and Settings, with language selection through A. Continue is disabled before a game starts; replacing progress requires confirmation with report download and cancellation options. Appearance selection leads to a skippable, replayable introduction. Animated school-community characters provide context and guidance, without replacing evidence.

角色動態不可蓋過閱讀內容或造成操作門檻；支援減少動態效果，對話不設限時作答。題目、案件、星數與結局的三語說明須一致。Keep animation compatible with reading and reduced-motion preferences; do not time dialogue responses. Explain questions, cases, stars, and the ending consistently across languages.

**有限度的形成性評量 · Limits of the checks.** 單題選擇題可揭示當下選擇和常見誤解，不能證明完整學科掌握、長期遷移或倫理品格。答對後仍請學生以一句話解釋證據，答錯則閱讀回饋後修訂。房間完成章與核心案件紀錄分開呈現；不要以學科闖關取代對推理的評閱。A multiple-choice check samples a response; it does not establish subject mastery, durable transfer, or moral character. Ask for an explanation, support revision, and report room completion separately from case reasoning.

**結案證據 · Final evidence.** 保留「證據、受影響的人、修正、遷移」四向度。學生的最終反思應引用自己實際查看的一項案件線索或房間題目，說明它如何影響選擇，再列出可做的下一步；不要自動把未去過的房間或未完成的題目寫入個人成就。The final reflection should cite a clue or task the learner actually encountered, explain its effect on a decision, and identify a feasible next action. Do not imply completion of unvisited spaces.

**學科名稱及官方參考 · Curriculum naming and official references.** 中一至中六並非所有科目都必修或同名；高中科目應按選科與已學內容使用，初中來源不等於高中課程依據。 以下來源只支持學習領域／科目連繫；遊戲並非完整課程、教育局認證教材或全港統一初中課表。Each source supports a curriculum connection, not a claim of complete coverage or official endorsement.

- 教育局 [Subjects under the Eight Key Learning Areas](https://www.edb.gov.hk/en/curriculum-development/kla/overview.html)：中文、英文、數學、科學、科技、個人社會及人文、藝術、體育的領域架構。學習領域不等於必須獨立設科的固定清單。The KLA structure is broader than a fixed list of separately taught subjects.
- 教育局 [Science (Secondary 1–3)](https://www.edb.gov.hk/en/curriculum-development/kla/science-edu/js-sci.html)：採「科學（化學主題）」稱呼；不把高中化學課程直接移植為初中必修規格。Use a junior-science chemistry focus, not senior-secondary chemistry requirements.
- 教育局 [Technology Education](https://www.edb.gov.hk/en/curriculum-development/kla/technology-edu/) 及 [junior-secondary Computer/ICT textbook curriculum references](https://www.edb.gov.hk/attachment/tc/curriculum-development/resource-support/textbook-info/RecommendedTextbookList/JSE_ICT.pdf)：電腦與資訊科技活動屬相關科技教育情境；校本科名和組織方式可不同。Computer/ICT activities connect to technology education; school naming and organisation can vary.
- 教育局 [Citizenship, Economics and Society Curriculum Guide (Secondary 1–3), 2024](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/cescg_e_20240730%20clean.pdf)：初中名稱為「公民、經濟與社會」，不要與高中「公民與社會發展」混用。Keep the junior- and senior-secondary subject names distinct.
- 教育局 [Geography (Secondary 1–3) Curriculum Framework](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/js_geog/Geography_%28F.1-3%29_Curriculum_Framework_en.pdf)：地理情境可連繫地圖、資料、環境與人的關係；題目按已教內容選用。Select geography examples in line with learners' prior teaching.
- 教育局 [junior-secondary Chinese History and History curriculum announcement](https://www.info.gov.hk/gia/general/201805/24/P2018052400364p.htm)：兩者是不同課程；遊戲的「世界史」是歷史情境標籤，不冒稱正式科名。Chinese History and History are distinct; world history here describes a context.
- 教育局 [Arts Education curriculum documents](https://www.edb.gov.hk/en/curriculum-development/kla/arts-edu/curriculum-docs/index.html)：音樂與視覺藝術各有課程文件，藝術判斷不宜化約為唯一審美答案。Music and Visual Arts have separate guides; avoid treating taste as a single correct answer.
- 教育局 [Physical Education curriculum documents](https://www.edb.gov.hk/en/curriculum-development/kla/pe/curriculum-doc/index.html)：體育空間題目只檢查有限知識與判斷，不代表實際運動技能評估。A PE room question does not assess physical performance.

實施前由科任老師審閱題目、答案、用語及年級適切性；檢查三語版本的推理要求相若。科學或體育內容若涉及實際操作，須另按課堂安排及教師指導處理；本遊戲不是實驗或運動操作指引。Have subject teachers review question accuracy, level, and language parity. The game is not a laboratory or physical-training procedure guide.
