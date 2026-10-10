# 自架動態配音研究（歷史備選，未採用）

**我的AI校園生活 · 研究日期：2026 年 10 月 10 日**

**本文件是歷史備選研究，未採用，也不是目前部署要求。** 使用者已選擇[免費網頁手動製作 MP3](FREE-VOICE-TOOLS.md)：TTSFree 為主、TTSMaker 作人工操作備用；Google Cloud 及自架模型均暫停。`VOICE-CAST.md` 的角色性格仍可作創作參考，Google 聲線 ID 及其設定檔不適用於目前流程。本次研究沒有下載模型、生成音訊、租用伺服器或修改遊戲。

**預錄 MP3 尚未接入遊戲，目前 Web Speech 的語種及流暢度問題尚未完全修復。** 教師新增或修改題目不會自動更新錄音；須手動重新生成、試聽覆核及接入相符版本，最新書面題目、選項及回饋始終為準。

**下列舊提案僅供未來重新評估：網站內操作，獨立機器合成，按題目版本快取。** 其構想是在教師改題後排程新配音，學生在原網站播放；這不是目前已實作的功能。它可不使用按字收費的 TTS API，但仍需要運算、儲存、網絡及維護資源。研究未找到可直接放進普通瀏覽器、已驗證同時提供自然粵語／普通話／英語及 20 個獨立角色聲線的完整現成方案。

## 兩個歷史候選方案

| | A：獨立 Linux／NVIDIA 語音服務 | B：現有 Apple Silicon Mac 作配音工作機 |
|---|---|---|
| 合成引擎 | 上游 CosyVoice 3 Python 推論程式 | CosyVoice 3 的社群 MLX 移植與量化模型 |
| 網站體驗 | 教師儲存題目後排程合成；完成後全班可播放 | 相同網站流程；Mac 主動領取排程工作並上傳成品 |
| 適合 | 公開網站、持續供應新配音 | 先用已有硬件試音與小班試行，減少另租 GPU 的需要 |
| 真實成本 | 自有硬件電力／維護，或租用 GPU 的運行時數；另有儲存與流量 | Mac 的電力、佔用時間、儲存、網絡與維護；不是免費運算 |
| 可用性 | 要維持服務在線，處理佇列、故障與容量 | Mac 關機、睡眠或離線時，新配音等候；已快取的音檔仍可播放 |
| 尚待確認 | 指定硬件上的 RAM／VRAM、延遲、並發量與實際聽感 | 移植版相容性、粵語控制、記憶體峰值、長句品質；不能把上游結果當成移植版測試結果 |

**若日後重啟此研究，可先驗證 B，再評估是否需要 A 的持續服務。** 兩者使用同一類模型而有不同部署方式，均須先完成小規模實測。沒有現成可用機器時，不能承諾零新增成本；也不應先租 GPU 再驗證聲音是否合適。

### 為甚麼選 CosyVoice 3

上游列出中文、英語及 18 種以上中文方言／口音，支援參考聲音與跨語言合成。更具體的是，官方 `example.py` 的 **CosyVoice 3** 範例直接示範廣東話指令和粵語句子，並非只在「中文」標籤下推測粵語。模型卡標示 Apache-2.0，程式庫也採用 Apache-2.0。[上游專案](https://github.com/QwenAudio/CosyVoice)、[模型卡](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512)、[官方廣東話範例](https://raw.githubusercontent.com/FunAudioLLM/CosyVoice/main/example.py)、[程式授權](https://github.com/QwenAudio/CosyVoice/blob/main/LICENSE)

這些是**可行性證據，不是本遊戲的品質驗收**。廣東話指令、合適的語音參考與台詞需共同驗證，沒有等同 `yue-HK` 的絕對語言保證。教材中的書面繁體中文也不等於口語粵語；修改題目時應保留原文，再由可編輯的「朗讀稿」處理讀音、數字和術語，避免合成器擅自改題意。

## 運算與記憶體：哪些已核實

- 上游模型程式選擇 **CUDA，否則 CPU**；不能說在 Apple Silicon 上直接安裝原版就會使用 Apple GPU。CPU 路徑存在，不代表即時或多人合成速度已合格。[實際裝置選擇程式](https://raw.githubusercontent.com/QwenAudio/CosyVoice/main/cosyvoice/cli/model.py)
- 原始模型儲存庫目前列出 **9.75 GB**，包含不同版本／重複用途的權重。這是完整儲存庫的下載體積，**不是最低 RAM、VRAM，也不是每次都必須下載的檔案量**。LLM、聲學模型、聲碼器及 tokenizer 都會消耗資源；不能只用「0.5B」推算整套成本。[官方模型檔案](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512/tree/main)
- MLX 社群的 4-bit 轉換模型頁列出約 **1.22 GB**，並說明量化的是 LLM 部分。這仍是模型檔案規模，不是執行記憶體上限。移植專案要求 Apple Silicon、Python 和 MLX；它是**移植作者的第一手資料，並非 CosyVoice 上游對 Mac 的保證**。[轉換模型](https://huggingface.co/mlx-community/Fun-CosyVoice3-0.5B-2512-4bit)、[移植程式與要求](https://github.com/lovejing0306/mlx-audio-plus)、[CosyVoice 3 移植使用說明](https://github.com/lovejing0306/mlx-audio-plus/blob/main/docs/tts/cosyvoice3.md)
- 本次未找到足以為此遊戲承諾的官方最低 RAM／VRAM 或 Apple Silicon 每句延遲數字。先量測短句、長句、三種語言、首次載入及佇列；**不要把宣傳中的首包延遲當作家用 Mac 完成整句的速度**。

## 瀏覽器本機 TTS 為甚麼暫不作主方案

| 候選 | 核實到的能力 | 對目前需求的缺口 |
|---|---|---|
| Kokoro.js | 上游 JavaScript 套件可透過 WASM／WebGPU 在瀏覽器運行；Kokoro 是 82M 模型。中文新版模型卡列中文及英語。 | 沒有核實到 Cantonese／`yue` 模型與 20 位粵語角色。「中文」不能當作粵語證據。初次下載、解碼記憶體及學生裝置效能亦要測試。 |
| sherpa-onnx／VITS／Piper | sherpa 有正式 WASM TTS 建置流程；維護者的 TTS 示範清單確實有 `vits-cantonese-hf-xiaomaiiwn`，不應與其粵語 ASR 模型混淆。該 ONNX 檔約 114 MB。 | 所核實的粵語 checkpoint 頁面沒有 model card／清楚授權說明，也未建立 20 個可用獨立聲線及跨語言一致性；框架授權不自動涵蓋模型與訓練聲音。不能直接發布為完整解決方案。 |
| Qwen3-TTS 公開權重 | 公開 CustomVoice 模型列 **9** 個固定聲線；有 VoiceDesign 和 Base 參考聲音功能，權重標示 Apache-2.0。 | 公開模型卡沒有明確承諾香港粵語。宣傳的 **49 聲線＋粵語** 頁面講的是 Qwen3-TTS-Flash **API**；不可把這能力當作公開權重內建。此刻不替代成另一個付費服務。 |

來源：[Kokoro.js](https://github.com/hexgrad/kokoro/tree/main/kokoro.js)、[Kokoro 中文模型](https://huggingface.co/hexgrad/Kokoro-82M-v1.1-zh)、[sherpa WASM 官方建置](https://k2-fsa.github.io/sherpa/onnx/tts/wasm/build.html)、[維護者 TTS 模型清單](https://huggingface.co/spaces/k2-fsa/text-to-speech/blob/main/model.py)、[粵語模型頁](https://huggingface.co/csukuangfj/vits-cantonese-hf-xiaomaiiwn)、[粵語模型檔案](https://huggingface.co/csukuangfj/vits-cantonese-hf-xiaomaiiwn/tree/main)、[Qwen 公開 CustomVoice 模型](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)、[Qwen API 公告](https://docs.qwenlm.ai/qwen3-tts-1128/index.html)。

若以後放寬為「少量聲線，部分語言」，瀏覽器方案可重新評估。現在不以調高／調低一個聲音冒充 20 個獨立角色，也不以 eSpeak 類機械聲線滿足「自然流暢」的承諾。

## 20 位角色的聲音來源

CosyVoice 的 zero-shot／cross-lingual 能保存參考聲音特徵；**它不等於附送 20 個已授權、三語自然的演員聲線**。正式配音前，需建立 20 份穩定、可追溯的參考聲音或獲准使用的合成聲線，然後固定角色 ID 與語音設定。

可行來源是明確同意本遊戲合成及公開播放的成人配音者，或授權清楚允許再合成的聲線資料。每份記錄保存來源、使用範圍、同意證明、參考稿及版本；授權資料留在私人儲存。學生角色可用成人演繹青年語氣，不收集真實中學生聲音，也不抓取名人／網上片段來湊數。開源程式或模型授權並不自動賦予第三者聲音的使用權。

原先的 20 位角色性格可保留，但 Google 的聲線 suffix 不能轉用作 CosyVoice speaker ID。第一輪先用 **2 個授權來源 × 3 語言 × 3 種句型** 做 18 段驗證，通過後才完成 20 人聲音名冊；未取得來源前不宣稱 20 人配音已完成。

## 自架方案的架構草案（未實作）

現有 Cloudflare Worker 負責網頁與權限。其每 isolate 記憶體上限為 **128 MB，包含 WASM**；所以不能把 CosyVoice、PyTorch 或 MLX 模型直接塞進這個 Worker。另設推論工作機，Worker 僅驗證、排程及傳送結果。[Cloudflare Workers 官方限制](https://developers.cloudflare.com/workers/platform/limits/#memory)

以下為保留的自架設計草案，尚未實作，也不代表目前免費網頁流程具有自動改題配音功能：

```text
教師在網站儲存題目 → 伺服器建立題目 revision 和配音工作
                                   ↓
                     獨立 CosyVoice 工作機領取工作
                                   ↓
                     按角色＋語言合成整句 → 存音檔
                                   ↓
學生在原網站按播放 ← 權限驗證＋版本相符的音檔快取
```

1. **題目即時更新，配音非同步準備。** 儲存後文字立即生效，音訊顯示「準備中／可播放／生成失敗」。工作機不可用時保留文字，不阻塞答題，不播放舊版本。
2. **來源由伺服器決定。** 播放請求只含題目 ID、revision、語言和角色 ID；伺服器按學生 assignment 或教師權限讀取內容。匿名玩家只讀公開內建題目。不要開放無限制任意文字合成端點。
3. **精確快取。** 快取鍵至少包含擁有者範圍、題目／台詞 revision、朗讀稿 hash、語言、角色、聲線版本及模型版本。相同工作合併，成功結果重用；改題後產生新鍵。
4. **整句合成。** 以句子／自然段為單位，保留標點和語境；長文在合理句界分段，不逐字拼音檔。粵語、普通話、英語分開指令、稿件及結果；失敗不換成另一語言。
5. **獨立機器受控存取。** A 可用私人 HTTPS 推論服務，僅接受網站伺服器的服務身分。B 較適合 Mac 主動向網站領取工作及上傳結果，毋須把家中 Mac 直接暴露為公開服務。服務憑證只留伺服器／工作機環境，絕不傳給瀏覽器。
6. **題目與答案維持原權限。** 私人班級題目音訊不得變成公開永久連結；正確答案／回饋的音訊只在原本可查看的階段提供。音檔儲存須有授權檢查或短效下載憑證。
7. **限制成本與故障影響。** 設定每位教師的字數／工作數、最大句長、有限重試及佇列容量。先只在教師發布新 revision 時合成，學生重播直接取快取；不用每次播放都重新運行模型。

## 實作前的驗收與選擇

先確認現有工作機的晶片、記憶體、可持續在線時間，以及是否已有獲准使用的聲音來源。然後用前述 18 段測試：由懂粵語／普通話的真人核對語言、讀音、漏字、長句連貫；記錄首次與熱啟動延遲、記憶體峰值、排隊時間和每次完整失敗。再測教師改題→新配音、跨裝置播放、工作機離線、取消／切換語言及重播。

完成測試前，**沒有承諾即時零等待、20 聲線已就緒、自然度已合格或零費用**。以上驗收只適用於未來明確重啟自架研究的情況。**目前下一步是依[免費網頁流程](FREE-VOICE-TOOLS.md)手動製作及覆核 MP3，再另行接入遊戲**，不需要安裝 CosyVoice、購買硬件、租用 GPU、建立 Cloud 帳戶或提供 API 金鑰。Google 與自架計劃均維持暫停；本次沒有任何付費合成呼叫。
