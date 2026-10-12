"""Build the original curriculum-referenced starter bank from authored items.

Authoring only: requires opencc-python-reimplemented. No Python or OpenCC is
shipped. Stable item IDs/scoring: the server handles versioned content refresh,
never overwriting old assignments.
"""
import hashlib
import json
from pathlib import Path
from opencc import OpenCC

ROOT = Path(__file__).resolve().parents[2]
VERSION = 'hk-curriculum-2026-10-v2'
SUBJECTS = ['chinese', 'english', 'maths', 'chemistry', 'geography', 'computer',
            'history', 'art', 'music', 'library', 'rooftop', 'playground', 'hall']
LEVELS = ['foundation', 'application', 'challenge']
SIMPLIFY = OpenCC('t2s')


def tri(pair):
    assert len(pair) == 2 and all(isinstance(s, str) and s.strip() for s in pair)
    zh, en = (s.strip() for s in pair)
    return {'zh': zh, 'cn': SIMPLIFY.convert(zh), 'en': en}


def build():
    sources = sorted((ROOT / 'scripts/content-authoring').glob('grade-items-*.json'))
    authored = [item for path in sources for item in json.loads(path.read_text())]
    keys = [(q['subjectId'], q['grade'], q['level']) for q in authored]
    expected = {(s, g, level) for s in SUBJECTS for g in range(1, 7) for level in range(1, 4)}
    assert len(keys) == len(set(keys)) == len(expected) == 234, 'Duplicate or missing authored items'
    assert set(keys) == expected, 'Unexpected subject/grade/level'
    authored.sort(key=lambda q: (SUBJECTS.index(q['subjectId']), q['grade'], q['level']))
    items = []
    for q in authored:
        subject, grade, level = q['subjectId'], q['grade'], q['level']
        assert len(q['options']) == 3 and type(q['answer']) is int and q['answer'] in range(3)
        options = []
        for index, option in enumerate(q['options']):
            assert len(option) == 4
            options.append({'text': tri(option[:2]), 'correct': index == q['answer'],
                            'feedback': tri(option[2:])})
        # Balance all three correct positions within each grade/room. Rotate the
        # complete option, including its explanation, rather than rewriting it.
        target = (grade + level + SUBJECTS.index(subject)) % 3
        shift = (q['answer'] - target) % 3
        options = options[shift:] + options[:shift]
        for index, option in enumerate(options):
            option['id'] = 'abc'[index]
        assert options[target]['correct']
        items.append({'id': f's{grade}-{subject}-{level:02d}', 'grade': grade,
                      'subjectId': subject, 'roomId': subject, 'category': 'subject',
                      'level': LEVELS[level - 1], 'stars': level, 'maxScore': 1,
                      'title': tri(q['title']), 'question': tri(q['question']),
                      'options': options, 'takeaway': tri(q['takeaway'])})
    for locale in ('zh', 'cn', 'en'):
        stems = [q['question'][locale] for q in items]
        assert len(set(stems)) == len(stems), f'Repeated {locale} question stem'
    bank_text = json.dumps(items, ensure_ascii=False, indent=2) + '\n'
    (ROOT / 'data/grade-bank.json').write_text(bank_text)
    digest = hashlib.sha256(bank_text.encode('utf-8')).hexdigest()
    metadata = {'version': VERSION, 'contentHash': digest, 'hashFormat': 'sha256-file-utf8',
                'questionCount': len(items), 'grades': [1, 2, 3, 4, 5, 6],
                'subjects': SUBJECTS, 'authoringFiles': [str(p.relative_to(ROOT)) for p in sources]}
    (ROOT / 'data/curriculum-version.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    references = json.loads((ROOT / 'scripts/content-authoring/curriculum-sources.json').read_text())
    assert set(references) == set(SUBJECTS), 'Missing curriculum references'
    outcomes = []
    for subject in SUBJECTS:
        for grade in range(1, 7):
            questions = [q for q in items if q['subjectId'] == subject and q['grade'] == grade]
            outcomes.append({'subjectId': subject, 'grade': grade,
                'placement': 'editorial sequence within key-stage references; teacher review required',
                'sources': references[subject],
                'items': [{'questionId': q['id'], 'level': q['level'],
                           'focus': q['title'], 'learningOutcome': q['takeaway']} for q in questions]})
    alignment = {'version': VERSION, 'verifiedOn': '2026-10-10', 'outcomes': outcomes}
    (ROOT / 'data/curriculum-alignment.json').write_text(json.dumps(alignment, ensure_ascii=False, indent=2) + '\n')
    browser = ('/* Original curriculum-referenced starter questions. Teacher review and local sequencing required. */\n'
               'window.GRADE_CONTENT_VERSION = ' + json.dumps(VERSION) + ';\n'
               'window.GRADE_CONTENT = ' + json.dumps(items, ensure_ascii=False, separators=(',', ':')) + ';\n')
    (ROOT / 'public/campus/game/grade-content.js').write_text(browser)
    print(f'Built {len(items)} independent questions; complete zh/cn/en; version {VERSION}')
    print(f'SHA-256: {digest}')


if __name__ == '__main__':
    build()
