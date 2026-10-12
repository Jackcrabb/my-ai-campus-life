# Independent teacher login — design and browser evidence

Recorded on **13 October 2026** for **My AI Campus Life**. These files distinguish the approved generated proposal from screenshots of the published implementation.

| File | Source and scope |
|---|---|
| [Approved preview](teacher-login-approved-preview.png) | Built-in imagegen output, 1672 × 941. The user approved the cream, deep-teal and gold pixel treatment, then requested removal of the “No ChatGPT account required” subtitle. The original preview is preserved unchanged as a historical design artifact. |
| [Desktop teacher login](teacher-login-desktop.jpg) | Browser capture of the independently hosted implementation, 1728 × 822. The unwanted subtitle is absent. |
| [Mobile teacher login](teacher-login-mobile.jpg) | Browser capture at 390 × 844. The login card fits without observed horizontal overflow. |
| [Teacher workspace](teacher-workspace-desktop.jpg) | Browser capture after successful teacher-code login, 1728 × 822, showing the 14-entry subject/theme chooser. |
| [Desktop student setup](student-setup-desktop.jpg) | Browser capture of the student setup, 1728 × 822, with the school background and full character visible. |

The generated proposal used the project’s existing pixel-campus interface as a visual reference. It is not a screenshot or runtime asset. The captures were taken from [the independently hosted game](https://my-ai-campus-life.hjhlgz.workers.dev/campus/); they are not newly generated artwork and do not display a teacher code or student records. File sizes, dimensions and SHA-256 hashes are recorded in [assets.json](assets.json).

The approved preview’s obsolete subtitle must not be copied back into the interface. Browser screenshots establish the observed layout and login/subject-chooser state, not every teacher workflow, physical audio or printing. The [release audit](../../../docs/DISTRIBUTION-AUDIT.md#13-october-2026-independent-hosting-rollout) separately records 12 live API checks, cleanup and remaining network/device limits.

This package contains **one new generated preview and four browser screenshots**. It supplements the conversation archive; it does not change the earlier verified archive’s 98-image count or its historical cutoff.
