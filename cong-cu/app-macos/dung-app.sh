#!/bin/bash
# Dung lai app macOS va file DMG sau khi sua giao dien hoac may chu
set -e
cd "$(dirname "$0")"
echo "1/5  Bien dich app…"
swiftc -O -o SoanBai SoanBai.swift -framework AppKit -framework WebKit

echo "2/5  Ve icon…"
swiftc -O -o TaoIcon TaoIcon.swift -framework AppKit
mkdir -p icon-tam && ./TaoIcon icon-tam > /dev/null

rm -rf build && mkdir -p build
ICONSET=build/SoanBai.iconset && mkdir -p "$ICONSET"
cp icon-tam/icon_16.png   "$ICONSET/icon_16x16.png"
cp icon-tam/icon_32.png   "$ICONSET/icon_16x16@2x.png"
cp icon-tam/icon_32.png   "$ICONSET/icon_32x32.png"
cp icon-tam/icon_64.png   "$ICONSET/icon_32x32@2x.png"
cp icon-tam/icon_128.png  "$ICONSET/icon_128x128.png"
cp icon-tam/icon_256.png  "$ICONSET/icon_128x128@2x.png"
cp icon-tam/icon_256.png  "$ICONSET/icon_256x256.png"
cp icon-tam/icon_512.png  "$ICONSET/icon_256x256@2x.png"
cp icon-tam/icon_512.png  "$ICONSET/icon_512x512.png"
cp icon-tam/icon_1024.png "$ICONSET/icon_512x512@2x.png"
iconutil -c icns "$ICONSET" -o build/SoanBai.icns

echo "3/5  Dong goi app…"
APP="build/Soan Bai Website.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp SoanBai "$APP/Contents/MacOS/SoanBai"
cp build/SoanBai.icns "$APP/Contents/Resources/SoanBai.icns"
cp ../soan-bai.mjs "$APP/Contents/Resources/soan-bai.mjs"
cp ../giao-dien.html "$APP/Contents/Resources/giao-dien.html"
cp Info.plist "$APP/Contents/Info.plist"
echo -n "APPL????" > "$APP/Contents/PkgInfo"

echo "4/5  Ky ten…"
codesign --force --deep --sign - "$APP"

echo "5/5  Tao file DMG…"
rm -rf build/dmg && mkdir -p build/dmg
cp -R "$APP" build/dmg/
ln -s /Applications "build/dmg/Applications"
cp DOC-TRUOC-KHI-CAI.txt "build/dmg/DOC TRUOC KHI CAI.txt"
hdiutil create -volname "Soan Bai Website" -srcfolder build/dmg -ov -format UDZO \
  -fs HFS+ build/SoanBaiWebsite.dmg > /dev/null

cp build/SoanBaiWebsite.dmg ~/Desktop/"Soan Bai Website.dmg"
echo
echo "XONG. File DMG da nam ngoai Desktop: Soan Bai Website.dmg"
