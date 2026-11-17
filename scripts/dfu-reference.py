#!/usr/bin/env python3
# Regenerate tests/data/dfu-reference.json with adafruit-nrfutil installed (pip install adafruit-nrfutil):
#   python3 scripts/dfu-reference.py tests/data/dfu-reference.json
# Reference packet stream from adafruit-nrfutil's own classes, for tests/data/dfu-reference.json.
import json, sys
from unittest import mock
from nordicsemi.dfu import dfu_transport_serial as T
fw = bytes(((i * 37) ^ (0xC0 if i % 97 == 0 else 0) ^ (0xDB if i % 89 == 0 else 0)) & 0xFF for i in range(1100))
dat = bytes([0x52,0,0xff,0xff,0xff,0xff,0xff,0xff,1,0,0xb6,0,0xdc,0x8a])
written = []
class Port:
    def write(self, b): written.append(bytes(b).hex())
    def read(self, n): return b''
    def close(self): pass
    def isOpen(self): return True
t = T.DfuTransportSerial('x')
t.serial_port = Port()
t.get_ack_nr = lambda: 0
T.HciPacket.sequence_number = 0
with mock.patch('time.sleep'):
    t.send_start_dfu(4, 0, 0, len(fw))
    t.send_init_packet(dat)
    t.send_firmware(fw)
json.dump({"firmware": fw.hex(), "dat": dat.hex(), "packets": written}, open(sys.argv[1], 'w'), indent=0)
print(len(written), 'packets')
