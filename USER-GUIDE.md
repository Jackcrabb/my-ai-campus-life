# My AI Campus Life — User guide

[Project overview](README.md) · [Teaching design](DESIGN-AND-TEACHING-GUIDE.md)

This guide describes the current repository workflow. Consult the corresponding release record for the deployed revision and verification scope.

## Students: start and explore

1. Choose **New Game → Student** to start character setup, with no report/download confirmation, then select your year (S1–S6), class section (A–D), student number, name and appearance. In class mode, use the details your teacher asks you to use.
2. Choose free exploration or join your class. Read or skip the introduction; it can be replayed later.
3. Move with **WASD or the arrow keys**. Press **E** to talk to a nearby person, or **Space/Enter** to use a nearby room entrance. Clicking a person, door or staircase also approaches and interacts. Use **Map** to read the floor plan, ordered from 4F (fifth level) at the top to G (first level) at the bottom. Cases and Subjects show progress only; visit the corresponding person or room to answer.
4. Read the evidence before choosing an answer. Review the feedback, make a repair and explain a next action in your journal.

**Continue** returns directly to your saved campus. Opening the Student / Teacher chooser, or choosing Teacher, does not reset that save. Choosing a new Student starts a replacement student setup. Student learning-report download controls have been removed; teacher Excel exports and worksheet PDF access are separate and remain available. The start-menu **Settings** button is currently disabled; the in-game toolbar provides settings after starting. At the top right, **A** changes language and the adjacent **music-note button** opens sound controls. Escape or a panel's close button returns to the game.

Sound is optional. Music and fixed NPC/introduction speech have separate volume controls; dialogue can be replayed or muted. **Academic questions, answer options and explanations are text-only**, so no narration or recording refresh is needed when a teacher edits them.

Traditional Chinese retains the existing browser/OS **Cantonese** read-aloud. Simplified Chinese uses bundled **Mandarin** recordings and English uses bundled **English** recordings, including numbers: 52 fixed lines in each language for the 20 named characters. Playback loads these game files without an API key or speech-generation request. There is **no Speech Studio in the teacher workspace** and no API-key entry for ordinary teachers or students. Only changes to fixed NPC dialogue require audio maintenance; teacher-edited academic content remains text-only.

A recording must match the character, language and exact sentence. If it is missing or changed, a matching device voice may be used; an initially empty voice list waits up to three seconds. When neither is available, read the visible text or try dialogue replay. Missing audio must not be replaced with the wrong language or character gender. **Test voice** is a sample, not proof that every character works on that device. The earlier Mac audit found no known male Cantonese device voice, so that remains a Cantonese limitation. Mandarin/English files use four shared voices with verified catalog metadata and MP3 integrity; full listening review on classroom devices remains necessary. See the [current sound policy](README.md#sound) and [known limitations](KNOWN-LIMITATIONS.md).

NPC names appear in dialogue only. Student NPC uniforms follow your chosen outfit series while retaining their own appearance. NPCs walk at about 88% of the protagonist’s top speed, with matching distance-driven foot movement and pauses.

## Join a class and continue on another device

1. Obtain the **class code** from your teacher. Open the class connection from onboarding or **Settings → Class connection → Manage**.
2. Enter the class code, student number and name, then choose **Join for the first time**.
3. Save the private **recovery code** shown after joining. The download control can save your recovery details; keep that file private.
4. On another device, open the class connection, enter the same class code and student number plus your recovery code, and select **Resume with code**.

Returning students should resume their existing record rather than join again. A class code alone does not recover a student's record. If you lose the recovery code, contact your teacher or site administrator; do not create a second identity to bypass the problem. An authorized recovery reset invalidates old student sessions. The current teacher interface does not provide a self-service reset button.

Class mode stores your name, class, number, answers and necessary progress, including your saved reflection, in the class database. It does not send reflections to a generative AI tool. Free exploration stays in the same browser and its previous scores are not imported into class results. Sign out after using a shared device. If a sync conflict appears, reload the latest record before continuing; do not assume a failed save succeeded.

## Teachers: open the workspace and create classes

1. From the title screen, choose **New Game → Teacher**. This opens the teacher workspace directly, without a student avatar or campus session. The in-game **Settings → Teacher workspace → Open** entry is also available.
2. Sign in with your **authorized teacher ChatGPT account** if prompted, then unlock with the configured teacher PIN. The project's requested shared PIN is **1234**. The PIN alone does not grant access: your identity must also be on the server's teacher allowlist.
3. Choose your teaching subject. The hub offers 13 learning subjects plus **AI Ethics and Inclusion**. Use **Change subject** when needed; grade, class and activity filters remain available across tools. Core AI questions can be reviewed but not edited.
4. In **Classes**, expand **Create classes**. Enter the school year, grade and section to create one class, or deliberately choose **Create 24 classes** for S1–S6 × A–D.
5. Copy each class's join code and share it with that class. Ask students to retain their own recovery codes.

Only your own classes are visible. Unlocks expire after 30 minutes and incorrect PIN attempts are rate-limited. Use **Lock** when leaving the workspace on a shared computer. If access is denied, check that you used the authorized identity; repeatedly entering the PIN will not fix an allowlist problem.



## Edit questions and publish a new activity

1. From your selected subject, open **Questions**, choose a grade, then select **New question** or **Edit**. Repeat **New question** to add a fourth, fifth or further question; there is no fixed question-count cap. Use **Change subject** to move to another subject.
2. Set the task level and choose **1–10 whole-number stars** for that question. Star values are independent of the level. Complete the title, question, options, feedback and takeaway in **all three language tabs**. Mark the correct answer and review it against the intended learning objective.
3. Save as **Draft** while reviewing, or **Published** when ready. Saving an edit creates a revision; it does not rewrite existing student work.
4. Go to **Classes → New activity**, enter an activity name and confirm. The activity uses the latest published questions for that grade. Students should load the new activity before answering it.

Publishing a question and starting a class activity are separate steps. Existing activities retain their original question versions, star values and score denominators. Changing a published question does not retroactively change those activities or their students’ earned stars. **Archive** removes a subject question from future activities while preserving earlier records. The four AI scenarios and final transfer task are read-only core content.

**Questions, options and explanations are text-only by design.** Edit and publish them normally; there are no corresponding voice files to regenerate or keep synchronized. Fixed NPC dialogue and the introduction are maintained separately behind the scenes. Teachers do not manage voice generation or API keys.

For example, an S2 mathematics teacher can revise a ratios or probability question, explain why the distractors are incorrect in each language, publish the revision, then start a named follow-up activity. Compare that activity with the earlier one without changing the older results. All 234 starter questions have been replaced with authored, curriculum-referenced questions and checked for structure, mathematics, language mirrors and version consistency, with cross-agent content review. See [curriculum alignment](docs/CURRICULUM-ALIGNMENT.md). Teachers should still review suitability for their own classes; this is not complete curriculum coverage.

## Review results, print reports and download Excel

1. Open **Results** and select the **class**, **subject** and **activity**. Historical activities remain selectable.
2. Read scores alongside student explanations and reflections. Subject scores use **first responses** on a 0–100 scale; an unfinished subject displays a dash and remains blank in the export.
3. Check **Earned stars** and **Available stars** alongside the percentage. These are the selected activity’s values, including progress before the subject is complete.
4. Choose **Print subject results** to open the browser’s native print flow for the selected class, subject and activity. Select a printer or Save as PDF and confirm there; opening Results never prints automatically.
5. Choose **Download subject Excel** for the selected subject, or **Download all subjects** for all 14 result categories in separate worksheets. Both use six fixed headers: **班別 / 學號 / 學生姓名 / 學科得分 / 獲得星星 / 可得星星**. The printed report contains equivalent fields translated to the interface language.

## Upload and print worksheets

Teacher-authored question worksheets can still use the Questions workspace’s print action. For uploaded PDFs, open **Worksheets** under one of the 13 learning subjects. The subject is fixed to your selection; set the title and grade, then upload a Traditional Chinese version, an English version, or both. Each file may be at most **5 MiB**; only authorized PDF content should be uploaded.

Students first connect to their class, then use **Print in the top-right HUD** from the relevant floor. There are no physical printer objects in corridors or rooms. Choose a subject on that floor and a language version the teacher has actually supplied. The server restricts access by teacher ownership, student class grade and floor; students cannot select a different grade. Moving to another floor changes the subjects available through Print.

Selecting a PDF loads a preview and does not print. After it loads, **Print PDF** requests the PDF reader/browser’s print flow; the user still confirms printer settings. **Open PDF** and **Download PDF** remain available if the embedded viewer cannot print. No physical print job or native print dialogue has been verified by the automated checks. See the [worksheet guide](docs/WORKSHEETS.md) for upload validation and device limitations. Keep teacher exports within your school’s normal handling of student records.

Progress stars differ from assessment scores. A later correct retry earns its one-time stars but does not change the first-response subject score. The starter campus has 39 subject questions for the selected grade and offers 103 total stars, with an exit at 100. These are defaults: a teacher’s added questions and star values change the activity’s total, and its exit threshold is the lower of 100 and the available total. A shorter lesson can finish the core AI discussion and reflection without completing the formal game ending.

## Plan a lesson

Allow roughly **20–30 minutes for the four AI scenarios and reflection**, or use selected subject rooms in a separate lesson. The full-campus estimate is **45–75 minutes or longer**. These are planning estimates, not student-tested timings.

Ask students to cite evidence, identify affected people, explain a practical repair and transfer the idea to a new situation. Do not interpret stars as moral character or complete subject mastery. All in-game AI outputs are teaching simulations. For the MEDD8934 presentation, use the separate live-tool protocol and fictional sample text in the [teaching guide](DESIGN-AND-TEACHING-GUIDE.md).
