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
 'W': '#eef0f2', 'l': '#a3a9b1', 'L': '#5f666f',      # white label on the XIAO shield, its print
 'i': '#3f86d8',                                      # small blue button
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
    """Heltec WiFi LoRa 32 V3/V4 as photographed: a long black board, 18 header pins per side, USB-C
    at one end between the PRG and RST buttons, the OLED over most of the middle, and at the far end
    the antenna plug, a small LED and two round mounting holes. V4 carries a white "V4" mark."""
    c=C()
    c.board(4,8,56,24,'b','B','d')
    c.pins(7,9,18,step=3); c.pins(7,30,18,step=3)    # 2 x 18 header pins
    c.usbc(4,17,vertical=True)                      # USB-C at the left end
    c.button(9,11); c.button(9,26)                  # PRG / RST beside it
    c.oled(15,12,30,16)                             # 0.96" OLED, most of the board
    for (hx,hy) in ((52,12),(52,25)):               # mounting holes at the far end
        c.rect(hx,hy,4,4,'z'); c.rect(hx+1,hy+1,2,2,'k')
    c.ipex(52,18)                                   # antenna plug
    c.led(49,13,'a')
    if v4:
        c.rect(46,24,5,3,'e'); c.rect(47,25,1,1,'b'); c.rect(49,25,1,1,'b')   # white "V4" mark
        if not fem: c.px(50,22,'n')                 # V4.3: FEM switched off (green dot)
    else:
        c.rect(46,24,4,3,'e'); c.rect(47,25,2,1,'b')  # battery connector (SH1.25)
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
    """RAK WisBlock base with a RAK4631 core, as photographed: a black base board, gold round
    mounting holes, white battery and solar plugs and USB-C at one end, the RAK4631 module with its
    white label, and the sensor slots with their screw holes at the other end."""
    c=C()
    c.board(3,7,58,28,'b','B','d')                  # WisBlock base, black
    for (hx,hy) in ((5,9),(5,29),(55,9),(55,29)):   # gold mounting holes
        c.rect(hx,hy,4,4,'G'); c.rect(hx+1,hy+1,2,2,'h')
    c.usbc(3,18,vertical=True)                      # USB-C
    c.rect(9,13,5,4,'e'); c.rect(10,14,3,2,'M')     # battery plug (white JST)
    c.rect(9,24,5,4,'e'); c.rect(10,25,3,2,'M')     # solar plug
    c.board(16,11,20,18,'d','b','k',round_=False)   # RAK4631 core module
    c.rect(18,13,16,14,'z'); c.rect(19,14,14,12,'W') # its shield with the white label
    for i in range(21,31):
        if i%3: c.px(i,17,'L')
    c.rect(21,20,3,3,'i'); c.rect(25,21,6,1,'l')    # blue RAK mark, text line
    c.ipex(32,28)                                   # LoRa antenna plug
    c.pins(17,9,9,step=2)                           # header row above the module
    for (sx,sy) in ((39,10),(39,21)):               # two sensor slots with screw holes
        c.rect(sx,sy,14,9,'k'); c.rect(sx+1,sy+1,12,7,'d')
        c.rect(sx+2,sy+3,6,2,'c'); c.rect(sx+10,sy+3,2,2,'z')
    c.led(15,31,'n'); c.led(17,31,'U')
    return c

def xiao(esp=False):
    """Seeed XIAO (nRF52840 or ESP32-S3) as sold: a small black board, USB-C out past one short
    edge, 7 castellated pads on each long side, a metal shield under a white "seeed studio" label.
    The Wio-SX1262 for XIAO sits underneath and shows only as a darker edge with its antenna plug."""
    c=C()
    x,y,w,h=20,8,28,24
    c.board(x+3,y+3,w,h,'d','b','k')              # Wio-SX1262 underneath, peeking out
    c.ipex(x+w-2,y+h-1)                           # its LoRa antenna (U.FL)
    c.board(x,y,w,h,'b','B','d')                  # the XIAO
    for k in range(7):                            # castellated pads, top and bottom edge
        px=x+2+k*4
        c.rect(px,y,2,2,'g'); c.px(px,y,'h'); c.px(px+1,y,'h')
        c.rect(px,y+h-2,2,2,'g'); c.px(px,y+h-1,'h'); c.px(px+1,y+h-1,'h')
    # USB-C out past the left edge
    c.rect(x-5,y+7,9,10,'z'); c.rect(x-4,y+8,7,8,'S'); c.rect(x-4,y+9,7,6,'s'); c.rect(x-3,y+11,5,2,'o')
    # shield with the white label
    lx,ly,lw,lh=x+6,y+3,w-9,h-6
    c.rect(lx,ly,lw,lh,'z'); c.rect(lx+1,ly+1,lw-2,lh-2,'W')
    for i in range(lx+3,lx+lw-3):                 # "seeed studio" as a bold print line
        if (i-lx)%5: c.px(i,ly+4,'L'); c.px(i,ly+5,'L')
    for r,ln in enumerate([lw-8,lw-10,lw-12]):    # model / FCC lines
        for i in range(lx+3,lx+3+ln):
            if (i*3+r)%4: c.px(i,ly+8+r*2,'l')
    c.rect(lx+3,ly+lh-5,3,2,'L'); c.rect(lx+7,ly+lh-5,3,2,'L')   # FC  CE marks
    if esp:
        c.rect(x+w-3,y+5,2,12,'c'); c.rect(x+w-3,y+6,1,10,'C')    # board-to-board connector
        c.ipex(x+w-5,y+h-6)                       # Wi-Fi/BT antenna plug
        c.led(x+5,y+4,'a')                        # charge LED
    else:
        c.rect(x+9,y+h-3,3,1,'i')                 # the small blue button
        c.led(x+4,y+4,'n'); c.led(x+4,y+h-5,'r')
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

QMARK = ["0111110", "1100011", "0000011", "0001110", "0011000", "0000000", "0011000"]
def qmark(c, x, y, col='e'):
    for j, row in enumerate(QMARK):
        for i, v in enumerate(row):
            if v == '1': c.px(x + i, y + j, col)

def generic(kind):
    """A board not listed (B-322): the family's shape, plain, with a question mark."""
    if kind == 'nrf52':
        c = C(); c.board(8, 8, 48, 24, 'b', 'B', 'd'); c.usbc(8, 18, vertical=True)
        c.shield(34, 12, 14, 14); c.ipex(50, 11); qmark(c, 18, 13)
    elif kind == 'esp32':
        c = C(); c.board(4, 8, 54, 24, 'b', 'B', 'd'); c.pins(7, 9, 25); c.pins(7, 30, 25)
        c.usbc(4, 18, vertical=True); c.chip(40, 14, 7, 7); c.shield(48, 14, 6, 6); c.ipex(54, 11); qmark(c, 20, 14)
    else:
        c = C(); c.board(2, 10, 60, 26, 'v', 'V', 'w'); c.board(6, 4, 50, 20, 'u', 'U', 'y', round_=False)
        c.pins(9, 6, 22); c.shield(34, 11, 10, 9); qmark(c, 18, 11)
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
 'generic-nrf52': (generic('nrf52'), 'Annat nRF52-kort'),
 'generic-esp32': (generic('esp32'), 'Annat ESP32-kort'),
 'generic-pi': (generic('pi'), 'Annan Raspberry Pi'),
}
os.makedirs(OUT,exist_ok=True)
for k,(c,t) in boards.items():
    open(f'{OUT}/{k}.svg','w').write(c.svg(t)); c.png(f'{OUT}/{k}.png')
# contact sheet
ims=[Image.open(f'{OUT}/{k}.png') for k in boards]
sheet=Image.new('RGBA',(ims[0].width*2+30, (ims[0].height+10)*((len(ims)+1)//2)),(240,240,236,255))
for i,im in enumerate(ims): sheet.paste(im,((i%2)*(im.width+30),(i//2)*(im.height+10)),im)
sheet.save(f'{OUT}/_sheet.png'); print('ok', len(boards))
