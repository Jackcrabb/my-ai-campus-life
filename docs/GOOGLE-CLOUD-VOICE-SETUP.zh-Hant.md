# Google Cloud 配音設定指南（Mac，歷史備選）

適用於《我的AI校園生活》。資料核對日期：2026 年 10 月 10 日。

**本文件已暫停採用，只保留作可選的歷史研究；不是目前遊戲部署或使用的要求。** 使用者已選擇[免費網頁製作 MP3](FREE-VOICE-TOOLS.md)：以 TTSFree 為主，TTSMaker 作人工操作備用。現在無須建立 Google Cloud 專案、設定帳單、登入 gcloud、提供金鑰或自行架設模型。

**預錄 MP3 尚未接入遊戲；目前 Web Speech 的語種及流暢度問題尚未完全修復。** 教師改題後需另行手動生成及覆核相符版本的 MP3；最新書面題目、選項及回饋為準。本文件沒有啟用帳戶或進行付費合成。

以下步驟只適用於日後明確重新選擇 Google 方案的情況。當時建議先做 **20 位角色 × 粵語、普通話、英語 = 60 段短試音**，核對字數及費用後再決定是否生成；這並非目前製作清單的啟用要求。

## 1. 建立專案

1. 開啟 [Google Cloud Console](https://console.cloud.google.com/)，用你希望管理配音費用的 Google 帳戶登入。
2. 按頂部的專案選單，選 **新增專案 / New project**。
3. 專案名稱填寫 `my-ai-campus-life-voices`。
4. 確認下方的 **專案 ID / Project ID**。它必須全域唯一；名稱已被使用時，可接受 Google 自動加上的字尾。專案 ID 與顯示名稱可能不同。
5. 若個人帳戶顯示「無機構 / No organization」，可使用該選項；學校管理帳戶若不允許建立專案，需要管理員提供權限。
6. 按 **建立 / Create**，完成後在頂部選取這個新專案，記下真正的 Project ID。

後續只需要提供 **Project ID**，不需要提供帳戶密碼、付款資料或金鑰。[Google 官方建立專案說明](https://docs.cloud.google.com/resource-manager/docs/creating-managing-projects)

## 2. 由你本人設定帳單

在 Console 搜尋 **Billing / 帳單**，依畫面建立或選取你的帳單帳戶，並把它連結到剛建立的專案。付款資料直接在 Google 網站輸入。

Cloud Text-to-Speech 要求專案啟用帳單，即使使用量可能落在免費額度內。請先查看畫面上的方案、貨幣、試用條款與付款要求，不要把「有免費額度」理解成任何用量都不會收費。[Google 官方啟用流程](https://docs.cloud.google.com/text-to-speech/docs/get-started)

## 3. 啟用正確的 API

1. 確認頁頂選中 `my-ai-campus-life-voices` 專案。
2. 搜尋 **Cloud Text-to-Speech API**，或進入 **APIs & Services → Library / API 和服務 → 程式庫**。
3. 開啟 Cloud Text-to-Speech API，按 **Enable / 啟用**；服務名稱是 `texttospeech.googleapis.com`。

這是把文字變成配音的服務。此步不需要建立 API key、服務帳戶，亦不需要下載服務帳戶 JSON 私鑰。[官方 API 設定說明](https://docs.cloud.google.com/text-to-speech/docs/get-started)

## 4. 可選：設定小額預算提醒

在 **Billing → Budgets & alerts / 帳單 → 預算和快訊** 建立 **Alerts-only / 僅提醒** 預算，範圍選這個配音專案。例如先設每月 US$5，或帳單貨幣中你接受的小額數字，並在 50%、90%、100% 收到通知。金額由你決定。

**預算提醒不是硬性上限，到達金額不會自動停止收費。** 本次另外用「先估算、限定試音清單、取得單次預算授權」控制生成範圍；不要只依賴電郵提醒。[Google 官方預算說明](https://docs.cloud.google.com/billing/docs/how-to/budgets)

## 5. 在 Mac 安裝官方 gcloud CLI

CLI 是之後讓這部 Mac 安全登入 Google Cloud 的命令列工具；遊戲玩家不需要安裝。

1. 開啟 [Google 官方安裝頁](https://docs.cloud.google.com/sdk/docs/install)，選 **macOS**。
2. 在 Mac 的「關於這台 Mac」確認晶片：Apple M 系列選 **ARM64 / Apple silicon**；Intel 選 **x86_64**。已有 `gcloud` 的話，可先用下方版本指令檢查，無須重裝。
3. 下載對應 `.tar.gz`，解壓縮得到 `google-cloud-sdk` 資料夾，可把它放在自己的使用者資料夾。不要放進遊戲專案或 Git 儲存庫。
4. 開啟「終端機 / Terminal」，在解壓縮資料夾的上一層執行安裝程式。如果資料夾放在使用者資料夾，可執行：

```sh
~/google-cloud-sdk/install.sh
```

讓安裝程式加入 `PATH`。需要 Python 時按官方安裝程式的提示處理；匿名使用統計可自行選擇。完成後開一個新的終端機視窗，檢查：

```sh
gcloud --version
```

若顯示 `command not found`，先重新開終端機，再檢查安裝時是否同意加入 `PATH`。[官方 macOS 安裝步驟](https://docs.cloud.google.com/sdk/docs/install#mac)

## 6. 由你本人登入，再指定專案

在終端機執行：

```sh
gcloud auth login
```

它會開啟 Google 登入頁；由你本人選擇同一個帳戶並完成授權。不要把登入驗證碼或畫面中的憑證貼到聊天。[官方 gcloud auth login 說明](https://docs.cloud.google.com/sdk/gcloud/reference/auth/login)

登入後，把以下 `YOUR_PROJECT_ID` 換成第 1 步記下的實際專案 ID：

```sh
gcloud config set project YOUR_PROJECT_ID
gcloud config get-value project
```

第二行只用來確認目前的專案。之後的配音工具會在本機內部取得短效 access token，並使用 `x-goog-user-project` 明確指定配音專案。**你不需要執行並貼出 `print-access-token` 的結果，也不需要長期服務帳戶私鑰。** 本流程採用 gcloud 使用者登入的 REST 認證，無須另外執行 `gcloud auth application-default login`。[官方 REST 認證與計費專案說明](https://docs.cloud.google.com/docs/authentication/rest)

若收到權限錯誤，先確認登入帳戶、專案選擇、帳單及 API 是否正確。機構帳戶可能需要管理員授予 API 使用權限；不要用分享帳戶密碼來解決。將錯誤訊息中的憑證遮去後，才交給協作者查看。

## 7. 先核對 60 段試音的 dry run

歷史 Google 候選設定在 [voice-cast.json](../data/voice-cast.json)。該提案首輪使用 Google 語速 `1.0`，先比較聲線本身，再按試音結果微調；設計文件內的其他語速仍是候選方向。**此值不等同目前指定的 TTSFree Voice Speed 100%／Speech Pitch 100%，不可互換。** 原 Google 提案的三種語言固定為：

| 遊戲語言 | 配音語言代碼 | 輸出要求 |
|---|---|---|
| 繁體中文 `zh` | `yue-HK` | 香港粵語 |
| 简体中文 `cn` | `cmn-CN` | 普通話 |
| English `en` | `en-GB` | 英語 |

Chirp 3 HD 的公布價格為 **每 100 萬字元 US$30**，價目表另列首 100 萬字元的免費額度；實際適用條件和剩餘額度以帳戶為準。[Google 官方價格](https://cloud.google.com/text-to-speech/pricing)

已在本機執行以下 dry run；它沒有連線、讀取憑證或生成音檔：

```sh
node scripts/generate-voices.mjs --dry-run
```

| 試音量 | 實際台詞字元數 | 未扣免費額度的生成費用估算 |
|---|---|---|
| 20 位角色 × 三種語言，共 60 段 | 5,071 字元 | **US$0.15213** |

費用以目前公布的字元單價估算；未扣帳戶免費額度、不含稅項及其他雲端服務，亦不是 Google 帳單保證。改動台詞或價格後應重新計算。重新生成會再次計入用量。

## 8. 生成範圍與費用控制

目前沒有語音生成費用：尚未連接帳戶，也沒有呼叫合成 API。完成設定不會自動開始生成。只有在你確認生成這 60 段及可接受的費用後，才執行帶有 `--generate`、`--project` 和 `--max-cost-usd` 的指令；工具會先檢查整批估算是否超過授權值，超過就停止。這是本機執行的範圍檢查，**不是帳戶級的硬性停扣款機制**，也無法控制其他程式或使用者的用量。

生成工具有以下限制：

- 沒有 `--generate` 時，只執行本機 dry run。
- 每次提交整句台詞，固定選用該角色及語言的聲線；聲線不存在就停止，不改用另一語種。
- 不自動重試合成請求。網絡失敗可能仍已在供應商端完成並計費，所以不要盲目重新執行。
- 成功音檔及其文字、聲線雜湊會儲存；再次執行時，完整且相符的音檔會跳過。
- 憑證只在本機程序記憶體內使用，不放進網頁、GitHub 或音檔 manifest。
- 輸出放在 `design/voice-auditions/`，不會直接替換公開遊戲配音。

若日後重新採用此方案，需通過試聽並完成另行接入後，遊戲才可播放託管的固定音檔。**學生每次播放不會呼叫 Google TTS**；玩家亦沒有付費生成入口。所有配音完成後，可在 Google Console 的 **APIs & Services → Enabled APIs & services → Cloud Text-to-Speech API → Disable** 停用 API，已下載及託管的音檔仍可播放。停用不會取消已產生的費用，也不影響帳戶內其他服務的費用。[Google 官方停用步驟](https://docs.cloud.google.com/text-to-speech/docs/get-started#disable_the_cloud_text-to-speech_api)

香港粵語目前仍標示 Preview。試音須由人實際聆聽，核對粵語與普通話是否分明、姓名與 AI 詞彙的讀音、20 位角色的區別及句子完整度。通過後才生成完整台詞。[官方語言支援](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd)

## 若日後重新採用 Google 方案

只有明確重新採用 Google 並完成設定後，才需要提供 **Project ID**、設定完成狀態，以及單次生成範圍和預算；未有生成授權，不執行合成。不需要提供密碼、信用卡資料、access token、API key 或 JSON 私鑰。建立專案及登入完成亦不代表音檔已生成。

**目前不需要進行上述 Google 設定。** 請依[免費網頁配音流程](FREE-VOICE-TOOLS.md)手動製作及覆核 MP3；[先前角色配音表](VOICE-CAST.md)保留作創作與技術研究參考。
