# 身形與步行姿勢確認稿 v2 — 男生局部膚色修正

生成：2026-10-09，內置 ImageGen，非透明背景。只供審閱，尚未實裝或發佈。

使用者指出男生側臉、耳後及頸部紫紅色塊不自然。本次對 05-walk-proportion.png 進行定向修改，移除四個男生姿勢的紫紅色髮色及膚色陰影，保留以使用者圖 2 為準的身形。

來源：`/Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-d1f98781-2bf2-40e8-9849-1c722a01e000.png`

檔案：`05-walk-proportion-v2.png`。生成原圖直接複製，沒有程式修圖。舊稿保留供比對，v2 是目前供使用者確認的版本。

## 目視檢查

- 四個男生的耳後、側臉及頸部未再出現原先大片紫紅色遮蓋；頭髮為深黑棕色，皮膚為自然暖膚色。
- 頭部大小、身體及腿長未見明顯改變；四欄完整，人物鞋子沒有裁切。
- 女生白裙紅腰帶及其他姿勢仍保留；女生腰帶的紅色不是缺陷。
- 這是生成式局部修改，沒有宣稱所有其他像素逐點不變。
- 四格為比例與色彩審閱，非正式循環動畫。正式動畫仍需檢查左右腳相位、腳底定位、固定尺度及速度。
- 未修改任何遊戲程式、角色 atlas、後端或已發佈網站。

## Exact edit prompt

```text
Use case: precise-object-edit.
Edit the provided existing character review sheet with MAXIMUM fidelity. This is a narrowly scoped COLOR CORRECTION, not a redesign.
TARGET: only the BOY in the TOP ROW, all FOUR poses.
DEFECT: behind the boy's left ear, in his sideburn/temple hair, side cheek, jaw, nape and neck there is an unnatural saturated purple-magenta-red patch. It looks like a colored overlay hiding part of his face. Remove this discoloration COMPLETELY in ALL FOUR boy drawings.
CORRECTION: Repaint only those small affected areas with natural colors that blend into the existing fine-pixel art. The hair at the side/back of head and sideburns should be neutral very dark brown/near-black, consistent with the rest of his hair (no purple or red streak). Ear, cheek, jaw, neck and nape should use the SAME natural warm light-medium peach/beige skin color as his face and arms, with very restrained warm tan/brown shadow. No red rash, no magenta cast, no bright red ear, no purple underchin or neck. Preserve individual ear outline, jawline and anatomical separation from shirt collar. Subtle original black pixel outlines only, not a flat flesh-colored blob.
INVARIANTS: Keep EXACTLY the same boy's face shape, hairstyle shape, head size, long body proportions, body/leg/arm lengths, same four poses, all clothing, white shirt/trousers, blackbelt, backpack, all alignment and foot baselines. Do not shrink or enlarge heads or bodies. Keep his original eyes, mouth and expression. This is a local discoloration repair only.
Do not change ANYTHING in the GIRL bottom row: her red belt is intentional and MUST stay red. Do not change labels, title, layout, cream background or teal separators. Keep 2rows4columns, entire image uncropped. Refined original fine-pixel anime style, not a 3D or photoreal render. No new text, no extra marks, no logos. The resulting boy should have consistent natural skin/hair colors across all four poses.
```
