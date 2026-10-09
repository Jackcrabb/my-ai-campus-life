# 身形與步行姿勢確認稿 — 圖 2 比例

此圖只供視覺審閱，尚未實裝或發布。沒有修改任何遊戲程式、角色 atlas、角色資料、CSS 或教學內容。

## 檔案與來源

- 圖片：`design/campus-life-review-v1/05-walk-proportion.png`
- 工具：OpenAI built-in ImageGen；`transparent_background: false`。
- 實際輸出：1448 × 1086 px，RGB PNG，1,629,842 bytes。
- 生成日期：2026-10-09。
- 生成識別：`exec-f61f1006-761b-4fc2-9c96-0829ec3dd99b`。
- 原始檔：`/Users/jackho/.codex/generated_images/01a11b37-f27e-75e3-9f01-083b22e1092d/exec-f61f1006-761b-4fc2-9c96-0829ec3dd99b.png`。
- 複製原圖，沒有修改像素、拼貼、拉長軀幹或縮放頭部。

## 參考權重

兩張使用者截圖均已用 view_image 檢視：

1. 圖 1：`/var/folders/dt/gl3f93fj40bc3w1cb06x49kr0000gn/T/TemporaryItems/NSIRD_screencaptureui_Tii1Pz/螢幕截圖 2026-10-08 下午11.57.32.png`。這是已被使用者拒絕的偏短身形；只用來理解問題，**沒有傳給生成工具**。
2. 圖 2：`/var/folders/dt/gl3f93fj40bc3w1cb06x49kr0000gn/T/TemporaryItems/NSIRD_screencaptureui_7nsdfk/螢幕截圖 2026-10-08 下午11.57.53.png`。此圖為**唯一傳入生成工具的身份、頭身及腿長比例依據**。只參照左方男生及中央女生，不使用右方成人教師。

使用者要求保留圖 2 的身體比例；本稿沒有另行指定七頭身或使用偏矮的舊 atlas 作參考。

## 構圖與姿勢

兩行四列。上行為同一位短髮、白恤衫白長褲、黑皮帶及深藍背包男生；下行為同一位長馬尾、白色恤衫連身裙、紅腰帶及深藍背包女生。

四欄依次：站立、左腳接觸、經過步、右腳接觸。各行使用共同腳底基準和一致人物比例；手臂隨步態反向擺動。奶油白背景、細分隔線、沒有學校名稱、校徽或遊戲 UI。

## 檢查與限制

- 已目視檢查完整 2 × 4 人物、標題、副題及四個姿勢標籤；頭髮、背包及完整鞋子均未裁切。
- 與圖 2 對照後，稿件保留較修長的少年軀幹和腿長，沒有回到圖 1 的矮身體造型。
- 同一行不同姿勢未見明顯的頭部膨脹或腿部縮短；站立和步行共用視覺尺度。沒有把彎膝姿勢重新放大至同一包圍盒高度。
- 步行為自然小幅度示意，至少一腳承重，不是跳躍或誇張跨步。
- 這是**四個姿勢的比例確認稿，不是完整八格動畫，也不是精確登記完成的生產 atlas**。特別是左右腳相位、腳底錨點及逐格像素一致性，後續仍需要以核准的實際動畫素材檢驗；不能從靜態確認稿宣稱動畫已流暢。
- 必須取得使用者對新稿的明確確認後，才可製作或整合遊戲素材。

## Exact generation prompt

Use case: stylized-concept.
Asset type: STANDING AND WALKING BODY-PROPORTION REVIEW BOARD ONLY, not a production game atlas.
Create a polished original fine-pixel anime character review board, landscape approximately 2048 × 1536, exactly TWO ROWS × FOUR COLUMNS, eight full-body figures.
The ONE supplied reference image is the user's authoritative IMAGE 2. Preserve the two student characters' body proportions from that reference exactly: the elongated natural teenage bodies, head-to-body scale, narrow torso, waist position, thigh and calf lengths, shoulder width, feet and hands. MATCH THE REFERENCE, do not redesign them into chibi or miniature children. Do not impose an arbitrary seven-head anatomy. The boy on the left and ponytailed girl in the centre are the ONLY character references; DO NOT include or copy the adult teacher on the right. Do NOT use the previously rejected squat sprite-sheet proportions.
Important: maintain the SAME HEAD PIXEL SIZE and the SAME shoulder, torso, limb lengths through all four poses of each character. Never enlarge the head or shrink the legs to fit a walking pose. All standing and walking drawings use one identical scale and camera. Leg bending may lower the head a few pixels; it must NOT trigger whole-body rescaling. All planted soles share one straight foot baseline per row. Every full head, ponytail, backpack and shoe completely visible. Natural long legs as in IMAGE 2, not stubby child legs.
Style: detailed original fine crafted-pixel anime illustration, clean precise tiny pixel clusters, delicate dark outlines, restrained expressive eyes and naturally sized heads, nuanced hair strands and fabric folds. Refine detail from the reference without changing anatomy. No blurry smoothing, no coarse blocks, no 3D, no photorealism.

TOP ROW: the SAME teenage BOY in all four cells. Dark tousled short hair from IMAGE 2; light-medium warm skin; same face, same long natural body proportions. White short-sleeve collared shirt tucked into WHITE full-length straight trousers, plain black belt, black leather school shoes, dark navy backpack on both shoulders. No tie. Do not change outfit, hair or body between cells.
BOTTOM ROW: the SAME teenage GIRL in all four cells. Long single dark ponytail reaching down the back, matching IMAGE 2; light-medium warm skin; same face and long natural teenage proportions. White short-sleeve collared knee-length shirt dress with narrow RED belt, white ankle socks, black leather school shoes, dark navy backpack on both shoulders. No tie. Preserve the reference's torso and leg lengths; NOT a large head on a tiny body.

ALL EIGHT figures face three-quarter RIGHT with the same camera angle.
FOUR POSE COLUMNS:
1: STANDING. Relaxed upright stance, both shoes on baseline, hands naturally relaxed or gently resting on a backpack strap. Full body, reference anatomy unchanged.
2: FIRST CONTACT. A modest natural walking step: anatomical LEFT foot forward, left heel just touching baseline; RIGHT leg behind, right toes contacting ground and heel slightly raised. Right arm forward, left arm back. Modest stride only, feet separation no greater than shoulder width. No giant marching stride.
3: PASSING. Weight supported by the planted LEFT foot directly under pelvis; RIGHT leg passes underneath with knee only slightly bent and right shoe lifted just enough to clear ground. Upright balanced torso, no squat, no floating or running. Arms near neutral. The planted left shoe touches the same baseline.
4: OPPOSITE CONTACT. RIGHT foot forward with heel at baseline; LEFT leg behind with toes on ground and heel raised. LEFT arm forward, RIGHT arm back. This must visibly be the opposite limb phase to column 2, not the same pose copied. Same modest stride and body scale.
Ponytail and backpack may shift subtly with the motion; they must retain their length, size and attachment. Quiet real walking body mechanics, no leap, no both-feet-airborne pose, no excessive head bob, no exaggerated arm swing.

Layout: very pale neutral cream canvas, generous clean spacing, thin muted teal column separators and one horizontal divider. Subtle straight baseline underneath feet in each row to compare registration. Consistent scale within each row; do not stretch to fill cell width. Large clean artwork, small but legible Traditional Chinese labels. No school names, logos or badges. No UI, no scenery, no grids inside figures, no body-measurement text.
Exact title at top: 身形與步行姿勢確認稿
Exact small subtitle: 依圖2比例・視覺提案
Column labels once across the top: 站立 / 左腳接觸 / 經過步 / 右腳接觸
Small row labels at left: 男生 / 女生
This is FOUR illustrative key poses per character for human approval, not a claim of a complete eight-frame animation. The visible difference from a squat chibi sprite must be the preserved longer natural body and legs, NOT merely a different uniform.
