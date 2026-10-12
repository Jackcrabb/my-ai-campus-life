# 01 — 角色比例及互動視覺提案

狀態：設計審閱，尚未實裝或發佈。使用內置 ImageGen 生成，輸出原樣複製，沒有用程式重繪或修改像素。

最後來源：`/Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-4ba28f4f-38b0-4220-a147-7e121681325a.png`

初稿來源：`/Users/jackho/.codex/generated_images/01a11b35-a464-72b1-8c43-37ddeaccd3c1/exec-373a309a-5b6e-4912-9f48-ed56fe67bc7b.png`

參考：已批准的 GIRLS-REVIEW-v1、BOYS-REVIEW-v1，及 version-1-crafted-pixel 原創美術方向。

## 檢查及最新使用者指示

- 標題、提示及對話文字清楚；畫面與對話中的周老師均為同一男性形象。
- 修訂版縮小左側主角頭部，並把右上主角女生校裙改為白裙紅腰帶，與左側保持一致。
- 原畫上的頭身比數字是生成目標，不能當作像素測量結果。
- 使用者後續指定「圖 2」中的校園角色比例為準。該圖正是本稿右上校園場景的局部截圖；未來所有角色站立及步行需維持這個身形，不能套用舊版矮身 sprite atlas。
- 05-walk-proportion-v2.png 另供檢查同一比例在不同姿勢下的表現，並修正男生不自然的紫紅色陰影。
- 本稿是場景和互動示意，不是動畫 atlas。完整走路動畫及程式固定縮放仍待批准後製作和測試。
- 04-npc-roster.png 是教職員身份概念稿；正式製作時需採一份已批准的角色名錄，統一服裝細節、全身圖及對話立繪。

## 初始生成提示詞

```text
Use case: ui-mockup and character-proportion design review.
Create one polished landscape 16:10 image board for an original Hong Kong secondary school game named exactly "我的AI校園生活".
This is a proposed design approval image, not a screenshot of working software. At top use a small elegant header "01  角色比例與互動" and a subtle tag "視覺提案・尚未實裝".

REFERENCES:
Image1 is the approved GIRLS costume/identity reference. Preserve the girl G1: long dark ponytail, white short-sleeve collared knee-length dress with red belt, white socks, black school shoes.
Image2 is the approved BOYS costume/identity reference. Preserve boy B5: soft dark tousled short hair, white short-sleeve collared shirt, white full-length trousers, black belt and black school shoes.
Image3 is the approved finely detailed crafted pixel-anime campus art style reference ONLY, do NOT copy its older dark box UI. New interface is light frosted translucent glass, smooth generous rounded corners, slate text, quiet teal controls.

CRITICAL character proportion improvement: full-body teenage characters with natural slim SCHOOL-AGE proportions, approximately 6.8 to 7 head units tall from skull top to sole. Make heads clearly SMALLER relative to torso/limbs than the reference boards. Keep recognizable youthful faces and same exact clothing/hair. Not chibi, not oversized eyes/heads, not adult fashion models, not babyish. Boys only trousers; girl only dress. Detailed pixel clusters and clean fine pixel outlines, not giant blocks, not blurry painting.

COMPOSITION:
Left 32% of board is a pale warm ivory design area showing the boy and girl standing side by side FULL BODY head to soles, large enough to assess proportions. One label above "固定頭身比例"; no rulers or numbers necessary. Subtle aligned ground shadow; preserve natural size difference boy slightly taller. Plenty of space around pair.
Right 68% has two stacked widescreen game-scene preview panels.
Upper panel "校園探索": richly detailed pixel Hong Kong school corridor, green classroom doors, sunlight through windows, terrazzo floor, distant city/highrises outside, noticeboard, ceiling fans/pipes, plants. Show same boy and girl in smaller proportional world sprites and one adult male geography teacher (warm medium-brown skin, long face, short side-part wavy black hair, sandy beige overshirt, olive trousers, brown shoes) standing near a door. Three discreet background students: reading a book at bench, chatting quietly, walking. These ambient students must have NO interaction label. Teacher alone has a tiny translucent pill "周老師  ·  E 對話". Tiny quiet caption "點擊人物或按 E 才交談". Do not show huge task HUD or directional movebuttons.
Lower panel "對話狀態": keep the SAME male geography teacher EXACT face/hair/skin/clothing, shown waist up on right with ONE calm open-palm welcoming gesture (not waving frantically). Warm campus corridor behind. Left portion shows same boy shoulder/side back, preserving hairstyle/uniform. Across lower edge a translucent frosted warm-white rounded dialogue box with small teal namechip "周老師", text "歡迎加入校園。先了解每位同學的需要，再判斷 AI 的建議。" and a small "繼續 →" control. No dark opaque box. Do not draw a female portrait for male teacher.
Bottom of overall board small simple two-part legend: "走過只顯示提示" and "互動後才出現說話姿勢".
This image is for reviewing proposed proportions, visual identity consistency and understated in-game UI. Large correct Traditional Chinese typography, generous negative space, avoid densely packed instructions. No Apple logo, no copyrighted characters, no school logos, no browser chrome, no modal popup window. Beautiful original detailed pixel game artwork throughout.
```

## 定向修改提示詞

```text
Edit this existing design-review board with high fidelity. Preserve the full layout, all Chinese typography, exact background, glass dialogue UI, title, teachers and their costumes, pixel-art texture. Only make two targeted changes:
1) On the LEFT large full-body boy and girl, make their heads (including hair mass) about 17% smaller relative to their unchanged torso and legs. Keep their chin/neck natural, same approved facial identities, same school-age teenage appearance, same hairstyle (boy tousled short; girl long ponytail), same clothes. Keep shoulders, torso, hands and shoes in exactly the same composition. They should now read as approximately 6.8–7 heads tall, elegant natural adolescent anatomy, NOT chibi. This needs to be a visibly smaller head, not just shrinking the whole person. Girl retains white collared short sleeve dress, red belt, black shoes, ponytail. Boy retains white shirt and full white trousers with black belt.
2) In the upper-right corridor scene, the main girl standing closest to the geography teacher must wear that SAME white dress with RED BELT as the large reference girl. No blue stripes on this foreground girl's uniform. All other background students can retain their different outfits.
Everything else unchanged. All same identities. No new labels or UI, no school names, no realistic photography. Detailed fine pixel anime.
```
