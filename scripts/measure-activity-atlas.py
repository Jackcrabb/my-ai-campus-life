"""Measure original RGBA activity sheets without modifying image pixels.

Usage: python3 scripts/measure-activity-atlas.py PNG STEM ID:ACTIVITY [...]
Four chronological poses per identity: enter, main A, main B, exit.
"""
from collections import deque
from pathlib import Path
from statistics import median
import json
import sys

from PIL import Image

source, stem, *roles = sys.argv[1:]
root = Path(__file__).resolve().parents[1]
image = Image.open(source)
if image.mode != "RGBA":
    raise SystemExit("Expected genuine RGBA source, not a flattened background")
alpha = image.getchannel("A")
width, height = image.size
histogram = alpha.histogram()
if histogram[0] < width * height * 0.25:
    raise SystemExit("Unexpectedly little transparent background: inspect image")
mask = bytearray(1 if value > 32 else 0 for value in alpha.getdata())
components = []
for start in range(len(mask)):
    if not mask[start]:
        continue
    mask[start] = 0
    queue = deque([start])
    count, x0, y0, x1, y1 = 0, width, height, 0, 0
    while queue:
        index = queue.popleft()
        y, x = divmod(index, width)
        count += 1
        x0, y0, x1, y1 = min(x0, x), min(y0, y), max(x1, x), max(y1, y)
        neighbours = (
            index - 1 if x else -1,
            index + 1 if x < width - 1 else -1,
            index - width if y else -1,
            index + width if y < height - 1 else -1,
        )
        for neighbour in neighbours:
            if neighbour >= 0 and mask[neighbour]:
                mask[neighbour] = 0
                queue.append(neighbour)
    if count > 1000:
        components.append((x0, y0, x1 + 1, y1 + 1))
if len(components) != len(roles) * 4:
    raise SystemExit(f"Expected {len(roles) * 4} complete figures, got {len(components)}: {components}")
components.sort(key=lambda box: box[1])
components = [box for row in range(len(roles))
              for box in sorted(components[row * 4:row * 4 + 4], key=lambda box: box[0])]
frames, identities = [], []
for x0, y0, x1, y1 in components:
    if min(x0, y0) <= 0 or x1 >= width or y1 >= height:
        raise SystemExit(f"Figure may touch sheet edge: {(x0,y0,x1,y1)}")
    head_region = alpha.crop((x0, y0, x1, y0 + round((y1-y0) * 0.13)))
    head_box = head_region.point(lambda value: 255 if value > 64 else 0).getbbox()
    anchor = round(x0 + (head_box[0] + head_box[2]) / 2)
    frames.append(dict(x=x0-2, y=y0-2, w=x1-x0+4, h=y1-y0+4,
                       anchorX=anchor, baseline=y1-3))
for row, role in enumerate(roles):
    character_id, activity = role.split(":", 1)
    first = row * 4
    standing_height = round(median(box[3]-box[1] for box in components[first:first+4]))
    entry = dict(id=character_id, standingHeight=standing_height,
                 activities={activity: dict(enter=[first], loop=[first+1, first+2],
                                            exit=[first+3], fps=0.65)})
    identities.append(entry)
layout = dict(id=stem, src=f"images/activities/{stem}.png", width=width,
              height=height, cols=4, rows=len(roles), facing="right", frames=frames,
              identities=identities, alphaThresholdForBounds=32,
              alpha=dict(transparentPixels=histogram[0], opaquePixels=histogram[255],
                         nearOpaquePixels=sum(histogram[248:]), minimum=alpha.getextrema()[0],
                         maximum=alpha.getextrema()[1], cornerAlpha=[alpha.getpixel(p) for p in
                         [(0,0),(width-1,0),(0,height-1),(width-1,height-1)]]),
              notes="Original PNG unchanged. Connected alpha components measured; two-pixel crop padding. Head center anchors and feet-minus-three baseline. One median standing height per identity; never resize per frame. Four drawn activity poses: enter, main A, main B, exit. Inspect images before registration.")
destination = root / "design" / "production-activities" / f"{stem}.layout.json"
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_text(json.dumps(layout, indent=2) + "\n")
print(json.dumps(dict(layout=str(destination.relative_to(root)), size=image.size,
                      identities=identities, alpha=layout["alpha"]), indent=2))
