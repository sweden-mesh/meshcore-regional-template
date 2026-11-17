#!/usr/bin/env python3
"""Pixel-art board illustrations -> SVG (crisp, merged runs) + PNG preview."""
import sys, os
from PIL import Image
OUT = sys.argv[1]
W, H = 64, 40
P = {
 'k': '#14181e',  # outline
 'b': '#232a33', 'B': '#313a46', 'd': '#181d24',      # black pcb
 'g': '#d6a43a', 'G': '#f0c860', 'h': '#94701f',      # gold
 's': '#b9c0ca', 'S': '#e9edf2', 'z': '#7d8591',      # silver
 'o': '#0b0f14', 'O': '#7fd0ff', 'q': '#3a6f8f',      # oled glass / lit px / dim px
 'v': '#2e7a3a', 'V': '#43a052', 'w': '#1d5426',      # green pcb
 'u': '#1f4f8f', 'U': '#3270bd', 'y': '#143665',      # blue pcb
 'c': '#2a2d31', 'C': '#44484e',                      # chip
 'r': '#e2483c', 'n': '#42d36a', 'a': '#ff9d2e',      # leds
 'm': '#5d636b', 'M': '#878e97',                      # button / plastic
 'e': '#e7e7e2',                                      # silkscreen
 'p': '#7a2fb5', 'P': '#9b55d6', 'x': '#561f82',      # purple pcb (RAK base)
}
class C:
    def __init__(s): s.g=[[None]*W for _ in range(H)]
    def px(s,x,y,c):
        if 0<=x<W and 0<=y<H: s.g[y][x]=c
    def rect(s,x,y,w,h,c):
        for j in range(y,y+h):
            for i in range(x,x+w): s.px(i,j,c)
    def board(s,x,y,w,h,base,hi,lo,round_=True):
        s.rect(x,y,w,h,'k')
        s.rect(x+1,y+1,w-2,h-2,base)
        s.rect(x+1,y+1,w-2,1,hi); s.rect(x+1,y+1,1,h-2,hi)
        s.rect(x+1,y+h-2,w-2,1,lo); s.rect(x+w-2,y+1,1,h-2,lo)
        if round_:
            for (i,j) in [(x,y),(x+w-1,y),(x,y+h-1),(x+w-1,y+h-1)]: s.g[j][i]=None
    def pins(s,x,y,n,step=2,c='g',hole='h',vertical=False):
        for k in range(n):
            i,j=(x,y+k*step) if vertical else (x+k*step,y)
            s.px(i,j,c)
    def shield(s,x,y,w,h):
        s.rect(x,y,w,h,'z'); s.rect(x+1,y+1,w-2,h-2,'s'); s.rect(x+1,y+1,w-2,1,'S'); s.rect(x+1,y+1,1,h-2,'S')
    def chip(s,x,y,w,h):
        s.rect(x,y,w,h,'C'); s.rect(x+1,y+1,w-2,h-2,'c'); s.rect(x,y,w,1,'M'); s.px(x+1,y+1,'C')
        for i in range(x+1,x+w-1,2): s.px(i,y-1,'z'); s.px(i,y+h,'z')
    def usbc(s,x,y,vertical=False):
        if vertical: s.rect(x,y,4,6,'z'); s.rect(x+1,y+1,2,4,'S'); s.rect(x+1,y+2,2,2,'o')
        else: s.rect(x,y,6,4,'z'); s.rect(x+1,y+1,4,2,'S'); s.rect(x+2,y+1,2,2,'o')
    def oled(s,x,y,w,h,lines=True):
        s.rect(x,y,w,h,'k'); s.rect(x+1,y+1,w-2,h-2,'o')
        if lines:
            # a tiny "screen": title bar + a few text rows
            s.rect(x+2,y+2,w-4,1,'O')
            for r,ln in enumerate([w-8,w-12,w-6]):
                yy=y+4+r*2
                if yy<y+h-1:
                    for i in range(x+2,x+2+ln):
                        if (i*7+yy*3)%5: s.px(i,yy,'q' if r else 'O')
    def ipex(s,x,y): s.rect(x,y,3,3,'G'); s.px(x+1,y+1,'h')
    def button(s,x,y): s.rect(x,y,3,2,'M'); s.rect(x,y+1,3,1,'m')
    def led(s,x,y,c): s.px(x,y,c)
    def spring_antenna(s,x,y,n):
        for k in range(n):
            s.rect(x+k*2,y,1,4,'G'); s.px(x+k*2+1,y+3,'h'); s.px(x+k*2+1,y,'G')
    def svg(s,title):
        runs=[]
        for y in range(H):
            x=0
            while x<W:
                c=s.g[y][x]
                if c is None: x+=1; continue
                x0=x
                while x<W and s.g[y][x]==c: x+=1
                runs.append((c,x0,y,x-x0))
        by={}
        for c,x,y,w in runs: by.setdefault(c,[]).append(f'M{x} {y}h{w}v1h-{w}z')
        body=''.join(f'<path fill="{P[c]}" d="{"".join(d)}"/>' for c,d in by.items())
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W*4}" height="{H*4}" '
                f'shape-rendering="crispEdges" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')
    def png(s,path,scale=8):
        im=Image.new('RGBA',(W,H),(0,0,0,0))
        for y in range(H):
            for x in range(W):
                c=s.g[y][x]
                if c: im.putpixel((x,y),tuple(int(P[c][i:i+2],16) for i in (1,3,5))+(255,))
        im.resize((W*scale,H*scale),Image.NEAREST).save(path)

def heltec(v4=False,fem=True):
    c=C()
    c.board(4,8,54,24,'b','B','d')
    c.pins(7,9,25); c.pins(7,30,25)            # header rows top & bottom
    c.usbc(4,18,vertical=True)                  # USB-C on the left edge
    c.oled(18,12,24,15)                         # 0.96" OLED
    c.chip(45,13,6,6)                           # ESP32-S3
    c.shield(45,21,7,6) if not v4 else c.shield(44,21,8,6)  # SX1262 module
    c.ipex(54,12)                               # antenna connector
    c.button(9,12); c.button(9,25)              # PRG / RST
    c.led(13,13,'a')
    if v4:
        c.rect(53,22,4,5,'k'); c.rect(54,23,2,3,'M'); c.px(54,23,'S')  # FEM
        c.rect(12,17,3,5,'e'); c.rect(13,18,1,3,'b')  # solar/battery JST
        if not fem: c.px(55,25,'n')
    else:
        c.rect(12,18,3,4,'e'); c.rect(13,19,1,2,'b')  # battery JST
    return c

def t096():
    c=C()
    c.board(6,8,50,24,'b','B','d')
    c.usbc(6,18,vertical=True)
    c.oled(16,11,18,13)                          # 0.96" TFT-ish (smaller)
    c.shield(37,11,10,10)                         # nRF52840 module
    c.shield(37,23,9,6)                           # SX1262 + FEM
    c.ipex(50,11)
    c.pins(9,30,22)
    c.button(11,12); c.led(12,26,'n')
    c.rect(16,26,4,3,'e'); c.rect(17,27,2,1,'b')  # battery JST
    c.rect(22,26,4,3,'e'); c.rect(23,27,2,1,'b')  # solar JST
    return c

def rak():
    c=C()
    c.board(3,6,58,30,'u','U','y')               # WisBlock base (RAK19007)
    c.board(14,9,26,22,'b','B','d',round_=False) # RAK4631 core module
    c.shield(16,11,22,18)
    for i in range(18,36,4): c.px(i,15,'z')
    c.ipex(41,10); c.ipex(41,15)                 # LoRa + BLE
    c.usbc(3,17,vertical=True)
    c.rect(44,26,6,4,'e'); c.rect(45,27,4,2,'b')  # battery
    c.rect(52,26,5,4,'e'); c.rect(53,27,3,2,'b')  # solar
    for k in range(4): c.rect(45+k*0,9+k*0,0,0,'k')
    c.board(44,10,14,13,'y','u','y',round_=False) # empty sensor slot
    c.rect(46,12,10,9,'d'); c.pins(47,16,5)
    c.button(8,8); c.led(8,30,'n'); c.led(10,30,'u' if False else 'U')
    return c

def xiao(esp=False):
    c=C()
    c.board(12,8,40,26,'b','B','d')              # Wio-SX1262 for XIAO (base)
    c.shield(36,12,13,13)                         # SX1262 module
    c.ipex(46,27)
    c.pins(14,10,6,step=3); c.pins(14,31,6,step=3)
    c.board(10,10,22,20,'d','b','k',round_=False) # XIAO on top
    c.usbc(8,17,vertical=True)
    c.shield(14,12,15,14)
    if esp:
        c.ipex(27,26)                             # XIAO ESP32-S3 Wi-Fi antenna connector
        c.led(13,27,'a')
    else:
        c.led(13,27,'n'); c.led(13,28,'r')
    for k in range(7):                            # castellations
        c.px(11,12+k*2,'g'); c.px(30,12+k*2,'g')
    c.button(17,27) if esp else None
    return c

def pizero():
    c=C()
    c.board(2,10,60,26,'v','V','w')              # Pi Zero 2 W
    c.rect(4,12,0,0,'k')
    c.chip(26,22,8,7)                            # RP3A0
    c.rect(4,30,6,4,'z'); c.rect(5,31,4,2,'S')   # mini HDMI
    c.rect(40,31,5,3,'z'); c.rect(41,32,3,1,'S'); c.rect(48,31,5,3,'z'); c.rect(49,32,3,1,'S')  # micro USB x2
    c.rect(56,20,4,8,'m')                         # camera connector
    c.board(6,4,50,20,'u','U','y',round_=False) # SX1262 HAT on top
    c.pins(9,6,22); c.pins(9,8,22,c='G')         # 40-pin header through the HAT
    c.shield(30,11,12,9)                          # SX1262 module
    c.ipex(44,11)
    c.rect(46,16,6,4,'G'); c.rect(47,17,4,2,'h')  # SMA base
    c.led(12,15,'r'); c.led(14,15,'n'); c.button(11,18)
    return c

boards = {
 'heltec-v3': (heltec(), 'Heltec V3'),
 'heltec-v4': (heltec(v4=True), 'Heltec V4 (FEM på)'),
 'heltec-v4-3': (heltec(v4=True,fem=False), 'Heltec V4.3 (FEM av)'),
 'heltec-t096': (t096(), 'Heltec T096'),
 'rak4631': (rak(), 'RAK4631 på WisBlock-bas'),
 'xiao-nrf52840': (xiao(), 'XIAO nRF52840 med Wio-SX1262'),
 'xiao-esp32s3': (xiao(esp=True), 'XIAO ESP32-S3 med Wio-SX1262'),
 'pi-zero-2w': (pizero(), 'Raspberry Pi Zero 2 W med LoRa-HAT'),
}
os.makedirs(OUT,exist_ok=True)
for k,(c,t) in boards.items():
    open(f'{OUT}/{k}.svg','w').write(c.svg(t)); c.png(f'{OUT}/{k}.png')
# contact sheet
ims=[Image.open(f'{OUT}/{k}.png') for k in boards]
sheet=Image.new('RGBA',(ims[0].width*2+30, (ims[0].height+10)*4),(240,240,236,255))
for i,im in enumerate(ims): sheet.paste(im,((i%2)*(im.width+30),(i//2)*(im.height+10)),im)
sheet.save(f'{OUT}/_sheet.png'); print('ok', len(boards))
