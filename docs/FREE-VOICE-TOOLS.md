# 免費網頁配音工具 / Free web voice tools

核實日期：2026-10-10。這是目前的語音製作方向：使用免費網頁工具生成、人工試聽，再下載 MP3。先前的 Google Cloud 設定及自行架設模型研究已暫停；本文件沒有啟用 API、建立帳戶或購買服務。

**已選定 TTSFree 為主要製作工具，TTSMaker 為人工操作備用。** 先製作粵語、普通話及英語各一段試音；下列 Luvvoice 資料只保留作其他工具研究，未列入目前製作流程。官方語言支援及下載授權已查閱，但「流利、自然、適合角色」仍須逐段試聽。**預錄 MP3 尚未接入遊戲。** 現行 Web Speech 已修正語言／角色性別篩選、英文數字朗讀稿及切換佇列；自然語速／音高為 `1/1`，不等同本工具的原始 Default `0/0`。這部 Mac 原生聲線檢查未找到已知男聲粵語或普通話；缺少匹配聲線便停止自動朗讀，不改配女聲。實際聽感仍待目標裝置確認。 本文不聲稱已完成全遊戲配音，也不聲稱有免費二十款獨立粵語聲線。

已下載三段 Default 試音：[粵語 HiuMaan，約 10.0 秒](../resources/design/voice-auditions-free/zh-hk-hiumaan-default.mp3) · [普通話 Xiaoyi，約 9.3 秒](../resources/design/voice-auditions-free/zh-cn-xiaoyi-default.mp3) · [英語 Sonia，約 9.6 秒](../resources/design/voice-auditions-free/en-gb-sonia-default.mp3)。[文本、設定及檔案核對紀錄](../resources/design/voice-auditions-free/README.md)已保存，仍待試聽審核。台灣普通話 YunJhe 兩次返回零位元組空檔，沒有保存或使用。製作只使用虛構文本，沒有帳戶、API 金鑰或付款。

## 1. TTSFree：先做三語試音

- [香港粵語](https://ttsfree.com/text-to-speech/chinese-hong-kong)：官方明列 `zh-HK` 三款聲音，HiuGaai（女）、HiuMaan（女）、WanLung（男）。這是粵語語音選項，而非單純繁體中文介面。
- [普通話](https://ttsfree.com/text-to-speech/chinese-mandarin-simplified)：可選 **Chinese (CN)** 或 **Chinese (TW)** 的普通話聲線；中國大陸或台灣口音均可，須人工確認實際朗讀為普通話。CN 選項例如 Xiaoxiao 或 Yunxi。遊戲的簡體中文介面不限制只能用 CN 聲線，也不能單憑文字繁簡判定朗讀語種。
- [英語](https://ttsfree.com/text-to-speech/english-united-kingdom)：選 English (United Kingdom)，例如 Sonia 或 Ryan。聲線頁包括付費款式，不能把整個目錄當作免費清單。
- [官方價目表](https://ttsfree.com/pricing)：Guest 為 $0，每次最多 500 字元、每日 50 次，可下載 MP3，允許商業用途。Free User 為 $0，但需註冊；每次 2,000 字元、每日 100 次、每月 500,000 字元。本次先用 Guest，不建立帳戶。[首頁](https://ttsfree.com/)明示不需信用卡。
- [使用條款](https://ttsfree.com/terms)允許使用者將有權使用的文字生成音檔，作個人及商業用途；價目表亦表示毋須署名。語言頁說明可將音檔放入網站及手機應用程式。由成人教師製作；條款要求使用者至少 16 歲，未滿 18 歲須監護人同意。

最新製作決定：選用 TTSFree 的 **Default** 語速及音高，網站原始調整值為 **Voice Speed `0` / Speech Pitch `0`**。使用者認為先前的 70% 語速仍太快，故此設定取代先前試驗的 100%／100% 及 70%／100%。這是網站的原始調整值，**不可換算成 Web Speech 的 `rate: 0`／`pitch: 0`，也不以數字單獨保證流暢度**。保存實際聲線、兩個原始設定值及試聽結果；只有完整句子自然清楚才通過人工覆核。

實際步驟：選對語言及免費聲線 → 貼上一整句或短段落 → 將 Voice Speed 及 Speech Pitch 恢復 Default（原始調整值各 `0`），關閉額外背景音樂 → Convert Now → 試聽 → Download MP3。遇到付費提示便換免費聲線，不購買。生成後自行保存檔案，不依靠供應商的臨時連結。

**角色限制：TTSFree 只有三款已核實的粵語目錄聲線，不能滿足二十位角色各一款獨立粵語聲音。** 調高或調低音調不等於新增自然聲線。不同角色可以共用聲線，但**同一角色在同一語言內固定使用一款已覆核的聲線及設定**；跨語言另行配對及試聽，不承諾同名聲線聽起來是同一人。若某段轉用 TTSMaker，須先覆核該角色在該語言的整套配音一致性，不混用不同聲音冒充同一角色。

## 2. TTSMaker：較多粵語選項，需人工使用

[TTSMaker](https://ttsmaker.com/zh-hk)提供 MP3；免費一般額度為每週 20,000 字元，部分標示火焰的聲音不計入每週額度。每次可輸入長度依當時選定聲線而定，不能把某款的上限套用至全部聲線。官方[語言介紹](https://ttsmaker.com/blog/ttsmaker-supports-text-to-speech-in-80-languages/)明確列出 Cantonese、Mandarin 和英語地區變體。

2026-10-10 在實際官方選單觀察到八個粵語項目：`1201`、`887`、`1801`、`1802`、`1803`、`1811`、`1419`、`1420`。這是當日介面觀察，不是固定供應承諾，亦未表示八款音質均已通過試聽。`887` 當時標示不計一般額度；仍有單次長度、驗證碼及服務規則限制。

[版權及商業使用條款](https://ttsmaker.com/copyright_and_commercial_license_terms/zh-hk)明確授予生成音檔的永久、全球、非獨家使用許可，包括修改、複製及分發，並列出遊戲及教育材料等用途；此為使用授權，不應誤稱取得聲音模型版權。[首頁 FAQ](https://ttsmaker.com/)說明署名非必要。輸出下載連結只暫存約 30 分鐘，須及時保存。

實際步驟：選中文及明確標示粵語的聲線 → 輸入完整段落 → 選 MP3 → 由使用者完成網站驗證及轉換 → 試聽、下載。這個免費網頁流程作人工使用；不繞過驗證碼、不以腳本批量呼叫網站內部端點，也不將免費網頁當作遊戲的即時 API。進入免費編輯器沒有要求填付款資料；不啟用 Pro。

**角色限制：八個粵語選項仍少於二十位角色，而且不同網站可能重用相同底層聲線。不可直接把各網站的聲線數目相加。**

## 3. Luvvoice：保留研究，非目前製作流程

[中文語音頁](https://luvvoice.com/en/language/chinese)明確區分普通話、香港粵語及台灣普通話，提供 MP3，並表示基本使用毋須登入。粵語同樣列出 HiuMaan、HiuGaai、WanLung；普通話列出 Xiaoxiao、Yunyang、Yunxi 等。[聲音目錄](https://luvvoice.com/library)另有英語，例如英國的 Libby、Maisie、Ryan、Sonia、Thomas。

[首頁 FAQ](https://luvvoice.com/)現列免費額度為每月 20,000 字元，未登入編輯器顯示每次 3,000 字元；實際可用額度及聲線登入要求以當時介面為準。頁面標題的「No Word Limit」不應解讀成全部免費無限量。免費頁面不要求付款資料；不要啟動付費或自訂聲音功能。

首頁允許將輸出用於商業項目；[使用條款](https://luvvoice.com/terms-of-service)說明使用者擁有其建立的文字及音訊內容，但仍須有權使用輸入材料，並遵守第三方權利。條款列明最低年齡 16 歲。因此由教師生成遊戲配音，不要求中一學生到該網站建立帳戶或提交資料。

實際步驟：貼上對白 → 選 Chinese (Cantonese, Traditional)、Chinese (Mandarin, Simplified) 或 English → Generate → 試聽 → 下載 MP3。它的三款粵語與 TTSFree 同名，**不代表新增三種獨立角色聲音**。

## 為何沒有選 Narakeet 作免費公開遊戲音源

[Narakeet 粵語頁](https://www.narakeet.com/languages/cantonese-text-to-speech/)宣傳大量粵語聲線，亦可免費試用。可是[價目表](https://www.narakeet.com/docs/pricing/)的免費方案是合共 20 次轉換、每段 1 KB 腳本；1 KB 是檔案大小，不是 1,000 個中文字。[授權頁](https://www.narakeet.com/docs/usage-rights-copyright/)把免費輸出限制為個人及評估用途。故可作個人比較試音，不能把它當作已取得公開網站遊戲分發授權的免費方案。

## 本遊戲的實際製作流程

1. 先用三段原創短稿測試，每段保持在 Guest 上限內。粵語稿須採香港口語，不只是將普通話稿轉成繁體字。
2. 先聽完整句子的流暢度，再檢查人名、校名、數學符號、中英混用及句末是否被截斷。合格才建立角色配音表；不要把大量零碎字詞拼接成句子。
3. 保存 MP3 及一份製作記錄：角色、語言、原稿、聲線名稱／ID、語速及音高的網站原始設定值、供應商、生成日期、授權連結、對應題目版本。不要提交學生姓名、學號、成績或班級名冊。
4. 待音檔生成、人工覆核及完成程式接入後，網站才可播放已下載的固定音檔，並保留完整字幕。**目前尚未完成 MP3 接入。** 未來缺少相符語言或版本的音檔時，應顯示文字及清楚狀態，不播放內容已過期的題目配音。
5. 教師新增或修改題目後，可能沒有相符錄音，或只有舊版本；**以最新書面題目、選項及回饋為準**。需要另行手動生成、試聽覆核並上載／接入對應 MP3。儲存或發布題目**不會自動同步錄音**；題目功能與文字仍可正常使用。這是產品限制，已在專案 README、使用指南及限制文件明示。

建議首輪原創試音稿：

| 語言 | 試音稿 |
| --- | --- |
| 香港粵語 | 歡迎嚟到明澄書院。今日我哋一齊學習點樣負責任咁使用人工智能。作決定之前，記得先睇證據，再諗吓會影響邊啲人。 |
| 普通話 | 欢迎来到明澄书院。今天我们一起学习如何负责任地使用人工智能。作出决定之前，请先查看证据，再想一想会影响哪些人。 |
| English | Welcome to Ming Ching College. Today, we will learn how to use artificial intelligence responsibly. Before making a decision, check the evidence and consider who might be affected. |

20 位角色乘以 3 種語言的單句試音是 60 次轉換；以 TTSFree Guest 每日 50 次的公布額度計，理論上至少分兩天，另須預留重做次數。這只是額度計算，不是已取得 60 段合格音檔的承諾。完整對白及題庫會遠多於 60 段。

## English note for contributors

The selected workflow is manually generated, downloaded MP3 files: **TTSFree is primary and TTSMaker is the manual fallback**. Google Cloud setup and self-hosted synthesis are paused; Luvvoice remains research only. No accounts, keys or paid calls are needed for the selected guest workflow. **No prerecorded MP3 dialogue is integrated yet.** The Web Speech code now fixes language/gender selection, English numeral preparation and stale queues, with natural rate/pitch `1/1`. This Mac’s audited native inventory has no known male Cantonese/Mandarin voice; those NPC lines remain unavailable rather than using a female voice. Three Default audition MP3s were downloaded and file-checked; the Taiwan Mandarin attempt failed twice with empty output. Listening approval and full character coverage remain pending. Published catalog support and file checks do not prove final audio quality.

The latest production decision uses TTSFree **Default** speed and pitch, with raw adjustment values **Voice Speed `0` / Speech Pitch `0`**. This supersedes the earlier 100/100 and 70/100 trials after the user found 70% speed too fast. These are site-specific adjustment values, not Web Speech `rate: 0` / `pitch: 0`. Record the actual voice and settings, and judge full-sentence fluency through listening review rather than a numeric label. Mandarin may use **Chinese (CN)** or **Chinese (TW)** after listening review. TTSFree lists only three Cantonese voices, so twenty unique Cantonese voices are not promised. Multiple characters may share a voice; each character keeps one consistent chosen voice and settings within each locale.

Teacher-created or edited questions may have no matching audio or only an outdated recording. Audio updates require separate manual generation, listening review and integration; saving or publishing does not automatically update a recording. The latest written question, options and feedback remain authoritative. Preserve subtitles and record each MP3's text, language, voice, provider, raw speed/pitch settings, generation date and question revision. Do not play a clip for an older revision. Recheck provider terms when producing new assets.
