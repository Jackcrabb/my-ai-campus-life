# Teacher workspace — visual proposal 03

This review-only image proposes the teacher workflow for **我的AI校園生活**. It does not implement or verify cloud aggregation, authentication, question editing, scoring or Excel export. The current game and deployment were not modified.

## Output and provenance

- Output: `03-teacher-workspace.png`
- Generation method: built-in imagegen, reference-based UI mockup; no CLI/API fallback.
- Original source: `/Users/jackho/.codex/generated_images/01a11b37-3623-7652-90a8-3813a11d2e1c/exec-3161c00d-0135-4439-a7ef-bdf7b6fe817d.png`
- Generation ID: `exec-3161c00d-0135-4439-a7ef-bdf7b6fe817d`
- Dimensions: 1672 × 941 pixels, RGB PNG; approximately 16:9.
- Background parameter: `transparent_background: false`
- Reference: `dist/images/backgrounds/campus-pair-04.png` from this project; its upper mathematics-classroom scene was visually inspected and supplied only for visual continuity.
- Reference mechanism: `referenced_image_paths`; no conversation-image count used.
- SHA-256: `fa28f3415db88202760908c087a69f1723fb6570a5f675df9cd9d0f603daba0e`
- The output is a byte-identical copy of the generated original. No image editing or text overlay was performed.

## Visual review

The main score panel, smaller question editor, teacher unlock card and classroom printer are visible with a consistent pixel-classroom / rounded translucent-glass treatment. The four table headings, three fictional student rows, grade/class/subject filters, editor options, Excel button and four password dots are readable. No numeric PIN appears.

The cloud label reads “雲端同步（規劃中）”, and the board reads “視覺提案・示範資料”. Multi-device aggregation remains an architecture proposal, not a deployed or verified capability.

No material Chinese text defect was identified by visual inspection. The generated title has display spacing around “AI”; punctuation in the algebra field is visually typeset rather than a byte-exact font rendering. The proposed field is mathematically consistent: x + y = 11 and 2x + y = 19 imply x = 8. This is an example for reviewing the editor, not a claim of universal S2 teaching sequence.

The “教師登入” inset illustrates an unlock interaction only. A four-digit PIN is not presented as secure authentication for real student records; the read-only architecture plan calls for server-side teacher identity and authorization. This design contains only fictional sample names and scores.

Only this PNG and this provenance file are part of this deliverable. No runtime source, production documentation, database, hosting manifest or deployment was changed.

## Exact generation prompt

```text
Use case: ui-mockup.
Asset type: ONE polished wide 16:9 design-review image, preferably 2048x1152, for a Hong Kong secondary-school pixel campus game. This is a PROPOSED teacher workflow concept, not a functioning website screenshot.
Input image 1 is ONLY a visual style reference: use the TOP HALF mathematics classroom for the fine crafted-pixel architecture, warm Hong Kong daylight, jade window frames, wood desks, chalkboard and restrained colours. Create a single unified classroom backdrop, NEVER reproduce the reference's two-row atlas.
Primary request: A beautiful quiet in-game teacher workspace for “我的AI校園生活”. Preserve fine pixel scenery behind contemporary rounded light translucent frosted-glass panels, dark teal typography and muted teal buttons. Clear balanced hierarchy, generous padding, elegant thin borders, modest shadows, highly readable Traditional Chinese sans-serif text. The interface is INSIDE the classroom game scene; no browser chrome, device frame or operating-system window.
Composition: upper left game title. MAIN score panel occupies roughly the left 68% of width, right side has a smaller question-editor concept panel above a small teacher-unlock card. A recognisable original pixel printer on a classroom cabinet remains visible in the lower right background. Treat these as aligned design-board views of the workflow, not multiple overlapping modal windows. Keep the background visible around panels.
EXACT TEXT, reproduce carefully with no invented letters or substitutions:
Title: “我的AI校園生活”
Main panel title: “教師工作台”
Two tabs: “班級成績” active; “題庫管理” inactive.
Three compact filter chips: “中二” “2A” “數學”
Main table EXACTLY FOUR HEADERS, left to right: “班別” “學號” “學生姓名” “學科得分”.
Exactly three fictional rows, four aligned cells each:
“2A” | “01” | “陳晴” | “80”
“2A” | “02” | “林朗” | “60”
“2A” | “03” | “何悅” | “—”
Large but restrained main button: “下載Excel”
Below table subtle small text: “首次作答得分”
Cloud state label must read “雲端同步（規劃中）” with a neutral outlined cloud icon; no success tick and no claim of active connection.
Right editor title: “題目編輯”
Small subtitle: “中二 · 數學”
Question inside a soft glass field: “x＋y＝11；2x＋y＝19。x＝？”
Three compact option rows: “A　7” “B　8” “C　9”; B is selected with a discreet teal radio dot.
Buttons below: “儲存草稿” and “預覽”.
Below editor a small separate teacher-unlock view, title “教師登入”, password field contains ONLY FOUR SOLID DOTS “● ● ● ●”, a small button “解鎖”. NEVER show a numeric PIN or any password digits.
Near the pixel printer a tiny label: “課室印表機”.
Bottom-left design-review label, easily readable: “視覺提案・示範資料”.
Avoid extra text, fabricated features, rankings, charts, student photographs, progress badges, mascots, logos, real school crests, decorative clutter or crowded panels. All data is fictional. Prioritize accurate Chinese typography and calm spacious polished composition. All UI edges crisp; frosted translucency should preserve text contrast, not blur the text.
```

