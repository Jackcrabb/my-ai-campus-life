"""Authoring-only generator. Requires OpenCC for Traditional-to-Simplified copy.
Runtime consumes the checked-in JSON; no Python or OpenCC dependency is deployed.
"""
import json
from pathlib import Path
from opencc import OpenCC
root=Path(__file__).resolve().parents[2]
cc=OpenCC('t2s')
def T(zh,en): return {'zh':zh,'cn':cc.convert(zh),'en':en}
topics={
'chinese':['Narrative voice','Metaphor','Causal inference','Relevant evidence','Qualified stance','Synthesis'],
'english':['Subject–verb agreement','Past tense','Passive voice','Conditionals','Cautious claims','Argument evaluation'],
'maths':['Integer operations','Linear equations','Percentage changes','Quadratic equations','Independent events','Conditional probability'],
'chemistry':['Separating mixtures','Controlled variables','Atomic structure','Amount of substance','pH data','Reaction rate'],
'geography':['Map directions','Map scale','Rainfall totals','Urban temperature','Sampling bias','Population-adjusted rates'],
'computer':['Data and instructions','Algorithms','Boolean logic','Unseen test data','Accuracy and imbalance','Data leakage'],
'history':['Chronology','Primary sources','Source purpose','Continuity and change','Multiple causes','Independent evidence'],
'art':['Visual contrast','Visual hierarchy','Accessible graphics','Artistic context','Design iteration','Creative process'],
'music':['Time signatures','Note duration','Tempo','Dynamics','Fair comparison','Evidence in music criticism'],
'library':['Catalogue search','Focused keywords','Checking citations','Neutral research questions','Sampling limitations','Research synthesis'],
'rooftop':['Plant observations','Water savings','Mean height','Fair experiments','Missing observations','Environmental decisions'],
'playground':['Equal participation','Lap averages','Success rates','Adapting participation','Scoring reliability','Group-level fairness'],
'hall':['Data minimisation','Checking facts','Inclusive communication','Appeal and review','Group experience','Ongoing governance']}
scenarios=json.loads((root/'scripts/content-authoring/grade-scenarios.json').read_text())
items=[]
for subject,rows in scenarios.items():
 assert len(rows)==6
 for grade,row in enumerate(rows,1):
  topic,qzh,qen,ozh,oen,rzh,ren=row
  zh=ozh.split('|');en=oen.split('|');assert len(zh)==len(en)==3
  forms=[
   (T('基礎：'+topic,'Foundation: '+topics[subject][grade-1]),T(qzh,qen),list(zip(zh,en))),
   (T('應用：核對 AI 建議','Apply: check an AI suggestion'),T(qzh+'\nAI 回答：「'+zh[1]+'」。你應如何回應？',qen+'\nAI answers: “'+en[1]+'”. How should you respond?'),[(f'更正為「{zh[0]}」，並核對題目條件。',f'Correct it to “{en[0]}” and check the conditions.'),(f'接受「{zh[1]}」，因為是 AI 提供。',f'Accept “{en[1]}” because AI supplied it.'),('不核對，直接轉發答案。','Forward the answer without checking.')]),
   (T('挑戰：解釋判斷依據','Challenge: explain your reasoning'),T(qzh+'\n若選擇「'+zh[0]+'」，哪項理由最充分？',qen+'\nIf you choose “'+en[0]+'”, which justification is strongest?'),[(rzh,ren),('因為回答最有自信，所以不需證據。','Because the answer sounds confident, no evidence is needed.'),('因為最多人選擇，所以必然正確。','Because most people chose it, it must be correct.')])]
  for k,(title,question,opts) in enumerate(forms):
   pairs=[]
   for i,(a,b) in enumerate(opts):
    pairs.append({'text':T(a,b),'correct':i==0,'feedback':T(rzh if i==0 else '這個選擇未能符合題目條件。'+rzh,ren if i==0 else 'This choice does not follow the conditions. '+ren)})
   shift=(grade+k+len(subject))%3;pairs=pairs[shift:]+pairs[:shift]
   for i,o in enumerate(pairs):o['id']='abc'[i]
   items.append({'id':f's{grade}-{subject}-{k+1:02d}','grade':grade,'subjectId':subject,'roomId':subject,'category':'subject','level':['foundation','application','challenge'][k],'stars':k+1,'maxScore':1,'title':title,'question':question,'options':pairs,'takeaway':T(rzh,ren)})
assert len(items)==234
(root/'data/grade-bank.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
(root/'public/campus/grade-content.js').write_text('/* Original graded learning scenarios. Classroom teachers should review suitability. */\nwindow.GRADE_CONTENT = '+json.dumps(items,ensure_ascii=False,separators=(',',':'))+';\n')
print(f'Generated {len(items)} questions: 6 grades × 13 spaces × 3 levels; complete zh/cn/en.')
