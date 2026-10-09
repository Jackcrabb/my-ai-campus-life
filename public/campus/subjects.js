/* Original classroom challenges. Named people, passages and datasets are fictional teaching examples. */
(() => {
  "use strict";
  const T = (zh, cn, en) => ({ zh, cn, en });
  const O = (text, correct, feedback) => ({ text, correct, feedback });
  const L = (id, stars, title, question, options, takeaway) => ({
    id,
    stars,
    title,
    question,
    options,
    takeaway,
  });
  window.SUBJECT_CONTENT = [
    {
      id: "playground",
      location: "playground",
      floor: 0,
      title: T("操場", "操场", "Playground"),
      subject: T("體育", "体育", "Physical Education"),
      npcName: T("陳老師", "陈老师", "Teacher Chan"),
      npcRole: T("體育老師", "体育老师", "PE teacher"),
      description: T(
        "檢查安全參與、輪流練習及表現紀錄。以下練習安排和數據均為教學模擬。",
        "检查安全参与、轮流练习及表现记录。以下练习安排和数据均为教学模拟。",
        "Examine safe participation, practice rotations and performance records. All practice plans and data here are simulated.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：安全投球區",
            "基础：安全投球区",
            "Foundation: safe throwing space",
          ),
          T(
            "投球練習開始前，哪項安排能避免球員與拾球者同時進入投球路線？",
            "投球练习开始前，哪项安排能避免球员与捡球者同时进入投球路线？",
            "Before throwing practice, which arrangement keeps throwers and ball collectors from using the throwing lane at the same time?",
          ),
          [
            O(
              T(
                "每人按自己的時間投球和拾球。",
                "每人按自己的时间投球和捡球。",
                "Everyone throws and collects whenever they want.",
              ),
              false,
              T(
                "時間不協調，拾球者可能走進仍在使用的路線。",
                "时间不协调，捡球者可能走进仍在使用的路线。",
                "Uncoordinated timing could put collectors in an active throwing lane.",
              ),
            ),
            O(
              T(
                "劃清等候區，按老師訊號投球；全部停止後才拾球。",
                "划清等候区，按老师信号投球；全部停止后才捡球。",
                "Mark a waiting area, throw on the teacher’s signal, and collect only after all throwing stops.",
              ),
              true,
              T(
                "清楚區域及共同訊號能把投球與拾球時段分開。",
                "清楚区域及共同信号能把投球与捡球时段分开。",
                "Clear zones and shared signals separate throwing from collection.",
              ),
            ),
            O(
              T(
                "投球時讓隊友站在目標前，方便拾球。",
                "投球时让队友站在目标前，方便捡球。",
                "Have teammates stand in front of the target while others throw.",
              ),
              false,
              T(
                "這會把同學放進球的路線，不能用方便代替安全安排。",
                "这会把同学放进球的路线，不能用方便代替安全安排。",
                "That places people in the ball’s path; convenience does not resolve the hazard.",
              ),
            ),
          ],
          T(
            "開始運動前，先辨認活動區、等候區及停止訊號。",
            "开始运动前，先辨认活动区、等候区及停止信号。",
            "Before an activity, identify active zones, waiting areas and stop signals.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：公平輪站",
            "应用：公平轮站",
            "Application: equal station practice",
          ),
          T(
            "甲、乙、丙三組要完成投球、平衡及步法三站。每輪 4 分鐘，共三輪。哪個安排讓每組在每站都練習一次？",
            "甲、乙、丙三组要完成投球、平衡及步法三站。每轮 4 分钟，共三轮。哪个安排让每组在每站都练习一次？",
            "Groups A, B and C must visit throwing, balance and footwork stations. There are three four-minute rounds. Which plan gives each group one turn at every station?",
          ),
          [
            O(
              T(
                "每組分別從不同站開始，每輪按相同方向移到下一站。",
                "每组分别从不同站开始，每轮按相同方向移到下一站。",
                "Start each group at a different station and rotate all groups one station each round.",
              ),
              true,
              T(
                "三組同步輪轉三輪，每組都得到三站各 4 分鐘。",
                "三组同步轮转三轮，每组都得到三站各 4 分钟。",
                "Three coordinated rounds give each group four minutes at each of the three stations.",
              ),
            ),
            O(
              T(
                "每輪都讓各組選最喜歡的一站。",
                "每轮都让各组选最喜欢的一站。",
                "Let groups choose their favourite station every round.",
              ),
              false,
              T(
                "自由選擇不能確保每組都完成三站，也可能造成擠塞。",
                "自由选择不能确保每组都完成三站，也可能造成拥挤。",
                "Free choice does not ensure all stations are visited and may cause crowding.",
              ),
            ),
            O(
              T(
                "三輪都留在第一站，最後交換一次。",
                "三轮都留在第一站，最后交换一次。",
                "Stay at the first station for all three rounds and swap once at the end.",
              ),
              false,
              T(
                "大部分時間只有一種練習，未符合三站各練一次的要求。",
                "大部分时间只有一种练习，未符合三站各练一次的要求。",
                "That provides mainly one activity, rather than a turn at all three stations.",
              ),
            ),
          ],
          T(
            "輪站表可同時安排時間、空間及參與機會。",
            "轮站表可同时安排时间、空间及参与机会。",
            "A rotation plan coordinates time, space and opportunities to participate.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：真的進步了嗎？",
            "挑战：真的进步了吗？",
            "Challenge: has accuracy improved?",
          ),
          T(
            "小明第一週在 3 米外投中 6／10 球；第二週在 2 米外投中 8／10 球。要檢查他在 3 米的準繩度是否進步，應怎樣做？",
            "小明第一周在 3 米外投中 6／10 球；第二周在 2 米外投中 8／10 球。要检查他在 3 米的准确度是否进步，应怎样做？",
            "Ming scored 6/10 from 3 metres in week one and 8/10 from 2 metres in week two. How should you check improvement in accuracy at 3 metres?",
          ),
          [
            O(
              T(
                "直接以 8 大於 6 判定進步。",
                "直接以 8 大于 6 判定进步。",
                "Declare improvement because 8 is greater than 6.",
              ),
              false,
              T(
                "投球距離不同，較高命中數未能單獨證明在 3 米的表現進步。",
                "投球距离不同，较高命中数不能单独证明在 3 米的表现进步。",
                "The distances differ, so the higher total alone does not establish improvement at 3 metres.",
              ),
            ),
            O(
              T(
                "再改到 1 米投球，只比較最高命中數。",
                "再改到 1 米投球，只比较最高命中数。",
                "Move to 1 metre and compare only the highest score.",
              ),
              false,
              T(
                "再改距離只會增加條件差異，沒有回答指定的問題。",
                "再改距离只会增加条件差异，没有回答指定的问题。",
                "Changing the distance again adds another difference without answering the question.",
              ),
            ),
            O(
              T(
                "在 3 米以相同球、目標及投球次數再測試。",
                "在 3 米以相同球、目标及投球次数再测试。",
                "Retest at 3 metres with the same ball, target and number of throws.",
              ),
              true,
              T(
                "保持比較條件一致，才較能判斷指定技巧的變化；仍應看多次紀錄。",
                "保持比较条件一致，才较能判断指定技巧的变化；仍应看多次记录。",
                "Comparable conditions help assess change in the target skill; several records are still preferable to one.",
              ),
            ),
          ],
          T(
            "比較運動表現時，要先確認距離、器材及次數是否一致。",
            "比较运动表现时，要先确认距离、器材及次数是否一致。",
            "Check distance, equipment and attempt counts before comparing performance.",
          ),
        ),
      ],
    },
    {
      id: "hall",
      location: "hall",
      floor: 0,
      title: T("禮堂", "礼堂", "School hall"),
      subject: T(
        "公民、經濟與社會",
        "公民、经济与社会",
        "Citizenship, Economics and Society",
      ),
      npcName: T("何校長", "何校长", "Principal Ho"),
      npcRole: T("校長", "校长", "Principal"),
      description: T(
        "以代表性、有限資源及參與條件作校園決定。以下計劃、成本及人數均屬虛構。",
        "以代表性、有限资源及参与条件作校园决定。以下计划、成本及人数均属虚构。",
        "Make school decisions using representation, limited resources and access criteria. Plans, costs and numbers are fictional.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：誰的意見被聽見？",
            "基础：谁的意见被听见？",
            "Foundation: whose views are heard?",
          ),
          T(
            "學生會想了解全校不同年級對午間活動的看法。哪個方法最能減少只聽到某一群人的偏差？",
            "学生会想了解全校不同年级对午间活动的看法。哪个方法最能减少只听到某一群人的偏差？",
            "The student council wants views on lunchtime activities across year groups. Which method best reduces reliance on just one group?",
          ),
          [
            O(
              T(
                "只問學生會成員的朋友。",
                "只问学生会成员的朋友。",
                "Ask only council members’ friends.",
              ),
              false,
              T(
                "朋友可能有相似經驗，不能代表不同年級和需要。",
                "朋友可能有相似经验，不能代表不同年级和需要。",
                "Friends may share experiences and miss other year groups and needs.",
              ),
            ),
            O(
              T(
                "只採用聲量最大的同學的意見。",
                "只采用声音最大的同学的意见。",
                "Use only the views of the loudest students.",
              ),
              false,
              T(
                "願意大聲發言並不代表其他同學也持相同看法。",
                "愿意大声发言不代表其他同学也持相同看法。",
                "Speaking loudly does not make someone representative of others.",
              ),
            ),
            O(
              T(
                "從每個年級隨機邀請學生，並提供不同作答方式。",
                "从每个年级随机邀请学生，并提供不同作答方式。",
                "Randomly invite students from each year group and offer different ways to respond.",
              ),
              true,
              T(
                "涵蓋各年級並減少作答障礙，能改善意見來源的代表性。",
                "涵盖各年级并减少作答障碍，能改善意见来源的代表性。",
                "Including each year and reducing response barriers improves the range of voices represented.",
              ),
            ),
          ],
          T(
            "判斷調查結果前，先問樣本包括誰，也漏了誰。",
            "判断调查结果前，先问样本包括谁，也漏了谁。",
            "Before using a survey, ask whom the sample includes and leaves out.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：有限的預算",
            "应用：有限的预算",
            "Application: a limited budget",
          ),
          T(
            "班會有 $600，首要目標是清楚導引和安靜閱讀。大字標示 $250、閱讀角 $300、裝飾 $200。哪個組合符合兩個目標且不超支？",
            "班会有 $600，首要目标是清楚指引和安静阅读。大字标识 $250、阅读角 $300、装饰 $200。哪个组合符合两个目标且不超支？",
            "A class has $600. Its priorities are clear navigation and quiet reading. Large-print signs cost $250, a reading corner $300, and decorations $200. Which meets both priorities within budget?",
          ),
          [
            O(
              T(
                "三項全選，共 $750。",
                "三项全选，共 $750。",
                "All three, costing $750.",
              ),
              false,
              T(
                "$750 超過 $600，不能忽略資源限制。",
                "$750 超过 $600，不能忽略资源限制。",
                "$750 exceeds the $600 budget.",
              ),
            ),
            O(
              T(
                "大字標示及閱讀角，共 $550。",
                "大字标识及阅读角，共 $550。",
                "Signs and the reading corner, costing $550.",
              ),
              true,
              T(
                "$250＋$300＝$550，同時回應兩項優先需要，剩下 $50。",
                "$250＋$300＝$550，同时回应两项优先需要，剩下 $50。",
                "$250 + $300 = $550, meeting both priorities with $50 left.",
              ),
            ),
            O(
              T(
                "只選裝飾，共 $200。",
                "只选装饰，共 $200。",
                "Decorations only, costing $200.",
              ),
              false,
              T(
                "雖然未超支，卻沒有完成兩項指定目標。",
                "虽然未超支，却没有完成两项指定目标。",
                "It stays within budget but does not fulfil either stated priority.",
              ),
            ),
          ],
          T(
            "資源分配要同時看預算和優先需要；最便宜未必最切合目標。",
            "资源分配要同时看预算和优先需要；最便宜未必最切合目标。",
            "Resource allocation requires both a budget and priorities; the cheapest option may not meet the goal.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：找出可行會場",
            "挑战：找出可行会场",
            "Challenge: find a feasible venue",
          ),
          T(
            "會議需容納 40 人、全程無梯級，費用最多 $300。甲室：30 人、無梯級、$0；乙室：50 人、只有樓梯、$0；丙室：45 人、無梯級、$200。哪個符合全部條件？",
            "会议需容纳 40 人、全程无台阶，费用最多 $300。甲室：30 人、无台阶、$0；乙室：50 人、只有楼梯、$0；丙室：45 人、无台阶、$200。哪个符合全部条件？",
            "A meeting needs capacity for 40, step-free access throughout and a maximum cost of $300. A: 30 places, step-free, $0. B: 50, stairs only, $0. C: 45, step-free, $200. Which meets every condition?",
          ),
          [
            O(
              T("丙室。", "丙室。", "Room C."),
              true,
              T(
                "45 人容量足夠、無梯級，$200 亦在預算內。",
                "45 人容量足够、无台阶，$200 也在预算内。",
                "Its 45 places, step-free route and $200 cost satisfy all three conditions.",
              ),
            ),
            O(
              T(
                "甲室，因為免費。",
                "甲室，因为免费。",
                "Room A, because it is free.",
              ),
              false,
              T(
                "免費不能解決容量只得 30 人的限制。",
                "免费不能解决容量只有 30 人的限制。",
                "Being free does not solve its capacity limit of 30.",
              ),
            ),
            O(
              T(
                "乙室，因為座位最多。",
                "乙室，因为座位最多。",
                "Room B, because it has the most seats.",
              ),
              false,
              T(
                "座位足夠，但只有樓梯，未符合無梯級通道要求。",
                "座位足够，但只有楼梯，未符合无台阶通道要求。",
                "It has enough seats but fails the step-free access requirement.",
              ),
            ),
          ],
          T(
            "可行方案須符合所有必要條件，不只挑選最突出的一項優點。",
            "可行方案须符合所有必要条件，不只挑选最突出的一项优点。",
            "A feasible option meets every required condition, not just one attractive feature.",
          ),
        ),
      ],
    },
    {
      id: "chinese",
      location: "chinese",
      floor: 1,
      title: T("中文課室", "中文课室", "Chinese classroom"),
      subject: T("中國語文", "中国语文", "Chinese Language"),
      npcName: T("林老師", "林老师", "Teacher Lam"),
      npcRole: T("中文老師", "中文老师", "Chinese teacher"),
      description: T(
        "從原創短文讀出成語、比喻及作者態度。人物和事件均屬虛構。",
        "从原创短文读出成语、比喻及作者态度。人物和事件均属虚构。",
        "Interpret idioms, metaphors and an author’s stance in original Chinese passages. People and events are fictional.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：成語與語境",
            "基础：成语与语境",
            "Foundation: an idiom in context",
          ),
          T(
            "「小晴不懂天文圖，主動請教低一級、熟悉觀測的同學。」哪個成語最切合她的態度？",
            "“小晴不懂天文图，主动请教低一级、熟悉观测的同学。”哪个成语最切合她的态度？",
            "Read:「小晴不懂天文圖，主動請教低一級、熟悉觀測的同學。」Which idiom best describes her attitude?",
          ),
          [
            O(
              T(
                "不恥下問",
                "不耻下问",
                "不恥下問 — willing to ask someone junior",
              ),
              true,
              T(
                "她不因對方年級較低而拒絕請教，符合成語意思。",
                "她不因对方年级较低而拒绝请教，符合成语意思。",
                "She is willing to learn from someone in a lower year, matching the idiom.",
              ),
            ),
            O(
              T(
                "囫圇吞棗",
                "囫囵吞枣",
                "囫圇吞棗 — accept without understanding",
              ),
              false,
              T(
                "她主動求理解，並不是未弄懂便照單全收。",
                "她主动求理解，并不是未弄懂便照单全收。",
                "She actively seeks understanding rather than accepting something without examining it.",
              ),
            ),
            O(
              T("掩耳盜鈴", "掩耳盗铃", "掩耳盜鈴 — deceive oneself"),
              false,
              T(
                "文中沒有她故意掩飾問題或自欺的行為。",
                "文中没有她故意掩饰问题或自欺的行为。",
                "The passage gives no evidence of concealing a problem or deceiving herself.",
              ),
            ),
          ],
          T(
            "選成語要對照人物的具體行動，不只看個別字詞。",
            "选成语要对照人物的具体行动，不只看个别字词。",
            "Match an idiom to the character’s actions, rather than isolated words.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：讀懂比喻",
            "应用：读懂比喻",
            "Application: interpret a metaphor",
          ),
          T(
            "「午間的走廊是一條安靜的河，同學們緩緩走向圖書館。」把走廊比作河，主要突出甚麼？",
            "“午间的走廊是一条安静的河，同学们缓缓走向图书馆。”把走廊比作河，主要突出什么？",
            "Read:「午間的走廊是一條安靜的河，同學們緩緩走向圖書館。」What does comparing the corridor to a river mainly suggest?",
          ),
          [
            O(
              T(
                "走廊真的淹水了。",
                "走廊真的淹水了。",
                "The corridor is literally flooded.",
              ),
              false,
              T(
                "這是比喻；後句描寫人流，沒有提供淹水證據。",
                "这是比喻；后句描写人流，没有提供淹水证据。",
                "This is a metaphor. The next clause describes people moving, not a flood.",
              ),
            ),
            O(
              T(
                "同學正在大聲爭吵。",
                "同学正在大声争吵。",
                "Students are arguing loudly.",
              ),
              false,
              T(
                "「安靜」及「緩緩」不支持爭吵的理解。",
                "“安静”及“缓缓”不支持争吵的理解。",
                "“Quiet” and “slowly” do not support an interpretation of loud conflict.",
              ),
            ),
            O(
              T(
                "人流平靜而緩慢地移動。",
                "人流平静而缓慢地移动。",
                "People move calmly and slowly like a flow of water.",
              ),
              true,
              T(
                "「河」的流動意象配合「安靜」「緩緩」，形成平和的畫面。",
                "“河”的流动意象配合“安静”“缓缓”，形成平和的画面。",
                "The flowing image works with “quiet” and “slowly” to create a calm scene.",
              ),
            ),
          ],
          T(
            "理解修辭，要連同上下文及描述詞一起閱讀。",
            "理解修辞，要连同上下文及描述词一起阅读。",
            "Interpret figurative language together with context and descriptive words.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：保留作者的分寸",
            "挑战：保留作者的分寸",
            "Challenge: preserve the author’s caution",
          ),
          T(
            "短文：「添置飲水機後，兩週內收集的膠樽減少了。不過，同期郊遊取消，仍待觀察長期變化。」哪句概括最準確？",
            "短文：“添置饮水机后，两周内收集的塑料瓶减少了。不过，同期郊游取消，仍待观察长期变化。”哪句概括最准确？",
            "Read:「添置飲水機後，兩週內收集的膠樽減少了。不過，同期郊遊取消，仍待觀察長期變化。」Which summary best preserves the author’s stance?",
          ),
          [
            O(
              T(
                "飲水機已被證明是膠樽減少的唯一原因。",
                "饮水机已被证明是塑料瓶减少的唯一原因。",
                "The fountain is proven to be the only cause of the reduction.",
              ),
              false,
              T(
                "「不過」和「仍待」指出限制，作者沒有確定唯一原因。",
                "“不过”和“仍待”指出限制，作者没有确定唯一原因。",
                "The qualifications signal uncertainty; the author has not established a sole cause.",
              ),
            ),
            O(
              T(
                "膠樽短期減少，但其他因素及長期情況仍需查證。",
                "塑料瓶短期减少，但其他因素及长期情况仍需查证。",
                "Bottles decreased briefly, but other factors and longer-term results need checking.",
              ),
              true,
              T(
                "這保留了觀察結果，也保留作者對原因及時間的限制。",
                "这保留了观察结果，也保留作者对原因及时间的限制。",
                "This retains the observation and the author’s limits on cause and duration.",
              ),
            ),
            O(
              T(
                "作者認為飲水機完全沒有作用。",
                "作者认为饮水机完全没有作用。",
                "The author believes the fountain has no effect at all.",
              ),
              false,
              T(
                "未能確定效果，不等於已證明完全無效。",
                "未能确定效果，不等于已证明完全无效。",
                "An uncertain effect is not proof of no effect.",
              ),
            ),
          ],
          T(
            "概括文章時，要保留轉折、限制及確定程度。",
            "概括文章时，要保留转折、限制及确定程度。",
            "A faithful summary retains qualifications, contrasts and the degree of certainty.",
          ),
        ),
      ],
    },
    {
      id: "english",
      location: "english",
      floor: 1,
      title: T("英語課室", "英语课室", "English classroom"),
      subject: T("英國語文", "英国语文", "English Language"),
      npcName: T("李老師", "李老师", "Teacher Lee"),
      npcRole: T("英語老師", "英语老师", "English teacher"),
      description: T(
        "練習英文條件句、代詞及批判閱讀。例句與調查均為原創模擬；英文學習文本保留英文。",
        "练习英文条件句、代词及批判阅读。例句与调查均为原创模拟；英语学习文本保留英文。",
        "Practise conditionals, pronouns and critical reading. Sentences and survey details are original fictional examples.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：未來條件句",
            "基础：未来条件句",
            "Foundation: a future condition",
          ),
          T(
            "選出完成句子的答案：If it rains tomorrow, we ___ our picnic indoors.",
            "选出完成句子的答案：If it rains tomorrow, we ___ our picnic indoors.",
            "Choose the phrase that completes the sentence: If it rains tomorrow, we ___ our picnic indoors.",
          ),
          [
            O(
              T("will have", "will have", "will have"),
              true,
              T(
                "一般未來條件句以 if＋現在式配合 will＋原形動詞。",
                "一般未来条件句以 if＋现在式配合 will＋动词原形。",
                "A first conditional commonly uses if + present simple and will + base verb.",
              ),
            ),
            O(
              T("had", "had", "had"),
              false,
              T(
                "had 是過去式，不配合這句明天可能發生的結果。",
                "had 是过去式，不配合这句明天可能发生的结果。",
                "Had is past tense and does not fit this possible future result.",
              ),
            ),
            O(
              T("having", "having", "having"),
              false,
              T(
                "we having 缺少構成完整謂語所需的動詞。",
                "we having 缺少构成完整谓语所需的动词。",
                "We having lacks the verb needed to form a complete predicate.",
              ),
            ),
          ],
          T(
            "用 first conditional 表達真實可能的未來情況及結果。",
            "用 first conditional 表达真实可能的未来情况及结果。",
            "Use the first conditional for a real future possibility and its likely result.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：代詞指向哪裏？",
            "应用：代词指向哪里？",
            "Application: follow the pronoun",
          ),
          T(
            "閱讀：Maya sent Jo a draft. Jo revised it before returning it to Maya. 兩個 it 指甚麼？",
            "阅读：Maya sent Jo a draft. Jo revised it before returning it to Maya. 两个 it 指什么？",
            "Read: Maya sent Jo a draft. Jo revised it before returning it to Maya. What do both uses of it refer to?",
          ),
          [
            O(
              T("Jo", "Jo", "Jo"),
              false,
              T(
                "句中是 Jo 修改及交回某物，it 並不是指 Jo。",
                "句中是 Jo 修改及交回某物，it 并不是指 Jo。",
                "Jo performs the actions; it refers to the thing being revised and returned.",
              ),
            ),
            O(
              T("a draft", "a draft", "a draft"),
              true,
              T(
                "draft 是被送出、修改及交回的物件，前後意思連貫。",
                "draft 是被送出、修改及交回的物件，前后意思连贯。",
                "The draft is the object sent, revised and returned, making the meaning coherent.",
              ),
            ),
            O(
              T("Maya", "Maya", "Maya"),
              false,
              T(
                "Maya 是最後收回草稿的人，不是被修改的物件。",
                "Maya 是最后收回草稿的人，不是被修改的物件。",
                "Maya receives the returned draft; she is not the object being revised.",
              ),
            ),
          ],
          T(
            "找代詞所指，要核對前文名詞及句中動作。",
            "找代词所指，要核对前文名词及句中动作。",
            "Resolve a pronoun by checking earlier nouns and the actions in the sentence.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：讀出調查限制",
            "挑战：读出调查限制",
            "Challenge: read the survey limits",
          ),
          T(
            "閱讀：Most students in our club liked the new app. Only members who used it for a week answered the survey. 哪個結論有文字支持？",
            "阅读：Most students in our club liked the new app. Only members who used it for a week answered the survey. 哪个结论有文字支持？",
            "Read: Most students in our club liked the new app. Only members who used it for a week answered the survey. Which conclusion is supported?",
          ),
          [
            O(
              T(
                "Every student in the school liked the app.",
                "Every student in the school liked the app.",
                "Every student in the school liked the app.",
              ),
              false,
              T(
                "調查只涉及部分社團成員，不能擴大成全校每位學生。",
                "调查只涉及部分社团成员，不能扩大成全校每位学生。",
                "The survey covers some club members, not every student in the school.",
              ),
            ),
            O(
              T(
                "The app definitely improved everyone’s English.",
                "The app definitely improved everyone’s English.",
                "The app definitely improved everyone’s English.",
              ),
              false,
              T(
                "liked 表示喜歡，沒有提供英語學習成效的證據。",
                "liked 表示喜欢，没有提供英语学习效果的证据。",
                "Liked expresses preference, not evidence of improved English.",
              ),
            ),
            O(
              T(
                "The responses came from club members who had used the app for a week.",
                "The responses came from club members who had used the app for a week.",
                "The responses came from club members who had used the app for a week.",
              ),
              true,
              T(
                "這直接對應第二句，沒有超出文本提供的範圍。",
                "这直接对应第二句，没有超出文本提供的范围。",
                "This follows the second sentence without extending beyond the text.",
              ),
            ),
          ],
          T(
            "分清文本明說的內容，與讀者額外加上的推論。",
            "分清文本明说的内容，与读者额外加上的推论。",
            "Separate what a text states from assumptions a reader adds.",
          ),
        ),
      ],
    },
    {
      id: "maths",
      location: "maths",
      floor: 1,
      title: T("數學課室", "数学课室", "Mathematics classroom"),
      subject: T("數學", "数学", "Mathematics"),
      npcName: T("黃老師", "黄老师", "Teacher Wong"),
      npcRole: T("數學老師", "数学老师", "Mathematics teacher"),
      description: T(
        "用比、百分率及共同分母解讀資料。價格及測試結果均為教學模擬。",
        "用比、百分率及共同分母解读资料。价格及测试结果均为教学模拟。",
        "Interpret ratios, percentages and comparable denominators. Prices and test results are simulated.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：按比例分配",
            "基础：按比例分配",
            "Foundation: divide in a ratio",
          ),
          T(
            "紅色與藍色籌碼的數目比為 3：2，共有 25 枚。紅色有多少枚？",
            "红色与蓝色筹码的数量比为 3：2，共有 25 枚。红色有多少枚？",
            "Red and blue counters are in the ratio 3:2. There are 25 counters altogether. How many are red?",
          ),
          [
            O(
              T("10 枚", "10 枚", "10"),
              false,
              T(
                "10 是兩份的藍色數量；紅色佔三份。",
                "10 是两份的蓝色数量；红色占三份。",
                "10 is the blue share of two parts; red has three parts.",
              ),
            ),
            O(
              T("15 枚", "15 枚", "15"),
              true,
              T(
                "共 5 份，每份 25÷5＝5；紅色 3×5＝15。",
                "共 5 份，每份 25÷5＝5；红色 3×5＝15。",
                "There are five parts. Each is 25 ÷ 5 = 5, so red has 3 × 5 = 15.",
              ),
            ),
            O(
              T("20 枚", "20 枚", "20"),
              false,
              T(
                "20 紅、5 藍的比是 4：1，不是 3：2。",
                "20 红、5 蓝的比是 4：1，不是 3：2。",
                "20 red and 5 blue gives 4:1, not 3:2.",
              ),
            ),
          ],
          T(
            "先求總份數，再求每份數量，最後分配。",
            "先求总份数，再求每份数量，最后分配。",
            "Find total parts, calculate one part, then allocate each share.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：找回原價",
            "应用：找回原价",
            "Application: recover the original price",
          ),
          T(
            "一本書減價 20% 後售 $80。原價是多少？",
            "一本书降价 20% 后售 $80。原价是多少？",
            "A book costs $80 after a 20% discount. What was its original price?",
          ),
          [
            O(
              T("$64", "$64", "$64"),
              false,
              T(
                "$64 是再把 $80 減 20%；這不是倒推原價。",
                "$64 是再把 $80 减 20%；这不是倒推原价。",
                "$64 applies another 20% discount to $80 instead of reversing the discount.",
              ),
            ),
            O(
              T("$96", "$96", "$96"),
              false,
              T(
                "加上 $80 的 20% 不能還原，因為折扣是按原價計算。",
                "加上 $80 的 20% 不能还原，因为折扣是按原价计算。",
                "Adding 20% of $80 does not reverse a discount calculated from the original price.",
              ),
            ),
            O(
              T("$100", "$100", "$100"),
              true,
              T(
                "$80 是原價的 80%；原價＝80÷0.8＝$100。",
                "$80 是原价的 80%；原价＝80÷0.8＝$100。",
                "$80 is 80% of the original: 80 ÷ 0.8 = $100.",
              ),
            ),
          ],
          T(
            "倒推百分率時，先確定已知數量佔原數的幾成。",
            "倒推百分率时，先确定已知数量占原数的几成。",
            "To reverse a percentage change, identify what fraction of the original the known amount represents.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：別只看答對總數",
            "挑战：别只看答对总数",
            "Challenge: compare rates fairly",
          ),
          T(
            "同一類題目中，甲組答對 8／10，乙組答對 18／30。哪個比較正確？",
            "同一类题目中，甲组答对 8／10，乙组答对 18／30。哪个比较正确？",
            "On the same type of task, Group A answers 8/10 correctly and Group B 18/30. Which comparison is correct?",
          ),
          [
            O(
              T(
                "甲 80%、乙 60%；甲高 20 個百分點。",
                "甲 80%、乙 60%；甲高 20 个百分点。",
                "A scores 80%, B 60%; A is 20 percentage points higher.",
              ),
              true,
              T(
                "8÷10＝0.8，18÷30＝0.6；80−60＝20 個百分點。這本身不解釋原因。",
                "8÷10＝0.8，18÷30＝0.6；80−60＝20 个百分点。这本身不解释原因。",
                "8 ÷ 10 = 0.8 and 18 ÷ 30 = 0.6; the gap is 20 points. This alone does not explain why.",
              ),
            ),
            O(
              T(
                "乙較好，因為 18 大於 8。",
                "乙较好，因为 18 大于 8。",
                "B has the higher success rate because 18 is greater than 8.",
              ),
              false,
              T(
                "兩組題數不同，只比較答對總數會忽略分母。",
                "两组题数不同，只比较答对总数会忽略分母。",
                "The totals differ; comparing correct counts alone ignores the denominators.",
              ),
            ),
            O(
              T(
                "甲 80%、乙 60%；甲高 40 個百分點。",
                "甲 80%、乙 60%；甲高 40 个百分点。",
                "A scores 80%, B 60%; A is 40 percentage points higher.",
              ),
              false,
              T(
                "兩個百分率正確，但差是 80−60＝20，不是 40。",
                "两个百分率正确，但差是 80−60＝20，不是 40。",
                "The rates are right, but 80 − 60 = 20, not 40.",
              ),
            ),
          ],
          T(
            "比較成功率要保留分母；百分點是兩個百分率的相減。",
            "比较成功率要保留分母；百分点是两个百分率的相减。",
            "Keep denominators when comparing success rates; percentage points are the difference between percentages.",
          ),
        ),
      ],
    },
    {
      id: "chemistry",
      location: "chemistry",
      floor: 2,
      title: T("科學實驗室", "科学实验室", "Science laboratory"),
      subject: T(
        "科學（化學主題）",
        "科学（化学主题）",
        "Science (chemistry focus)",
      ),
      npcName: T("鄭老師", "郑老师", "Teacher Cheng"),
      npcRole: T("科學老師", "科学老师", "Science teacher"),
      description: T(
        "閱讀模擬紀錄，辨認變項、質量及證據支持的結論。本室不要求實際進行實驗。",
        "阅读模拟记录，辨认变量、质量及证据支持的结论。本室不要求实际进行实验。",
        "Read simulated records to identify variables, mass and supported conclusions. No real experiment is required.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：只改一項變項",
            "基础：只改一项变量",
            "Foundation: change one variable",
          ),
          T(
            "要比較水溫對同一種糖溶解時間的影響，哪個設計最好？",
            "要比较水温对同一种糖溶解时间的影响，哪个设计最好？",
            "Which design best compares the effect of water temperature on the time taken for the same sugar to dissolve?",
          ),
          [
            O(
              T(
                "同時改水溫和糖的份量。",
                "同时改水温和糖的分量。",
                "Change both temperature and the mass of sugar.",
              ),
              false,
              T(
                "兩項同時改變，便難分辨哪項影響結果。",
                "两项同时改变，就难分辨哪项影响结果。",
                "Changing both makes their effects difficult to separate.",
              ),
            ),
            O(
              T(
                "每次使用不同水量和不同攪拌方式。",
                "每次使用不同水量和不同搅拌方式。",
                "Use different water volumes and stirring methods each time.",
              ),
              false,
              T(
                "水量和攪拌也可能影響時間，應保持一致。",
                "水量和搅拌也可能影响时间，应保持一致。",
                "Volume and stirring can affect time and should be kept consistent.",
              ),
            ),
            O(
              T(
                "只改水溫，保持水量、糖量、粒度及攪拌方式一致。",
                "只改水温，保持水量、糖量、粒度及搅拌方式一致。",
                "Change only temperature; keep water volume, sugar mass, grain size and stirring the same.",
              ),
              true,
              T(
                "這能較清楚比較指定變項，並減少其他條件的影響。",
                "这能较清楚比较指定变量，并减少其他条件的影响。",
                "This better isolates the intended variable by limiting differences in other conditions.",
              ),
            ),
          ],
          T(
            "公平測試先指定改變的變項，再控制其他相關條件。",
            "公平测试先指定改变的变量，再控制其他相关条件。",
            "A fair test specifies the changed variable and controls other relevant conditions.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：看不見不等於消失",
            "应用：看不见不等于消失",
            "Application: dissolved does not mean gone",
          ),
          T(
            "密閉容器內有 90 g 水及 10 g 糖。糖完全溶解，沒有物質進出。只計內容物，溶解後總質量應是多少？",
            "密闭容器内有 90 g 水及 10 g 糖。糖完全溶解，没有物质进出。只计内容物，溶解后总质量应是多少？",
            "A sealed container holds 90 g of water and 10 g of sugar. The sugar dissolves completely and nothing enters or leaves. Excluding the container, what is the total mass afterward?",
          ),
          [
            O(
              T("100 g", "100 g", "100 g"),
              true,
              T(
                "糖仍在溶液中；90＋10＝100 g，沒有物質進出。",
                "糖仍在溶液中；90＋10＝100 g，没有物质进出。",
                "The sugar remains in the solution: 90 + 10 = 100 g, with no matter entering or leaving.",
              ),
            ),
            O(
              T("90 g", "90 g", "90 g"),
              false,
              T(
                "溶解的糖雖不再看得見顆粒，仍有質量。",
                "溶解的糖虽不再看得见颗粒，仍有质量。",
                "Sugar still has mass even when its separate grains are no longer visible.",
              ),
            ),
            O(
              T("110 g", "110 g", "110 g"),
              false,
              T(
                "溶解沒有額外產生 10 g 物質；不要把糖計算兩次。",
                "溶解没有额外产生 10 g 物质；不要把糖计算两次。",
                "Dissolving does not create another 10 g; do not count the sugar twice.",
              ),
            ),
          ],
          T(
            "物質溶解後仍存在；沒有物質進出的系統可用總質量核對。",
            "物质溶解后仍存在；没有物质进出的系统可用总质量核对。",
            "Dissolved matter still exists; total mass can be checked when no matter enters or leaves.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：數據容許說多遠？",
            "挑战：数据允许说多远？",
            "Challenge: how far does the evidence go?",
          ),
          T(
            "其他條件相同，每個溫度重複三次，平均溶解時間為：20°C＝80 秒、40°C＝45 秒、60°C＝30 秒。哪句最符合數據？",
            "其他条件相同，每个温度重复三次，平均溶解时间为：20°C＝80 秒、40°C＝45 秒、60°C＝30 秒。哪句最符合数据？",
            "With other conditions kept equal and three repeats per temperature, mean dissolving times are 20°C: 80 s, 40°C: 45 s, 60°C: 30 s. Which statement fits these data?",
          ),
          [
            O(
              T(
                "所有物質在任何高溫下都會立即溶解。",
                "所有物质在任何高温下都会立即溶解。",
                "Every substance dissolves instantly at any high temperature.",
              ),
              false,
              T(
                "只測了一種糖和三個溫度，不能推廣至所有物質及條件。",
                "只测了一种糖和三个温度，不能推广至所有物质及条件。",
                "One sugar and three temperatures do not justify a claim about every substance and condition.",
              ),
            ),
            O(
              T(
                "在這些測試條件下，較高水溫對應較短平均溶解時間。",
                "在这些测试条件下，较高水温对应较短平均溶解时间。",
                "Under these test conditions, higher water temperature corresponds to a shorter mean dissolving time.",
              ),
              true,
              T(
                "三組平均時間隨溫度上升而縮短，結論也保留了測試範圍。",
                "三组平均时间随温度上升而缩短，结论也保留了测试范围。",
                "The three means decrease as temperature rises, and this wording keeps the conclusion within the tested range.",
              ),
            ),
            O(
              T(
                "每次提高 20°C，時間都剛好減半。",
                "每次提高 20°C，时间都刚好减半。",
                "Every 20°C increase halves the time exactly.",
              ),
              false,
              T(
                "80 的一半是 40，不是 45；45 的一半是 22.5，不是 30。",
                "80 的一半是 40，不是 45；45 的一半是 22.5，不是 30。",
                "Half of 80 is 40, not 45; half of 45 is 22.5, not 30.",
              ),
            ),
          ],
          T(
            "用數據支持有範圍的結論，不把趨勢誇大成普遍定律。",
            "用数据支持有范围的结论，不把趋势夸大成普遍定律。",
            "Use data for a bounded conclusion rather than turning a trend into a universal rule.",
          ),
        ),
      ],
    },
    {
      id: "geography",
      location: "geography",
      floor: 2,
      title: T("地理課室", "地理课室", "Geography classroom"),
      subject: T("地理", "地理", "Geography"),
      npcName: T("周老師", "周老师", "Teacher Chow"),
      npcRole: T("地理老師", "地理老师", "Geography teacher"),
      description: T(
        "閱讀比例尺、等高線及長期氣溫紀錄。地點與數據均屬虛構。",
        "阅读比例尺、等高线及长期气温记录。地点与数据均属虚构。",
        "Read map scales, contours and long-term temperature records. Locations and data are fictional.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：地圖上的距離",
            "基础：地图上的距离",
            "Foundation: map distance",
          ),
          T(
            "地圖比例尺是 1：50,000。兩點在圖上相距 4 cm，實際直線距離是多少？",
            "地图比例尺是 1：50,000。两点在图上相距 4 cm，实际直线距离是多少？",
            "A map has a scale of 1:50,000. Two points are 4 cm apart on the map. What is their real straight-line distance?",
          ),
          [
            O(
              T("200 米", "200 米", "200 metres"),
              false,
              T(
                "4×50,000＝200,000 cm；換成米要除以 100，得到 2,000 米。",
                "4×50,000＝200,000 cm；换成米要除以 100，得到 2,000 米。",
                "4 × 50,000 = 200,000 cm; dividing by 100 gives 2,000 metres.",
              ),
            ),
            O(
              T("20 公里", "20 公里", "20 kilometres"),
              false,
              T(
                "200,000 cm＝2,000 m＝2 km，不是 20 km。",
                "200,000 cm＝2,000 m＝2 km，不是 20 km。",
                "200,000 cm = 2,000 m = 2 km, not 20 km.",
              ),
            ),
            O(
              T("2 公里", "2 公里", "2 kilometres"),
              true,
              T(
                "圖上 1 cm 代表 500 m；4 cm 代表 2,000 m，即 2 km。",
                "图上 1 cm 代表 500 m；4 cm 代表 2,000 m，即 2 km。",
                "One map centimetre represents 500 m; four represent 2,000 m, or 2 km.",
              ),
            ),
          ],
          T(
            "比例尺計算先保持單位一致，最後才換算。",
            "比例尺计算先保持单位一致，最后才换算。",
            "Keep units consistent when applying a map scale, then convert.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：哪段坡較陡？",
            "应用：哪段坡较陡？",
            "Application: which slope is steeper?",
          ),
          T(
            "同一幅地圖、等高距 10 m。甲路線相鄰等高線的水平距離是 100 m；乙是 300 m。兩段路都垂直穿過等高線，哪段較陡？",
            "同一幅地图、等高距 10 m。甲路线相邻等高线的水平距离是 100 m；乙是 300 m。两段路都垂直穿过等高线，哪段较陡？",
            "On the same map, contours differ by 10 m in height. Route A crosses adjacent contours over 100 m horizontally; B over 300 m. Both cross at right angles. Which is steeper?",
          ),
          [
            O(
              T(
                "甲；相同升幅集中在較短水平距離。",
                "甲；相同升幅集中在较短水平距离。",
                "A: the same rise occurs over a shorter horizontal distance.",
              ),
              true,
              T(
                "甲坡度 10／100，大於乙的 10／300；等高線較密通常表示較陡。",
                "甲坡度 10／100，大于乙的 10／300；等高线较密通常表示较陡。",
                "A has a gradient of 10/100 versus B’s 10/300. Closer contours indicate the steeper slope here.",
              ),
            ),
            O(
              T(
                "乙；路程較長一定較陡。",
                "乙；路程较长一定较陡。",
                "B: a longer route must be steeper.",
              ),
              false,
              T(
                "同一升幅分散到較長水平距離，坡度反而較小。",
                "同一升幅分散到较长水平距离，坡度反而较小。",
                "The same rise spread over a longer horizontal distance gives a gentler slope.",
              ),
            ),
            O(
              T(
                "一樣陡，因為等高距相同。",
                "一样陡，因为等高距相同。",
                "They are equal because the contour interval is equal.",
              ),
              false,
              T(
                "坡度須同時看垂直升幅和水平距離。",
                "坡度须同时看垂直升幅和水平距离。",
                "Gradient depends on both vertical rise and horizontal distance.",
              ),
            ),
          ],
          T(
            "等高距相同時，等高線間距是判斷坡度的重要線索。",
            "等高距相同时，等高线间距是判断坡度的重要线索。",
            "With equal contour intervals, contour spacing helps reveal gradient.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：天氣不是氣候",
            "挑战：天气不是气候",
            "Challenge: weather and climate",
          ),
          T(
            "某地前一個 30 年期年均溫為 21.4°C，後一個為 22.2°C。今年某日只有 18°C。哪個解讀正確？",
            "某地前一个 30 年期年均温为 21.4°C，后一个为 22.2°C。今年某日只有 18°C。哪个解读正确？",
            "A place’s mean annual temperature was 21.4°C in one 30-year period and 22.2°C in the next. One day this year was 18°C. Which interpretation is correct?",
          ),
          [
            O(
              T(
                "這個 18°C 的日子證明長期均溫沒有上升。",
                "这个 18°C 的日子证明长期均温没有上升。",
                "The 18°C day proves the long-term mean has not risen.",
              ),
              false,
              T(
                "單日天氣不能推翻兩個長期平均值的比較。",
                "单日天气不能推翻两个长期平均值的比较。",
                "One day’s weather does not overturn a comparison of long-term averages.",
              ),
            ),
            O(
              T(
                "兩期均溫上升 0.8°C；單日較冷可與這個長期變化並存。",
                "两期均温上升 0.8°C；单日较冷可与这个长期变化并存。",
                "The mean rose by 0.8°C; a cooler individual day can coexist with that long-term change.",
              ),
              true,
              T(
                "22.2−21.4＝0.8°C。天氣描述短期狀況，氣候關注長期模式。",
                "22.2−21.4＝0.8°C。天气描述短期状况，气候关注长期模式。",
                "22.2 − 21.4 = 0.8°C. Weather concerns short-term conditions; climate concerns longer-term patterns.",
              ),
            ),
            O(
              T(
                "均溫升了，所以之後每一天都必須超過 22.2°C。",
                "均温升了，所以之后每一天都必须超过 22.2°C。",
                "Because the mean rose, every future day must exceed 22.2°C.",
              ),
              false,
              T(
                "平均值不是每天的最低值，日常氣溫仍會有變化。",
                "平均值不是每天的最低值，日常气温仍会变化。",
                "A mean is not a daily minimum; daily temperatures still vary.",
              ),
            ),
          ],
          T(
            "比較氣候需看長期資料；平均上升不表示每天都更熱。",
            "比较气候需看长期资料；平均上升不表示每天都更热。",
            "Climate comparisons need long-term records; a higher mean does not make every day warmer.",
          ),
        ),
      ],
    },
    {
      id: "computer",
      location: "computer",
      floor: 2,
      title: T("電腦室", "电脑室", "Computer room"),
      subject: T(
        "電腦與資訊科技（校本延伸）",
        "电脑与资讯科技（校本延伸）",
        "Computer and Information Technology (school-based extension)",
      ),
      npcName: T("張老師", "张老师", "Teacher Cheung"),
      npcRole: T("資訊科技老師", "资讯科技老师", "IT teacher"),
      description: T(
        "辨認釣魚訊息、檢查權限及核對 AI 數字。訊息與資料表均為虛構，不含真實登入連結。",
        "辨认钓鱼信息、检查权限及核对 AI 数字。信息与数据表均为虚构，不含真实登录链接。",
        "Recognise phishing, inspect permissions and verify AI calculations. Messages and tables are fictional, with no real sign-in links.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：可疑的緊急訊息",
            "基础：可疑的紧急信息",
            "Foundation: a suspicious urgent message",
          ),
          T(
            "一封自稱學校支援的郵件說：「十分鐘內回覆密碼及驗證碼，否則封鎖帳戶。」最合適的下一步是甚麼？",
            "一封自称学校支持部门的邮件说：“十分钟内回复密码及验证码，否则封锁账户。”最合适的下一步是什么？",
            "An email claiming to be school support says, “Reply with your password and verification code within ten minutes or lose your account.” What should you do next?",
          ),
          [
            O(
              T(
                "不回覆資料，經平日已知的學校聯絡途徑核實。",
                "不回复资料，通过平日已知的学校联系途径核实。",
                "Do not send the details; verify through a school contact channel you already know.",
              ),
              true,
              T(
                "索取密碼、驗證碼和製造急迫感都是警號；獨立核實可避免依賴可疑郵件。",
                "索取密码、验证码和制造紧迫感都是警告信号；独立核实可避免依赖可疑邮件。",
                "Requests for passwords, codes and urgency are warning signs. Independent verification avoids relying on the suspicious message.",
              ),
            ),
            O(
              T(
                "立即回覆，避免帳戶被封鎖。",
                "立即回复，避免账户被封锁。",
                "Reply immediately to avoid losing access.",
              ),
              false,
              T(
                "急迫語氣不是可信證據；交出這些資料可能讓他人存取帳戶。",
                "急迫语气不是可信证据；交出这些资料可能让他人访问账户。",
                "Urgency is not proof of legitimacy; those details could let someone access the account.",
              ),
            ),
            O(
              T(
                "只交驗證碼，不交密碼。",
                "只交验证码，不交密码。",
                "Send only the verification code, not the password.",
              ),
              false,
              T(
                "驗證碼也屬敏感登入資料，不能當作可隨意分享的內容。",
                "验证码也是敏感登录资料，不能随意分享。",
                "Verification codes are also sensitive access information.",
              ),
            ),
          ],
          T(
            "用已知途徑核實身份；不要被急迫訊息誘導交出登入資料。",
            "用已知途径核实身份；不要被紧急信息诱导交出登录资料。",
            "Verify identity through a known route instead of surrendering login information under pressure.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：權限與目的",
            "应用：权限与目的",
            "Application: permissions and purpose",
          ),
          T(
            "口說練習功能需要錄製你的發音，卻同時要求通訊錄及持續位置權限。哪個權限安排最符合這項功能需要？",
            "口语练习功能需要录制你的发音，却同时要求通讯录及持续位置权限。哪个权限安排最符合这项功能需要？",
            "A speaking-practice feature records your pronunciation but also requests contacts and continuous location access. Which permission arrangement best fits the stated function?",
          ),
          [
            O(
              T(
                "所有權限都開啟，越多資料越好。",
                "所有权限都开启，数据越多越好。",
                "Enable everything because more data is always better.",
              ),
              false,
              T(
                "更多資料並不自動改善練習，還增加不必要的資料存取。",
                "更多数据不会自动改善练习，还增加不必要的数据访问。",
                "More data does not automatically improve practice and creates unnecessary access.",
              ),
            ),
            O(
              T(
                "只開通訊錄，因為老師的聯絡方法很重要。",
                "只开通讯录，因为老师的联系方式很重要。",
                "Enable contacts only because the teacher’s contact details matter.",
              ),
              false,
              T(
                "通訊錄不能代替錄音功能，也不是這項練習所需。",
                "通讯录不能代替录音功能，也不是这项练习所需。",
                "Contacts do not provide recording and are not required by this stated task.",
              ),
            ),
            O(
              T(
                "只在主動錄音時准許咪高峰，拒絕無關的通訊錄及位置要求。",
                "只在主动录音时允许麦克风，拒绝无关的通讯录及位置请求。",
                "Allow the microphone when actively recording; deny unrelated contacts and location requests.",
              ),
              true,
              T(
                "權限應配合具體用途；仍需查核錄音如何保存及處理。",
                "权限应配合具体用途；仍需查核录音如何保存及处理。",
                "Permissions should match a specific purpose; how recordings are stored and handled still needs checking.",
              ),
            ),
          ],
          T(
            "必要權限不等於所有權限；逐項問它是否服務於任務。",
            "必要权限不等于所有权限；逐项问它是否服务于任务。",
            "Necessary permission does not mean every permission; ask how each serves the task.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：核對 AI 的百分率",
            "挑战：核对 AI 的百分率",
            "Challenge: check an AI percentage",
          ),
          T(
            "原始表格：60 人中 24 人選「願意」。AI 摘要卻寫「60% 願意」。應如何修正？",
            "原始表格：60 人中 24 人选“愿意”。AI 摘要却写“60% 愿意”。应如何修正？",
            "The source table says 24 of 60 people chose “willing.” An AI summary says “60% were willing.” What is the correct repair?",
          ),
          [
            O(
              T(
                "保留 60%，因為 AI 的句子很肯定。",
                "保留 60%，因为 AI 的句子很肯定。",
                "Keep 60% because the AI sounds confident.",
              ),
              false,
              T(
                "肯定語氣不能取代計算及原始資料。",
                "肯定语气不能取代计算及原始资料。",
                "Confident wording cannot replace calculation and source data.",
              ),
            ),
            O(
              T(
                "按 24÷60×100%＝40% 修正，並保留原始表格供查核。",
                "按 24÷60×100%＝40% 修正，并保留原始表格供查核。",
                "Correct it to 24 ÷ 60 × 100% = 40%, retaining the table for verification.",
              ),
              true,
              T(
                "直接對照分子與分母，可以發現並修正生成摘要中的錯誤。",
                "直接对照分子与分母，可以发现并修正生成摘要中的错误。",
                "Checking numerator and denominator against the source reveals and repairs the summary error.",
              ),
            ),
            O(
              T(
                "改成 24%，因為有 24 人選願意。",
                "改成 24%，因为有 24 人选愿意。",
                "Change it to 24% because 24 people chose willing.",
              ),
              false,
              T(
                "24 是人數，須除以總人數 60 才能得到百分率。",
                "24 是人数，须除以总人数 60 才能得到百分比。",
                "24 is a count; divide by the total of 60 to calculate a percentage.",
              ),
            ),
          ],
          T(
            "AI 摘要的數字要回到原始表格和運算核對。",
            "AI 摘要的数字要回到原始表格和计算核对。",
            "Verify numbers in AI summaries against source records and calculations.",
          ),
        ),
      ],
    },
    {
      id: "history",
      location: "history",
      floor: 3,
      title: T(
        "中史與歷史研習室",
        "中史与历史研习室",
        "Chinese History and History study room",
      ),
      subject: T(
        "中國歷史／歷史",
        "中国历史／历史",
        "Chinese History / History",
      ),
      npcName: T("許老師", "许老师", "Teacher Hui"),
      npcRole: T("歷史科老師", "历史科老师", "History teacher"),
      description: T(
        "中國歷史與歷史是不同學科；本室分別練習史料分類及多角度查證。帳簿、引文、城市及日期紀錄均為虛構教材。",
        "中国历史与历史是不同学科；本室分别练习史料分类及多角度查证。账簿、引文、城市及日期记录均为虚构教材。",
        "Chinese History and History are distinct subjects. Practise source classification and multiple perspectives through fictional ledgers, quotations, cities and records.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：辨認一手史料",
            "基础：辨认一手史料",
            "Foundation: identify a primary source",
          ),
          T(
            "為中國近代商業史展覽研究一間 1902 年商號，哪項最直接記錄當時該商號的交易？",
            "为中国近代商业史展览研究一家 1902 年商号，哪项最直接记录当时该商号的交易？",
            "For an exhibition on modern Chinese commercial history, you are investigating a shop in 1902. Which most directly records that shop’s transactions at the time?",
          ),
          [
            O(
              T(
                "今天以該商號為背景創作的電視劇。",
                "今天以该商号为背景创作的电视剧。",
                "A television drama written today and set in the shop.",
              ),
              false,
              T(
                "戲劇是後來的創作，情節不能直接當作當年交易紀錄。",
                "电视剧是后来的创作，情节不能直接当作当年交易记录。",
                "A later fictional drama is not a direct record of the transactions.",
              ),
            ),
            O(
              T(
                "今天學生憑想像寫成的故事。",
                "今天学生凭想象写成的故事。",
                "A story imagined by a student today.",
              ),
              false,
              T(
                "想像作品可以引發興趣，但不能代替當時留下的資料。",
                "想象作品可以引发兴趣，但不能代替当时留下的资料。",
                "An imagined story may spark interest but cannot replace evidence from the time.",
              ),
            ),
            O(
              T(
                "該商號在 1902 年逐日填寫的原始帳簿。",
                "该商号在 1902 年逐日填写的原始账簿。",
                "The shop’s original ledger, filled in daily during 1902.",
              ),
              true,
              T(
                "帳簿是當時活動留下的一手紀錄；仍須檢查真偽、完整性及記帳目的。",
                "账簿是当时活动留下的一手记录；仍须检查真伪、完整性及记账目的。",
                "The ledger is a contemporary primary record; authenticity, completeness and its purpose still matter.",
              ),
            ),
          ],
          T(
            "一手史料接近所研究的活動，但不代表永遠完整或無誤。",
            "一手史料接近所研究的活动，但不代表永远完整或无误。",
            "Primary sources come from the activity studied, but are not automatically complete or error-free.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：不同身份，不同觀點",
            "应用：不同身份，不同观点",
            "Application: different positions and perspectives",
          ),
          T(
            "模擬晚清工廠史料：商人家書稱「工廠增加工作」；附近居民日記寫「河水變了顏色」。哪個處理方法最合理？",
            "模拟晚清工厂史料：商人家书称“工厂增加工作”；附近居民日记写“河水变了颜色”。哪个处理方法最合理？",
            "Fictional late-Qing factory sources: a merchant’s letter says “the factory created jobs”; a resident’s diary says “the river changed colour.” How should these be handled?",
          ),
          [
            O(
              T(
                "比較兩人的位置與目的，再找就業及河流相關紀錄查證。",
                "比较两人的位置与目的，再找就业及河流相关记录查证。",
                "Compare their positions and purposes, then check employment and river records.",
              ),
              true,
              T(
                "兩段話關注不同影響，可以同時值得調查；不能只憑身份判定真假。",
                "两段话关注不同影响，都值得调查；不能只凭身份判定真假。",
                "They concern different effects and both warrant investigation; identity alone does not establish truth or falsehood.",
              ),
            ),
            O(
              T(
                "兩人觀點不同，所以一定有一人說謊。",
                "两人观点不同，所以一定有一人说谎。",
                "Their views differ, so one must be lying.",
              ),
              false,
              T(
                "增加工作和河水變色可以同時發生，兩句並不必然矛盾。",
                "增加工作和河水变色可以同时发生，两句并不必然矛盾。",
                "More jobs and changed river colour could coexist; the claims need not contradict each other.",
              ),
            ),
            O(
              T(
                "只採用商人的說法，因為職位較高。",
                "只采用商人的说法，因为职位较高。",
                "Use only the merchant’s view because of higher status.",
              ),
              false,
              T(
                "社會地位不能代替證據，亦可能令重要的居民經驗被忽略。",
                "社会地位不能代替证据，也可能让重要的居民经验被忽略。",
                "Social status is not evidence and may cause relevant residents’ experiences to be overlooked.",
              ),
            ),
          ],
          T(
            "比較史料的身份、目的及內容，再用其他紀錄交叉查證。",
            "比较史料的身份、目的及内容，再用其他记录交叉核实。",
            "Compare authorship, purpose and content, then corroborate with other records.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：三個日期的謎題",
            "挑战：三个日期的谜题",
            "Challenge: three dates, different events",
          ),
          T(
            "另一虛構城市的鐵路檔案：1954 年計劃書、1955 年施工工資簿、1956 年開幕報道。哪個時間線最有證據支持？",
            "另一虚构城市的铁路档案：1954 年计划书、1955 年施工工资簿、1956 年开幕报道。哪个时间线最有证据支持？",
            "Railway records from another fictional city include a 1954 plan, a 1955 construction payroll and a 1956 opening report. Which timeline is best supported?",
          ),
          [
            O(
              T(
                "鐵路在 1954 年已正式開幕。",
                "铁路在 1954 年已正式开幕。",
                "The railway officially opened in 1954.",
              ),
              false,
              T(
                "計劃書證明有計劃，並不等於當年已開幕。",
                "计划书证明有计划，并不等于当年已开幕。",
                "A plan documents planning, not an opening in that year.",
              ),
            ),
            O(
              T(
                "1954 有計劃、1955 有施工紀錄、1956 有開幕報道。",
                "1954 有计划、1955 有施工记录、1956 有开幕报道。",
                "Planning is documented in 1954, construction in 1955 and an opening in 1956.",
              ),
              true,
              T(
                "不同史料記錄不同階段；不需要把所有日期強行改成同一年。",
                "不同史料记录不同阶段；不需要把所有日期强行改成同一年。",
                "The records describe different stages; their dates do not need to be forced into one year.",
              ),
            ),
            O(
              T(
                "日期不一，所以三份文件都沒有研究價值。",
                "日期不一，所以三份文件都没有研究价值。",
                "The dates differ, so all three records are worthless.",
              ),
              false,
              T(
                "日期差異可能反映事件發展，應先辨認每份文件記錄的事情。",
                "日期差异可能反映事件发展，应先辨认每份文件记录的事情。",
                "Different dates may reflect a process. Identify the event each record documents.",
              ),
            ),
          ],
          T(
            "整理歷史時間線時，要分清計劃、施工及啟用等不同事件。",
            "整理历史时间线时，要分清计划、施工及启用等不同事件。",
            "When building a timeline, distinguish planning, construction and opening as separate events.",
          ),
        ),
      ],
    },
    {
      id: "art",
      location: "art",
      floor: 3,
      title: T("視覺藝術室", "视觉艺术室", "Visual arts room"),
      subject: T("視覺藝術", "视觉艺术", "Visual Arts"),
      npcName: T("葉老師", "叶老师", "Teacher Yip"),
      npcRole: T("視覺藝術老師", "视觉艺术老师", "Visual arts teacher"),
      description: T(
        "探索視覺層次、色彩及作品語境。展板、作品與作者說明均為原創虛構例子。",
        "探索视觉层次、色彩及作品语境。展板、作品与作者说明均为原创虚构例子。",
        "Explore visual hierarchy, colour and artistic context through original fictional posters, artworks and artist statements.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：建立視覺重點",
            "基础：建立视觉重点",
            "Foundation: establish a focal point",
          ),
          T(
            "展覽海報的標題和說明字體一樣大、顏色一樣。目標是讓人先看見標題，再閱讀內容。哪個修改最直接？",
            "展览海报的标题和说明字体一样大、颜色一样。目标是让人先看见标题，再阅读内容。哪个修改最直接？",
            "A poster’s title and body have identical size and colour. The goal is to guide viewers to the title first, then the details. Which change most directly achieves this?",
          ),
          [
            O(
              T(
                "把所有字和背景都改得同樣鮮艷。",
                "把所有文字和背景都改得同样鲜艳。",
                "Make every word and the background equally vivid.",
              ),
              false,
              T(
                "所有部分都爭取注意，反而沒有清楚層次。",
                "所有部分都争取注意，反而没有清楚层次。",
                "If everything competes equally, the hierarchy remains unclear.",
              ),
            ),
            O(
              T(
                "增加標題大小及對比，保留較平靜的正文和留白。",
                "增加标题大小及对比，保留较平静的正文和留白。",
                "Increase title size and contrast, keeping quieter body text and space around it.",
              ),
              true,
              T(
                "大小、對比及留白能建立閱讀先後，服務於指定目標。",
                "大小、对比及留白能建立阅读先后，服务于指定目标。",
                "Size, contrast and space establish an order of attention that serves the brief.",
              ),
            ),
            O(
              T(
                "把標題縮小並放進密集圖案中。",
                "把标题缩小并放进密集图案中。",
                "Shrink the title and place it inside a dense pattern.",
              ),
              false,
              T(
                "這通常令標題更難被找到，與目標相反。",
                "这通常让标题更难被找到，与目标相反。",
                "That generally makes the title harder to find, opposing the stated goal.",
              ),
            ),
          ],
          T(
            "視覺層次用大小、對比和空間引導注意，不只是增加裝飾。",
            "视觉层次用大小、对比和空间引导注意，不只是增加装饰。",
            "Visual hierarchy guides attention through size, contrast and space, beyond adding decoration.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：傳統色相環",
            "应用：传统色相环",
            "Application: the traditional colour wheel",
          ),
          T(
            "在以紅、黃、藍為三原色的傳統美術色相環上，哪一色與藍色互補、位於相對位置？",
            "在以红、黄、蓝为三原色的传统美术色相环上，哪一色与蓝色互补、位于相对位置？",
            "On the traditional artists’ red-yellow-blue colour wheel, which colour is complementary to blue, opposite it on the wheel?",
          ),
          [
            O(
              T("綠色", "绿色", "Green"),
              false,
              T(
                "這個色相環上，綠色與紅色相對，不是藍色。",
                "这个色相环上，绿色与红色相对，不是蓝色。",
                "On this colour wheel, green is opposite red, not blue.",
              ),
            ),
            O(
              T("紫色", "紫色", "Violet"),
              false,
              T(
                "紫色與黃色相對；藍與紫在色相環上較接近。",
                "紫色与黄色相对；蓝与紫在色相环上较接近。",
                "Violet is opposite yellow; blue and violet are closer together.",
              ),
            ),
            O(
              T("橙色", "橙色", "Orange"),
              true,
              T(
                "在這個指定色相模型中，藍與橙是一對互補色。",
                "在这个指定色相模型中，蓝与橙是一对互补色。",
                "In this specified colour model, blue and orange form a complementary pair.",
              ),
            ),
          ],
          T(
            "使用色彩術語時，要知道所用色彩模型；本題採傳統紅黃藍色相環。",
            "使用色彩术语时，要知道所用色彩模型；本题采用传统红黄蓝色相环。",
            "Colour terms depend on the model; this question uses the traditional red-yellow-blue wheel.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：作品語境與署名",
            "挑战：作品语境与署名",
            "Challenge: context and attribution",
          ),
          T(
            "作者小悠說：「我把垃圾藏在耀眼燈光下，想問誰在清潔城市。」AI 草擬圖說稱作品「讚美完全無垃圾的城市」。展覽要求保留作者意思並交代協助，應選哪項？",
            "作者小悠说：“我把垃圾藏在耀眼灯光下，想问谁在清洁城市。”AI 草拟图说称作品“赞美完全无垃圾的城市”。展览要求保留作者意思并说明协助，应选哪项？",
            "Artist Yau says, “I hid litter beneath bright lights to ask who cleans the city.” An AI caption calls it “praise for a spotless city.” The exhibition requires faithful meaning and disclosure of assistance. Which caption fits?",
          ),
          [
            O(
              T(
                "「燈光與垃圾的對照追問清潔責任。」作品：小悠；圖說經 AI 草擬及作者修訂。",
                "“灯光与垃圾的对照追问清洁责任。”作品：小悠；图说经 AI 草拟及作者修订。",
                "“Contrasting lights and litter questions responsibility for cleaning.” Art: Yau; caption drafted with AI and revised by the artist.",
              ),
              true,
              T(
                "這回應作者說明，也清楚分開作品作者和圖說協助。",
                "这回应作者说明，也清楚区分作品作者和图说协助。",
                "This reflects the artist’s stated intention and separates artwork authorship from caption assistance.",
              ),
            ),
            O(
              T(
                "保留「完全無垃圾」，刪除作者名字。",
                "保留“完全无垃圾”，删除作者名字。",
                "Keep “spotless city” and remove the artist’s name.",
              ),
              false,
              T(
                "它仍改變作品意思，亦沒有交代作者及協助來源。",
                "它仍改变作品意思，也没有说明作者及协助来源。",
                "That still changes the meaning and omits authorship and assistance.",
              ),
            ),
            O(
              T(
                "只寫「AI 原創作品」，不再查作者說明。",
                "只写“AI 原创作品”，不再查作者说明。",
                "Label it “an original AI artwork” without checking the artist’s statement.",
              ),
              false,
              T(
                "AI 只協助草擬圖說，不是本例作品的作者。",
                "AI 只协助草拟图说，不是本例作品的作者。",
                "AI helped draft the caption; it did not author the artwork in this example.",
              ),
            ),
          ],
          T(
            "圖說應核對作品語境，並準確說明創作者與協助者的角色。",
            "图说应核对作品语境，并准确说明创作者与协助者的角色。",
            "Check an artwork’s context and accurately distinguish creators from contributors.",
          ),
        ),
      ],
    },
    {
      id: "music",
      location: "music",
      floor: 3,
      title: T("音樂室", "音乐室", "Music room"),
      subject: T("音樂", "音乐", "Music"),
      npcName: T("吳老師", "吴老师", "Teacher Ng"),
      npcRole: T("音樂老師", "音乐老师", "Music teacher"),
      description: T(
        "計算拍子、速度與樂句時間，並辨認創作貢獻。音樂作業情境屬虛構。",
        "计算节拍、速度与乐句时间，并辨认创作贡献。音乐作业情境属虚构。",
        "Calculate beats, tempo and phrase duration, then identify creative contributions. Assignment scenarios are fictional.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：填滿四拍",
            "基础：填满四拍",
            "Foundation: complete four beats",
          ),
          T(
            "在 4／4 拍中，四分音符算一拍，二分音符算兩拍。以下哪組音符剛好填滿一小節？",
            "在 4／4 拍中，四分音符算一拍，二分音符算两拍。以下哪组音符刚好填满一小节？",
            "In 4/4, a quarter note lasts one beat and a half note two. Which group fills exactly one bar?",
          ),
          [
            O(
              T(
                "一個四分音符＋一個二分音符。",
                "一个四分音符＋一个二分音符。",
                "One quarter note plus one half note.",
              ),
              false,
              T(
                "1＋2＝3 拍，還欠一拍。",
                "1＋2＝3 拍，还缺一拍。",
                "1 + 2 = 3 beats, leaving one beat unfilled.",
              ),
            ),
            O(
              T("兩個二分音符。", "两个二分音符。", "Two half notes."),
              true,
              T(
                "2＋2＝4 拍，剛好是一小節。",
                "2＋2＝4 拍，刚好是一小节。",
                "2 + 2 = 4 beats, exactly one bar.",
              ),
            ),
            O(
              T("三個四分音符。", "三个四分音符。", "Three quarter notes."),
              false,
              T(
                "1＋1＋1＝3 拍，不足四拍。",
                "1＋1＋1＝3 拍，不足四拍。",
                "1 + 1 + 1 = 3, not four beats.",
              ),
            ),
          ],
          T(
            "先按拍號確定每小節拍數，再加總音符時值。",
            "先按拍号确定每小节拍数，再加总音符时值。",
            "Use the time signature to establish beats per bar, then add note values.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：樂句有多長？",
            "应用：乐句有多长？",
            "Application: how long is the phrase?",
          ),
          T(
            "一段 4／4 拍樂句有 8 小節，速度為每分鐘 96 個四分音符拍，沒有額外停頓。演奏需要多少秒？",
            "一段 4／4 拍乐句有 8 小节，速度为每分钟 96 个四分音符拍，没有额外停顿。演奏需要多少秒？",
            "A phrase has eight bars of 4/4 at 96 quarter-note beats per minute, with no extra pauses. How many seconds does it take?",
          ),
          [
            O(
              T("20 秒", "20 秒", "20 seconds"),
              true,
              T(
                "8×4＝32 拍；32÷96 分鐘＝三分之一分鐘＝20 秒。",
                "8×4＝32 拍；32÷96 分钟＝三分之一分钟＝20 秒。",
                "8 × 4 = 32 beats; 32 ÷ 96 minutes is one-third of a minute, or 20 seconds.",
              ),
            ),
            O(
              T("32 秒", "32 秒", "32 seconds"),
              false,
              T(
                "32 是拍數；每分鐘 96 拍並不是每秒一拍。",
                "32 是拍数；每分钟 96 拍并不是每秒一拍。",
                "32 is the beat count; 96 beats per minute is not one beat per second.",
              ),
            ),
            O(
              T("40 秒", "40 秒", "40 seconds"),
              false,
              T(
                "在這個速度，32 拍需 20 秒；40 秒會包含 64 拍。",
                "在这个速度，32 拍需 20 秒；40 秒会包含 64 拍。",
                "At this tempo, 32 beats take 20 seconds; 40 seconds would contain 64 beats.",
              ),
            ),
          ],
          T(
            "樂句時間＝總拍數÷每分鐘拍數，再換成秒。",
            "乐句时间＝总拍数÷每分钟拍数，再换成秒。",
            "Phrase duration equals total beats divided by beats per minute, then converted to seconds.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：誰創作了甚麼？",
            "挑战：谁创作了什么？",
            "Challenge: who contributed what?",
          ),
          T(
            "吳老師准許你使用其旋律；你創作鼓節奏，並選取及修訂 AI 建議的部分和弦。作業要求記錄所有貢獻。哪個說明最準確？",
            "吴老师允许你使用其旋律；你创作鼓节奏，并选取及修订 AI 建议的部分和弦。作业要求记录所有贡献。哪个说明最准确？",
            "Teacher Ng permits use of their melody. You compose the drum rhythm and select and revise some AI-suggested chords. The assignment asks you to record all contributions. Which credit is accurate?",
          ),
          [
            O(
              T(
                "「全部由我獨自創作，沒有其他協助。」",
                "“全部由我独自创作，没有其他协助。”",
                "“Entirely composed by me, without any assistance.”",
              ),
              false,
              T(
                "這漏掉老師的旋律及 AI 的和弦建議。",
                "这遗漏了老师的旋律及 AI 的和弦建议。",
                "This omits the teacher’s melody and AI chord suggestions.",
              ),
            ),
            O(
              T(
                "「全部由 AI 創作。」",
                "“全部由 AI 创作。”",
                "“Entirely composed by AI.”",
              ),
              false,
              T(
                "AI 沒有創作本例的旋律及鼓節奏，不能把所有貢獻都歸給它。",
                "AI 没有创作本例的旋律及鼓节奏，不能把所有贡献都归给它。",
                "AI did not create the melody or drum rhythm in this example.",
              ),
            ),
            O(
              T(
                "「旋律：吳老師，經准許使用；鼓節奏：我；部分和弦建議：AI，由我選擇及修訂。」",
                "“旋律：吴老师，经允许使用；鼓节奏：我；部分和弦建议：AI，由我选择及修订。”",
                "“Melody: Teacher Ng, used with permission; drum rhythm: me; some chord suggestions: AI, selected and revised by me.”",
              ),
              true,
              T(
                "這把不同創作部分與來源分開，也具體交代人類的選擇及修訂。",
                "这区分不同创作部分与来源，也具体说明人类的选择及修订。",
                "This separates contributions and makes human selection and revision explicit.",
              ),
            ),
          ],
          T(
            "創作聲明要具體說明各部分來源，不能把協作簡化成「全由某一方創作」。",
            "创作声明要具体说明各部分来源，不能把协作简化成“全由某一方创作”。",
            "Name the sources of different creative elements instead of crediting an entire collaboration to one contributor.",
          ),
        ),
      ],
    },
    {
      id: "library",
      location: "library",
      floor: 4,
      title: T("圖書館", "图书馆", "Library"),
      subject: T("跨學科探究", "跨学科探究", "Integrated learning"),
      npcName: T("梁老師", "梁老师", "Teacher Leung"),
      npcRole: T("圖書館老師", "图书馆老师", "Teacher librarian"),
      description: T(
        "練習查找來源、忠實改述及評估研究限制。本室書目與研究摘錄均為虛構示例，不能當作真實文獻引用。",
        "练习查找来源、忠实转述及评估研究限制。本室书目与研究摘录均为虚构示例，不能当作真实文献引用。",
        "Practise finding sources, faithful paraphrasing and research limits. Bibliographies and extracts here are fictional examples, not real references to cite.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：書目真的存在嗎？",
            "基础：书目真的存在吗？",
            "Foundation: does the reference exist?",
          ),
          T(
            "AI 提供一篇看似完整的文章書目，但你未找到原文。引用前最需要做甚麼？",
            "AI 提供一篇看似完整的文章书目，但你未找到原文。引用前最需要做什么？",
            "AI supplies a detailed-looking article reference, but you have not found the article. What should you do before citing it?",
          ),
          [
            O(
              T(
                "在圖書館目錄或出版者網站核對作者、題名、日期，並查看原文。",
                "在图书馆目录或出版者网站核对作者、题名、日期，并查看原文。",
                "Check author, title and date through a library catalogue or publisher, and inspect the source.",
              ),
              true,
              T(
                "書目格式完整不代表文獻存在；查找和閱讀才能核對來源及內容。",
                "书目格式完整不代表文献存在；查找和阅读才能核对来源及内容。",
                "Complete formatting does not prove existence. Locating and reading the source checks both identity and content.",
              ),
            ),
            O(
              T(
                "題名夠專業便直接引用。",
                "题名够专业就直接引用。",
                "Cite it immediately because the title sounds scholarly.",
              ),
              false,
              T(
                "專業語氣可能是生成出來的，不能代替實際來源。",
                "专业语气可能是生成出来的，不能代替实际来源。",
                "Scholarly wording may be generated; it is not a substitute for an actual source.",
              ),
            ),
            O(
              T(
                "請同一個 AI 重複一次，兩次相同就算核實。",
                "请同一个 AI 重复一次，两次相同就算核实。",
                "Ask the same AI again; matching answers count as verification.",
              ),
              false,
              T(
                "同一錯誤可以重複出現；需要獨立可查的來源。",
                "同一错误可能重复出现；需要独立可查的来源。",
                "The same error can be repeated. Verification needs an independently checkable source.",
              ),
            ),
          ],
          T(
            "引用前先確認來源存在，再確認它真的支持所寫的說法。",
            "引用前先确认来源存在，再确认它真的支持所写的说法。",
            "Before citing, verify that a source exists and actually supports the claim.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：忠實改述",
            "应用：忠实转述",
            "Application: faithful paraphrasing",
          ),
          T(
            "原文：「20 位參加者中，10 位表示喜歡這項活動；研究沒有測量成績。」哪個改述忠於原文？",
            "原文：“20 位参与者中，10 位表示喜欢这项活动；研究没有测量成绩。”哪个转述忠于原文？",
            "Source: “Of 20 participants, 10 said they enjoyed the activity; achievement was not measured.” Which paraphrase is faithful?",
          ),
          [
            O(
              T(
                "所有參加者都喜歡活動，成績也改善了。",
                "所有参与者都喜欢活动，成绩也改善了。",
                "Every participant enjoyed it and improved their achievement.",
              ),
              false,
              T(
                "原文只說一半喜歡，也沒有測量成績。",
                "原文只说一半喜欢，也没有测量成绩。",
                "Only half reported enjoyment, and achievement was not measured.",
              ),
            ),
            O(
              T(
                "沒有人喜歡活動，所以活動一定無效。",
                "没有人喜欢活动，所以活动一定无效。",
                "Nobody enjoyed it, so the activity definitely failed.",
              ),
              false,
              T(
                "10 人表示喜歡；喜歡與否亦不能單獨決定學習成效。",
                "10 人表示喜欢；喜欢与否也不能单独决定学习效果。",
                "Ten reported enjoyment, and preference alone does not determine learning effectiveness.",
              ),
            ),
            O(
              T(
                "半數參加者表示喜歡；這份資料不能說明成績是否改變。",
                "半数参与者表示喜欢；这份资料不能说明成绩是否改变。",
                "Half reported enjoyment; the data do not show whether achievement changed.",
              ),
              true,
              T(
                "10／20 是一半，後半句也保留了原文未測量成績的限制。",
                "10／20 是一半，后半句也保留了原文未测量成绩的限制。",
                "10/20 is half, and the second clause preserves the limit on what was measured.",
              ),
            ),
          ],
          T(
            "改述可以換用字句，但不能改變數量、結果或限制。",
            "转述可以更换字句，但不能改变数量、结果或限制。",
            "A paraphrase may change wording, but not quantities, findings or limitations.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：研究能證明甚麼？",
            "挑战：研究能证明什么？",
            "Challenge: what can the study establish?",
          ),
          T(
            "模擬報告：12 位自願參加者自述使用應用程式後練習較多；沒有對照組，也沒有測試成績。哪個結論有支持？",
            "模拟报告：12 位自愿参与者自述使用应用程序后练习更多；没有对照组，也没有测试成绩。哪个结论有支持？",
            "A simulated report says 12 volunteers reported practising more after using an app. It has no comparison group or achievement test. Which conclusion is supported?",
          ),
          [
            O(
              T(
                "這個應用程式已證明提升所有中學生的成績。",
                "这个应用程序已证明提升所有中学生的成绩。",
                "The app is proven to improve achievement for all secondary students.",
              ),
              false,
              T(
                "樣本小且自選，沒有成績測量，也沒有對照；不能作這種因果及普遍推論。",
                "样本小且自选，没有成绩测量，也没有对照；不能作这种因果及普遍推断。",
                "A small self-selected sample without achievement measures or a comparison cannot establish that broad causal claim.",
              ),
            ),
            O(
              T(
                "這 12 人自述練習增加，但未能確定由應用程式造成或能否推廣。",
                "这 12 人自述练习增加，但不能确定由应用程序造成或能否推广。",
                "These 12 reported more practice, but causation and generalisability remain uncertain.",
              ),
              true,
              T(
                "這保留了實際紀錄，也沒有把自述、時間先後和因果混為一談。",
                "这保留了实际记录，也没有把自述、时间先后和因果混为一谈。",
                "This retains the observation without confusing self-report, sequence and causation.",
              ),
            ),
            O(
              T(
                "沒有對照組，所以這 12 人一定沒有增加練習。",
                "没有对照组，所以这 12 人一定没有增加练习。",
                "Without a comparison group, these 12 definitely did not practise more.",
              ),
              false,
              T(
                "研究限制令某些結論不確定，不代表可以反過來斷言觀察是假的。",
                "研究限制让某些结论不确定，不代表可以反过来断言观察是假的。",
                "A limitation creates uncertainty; it does not justify declaring the opposite result true.",
              ),
            ),
          ],
          T(
            "閱讀研究要分清樣本、測量方式、對照及可推論範圍。",
            "阅读研究要区分样本、测量方式、对照及可推断范围。",
            "Distinguish sample, measurement, comparison and the scope of a study’s conclusions.",
          ),
        ),
      ],
    },
    {
      id: "rooftop",
      location: "rooftop",
      floor: 4,
      title: T("天台花園", "天台花园", "Rooftop garden"),
      subject: T(
        "跨學科環境探究",
        "跨学科环境探究",
        "Integrated environmental learning",
      ),
      npcName: T("楊老師", "杨老师", "Teacher Yeung"),
      npcRole: T(
        "環境探究老師",
        "环境探究老师",
        "Environmental learning teacher",
      ),
      description: T(
        "以物種紀錄、觀察方法及熱環境資料進行探究。A、B、C 是模擬物種代號，所有數據均屬虛構。",
        "以物种记录、观察方法及热环境资料进行探究。A、B、C 是模拟物种代号，所有数据均属虚构。",
        "Investigate species records, observation methods and heat conditions. A, B and C label simulated species; all data are fictional.",
      ),
      levels: [
        L(
          "foundation",
          1,
          T(
            "基礎：物種數目與個體數目",
            "基础：物种数量与个体数量",
            "Foundation: species and individuals",
          ),
          T(
            "甲花圃：物種 A 有 8 隻、B 有 1 隻、C 有 1 隻。乙花圃：A 有 5 隻、B 有 5 隻。哪句正確描述「物種豐富度」（物種數目）？",
            "甲花圃：物种 A 有 8 只、B 有 1 只、C 有 1 只。乙花圃：A 有 5 只、B 有 5 只。哪句正确描述“物种丰富度”（物种数量）？",
            "Plot X has 8 individuals of species A, 1 of B and 1 of C. Plot Y has 5 of A and 5 of B. Which statement correctly describes species richness, the number of species?",
          ),
          [
            O(
              T(
                "兩者一樣，因為都共有 10 隻。",
                "两者一样，因为都共有 10 只。",
                "They are equal because both have 10 individuals.",
              ),
              false,
              T(
                "個體總數相同，不代表物種數目相同。",
                "个体总数相同，不代表物种数量相同。",
                "Equal totals of individuals do not mean equal numbers of species.",
              ),
            ),
            O(
              T(
                "乙較高，因為兩種數目較平均。",
                "乙较高，因为两种数量较平均。",
                "Y is richer because its two species have more even counts.",
              ),
              false,
              T(
                "分布是否平均是另一項特徵；本題只問有多少個物種。",
                "分布是否平均是另一项特征；本题只问有多少个物种。",
                "Evenness is a different feature; this question asks how many species are present.",
              ),
            ),
            O(
              T(
                "甲較高：甲有 3 種，乙有 2 種。",
                "甲较高：甲有 3 种，乙有 2 种。",
                "X is richer: it has 3 species while Y has 2.",
              ),
              true,
              T(
                "物種豐富度計算不同物種，不是把所有個體直接相加。",
                "物种丰富度计算不同物种，不是把所有个体直接相加。",
                "Species richness counts distinct species rather than adding all individuals.",
              ),
            ),
          ],
          T(
            "物種豐富度、個體總數和分布均勻程度是不同概念。",
            "物种丰富度、个体总数和分布均匀程度是不同概念。",
            "Species richness, total abundance and evenness are different concepts.",
          ),
        ),
        L(
          "application",
          2,
          T(
            "應用：讓觀察可以比較",
            "应用：让观察可以比较",
            "Application: make observations comparable",
          ),
          T(
            "甲組在大花圃觀察 15 分鐘，見到 12 隻昆蟲；乙組在小花圃觀察 5 分鐘，見到 8 隻。若想比較兩處的昆蟲情況，下次最好怎樣安排？",
            "甲组在大花圃观察 15 分钟，见到 12 只昆虫；乙组在小花圃观察 5 分钟，见到 8 只。若想比较两处的昆虫情况，下次最好怎样安排？",
            "A observes a large plot for 15 minutes and sees 12 insects. B observes a small plot for 5 minutes and sees 8. What would improve the next comparison?",
          ),
          [
            O(
              T(
                "使用相同面積、時長和觀察方法，在相近時段及天氣下重複記錄。",
                "使用相同面积、时长和观察方法，在相近时段及天气下重复记录。",
                "Use equal areas, durations and methods, repeating observations at comparable times and weather conditions.",
              ),
              true,
              T(
                "觀察投入及環境較一致，能減少方法差異造成的影響。",
                "观察投入及环境较一致，能减少方法差异造成的影响。",
                "More consistent effort and conditions reduce differences caused by the observation method.",
              ),
            ),
            O(
              T(
                "直接以 12 大於 8 判定甲處昆蟲較多。",
                "直接以 12 大于 8 判定甲处昆虫更多。",
                "Conclude A has more insects because 12 is greater than 8.",
              ),
              false,
              T(
                "甲的面積及觀察時間都較大，原始總數不能直接公平比較。",
                "甲的面积及观察时间都更大，原始总数不能直接公平比较。",
                "A had a larger area and longer observation, so raw counts are not directly comparable.",
              ),
            ),
            O(
              T(
                "只記錄較漂亮的昆蟲，讓紀錄更整齊。",
                "只记录较漂亮的昆虫，让记录更整齐。",
                "Record only attractive insects to keep the list tidy.",
              ),
              false,
              T(
                "依外觀選擇會造成取樣偏差，漏掉其他觀察對象。",
                "按外观选择会造成抽样偏差，漏掉其他观察对象。",
                "Selecting by appearance biases the sample and excludes other observations.",
              ),
            ),
          ],
          T(
            "比較野外紀錄，先檢查面積、時間、方法及環境條件。",
            "比较野外记录，先检查面积、时间、方法及环境条件。",
            "Before comparing field records, check area, time, method and environmental conditions.",
          ),
        ),
        L(
          "challenge",
          3,
          T(
            "挑戰：熱從哪裏來？",
            "挑战：热从哪里来？",
            "Challenge: what explains the heat?",
          ),
          T(
            "同一時間，陰影下草地表面是 30°C，陽光下混凝土表面是 35°C。學生說「5°C 差距全由地面材料造成」。哪個評估最準確？",
            "同一时间，阴影下草地表面是 30°C，阳光下混凝土表面是 35°C。学生说“5°C 差距全由地面材料造成”。哪个评估最准确？",
            "At the same time, shaded grass has a surface temperature of 30°C and sunlit concrete 35°C. A student says the entire 5°C difference is caused by material. Which evaluation is sound?",
          ),
          [
            O(
              T(
                "正確，因為同一時間測量便控制了所有條件。",
                "正确，因为同一时间测量就控制了所有条件。",
                "Correct: measuring at the same time controls every condition.",
              ),
              false,
              T(
                "時間相同，但日照和材料同時不同，仍有混雜因素。",
                "时间相同，但日照和材料同时不同，仍有混杂因素。",
                "Time is matched, but sunlight and material both differ, leaving a confounding factor.",
              ),
            ),
            O(
              T(
                "未能分開材料與日照影響；應比較相近日照下的兩種表面並重複量度。",
                "不能分开材料与日照影响；应比较相近日照下的两种表面并重复测量。",
                "Material and sunlight effects are not separated; compare surfaces under similar sunlight and repeat measurements.",
              ),
              true,
              T(
                "先控制日照等相關條件，再使用相同方法，才能較清楚研究材料差異。",
                "先控制日照等相关条件，再使用相同方法，才能更清楚研究材料差异。",
                "Matching sunlight and other relevant conditions with a consistent method better isolates material differences.",
              ),
            ),
            O(
              T(
                "只保留 35°C 的紀錄，便能證明混凝土較熱。",
                "只保留 35°C 的记录，就能证明混凝土更热。",
                "Keep only the 35°C reading to prove concrete is hotter.",
              ),
              false,
              T(
                "刪除比較資料不能排除混雜因素，反而減少可查證據。",
                "删除比较数据不能排除混杂因素，反而减少可查证据。",
                "Removing comparison data does not remove confounding; it reduces the available evidence.",
              ),
            ),
          ],
          T(
            "兩項條件同時改變時，不要把全部差異歸因於其中一項。",
            "两项条件同时改变时，不要把全部差异归因于其中一项。",
            "When two conditions change together, do not attribute the entire difference to only one.",
          ),
        ),
      ],
    },
  ];
})();
