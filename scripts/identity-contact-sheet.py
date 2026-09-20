#!/usr/bin/env python3
"""Contact sheet of every canonical reference slot: 4 creators x 6 slots, labelled, one PNG the owner approves from.
    python3 scripts/identity-contact-sheet.py  ->  media/identities/CONTACT_SHEET.png"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
R=Path(__file__).resolve().parents[1]; ID=R/'media/identities'
CREATORS=['marcus_vale','nia_brooks','camille_rose','maya_reyes']; SLOTS=['face_front','face_left','face_right','face_smile','face_neutral','body']
CELL,PAD,LABEL=320,12,54
W=PAD+len(SLOTS)*(CELL+PAD)+220; H=PAD+len(CREATORS)*(CELL+LABEL+PAD)+40
sheet=Image.new('RGB',(W,H),(248,247,244)); d=ImageDraw.Draw(sheet)
try: font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',20); small=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',15)
except Exception: font=small=ImageFont.load_default()
for r,c in enumerate(CREATORS):
    ident=json.loads((ID/c/'IDENTITY.json').read_text()); cast=ident.get('casting',{})
    y=PAD+r*(CELL+LABEL+PAD)
    d.text((PAD,y+8),ident['name'],fill=(20,20,20),font=font)
    d.text((PAD,y+36),f"{ident['canonical_subject']['presentation_age']} · {cast.get('ethnicity','?')}",fill=(90,90,90),font=small)
    d.text((PAD,y+58),(cast.get('hair','') or '')[:34],fill=(120,120,120),font=small)
    for k,s in enumerate(SLOTS):
        x=220+PAD+k*(CELL+PAD); p=ID/c/'references'/f'{s}.png'
        if p.exists(): sheet.paste(Image.open(p).convert('RGB').resize((CELL,CELL)),(x,y))
        else: d.rectangle([x,y,x+CELL,y+CELL],outline=(200,60,60),width=3); d.text((x+10,y+10),'MISSING',fill=(200,60,60),font=font)
        d.text((x,y+CELL+6),s,fill=(60,60,60),font=small)
d.text((PAD,H-30),'Creator Network — canonical reference slots, gpt-image-2, generated 2026-09-20. Synthetic persons; approve or reject per row.',fill=(120,120,120),font=small)
out=ID/'CONTACT_SHEET.png'; sheet.save(out); print(out, sheet.size)
