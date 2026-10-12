# 我的 AI 校園生活

[English](README.md) · [操作指南（English）](USER-GUIDE.md)

**My AI Campus Life** 是為香港中學生設計的校園探索遊戲，以 **Ethical and Inclusive AI Practices** 為核心，支援 HKU MEd MEDD8934 小組作業。玩家是虛構「明澄書院」的一名新生，選擇中一至中六、A–D 班、學號、姓名與造型，在五層校園與同學及教職員互動。

## 直接在瀏覽器遊玩

> **獨立網站已發布 — 2026 年 10 月 13 日：** 遊戲現已由擁有者自己的 Cloudflare Free 帳戶託管。學生直接開啟，教師以管理員提供的登入碼進入工作台。匿名入口、教師登入碼、班級活動、自訂星數、成績及 PDF 權限均通過線上核查，QR code 已指向獨立網站。實際驗證範圍見[部署紀錄](docs/DISTRIBUTION-AUDIT.md#13-october-2026-independent-hosting-rollout)。

**[開啟公開遊戲](https://my-ai-campus-life.hjhlgz.workers.dev)** — 自由探索毋須下載程式或登入 GitHub。Windows、Mac、平板及手機均透過瀏覽器開啟；班級功能需要網絡連線。

<a href="https://my-ai-campus-life.hjhlgz.workers.dev"><img src="docs/assets/public-game-qr.png" width="220" alt="掃描遊玩我的 AI 校園生活" /></a>

[QR code PNG](docs/assets/public-game-qr.png) · [列印用 SVG](docs/assets/public-game-qr.svg) · [發佈與下載核查](docs/DISTRIBUTION-AUDIT.md)

1. 開啟網址或掃描 QR code，以右上角 **A** 選擇語言。
2. 選擇 **新開始 → 學生**，設定角色後進入校園；已有同一瀏覽器存檔時選 **繼續遊戲**。
3. 上課活動使用教師提供的班級代碼。**新開始 → 教師** 使用管理員提供的教師登入碼。

日常分享請用上述遊戲網址。[私人 GitHub 原始碼倉庫](https://github.com/Jackcrabb/my-ai-campus-life)及 ZIP 只供已獲授權的協作者，下載與開發步驟另列於下方。

獨立版本採 **Cloudflare Worker + Static Assets + D1**，班級紀錄及分塊工作紙 PDF 均存於 D1，不啟用 R2。前端在 `public/campus/`；既有 Sites / Vinext 部署另行保留。兩個版本的發布及核查範圍分別記錄於[部署紀錄](docs/DISTRIBUTION-AUDIT.md)，修改來源檔案本身不等於已發布網站。

**美術及語音進度：2026 年 10 月 12 日。** 電腦版角色設定背景及完整身形已有修正截圖。NPC 日常行為已實裝；已釋出 7 張動作圖集，涵蓋 24 個身份／服飾組合，共 96 幅動作。第 1–2 款校服的 8 個同學組合及無五官背景學生尚未完成。來源版本現已包含 104 段固定對白 MP3：普通話及英文各 52 段，涵蓋 20 位角色；繁中保留原有粵語朗讀。教師語音工作室已移除，學科題目一律文字呈現。音檔完整解碼、雜湊及聲線性別／語言資料已驗證；公開第 4 版已包含這批音檔，逐段聆聽仍須另外完成。詳見[介面稽核](docs/UX-AUDIT.md)、[NPC 進度](docs/NPC-BEHAVIOR-PLAN.md)及[語音服務](docs/OPENROUTER-TTS-SERVICE.md)。

## 學習內容與操作

- 五層、18 個地點與 13 個學習空間，包含中文、英文、數學、科學／化學、地理、資訊科技、歷史、視覺藝術、音樂、體育、公民情境，以及圖書館和天台跨科活動。
- **234 道三語起始題**：六個年級 × 13 個空間 × 三道題。每位玩家預設看到所選年級的 39 題；教師可繼續新增題目，不受每科三題限制，系統不設固定題數上限。234 題已按教育局及香港考評局參考資料逐科重寫，完成三語生成、結構／數學檢查及交叉覆核；這不是完整香港課程或官方公開試題庫，詳見[課程對照](docs/CURRICULUM-ALIGNMENT.md)。
- 四項 AI 校園情境：口音評分、寫作私隱、翻譯與文化聲音、共融參與。流程是對話、閱讀證據、選擇、後果、修正，再完成遷移題及反思。
- 介面可切換繁體中文（`zh`）、簡體中文（`cn`）及英文（`en`）；英文學習文本可保留目標語言。
- 男生及女生各四款原創校服風格、兩款髮型、三種膚色，共 48 個可選外觀組合；不是 48 套獨立繪製圖集。外觀不改變題目或得分規則。
- 統一奶油白、深青綠與金色像素介面；課室名稱牌固定在門上，地圖、對話、題目及教師面板沿用同一套視覺風格。

使用 WASD／四個方向鍵移動，E 與人物對話，Space／Enter 進入房間；點擊人物、門或樓梯會走近並互動。地圖由上而下排列第 5 層（4F）至第 1 層地下（G）。「案件／學科」只顯示星數及完成進度，不能直接跳題；答題須到對應人物或房間。造型、題目、對話與手帳都使用頁面內面板，Escape 關閉面板。

「新開始」先選擇「學生／教師」：學生進入新角色設定；教師登入後直接開啟獨立工作台，不必建立學生角色或進入校園。開啟身份選擇或教師工作台不會重設學生存檔；只有選擇新學生才開始替換學生進度的流程。不再出現報告下載提示；「繼續遊戲」直接回到已儲存的校園。學生學習報告下載已移除，教師 Excel 成績及工作紙 PDF 列印／下載仍保留。主選單設定按鈕暫時停用；右上角先是 A 語言控制，旁邊是音符音量控制。進入遊戲後可用畫面內設定，右上角「打印」則開啟目前樓層的學生工作紙。

所有遊戲中的 AI 輸出及後果均為人工編寫的教學模擬，沒有接駁生成式 AI 作答服務。**遊戲本身不能代替 MEDD8934 要求的真實 AI 工具現場示範**；教師指引另備虛構文本與示範提示。

20 位 NPC 使用不重複的名字，姓名只在對話框顯示。學生 NPC 依玩家所選校服系列換裝，保留各自性別、髮型、臉貌與體型；角色身高用等比例縮放呈現，沒有單向拉長或壓扁圖像。NPC 步速為 150、主角為 170 世界單位／秒，保留起停，步伐按實際移動距離前進。對話使用獨立高細節立繪，畫布解析度配合實際顯示尺寸。

現行來源為每位具名角色安排校園工作、兩個活動位置及對話伙伴，採用準備、短途移動、20–60 秒活動、收尾與交流的流程；與玩家交談後會恢復原本活動。每條走廊有 5 位、每個房間有 3 位背景學生，不再複製具名教師作路人。已釋出的美術才會呈現相應動作，缺少動作時保持自然站姿；無五官背景學生設計仍待確認，不能視為已完成。完整素材覆蓋與待驗證項目見[NPC 進度](docs/NPC-BEHAVIOR-PLAN.md)。

## 自由探索與班級模式

自由探索不需要登入；角色、進度和反思留在同一瀏覽器，沿用舊存檔的讀取遷移。現行儲存鍵為 `my-ai-campus-life-v2`。自由探索分數不會匯入班級正式作答紀錄。瀏覽器存檔綁定網站網域；轉用新網址不會自動帶走舊 Sites 網址的自由探索存檔。需要繼續舊存檔時保留原連結。班級恢復碼只有在相應班級資料已遷移後，才可在新網站還原紀錄。

班級模式由教師提供班級代碼。學生首次輸入學號及姓名後取得一次顯示的恢復碼；換裝置時使用班級代碼、學號及恢復碼繼續。學生不需要 ChatGPT 帳戶。恢復碼代表對紀錄的持有權，並不是核實真實學生身份的學校 SSO。遺失時由授權教師重設；重設亦會撤銷舊學生登入。共用裝置完成後請登出。

班級模式把姓名、班級、學號、作答及必要進度存到 D1。造型、語言、位置、情境閱讀進度和反思亦可跨裝置同步。學生 API 只提供自己的紀錄；教師只可管理自己擁有的班級。版本衝突會提示重新載入，不會靜默覆蓋另一裝置。答案由伺服器評分，重試使用 idempotency key，伺服器不接受客戶端提供的分數。

**教師可為每道學科題目設定 1–10 顆整數星星，與題目程度分開設定。星數與學科得分不同。** 首次答對可得一次星數；答錯後再答對仍可取得星數。班級學科分數採每題首次作答，重試不改寫首次分數。尚未作答完成的學科會標示未完成，而非當成零分。預設活動共 78 顆學科星 + 20 顆情境星 + 5 顆遷移星 = **103 星**，100 星可離校；教師調整題目後上限會改變，離校門檻取 100 與該活動總星數的較小值。

這些紀錄用於形成性回饋，並非道德評級或安全的防作弊考試。公開練習題庫包含學習用答案；伺服器計分不等於能證明學生獨立作答。評量應連同學生的證據解釋、修正及反思。

## 教師工作台與 Excel

教師從主選單「新開始 → 教師」登入，解鎖後先選擇 13 個學習學科之一或「AI 倫理與共融」，再開啟題目、工作紙或成績功能。「更換學科」返回選科，切換工具時保留年級、班別與活動篩選。遊戲內「設定 → 教師工作台」入口亦保留。獨立 Cloudflare 版本直接輸入管理員提供的 **教師登入碼**，不經平台帳戶認證。管理員可設定數字登入碼或較長的私人登入碼，請完整輸入。錯誤嘗試有速率限制，登入有效 30 分鐘。每個登入碼連到所屬工作台；使用同一共用登入碼的人，都能管理該工作台的班級、題目、工作紙及學生成績。不同擁有者的獨立登入碼仍各自存取獨立工作台。共用電腦離開前按「鎖定」，登入碼遺失或被撤銷時聯絡管理員。登入碼只應提供給獲授權的教學團隊，不要放到學生工作紙或班級群組。另行保留的 Sites 版本繼續使用其原有身份及 PIN 認證。

工作台可明確建立一班或 24 班（S1–S6 × A–D），查看／複製班級代碼，新增、修改、發佈或封存學科題目，並為班級開始新活動。在「題目 → 新增題目」可按教學需要繼續加題，每科三題只是起始題庫設定；每題可選擇 **1–10 顆整數星星**。儲存為「已發佈」後，到「班級 → 新活動」發佈更新題庫，學生才會使用新版本。每次活動凍結題目及星數設定；後續改題不會重算舊活動、舊成績或可得星數。「AI 倫理與共融」可檢視核心情境、遷移題及成績，但不可編輯核心題目；PDF 上傳供其餘 13 個學科使用。

「成績」可查看目前或歷史活動，並顯示學生已獲得星星及該活動可得星星。「列印本科成績」會開啟瀏覽器的原生列印流程，讓教師選擇打印機或另存 PDF；「下載本科 Excel」只匯出所選學科，「下載全部學科」則匯出 14 個成績類別的獨立工作表。Excel 固定使用以下六欄，列印版則依介面語言顯示相同資料：

| 班別 | 學號 | 學生姓名 | 學科得分 | 獲得星星 | 可得星星 |
|---|---|---|---|---|---|

學生尚未完成本科時，百分制得分仍未完成，但可顯示已獲得星星。答錯後重試答對可得一次星星；首次作答得分保持原樣。舊活動的星數不會因教師後來修改題目而改算。

匯出由已授權教師主動下載，不會公開列出學生名單。

學生從右上角 HUD 的「打印」開啟工作紙，校園場景內不設實體打印機。教師在所選學科的「工作紙」頁籤指定年級，上傳繁中或英文 PDF，亦可兩種一併提供，每份上限 5 MiB。獨立版本的 PDF 儲存總上限為所有教師合計 **100 MiB**；容量用盡時，先刪除不再使用的工作紙再上傳。學生只會看到自己班級所屬年級、該樓層科目的授權版本；選擇版本後預覽，按「列印 PDF」才請求閱讀器／瀏覽器列印。保留「開啟 PDF」及「下載 PDF」作備用，不會自動送印。詳見[工作紙指南](docs/WORKSHEETS.md)。

## 音樂與語音

**語音只用於固定 NPC 對話及入場介紹；所有學科題目、答案選項與解說均以文字呈現。** 教師更新題目時不用製作或更新錄音。教師工作台不設語音工作室，配音由後台維護及核對。

語言對應保持嚴格：

- 繁體中文沿用**原有瀏覽器／系統粵語朗讀**（`zh-HK` 或 `yue`）。
- 簡體中文使用內置**普通話錄音**。
- 英文使用內置**英語錄音**，包括數字讀法。

使用者已確認 OpenRouter 的普通話及英文試音可用。粵語試音被聽出是國語，因此已拒用並封鎖 OpenRouter 的 `zh` 生成。按使用者決定，粵語保留原有朗讀方式，不呼叫 OpenRouter 或產生 MP3，仍依賴裝置提供合適聲線及原有角色性別檢查。聲線可重複使用；缺少相符聲線時不可換成錯誤語言或性別。

目前來源版本已包含 **104 段逐字匹配的固定對白 MP3，普通話及英文各 52 段，涵蓋 20 位具名角色**。製作時使用免費 Edge 語音服務的四款聲線，已核對供應商標示的性別及語言，語速為 **−8%**、音調不變。遊玩時直接載入內置檔案，毋須 API Key、不向語音供應商發送生成請求。所有 MP3 均通過完整解碼與 SHA-256 檢查；這些技術驗證不等於已逐段聆聽或確保所有發音自然。先前兩段 OpenRouter 試音不會被用來代替其他對白。

錄音必須同時符合角色身份、語言及完整文本才可播放。固定對白改為提示玩家查看畫面的班別／進度，避免把會改變的學生資料或星數寫進錄音。文本改動或檔案缺失時可使用嚴格匹配的裝置聲線；聲線清單尚未載入時最多等待三秒，再回報不可用，不使用錯誤語言或已知性別。內置普通話對白因此不再依賴裝置有沒有男聲，粵語仍依賴系統聲線；畫面文字始終保留。

獨立 Cloudflare Worker 完全停用線上語音生成。保留的 Sites 來源另有內部 OpenRouter 試音服務，只使用 `fish-audio/s2.1-pro-free:free`，全站每日上限為 **6 次、3,000 字元、0 美元**，生成前核對零收費資料，沒有付費備援，API Key 只存在伺服器。它並非上述內置 MP3 的來源，遊玩時亦不依賴它。免費 Edge 製作端點可能改動或停止服務，但已儲存的音檔不需重新生成。製作步驟與驗證限制見[內部語音服務指南](docs/OPENROUTER-TTS-SERVICE.md)。較早的 [TTSFree 手動試音紀錄](resources/design/voice-auditions-free/README.md)保留作歷史製作資料。

背景《Greensleeves》使用 [Mutopia 公版旋律](https://www.mutopiaproject.org/ftp/Traditional/greensleeves/greensleeves-let.pdf)，由本專案以 Web Audio 原創樂器及伴奏合成，沒有使用 DSE 或商業演奏錄音。音樂及語音音量獨立；需要使用者手勢解鎖播放，對話時音樂降低，頁面隱藏時暫停。詳見[資源來源](ASSET-PROVENANCE.md)。

## 加到 Windows／Mac 桌面（可選）

先開啟公開遊戲，再使用瀏覽器的網站安裝功能：

- **Windows Chrome：** 三點選單 → **Cast, save, and share → Install page as app**。[Google 官方步驟](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop)。
- **Windows Edge：** **Settings and more → More tools → Apps → Install this site as an app**。[Microsoft 官方步驟](https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge)。
- **Mac Safari（macOS Sonoma 14 或更新）：** **檔案 → 加入 Dock**。[Apple 官方步驟](https://support.apple.com/en-us/104996)。

這會以獨立視窗開啟線上遊戲，並不包含離線遊戲副本或班級伺服器。目前沒有 Windows `.exe` 或 Mac `.dmg` 安裝包。學校管理的電腦可能限制安裝，選單文字亦會隨版本及語言而不同，仍可直接使用原有網址。

Safari 網頁 App 與 Safari 的網站資料分開，不能假設自由探索存檔會自動轉移。原有自由探索請繼續用原瀏覽器；班級進度可使用恢復碼流程。尚未在實際課室裝置驗證這些桌面入口的安裝及教師登入。

## 下載 ZIP 原始碼（只供已授權協作者）

使用有權限的 GitHub 帳戶登入[私人原始碼倉庫](https://github.com/Jackcrabb/my-ai-campus-life)，選擇 **Code → Download ZIP**，或[下載 main 分支 ZIP](https://github.com/Jackcrabb/my-ai-campus-life/archive/refs/heads/main.zip)。未登入或沒有權限者會看到 404，這是私人倉庫的預期行為。[GitHub 官方說明](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)。

ZIP 是原始碼快照，不是安裝包，也不是雙擊即可玩的遊戲；不包含正式資料庫紀錄、已上載工作紙、憑證或已安裝依賴。解壓後在終端機進入資料夾，依下方開發步驟設定。只想使用遊戲的學生及教師，直接開啟公開網址即可。

## 獨立 Cloudflare 託管

使用擁有者的 **Workers Free + Static Assets + D1**，免費 `workers.dev` 網址毋須購買網域。PDF 以 D1 分塊儲存，每份 5 MiB、全站共 100 MiB，不需啟用 R2。免費方案仍有請求、CPU 及資料庫用量限制，超額可暫停服務，並非無限容量。帳戶核對、資料庫遷移、私人教師登入碼及部署步驟見[獨立部署指南](deployment/cloudflare/README.md)。

Cloudflare 憑證、部署帳戶設定及教師登入碼放於已忽略的本機資料夾，不納入 GitHub；倉庫只提供安全設定範本。原有 Sites 網站另行保留。

## 開發與資料庫

以下保留原有 Sites / Vinext 本機開發流程；上述獨立 Worker 共用前後端程式，但不使用 Sites 身份或 R2。

需要 Node.js 22.13+ 及專案依賴。首次安裝用專案的 `npm run install:ci`；已有依賴時直接執行：

```sh
npm run dev
```

使用命令實際顯示的本機網址，首頁會導向 `/campus/index.html`。不要再用 `python -m http.server dist` 測試班級功能；它不能提供身份驗證或 D1 API。

原有 Sites 開發路徑的 D1 binding 名稱為 `DB`，R2 工作紙儲存 binding 為 `BUCKET`，設定在 `.openai/hosting.json`；schema 在 `db/schema.ts`，遷移在 `drizzle/`。改 schema 後執行 `npm run db:generate`。新的空白本機資料庫可在首次 build 產生 Worker 設定後，依次套用以下六個既有遷移各一次：

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yummy_fat_cobra.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_plain_omega_sentinel.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_lazy_catseye.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0003_peaceful_mister_fear.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0004_mighty_miek.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0005_independent_teacher.sql
```

既有資料庫只套用尚未執行的遷移，不要重複執行已套用的 SQL。測試使用隔離的 Miniflare D1/R2，不需要重設正在預覽的班級資料。

Sites 正式環境必須設定 `TEACHER_EMAILS` 及 `TEACHER_PIN`，未配置擁有者名單時不授予教師權限。忽略於 Git 的 `.dev.vars` 可設定 `CAMPUS_LOCAL_TEACHER=1` 供本機教師測試；此例外只在非 production 且 loopback host 生效，production build 不會啟用。不要將 `.dev.vars`、憑證、課程 PDF、私人筆記或學生匯出放進 `public/`。

## 程式結構與驗證

檔案已按用途分組：[game 遊戲程式](public/campus/game/) · [images 圖像](public/campus/images/) · [audio 語音](public/campus/audio/) · [resources 字體與授權](public/campus/resources/) · [美術製作資源](resources/) · [data 資料](data/) · [文件](docs/) · [Chat Recording 對話紀錄](Chat%20Recording/)。各資源只保留一份可維護來源，遊戲入口 `public/campus/index.html` 及課堂 API 路徑維持不變。


| 路徑 | 用途 |
|---|---|
| `deployment/cloudflare/worker.ts`、`scripts/cloudflare-cli.mjs` | 獨立網站入口、D1 工作紙儲存及部署核查 |
| `scripts/provision-teacher-code.mjs` | 私人教師登入碼製作及摘要匯入 |
| `app/page.tsx`、`app/api/campus/[...path]/route.ts` | 保留的 Sites 入口、同源 API、平台身份 |
| `lib/campus-*.ts`、`db/schema.ts`、`drizzle/` | 學生／教師權限、版本化題目、活動、計分、D1 schema |
| `data/grade-bank.json`、`scripts/content-authoring/` | 234 題資料及題庫編製來源 |
| `public/campus/game/app.js`、`campus-cloud.js` | 遊戲狀態、雲端連接與衝突處理 |
| `public/campus/game/content.js`、`grade-content.js`、`subjects.js` | 四項情境、三語年級題庫、學習空間定義 |
| `public/campus/game/engine.js`、`characters.js`、`campus-art.js` | 校園場景、共用角色身份、動作、圖集與比例 |
| `public/campus/game/campus-routines.js`、`images/activities/` | 校園工作、活動位置、時長與已釋出動作美術 |
| `public/campus/game/teacher-ui.js`、`xlsx-export.js` | 教師學科首頁、工作台、Excel 下載 |
| `public/campus/game/worksheet-ui.js`、`lib/campus-worksheets.ts` | PDF 上傳、授權存取、預覽與手動列印 |
| `public/campus/game/campus-audio.js` | 即時語音及原創合成音樂 |
| `lib/campus-tts.ts` | 內部語音製作、免費價格核對、生成紀錄與覆核 |
| `public/campus/images/`、`resources/design/production-life/` | 執行資源與製作／裁切紀錄 |

```sh
node scripts/validate-resource-layout.mjs
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
node tests/tts-backend.test.mjs
node scripts/validate-activity-atlases.mjs
node_modules/.bin/tsc --noEmit
npm run build
```

較早的後端測試使用正式編製題庫，在隔離的本機 D1/R2 通過 **166 項 assertions/API checks**。另已驗證起始題更新不改動教師自編版本、封存題或已凍結活動；工作紙測試涵蓋檔案上限、授權、Unicode 檔名及可重試的儲存失敗。教師元件測試涵蓋獨立選科入口、學科工作紙、核心題唯讀及單科／全科匯出。整合測試涵蓋首次加入、登入還原、新活動、遺失回應後同鍵重試、四／五選項題及不同教室映射。TTS 後端以隔離 D1/R2 及模擬供應商通過 **180 項檢查**，包括以 HTTP 410 拒絕學科語音；整合測試亦確認 NPC 問候可朗讀，接着的學科題目、選項及回饋保持靜音。音效測試不能代替實際聽感及裝置驗證。其他測試與視覺結果以各次執行紀錄為準，不宣稱未執行的檢查通過。

以上功能以本機來源版本為準；新修正是否已上線須另看部署驗證。工作紙已做元件及隔離瀏覽器預覽／下載檢查，尚未驗證系統列印視窗或實體列印。

核心 AI 情境可先規劃為 20–30 分鐘，全校園暫估 45–75 分鐘，均未以目標學生量測。學生試行、學習成效、完整無障礙及多裝置稽核仍須分開完成。詳見 [設計與教學指南](DESIGN-AND-TEACHING-GUIDE.md) 及 [資源來源](ASSET-PROVENANCE.md)。

## 發佈

### 分享遊戲

請使用本文頂部的公開連結及 QR code。QR code 儲存 `https://my-ai-campus-life.hjhlgz.workers.dev/campus/`；PNG 為 820 × 820 像素，講義或投影片可使用 SVG 縮放，並保留四周淺色邊界。公開入口、QR code 及私人倉庫的日期與核查結果見[發佈與下載核查](docs/DISTRIBUTION-AUDIT.md)。

公開遊戲與私人原始碼的權限各自獨立。入口可連線不等於所有班級操作、原生列印對話框或每部裝置聲線均已驗證；正式上課前請按上方清單試用。

### 更新部署

獨立公開版本依[Cloudflare 部署指南](deployment/cloudflare/README.md)發布 Worker、靜態資源及已設定的 D1 資料庫。更換分享網址及 QR code 前，核對 Free 方案、遷移、教師登入碼、匿名學生入口與班級／工作紙操作。私人登入碼及正式資料庫紀錄不納入原始碼倉庫。

原有 Sites 網站是另一個部署，保留其 project identity 與 D1/R2 設定。上傳 GitHub 不會自動部署任何後端；只發布靜態檔案亦不能提供跨裝置班級功能。
