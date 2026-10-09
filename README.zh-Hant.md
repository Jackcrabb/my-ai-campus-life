# 我的 AI 校園生活

[English](README.md) · [操作指南（English）](USER-GUIDE.md)

**My AI Campus Life** 是為香港中學生設計的校園探索遊戲，以 **Ethical and Inclusive AI Practices** 為核心，支援 HKU MEd MEDD8934 小組作業。玩家是虛構「明澄書院」的一名新生，選擇中一至中六、A–D 班、學號、姓名與造型，在五層校園與同學及教職員互動。

現行程式採 **Sites / Vinext + Cloudflare D1** 架構，遊戲前端在 `public/campus/`。它提供自由探索及班級模式，已不是只能使用本機儲存的靜態網站。公開版本及視覺檢查範圍應以實際部署／QA 紀錄為準；本文件不把本地整合或測試通過當作已公開發佈。

## 學習內容與操作

- 五層、18 個地點與 13 個學習空間，包含中文、英文、數學、科學／化學、地理、資訊科技、歷史、視覺藝術、音樂、體育、公民情境，以及圖書館和天台跨科活動。
- **234 道三語起始題**：六個年級 × 13 個空間 × 三道題。每位玩家預設看到所選年級的 39 題。這是精選起始題庫，不是完整香港課程或公開試題庫。
- 四項 AI 校園情境：口音評分、寫作私隱、翻譯與文化聲音、共融參與。流程是對話、閱讀證據、選擇、後果、修正，再完成遷移題及反思。
- 介面可切換繁體中文（`zh`）、簡體中文（`cn`）及英文（`en`）；英文學習文本可保留目標語言。
- 男生及女生各四款原創校服風格、兩款髮型、三種膚色，共 48 個可選外觀組合；不是 48 套獨立繪製圖集。外觀不改變題目或得分規則。

使用 WASD／四個方向鍵移動，E 與人物對話，Space／Enter 進入房間；點擊人物、門或樓梯會走近並互動。地圖提供直接導覽。造型、題目、對話、教師工作台與手帳都在遊戲畫面內，Escape 關閉面板。主選單提供新開始、繼續遊戲及暫時停用的設定按鈕；右上角先是 A 語言控制，旁邊是音符音量控制。進入遊戲後可用畫面內設定。

所有遊戲中的 AI 輸出及後果均為人工編寫的教學模擬，沒有接駁生成式 AI 作答服務。**遊戲本身不能代替 MEDD8934 要求的真實 AI 工具現場示範**；教師指引另備虛構文本與示範提示。

## 自由探索與班級模式

自由探索不需要登入；角色、進度和反思留在同一瀏覽器，沿用舊存檔的讀取遷移。現行儲存鍵為 `my-ai-campus-life-v2`。自由探索分數不會匯入班級正式作答紀錄。

班級模式由教師提供班級代碼。學生首次輸入學號及姓名後取得一次顯示的恢復碼；換裝置時使用班級代碼、學號及恢復碼繼續。學生不需要 ChatGPT 帳戶。恢復碼代表對紀錄的持有權，並不是核實真實學生身份的學校 SSO。遺失時由授權教師重設；重設亦會撤銷舊學生登入。共用裝置完成後請登出。

班級模式把姓名、班級、學號、作答及必要進度存到 D1。造型、語言、位置、情境閱讀進度和反思亦可跨裝置同步。學生 API 只提供自己的紀錄；教師只可管理自己擁有的班級。版本衝突會提示重新載入，不會靜默覆蓋另一裝置。答案由伺服器評分，重試使用 idempotency key，伺服器不接受客戶端提供的分數。

**星數與學科得分不同。** 首次答對可得一次星數；答錯後再答對仍可取得星數。班級學科分數採每題首次作答，重試不改寫首次分數。尚未作答完成的學科會標示未完成，而非當成零分。預設活動共 78 顆學科星 + 20 顆情境星 + 5 顆遷移星 = **103 星**，100 星可離校；教師調整題目後上限會改變，離校門檻取 100 與該活動總星數的較小值。

這些紀錄用於形成性回饋，並非道德評級或安全的防作弊考試。公開練習題庫包含學習用答案；伺服器計分不等於能證明學生獨立作答。評量應連同學生的證據解釋、修正及反思。

## 教師工作台與 Excel

教師在課室列印機或教師入口開啟工作台。正式環境須先經 Sites 的 ChatGPT 身份登入、符合 `TEACHER_EMAILS` 擁有者名單，再輸入伺服器驗證的教師 PIN。按目前使用者設定，PIN 為 **1234**，由 `TEACHER_PIN` 環境設定提供；**PIN 不是獨立帳戶認證，也不能代替擁有者身份檢查**。PIN 錯誤有速率限制，解鎖有效 30 分鐘。

工作台可明確建立一班或 24 班（S1–S6 × A–D），查看／複製班級代碼，新增、修改、發佈或封存學科題目，並為班級開始新活動。每次活動凍結所用題目版本；後續改題不會重算舊活動或改變它的分母。核心 AI 情境及遷移題不屬於可編輯的學科題庫。可查看目前或歷史活動、按學科匯出 Excel，四個欄位固定為：

| 班別 | 學號 | 學生姓名 | 學科得分 |
|---|---|---|---|

匯出由已授權教師主動下載，不會公開列出學生名單。

## 音樂與語音

`campus-audio.js` 提供獨立語音／音樂音量、靜音、對白重播與試聽；需使用者手勢解鎖播放。對白開始時音樂降低，頁面隱藏時暫停，關閉時清理音效節點及計時器。

對白由 **Web Speech 在播放當下合成**，不是預錄角色音檔。繁中只使用 `zh-HK`／`yue` 粵語聲線；簡中只使用普通話聲線（`zh-CN` 優先，可用 `zh-SG`／`zh-TW`）；英文只使用英文（`en-GB` 優先）。缺少指定語種時顯示不可用並保留文字，不會以普通話代替粵語或相反。聲線供應取決於瀏覽器及作業系統；同語言下優先本機聲線，非本機聲線可能使用瀏覽器供應商的遠端服務。系統沒有標準化聲線性別欄位，不能保證每位角色都有對應性別或獨立聲線。

背景《Greensleeves》使用 [Mutopia 公版旋律](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf)，由本專案新寫的 Web Audio 樂器與伴奏合成，沒有使用 DSE 錄音。完整 [LilyPond 樂譜來源](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves.ly) 與 API 依據亦列於模組註解。語音可用性及實際聽感需要在目標裝置檢查，文字內容始終保留。

## 開發與資料庫

需要 Node.js 22.13+ 及專案依賴。首次安裝用專案的 `npm run install:ci`；已有依賴時直接執行：

```sh
npm run dev
```

使用命令實際顯示的本機網址，首頁會導向 `/campus/index.html`。不要再用 `python -m http.server dist` 測試班級功能；它不能提供身份驗證或 D1 API。

D1 binding 名稱為 `DB`，設定在 `.openai/hosting.json`；schema 在 `db/schema.ts`，遷移在 `drizzle/`。改 schema 後執行 `npm run db:generate`。新本機資料庫可在首次 build 產生 Worker 設定後套用既有遷移一次：

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yummy_fat_cobra.sql
```

不要對已套用的資料庫重複執行初始 SQL。測試使用隔離的 Miniflare D1，不需要重設正在預覽的班級資料。

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
| `public/campus/teacher-ui.js`、`xlsx-export.js` | 教師工作台、Excel 下載 |
| `public/campus/campus-audio.js` | 即時語音及原創合成音樂 |
| `public/campus/assets/`、`design/production-life/` | 執行資源與製作／裁切紀錄 |

```sh
node tests/backend.test.mjs
node tests/backend-client.test.cjs
node tests/campus-integration.test.cjs
node tests/grade-bank.test.cjs
node tests/progression.test.cjs
node tests/campus-audio.test.cjs
node_modules/.bin/tsc --noEmit
npm run build
```

最新本輪真實本機 D1 測試通過 **112 項 assertions/API checks**；涵蓋 24 班、跨裝置恢復、資料隔離、伺服器評分、重試、凍結版本、封存、歷史成績、衝突、CSRF、登入期限與 PIN 限速。整合測試涵蓋首次加入、登入還原、新活動、遺失回應後同鍵重試、四／五選項題及不同教室映射。音效測試使用模擬瀏覽器 API，不能代替實際聽感及裝置驗證。其他測試與視覺結果以各次執行紀錄為準，不宣稱未執行的檢查通過。

核心 AI 情境可先規劃為 20–30 分鐘，全校園暫估 45–75 分鐘，均未以目標學生量測。學生試行、學習成效、完整無障礙及多裝置稽核仍須分開完成。詳見 [設計與教學指南](DESIGN-AND-TEACHING-GUIDE.md) 及 [資源來源](ASSET-PROVENANCE.md)。

## 發佈

現行版本須部署包含 API 與 D1 的 Sites 專案，保留既有 project identity；只上傳靜態檔案不能提供跨裝置班級功能。遷移、正式環境變數、擁有者登入與公開學生流程應在部署時驗證。完成後以實際回傳網址、另一瀏覽器或裝置確認存取；本文件不代替部署成功紀錄，也不把開發伺服器當作公開分享連結。
