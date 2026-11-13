#!/usr/bin/env python3
"""Make assets/se-lan.geojson: Sweden's 21 counties, keyed by SCB code, simplified to ~1 km.

Source: Natural Earth 10m admin-1 v5.1.2 (public domain),
https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson
Run:    python3 scripts/se-lan.py ne_10m_admin_1_states_provinces.geojson assets/se-lan.geojson
Only outer rings are kept: the wizards measure the distance to a county's border.
"""
import json,sys
src,out=sys.argv[1],sys.argv[2]
d=json.load(open(src))
# ISO 3166-2:SE letter codes -> SCB county codes
ISO2SCB={"AB":"01","C":"03","D":"04","E":"05","F":"06","G":"07","H":"08","I":"09","K":"10","M":"12","N":"13","O":"14","S":"17","T":"18","U":"19","W":"20","X":"21","Y":"22","Z":"23","AC":"24","BD":"25"}
def dp(pts,eps):
    if len(pts)<3: return pts
    (x1,y1),(x2,y2)=pts[0],pts[-1]
    dx,dy=x2-x1,y2-y1; L=(dx*dx+dy*dy)**.5 or 1e-12
    dmax,idx=0,0
    for i in range(1,len(pts)-1):
        x,y=pts[i]; dd=abs(dy*x-dx*y+x2*y1-y2*x1)/L
        if dd>dmax: dmax,idx=dd,i
    if dmax>eps: return dp(pts[:idx+1],eps)[:-1]+dp(pts[idx:],eps)
    return [pts[0],pts[-1]]
sys.setrecursionlimit(100000)
feats=[]
for f in d["features"]:
    p=f["properties"]
    if p.get("adm0_a3")!="SWE": continue
    iso=p["iso_3166_2"].split("-")[1]; scb=ISO2SCB[iso]
    g=f["geometry"]; polys=g["coordinates"] if g["type"]=="MultiPolygon" else [g["coordinates"]]
    rings=[]
    for poly in polys:
        ring=poly[0]; h=len(ring)//2; r=dp(ring[:h+1],0.01)[:-1]+dp(ring[h:],0.01)  # ~1 km; outer rings only, holes do not matter for distance
        if len(r)>=4: rings.append([[round(x,3),round(y,3)] for x,y in r])
    feats.append({"type":"Feature","properties":{"scb":scb,"name":p["name"]},"geometry":{"type":"MultiPolygon","coordinates":[[r] for r in rings]}})
feats.sort(key=lambda f:f["properties"]["scb"])
json.dump({"type":"FeatureCollection","features":feats},open(out,"w"),separators=(",",":"))
print(len(feats),[f["properties"]["scb"] for f in feats])
