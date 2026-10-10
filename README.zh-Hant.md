# 我的 AI 校園生活

[English](README.md) · [操作指南（English）](USER-GUIDE.md)

**My AI Campus Life** 是為香港中學生設計的校園探索遊戲，以 **Ethical and Inclusive AI Practices** 為核心，支援 HKU MEd MEDD8934 小組作業。玩家是虛構「明澄書院」的一名新生，選擇中一至中六、A–D 班、學號、姓名與造型，在五層校園與同學及教職員互動。

現行程式採 **Sites / Vinext + Cloudflare D1（紀錄）及 R2（工作紙檔案）** 架構，遊戲前端在 `public/campus/`，提供自由探索及班級模式。**[公開遊戲網址](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site)** 已於 2026 年 10 月 10 日（香港時間）確認可連線；分享連結與可列印 QR code 見下方。本文說明目前來源版本；公開版本的修訂及驗證範圍另以各次發布紀錄為準。

## 學習內容與操作

- 五層、18 個地點與 13 個學習空間，包含中文、英文、數學、科學／化學、地理、資訊科技、歷史、視覺藝術、音樂、體育、公民情境，以及圖書館和天台跨科活動。
- **234 道三語起始題**：六個年級 × 13 個空間 × 三道題。每位玩家預設看到所選年級的 39 題。234 題已按教育局及香港考評局參考資料逐科重寫，完成三語生成、結構／數學檢查及交叉覆核；這不是完整香港課程或官方公開試題庫，詳見[課程對照](docs/CURRICULUM-ALIGNMENT.md)。
- 四項 AI 校園情境：口音評分、寫作私隱、翻譯與文化聲音、共融參與。流程是對話、閱讀證據、選擇、後果、修正，再完成遷移題及反思。
- 介面可切換繁體中文（`zh`）、簡體中文（`cn`）及英文（`en`）；英文學習文本可保留目標語言。
- 男生及女生各四款原創校服風格、兩款髮型、三種膚色，共 48 個可選外觀組合；不是 48 套獨立繪製圖集。外觀不改變題目或得分規則。
- 統一奶油白、深青綠與金色像素介面；課室名稱牌固定在門上，地圖、對話、題目及教師面板沿用同一套視覺風格。

使用 WASD／四個方向鍵移動，E 與人物對話，Space／Enter 進入房間；點擊人物、門或樓梯會走近並互動。地圖由上而下排列第 5 層（4F）至第 1 層地下（G）。「案件／學科」只顯示星數及完成進度，不能直接跳題；答題須到對應人物或房間。造型、題目、對話與手帳都使用頁面內面板，Escape 關閉面板。

「新開始」先選擇「學生／教師」：學生進入新角色設定；教師登入後直接開啟獨立工作台，不必建立學生角色或進入校園。開啟身份選擇或教師工作台不會重設學生存檔；只有選擇新學生才開始替換學生進度的流程。不再出現報告下載提示；「繼續遊戲」直接回到已儲存的校園。學生學習報告下載已移除，教師 Excel 成績及工作紙 PDF 列印／下載仍保留。主選單設定按鈕暫時停用；右上角先是 A 語言控制，旁邊是音符音量控制。進入遊戲後可用畫面內設定，右上角「打印」則開啟目前樓層的學生工作紙。

所有遊戲中的 AI 輸出及後果均為人工編寫的教學模擬，沒有接駁生成式 AI 作答服務。**遊戲本身不能代替 MEDD8934 要求的真實 AI 工具現場示範**；教師指引另備虛構文本與示範提示。

20 位 NPC 使用不重複的名字，姓名只在對話框顯示。學生 NPC 依玩家所選校服系列換裝，保留各自性別、髮型、臉貌與體型；角色身高用等比例縮放呈現，沒有單向拉長或壓扁圖像。NPC 步速為 150、主角為 170 世界單位／秒，保留起停、短暫停留，步伐按實際移動距離前進。對話使用獨立高細節立繪，畫布解析度配合實際顯示尺寸。

## 自由探索與班級模式

自由探索不需要登入；角色、進度和反思留在同一瀏覽器，沿用舊存檔的讀取遷移。現行儲存鍵為 `my-ai-campus-life-v2`。自由探索分數不會匯入班級正式作答紀錄。

班級模式由教師提供班級代碼。學生首次輸入學號及姓名後取得一次顯示的恢復碼；換裝置時使用班級代碼、學號及恢復碼繼續。學生不需要 ChatGPT 帳戶。恢復碼代表對紀錄的持有權，並不是核實真實學生身份的學校 SSO。遺失時由授權教師重設；重設亦會撤銷舊學生登入。共用裝置完成後請登出。

班級模式把姓名、班級、學號、作答及必要進度存到 D1。造型、語言、位置、情境閱讀進度和反思亦可跨裝置同步。學生 API 只提供自己的紀錄；教師只可管理自己擁有的班級。版本衝突會提示重新載入，不會靜默覆蓋另一裝置。答案由伺服器評分，重試使用 idempotency key，伺服器不接受客戶端提供的分數。

**星數與學科得分不同。** 首次答對可得一次星數；答錯後再答對仍可取得星數。班級學科分數採每題首次作答，重試不改寫首次分數。尚未作答完成的學科會標示未完成，而非當成零分。預設活動共 78 顆學科星 + 20 顆情境星 + 5 顆遷移星 = **103 星**，100 星可離校；教師調整題目後上限會改變，離校門檻取 100 與該活動總星數的較小值。

這些紀錄用於形成性回饋，並非道德評級或安全的防作弊考試。公開練習題庫包含學習用答案；伺服器計分不等於能證明學生獨立作答。評量應連同學生的證據解釋、修正及反思。

## 教師工作台與 Excel

教師從主選單「新開始 → 教師」登入，解鎖後先選擇 13 個學習學科之一或「AI 倫理與共融」，再開啟題目、工作紙或成績功能。「更換學科」返回選科，切換工具時保留年級、班別與活動篩選。遊戲內「設定 → 教師工作台」入口亦保留。正式環境須先經 Sites 的 ChatGPT 身份登入、符合 `TEACHER_EMAILS` 擁有者名單，再輸入伺服器驗證的教師 PIN。按目前使用者設定，PIN 為 **1234**，由 `TEACHER_PIN` 環境設定提供；**PIN 不是獨立帳戶認證，也不能代替擁有者身份檢查**。PIN 錯誤有速率限制，解鎖有效 30 分鐘。

工作台可明確建立一班或 24 班（S1–S6 × A–D），查看／複製班級代碼，新增、修改、發佈或封存學科題目，並為班級開始新活動。每次活動凍結所用題目版本；後續改題不會重算舊活動或改變它的分母。「AI 倫理與共融」可檢視核心情境、遷移題及成績，但不可編輯核心題目；PDF 上傳供其餘 13 個學科使用。可查看目前或歷史活動；「下載本科 Excel」只匯出所選學科，「下載全部學科」則匯出 14 個成績類別的獨立工作表。四個欄位固定為：

| 班別 | 學號 | 學生姓名 | 學科得分 |
|---|---|---|---|

匯出由已授權教師主動下載，不會公開列出學生名單。

學生從右上角 HUD 的「打印」開啟工作紙，校園場景內不設實體打印機。教師在所選學科的「工作紙」頁籤指定年級，上傳繁中或英文 PDF，亦可兩種一併提供，每份上限 5 MiB。學生只會看到自己班級所屬年級、該樓層科目的授權版本；選擇版本後預覽，按「列印 PDF」才請求閱讀器／瀏覽器列印。保留「開啟 PDF」及「下載 PDF」作備用，不會自動送印。詳見[工作紙指南](docs/WORKSHEETS.md)。

## 音樂與語音

`campus-audio.js` 提供獨立語音／音樂音量、靜音、對白重播與試聽；需使用者手勢解鎖播放。對白開始時音樂降低，頁面隱藏時暫停，關閉時清理音效節點及計時器。

對白目前由 **Web Speech 在播放當下合成**，不是預錄角色音檔。**程式已修正聲線選擇：先限制繁中粵語、簡中普通話或英語，再配對角色性別，包含 `boy/girl` 資料的正確轉換。** 沒有已知匹配聲線時，自動朗讀會停止並顯示不可用，不改用相反性別聲音。英文數字只在朗讀稿轉為英文詞句，畫面文字不變，每句完整播放；Web Speech 語速及音高回復自然預設 `1/1`，並已測試快速切換語言、佇列及重播。**實際發音與流暢度仍需在目標裝置試聽確認。** 這部 Mac 的原生聲線唯讀檢查沒有找到已知男聲粵語或普通話，因此相關男角對話可能保持靜音；瀏覽器可提供不同聲線清單，亦不保證每位角色有獨立聲音。

目前已選擇**免費網頁手動製作 MP3：以 TTSFree 為主，TTSMaker 作人工操作備用**，流程見[免費配音工具指南](docs/FREE-VOICE-TOOLS.md)。目前方案不需要 Google Cloud 專案、帳單設定、API 金鑰或自行架設模型；先前文件保留作歷史備選研究。最新試音基準為 **TTSFree Default（原始 rate `0`、pitch `0`）**，以自然完整句子的節奏處理；先前 `100/100` 及 `70/100` 調整值已被取代，不能直接當作 Web Speech 倍速。已下載粵語 HiuMaan、內地普通話 Xiaoyi 及英式英語 Sonia 三段 Default 試音，每段約 9–10 秒，仍待試聽確認。第四款台灣普通話 YunJhe 兩次嘗試均返回零位元組空檔，不算有效樣本；三段下載亦不代表已完成全角色配音。**預錄 MP3 尚未接入遊戲；目前使用上述已修正選聲及朗讀稿處理的 Web Speech。**

這三段試音以虛構文本在免費 Guest 介面製作，沒有建立帳戶、使用 API 金鑰或付款：[粵語 HiuMaan — 約 10.0 秒](design/voice-auditions-free/zh-hk-hiumaan-default.mp3) · [普通話 Xiaoyi — 約 9.3 秒](design/voice-auditions-free/zh-cn-xiaoyi-default.mp3) · [英語 Sonia — 約 9.6 秒](design/voice-auditions-free/en-gb-sonia-default.mp3)。[試音文本、設定及核對紀錄](design/voice-auditions-free/README.md)。

**教師新增或修改題目後，可能沒有相符音檔，或只有舊版本；一律以最新書面題目、選項及回饋為準。** 每個更新版本需另行手動生成 MP3、試聽覆核及接入，儲存或發布題目不會自動更新錄音。未來接入音檔時須保留文字，且不可播放不同題目版本的舊錄音。TTSFree 目前只列出三款粵語聲線，不能承諾二十位角色各有獨立粵語聲音；同一角色在同一語言內保持固定聲線。

背景《Greensleeves》使用 [Mutopia 公版旋律](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf)，由本專案新寫的 Web Audio 樂器與伴奏合成，沒有使用 DSE 錄音。完整 [LilyPond 樂譜來源](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly) 與 API 依據亦列於模組註解。語音可用性及實際聽感需要在目標裝置檢查，文字內容始終保留。

## 開發與資料庫

需要 Node.js 22.13+ 及專案依賴。首次安裝用專案的 `npm run install:ci`；已有依賴時直接執行：

```sh
npm run dev
```

使用命令實際顯示的本機網址，首頁會導向 `/campus/index.html`。不要再用 `python -m http.server dist` 測試班級功能；它不能提供身份驗證或 D1 API。

D1 binding 名稱為 `DB`，R2 工作紙儲存 binding 為 `BUCKET`，設定在 `.openai/hosting.json`；schema 在 `db/schema.ts`，遷移在 `drizzle/`。改 schema 後執行 `npm run db:generate`。新的空白本機資料庫可在首次 build 產生 Worker 設定後，依次套用以下三個既有遷移各一次：

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yummy_fat_cobra.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_plain_omega_sentinel.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_lazy_catseye.sql
```

既有資料庫只套用尚未執行的遷移，不要重複執行已套用的 SQL。測試使用隔離的 Miniflare D1/R2，不需要重設正在預覽的班級資料。

正式環境必須設定 `TEACHER_EMAILS` 及 `TEACHER_PIN`，未配置擁有者名單時不授予教師權限。忽略於 Git 的 `.dev.vars` 可設定 `CAMPUS_LOCAL_TEACHER=1` 供本機教師測試；此例外只在非 production 且 loopback host 生效，production build 不會啟用。不要將 `.dev.vars`、憑證、課程 PDF、私人筆記或學生匯出放進 `public/`。

## 程式結構與驗證

| 路徑 | 用途 |
|---|---|
| `app/page.tsx`、`app/api/campus/[...path]/route.ts` | 網站入口、同源 API、平台身份 |
| `lib/campus-*.ts`、`db/schema.ts`、`drizzle/` | 學生／教師權限、版本化題目、活動、計分、D1 schema |
| `data/grade-bank.json`、`scripts/content-authoring/` | 234 題資料及題庫編製來源 |
| `public/campus/app.js`、`campus-cloud.js` | 遊戲狀態、雲端連接與衝突處理 |
| `public/campus/content.js`、`grade-content.js`、`subjects.js` | 四項情境、三語年級題庫、學習空間定義 |
| `public/campus/engine.js`、`characters.js`、`campus-art.js` | 校園場景、共用角色身份、動作、圖集與比例 |
| `public/campus/teacher-ui.js`、`xlsx-export.js` | 教師學科首頁、工作台、Excel 下載 |
| `public/campus/worksheet-ui.js`、`lib/campus-worksheets.ts` | PDF 上傳、授權存取、預覽與手動列印 |
| `public/campus/campus-audio.js` | 即時語音及原創合成音樂 |
| `public/campus/assets/`、`design/production-life/` | 執行資源與製作／裁切紀錄 |

```sh
node tests/backend.test.mjs
node tests/starter-update.test.mjs
node tests/worksheet-backend.test.mjs
node tests/campus-teacher.test.cjs
node tests/backend-client.test.cjs
node tests/campus-integration.test.cjs
node tests/grade-bank.test.cjs
node tests/curriculum-bank.test.cjs
node tests/progression.test.cjs
node tests/campus-audio.test.cjs
node tests/campus-engine.test.cjs
node tests/worksheet-ui.test.cjs
node_modules/.bin/tsc --noEmit
npm run build
```

最新已記錄測試使用正式編製題庫，在隔離的本機 D1/R2 通過 **134 項 assertions/API checks**。另已驗證起始題更新不改動教師自編版本、封存題或已凍結活動；工作紙測試涵蓋檔案上限、授權、Unicode 檔名及可重試的儲存失敗。教師元件測試涵蓋獨立選科入口、學科工作紙、核心題唯讀及單科／全科匯出。整合測試涵蓋首次加入、登入還原、新活動、遺失回應後同鍵重試、四／五選項題及不同教室映射。音效測試使用模擬瀏覽器 API，不能代替實際聽感及裝置驗證。其他測試與視覺結果以各次執行紀錄為準，不宣稱未執行的檢查通過。

以上功能以本機來源版本為準；新修正是否已上線須另看部署驗證。工作紙已做元件及隔離瀏覽器預覽／下載檢查，尚未驗證系統列印視窗或實體列印。

核心 AI 情境可先規劃為 20–30 分鐘，全校園暫估 45–75 分鐘，均未以目標學生量測。學生試行、學習成效、完整無障礙及多裝置稽核仍須分開完成。詳見 [設計與教學指南](DESIGN-AND-TEACHING-GUIDE.md) 及 [資源來源](ASSET-PROVENANCE.md)。

## 發佈

### 公開連結與 QR code

可分享 **[公開遊戲網址](https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site)** 或下方 QR code。請使用根網址，讓接收者前往目前的遊戲入口。2026 年 10 月 10 日（香港時間）以沒有帳戶憑證的新 HTTP 請求檢查，經 `/campus/index.html`、`/campus/` 兩次重新導向後，成功收到遊戲頁面的 **200 OK** 及 `Content-Type: text/html`。

<a href="https://lumen-lab-ai-ethics.tart-vale-4903.chatgpt.site"><img src="docs/assets/public-game-qr.png" width="240" alt="掃描開啟我的 AI 校園生活" /></a>

[高解像 PNG](docs/assets/public-game-qr.png) · [可縮放 SVG](docs/assets/public-game-qr.svg)

QR code 儲存的是完整公開根網址。PNG 為 1960 × 1960 像素、300 dpi；SVG 可供講義、海報及投影片縮放使用。排版或列印時請保留四周淺色邊界。已解碼核對儲存的 PNG 及 SVG 模組幾何，兩者皆指向上述同一網址。

接收者可直接到達遊戲入口，不需要先登入帳戶。最新來源的操作是選擇「新開始 → 學生」進入自由探索流程；班級模式使用教師提供的班級代碼及前述學生恢復流程。教師功能仍需授權身份與 PIN。入口連線檢查不等同於已驗證所有班級操作或每部裝置的語音，正式上課前請按上方清單試用目標裝置。

### 更新部署

更新版本時須部署包含 API、D1 資料庫及 R2 工作紙儲存的完整 Sites 專案，保留既有 project identity；只上傳靜態檔案不能提供跨裝置班級功能。遷移、正式環境變數、擁有者登入與公開學生流程應在部署時驗證，再以另一瀏覽器或裝置確認存取。
