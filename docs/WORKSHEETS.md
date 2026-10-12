# 工作紙站 / Worksheet stations

教師可在遊戲內的教師工作區上傳自製或已獲授權的 PDF。學生從遊戲右上角 HUD 的「打印」按鈕開啟工作紙站，取得自己班級所屬老師為相同年級及目前樓層科目提供的版本。這項功能需要部署已設定的伺服器、資料庫及檔案儲存；純靜態預覽不會自行提供真實班級工作紙。

## 教師操作

1. 首頁按「新開始」→「教師」，使用獲授權教師身份登入並輸入 PIN。選擇任教科目後，在科目首頁按「上傳工作紙」；此流程毋須建立學生角色或啟動校園場景。
2. 輸入名稱、選擇中一至中六。學科沿用科目首頁的選擇；按「更改科目」可切換，年級及班別篩選會保留。繁體中文 PDF、英文 PDF 可只提供一種，也可同時提供兩種；每種語言一份。
3. 每份檔案上限為 **5 MiB（5 × 1024 × 1024 bytes；介面簡寫 5 MB）**，不是兩份合計 5 MB。空檔案、超額檔案及缺少 PDF 標頭的檔案會被拒絕；伺服器另行驗證及執行權限檢查。
4. 按「上傳工作紙」。操作期間控制項暫停，避免重複送出。失敗時保留同一個表單節點、名稱及所選檔案，顯示錯誤後可再試。伺服器接受上傳後才清空表單；即使隨後重新載入清單失敗，也不會保留檔案而鼓勵重複上傳。
5. 年級篩選器控制本科清單；上傳表單可指定工作紙年級。刪除需在同一面板按「確認刪除」，不使用瀏覽器確認視窗。

請勿上傳未獲授權的課本掃描、學生名冊或含私人資料的文件。遊戲不會翻譯、修改或替老師產生 PDF 內容。

## 學生操作

1. 先連接老師的班級，在校園右上角按「打印」。工作紙站會按目前所在樓層提供科目，不必走近場景內的實體打印機。
2. 科目選單只列該樓層科目，年級由伺服器所辨識的學生班級決定，學生介面沒有切換年級功能。
3. 每張工作紙卡只顯示老師實際提供的「繁體中文」及／或「English」按鈕。簡體中文是介面語言；不表示一定有另一份簡體 PDF。
4. 選定語言後顯示預覽。載入預覽本身**不會列印**；只有按「開啟列印」才呼叫 PDF 閱讀器的列印功能。
5. 「開啟 PDF」及「下載 PDF」一直保留作備用。若裝置沒有內嵌 PDF 閱讀器，或不支援由嵌入預覽開啟列印，請開啟或下載檔案後，在閱讀器內列印。

手機內嵌 PDF 的縮放及工具列由瀏覽器閱讀器管理；工作紙站本身會適應窄螢幕，但不承諾每款手機的內嵌閱讀器都能自動將整頁縮至可見寬度。

## 實作及驗證

介面入口為 `window.CampusWorksheets.open({container, lang, mode, floor, grade, subjectId, onAccount, onResults})`。`lang` 支援 `zh`、`cn`、`en`；`mode: 'teacher'` 才提供上傳和刪除。教師科目首頁另外傳入 `fixedSubject: true`，讓本科清單及上傳保持相同科目；`onScopeChange({grade, subjectId})` 將年級變更同步回教師工具。一般呼叫不傳這兩個選項時，既有行為不變。回傳物件的 `destroy()` 會中止尚未完成的請求並移除事件監聽，關閉面板後不再重繪。客戶端篩選只是介面防護，真正的班級、教師及檔案權限仍由伺服器決定。

執行元件測試：

```sh
node tests/worksheet-ui.test.cjs
node tests/worksheet-backend.test.mjs
node tests/campus-teacher.test.cjs
node --check public/campus/game/worksheet-ui.js
```

2026-10-10 完成的元件測試包括三語文字、伺服器年級／樓層範圍、只選可用語言、舊預覽載入事件隔離、明確且載入後才可列印、開啟／下載備用、失敗保留表單和 File 物件、成功後重設、單語及雙語上傳、每份 5 MiB 邊界、PDF 標頭、刪除確認、請求中止及關閉後不再更新。

同日以獨立本機假 API 及原創單頁 PDF 做瀏覽器檢查，沒有登入真實教師帳戶、操作真實學生資料或將測試檔案送到正式儲存。已檢查 1280 × 800 桌面、390 × 844 手機版、三種介面語言、科目切換、實際 PDF 預覽及下載；工作紙站沒有橫向溢出，瀏覽器沒有記錄警告或錯誤。列印按鈕由測試頁攔截，元件測試驗證其呼叫時機；**沒有驗證系統列印對話框，也沒有進行實體列印**。

本機 Chrome 擴充功能未獲檔案 URL 存取權，因此瀏覽器檔案選擇器的端對端上傳未完成，沒有修改該權限。有效檔案的單語／雙語上傳、失敗保留檔案、5 MiB 驗證均由元件測試的假 API 驗證；不把它稱為已完成真實瀏覽器上傳。伺服器 R2／D1 整合測試由後端測試另行覆蓋。

工作紙介面 QA 截圖保存在 `tests/qa-artifacts/worksheet-student-desktop.png`、`worksheet-student-mobile.png`、`worksheet-teacher-desktop.png`、`worksheet-teacher-mobile.png`。這些較早的隔離測試截圖不代表正式班級資料，也不作為後來教師角色首頁的視覺驗證。後續元件測試已覆蓋無遊戲引擎的教師登入、14 個科目／主題入口、固定工作紙科目及跨工具年級保留；獨立瀏覽器只驗證至 PIN 畫面，其後因擴充功能視窗阻擋而停止。

## English summary

Teachers upload one Traditional Chinese PDF, one English PDF, or both, up to **5 MiB per file**. A failed upload preserves the actual form and chosen files; a successful server acceptance resets it. The teacher role opens directly from New game without creating a student avatar. A selected subject scopes both questions and PDF uploads, while grade and class filters persist. The AI ethics entry offers read-only shared activities and results, not unsupported core-event edits or PDF upload. Students open worksheets from the top-right Print HUD control. They receive only server-authorized worksheets for their teacher, grade and current floor. The UI does not offer a student grade switch or create missing translations.

Selecting a language loads a preview but never prints automatically. The explicit Print button becomes available after that preview loads. Open PDF and Download PDF remain available for devices whose embedded viewer cannot preview or print reliably. Physical printing and the native print dialog were not tested. Isolated component tests and responsive browser checks passed; browser file-picker upload remained blocked by the local extension permission, and no permission was changed.
