# 身形與步行姿勢確認稿 v3 — 耳朵局部陰影

日期：2026-10-09。工具：內置 ImageGen，非透明背景。

狀態：只供視覺確認，尚未套用網頁遊戲或發佈。

使用者指出 v2 的站立、經過步及右腳接觸三格男生仍有不自然的耳朵陰影，並認可左腳接觸一格的膚色。本次以第二格為配色參考，集中修正另外三格的耳朵及鄰近皮膚陰影。

來源：`/Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-76448602-6f03-4af4-acb2-4e5a5c4da7c1.png`

輸入：`05-walk-proportion-v2.png`。輸出：`05-walk-proportion-v3.png`。生成原圖直接複製，沒有另行修圖；保留 v2 供比對。

## 檢查

- 三格男生的內耳深色塊已減淡，改為暖桃膚色及較淡的棕色耳摺。
- 保留以使用者圖 2 為準的頭身比例、長軀幹及腿長，沒有目視可見的頭部放大或腿部壓短。
- 第二格作膚色參考；生成式局部修改不宣稱其他區域逐像素完全相同。
- 四格男生及女生、標題、衣服和完整鞋子仍在；女生紅腰帶保留。
- 本稿不代表完整步行動畫已完成或驗證；網頁及正式素材未修改。

## Exact edit prompt

```text
Use case: precise-object-edit.
Edit this exact review sheet very carefully. The user has approved the SECOND boy, column titled「左腳接觸」, as the reference for clean natural ear/face coloring. Keep that SECOND boy unchanged. Fix ONLY the ear and nearby skin shading of the boys in columns ONE「站立」, THREE「經過步」, and FOUR「右腳接觸」in the TOP ROW.

PROBLEM: those three heads still have odd residual dark red/grey/purplish blotches around the visible ear and immediately below/behind the ear at the cheek, jaw hinge and neck. Remove those unnatural patches and avoid replacing them with a dark charcoal block. The skin should be clean and legible, not look covered by hair, a rash or an overlay.

LOCAL REPAIR:
- Use the SECOND boy's ear, side cheek and neck coloring as the exact master palette for all three other boys.
- Each corrected ear uses the SAME light warm peach skin as his cheek. Inside the ear use just ONE delicate low-contrast light-tan crease, not a dark red or black hole.
- The small area immediately below the ear and along the neck must be natural peach/light tan, with no isolated burgundy, purple, navy or charcoal skin patch.
- Preserve the hair silhouette and natural dark hair, but keep the boundary between hair, ear, cheek and neck clear. Hair shadow must not bleed across the ear or side of face. No dark block hiding the ear.
- Soft neutral warm-tan shading only where necessary; minimal shadow around ear, even neutral daylight. Clean simple small pixel clusters.
- Keep all four faces as the SAME boy with the same expression and head size. Do not redesign, change hairstyle or alter body proportions.

STRICT INVARIANTS:
Preserve the approved second boy「左腳接觸」. Preserve every body/leg/arm dimension, long torso/leg proportions, all four poses, white shirt and long white trousers, belt, backpacks, foot baselines, frame layout and all Chinese labels.
Preserve ALL FOUR GIRLS completely, including red belts, faces and colors.
Do not recolor the whole picture. Do not brighten the entire image. Do not blur or smooth the art. This is only a tiny localized repair in three male ear/skin regions, not a new character sheet.
Keep exact original full 2×4 layout, aspect ratio, cream background, no cropping, no insets, no new text. Original fine pixel anime style.
```
