#!/bin/bash
# Dung lai app macOS "Quan Ly Website" va file DMG
set -e
cd "$(dirname "$0")"

echo "1/5  Bien dich app…"
swiftc -O -o QuanLy QuanLy.swift -framework AppKit -framework WebKit -framework CoreImage

echo "2/5  Ve icon…"
swiftc -O -o TaoIcon TaoIcon.swift -framework AppKit
mkdir -p icon-tam && ./TaoIcon icon-tam > /dev/null

rm -rf build && mkdir -p build
ICONSET=build/QuanLy.iconset && mkdir -p "$ICONSET"
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
iconutil -c icns "$ICONSET" -o build/QuanLy.icns

echo "3/5  Dong goi app…"
APP="build/Quan Ly Website.app"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp QuanLy "$APP/Contents/MacOS/QuanLy"
cp build/QuanLy.icns "$APP/Contents/Resources/QuanLy.icns"
cp ../may-chu.mjs "$APP/Contents/Resources/may-chu.mjs"
cp ../dieu-khien.mjs "$APP/Contents/Resources/dieu-khien.mjs"
cp ../giao-dien.html "$APP/Contents/Resources/giao-dien.html"
cp Info.plist "$APP/Contents/Info.plist"
echo -n "APPL????" > "$APP/Contents/PkgInfo"

echo "4/5  Ky ten…"
# Ky bang chung chi Developer ID neu may co: chu ky on dinh thi macOS nho quyen doc o ngoai,
# khong hoi lai "muon truy cap o dia di dong" sau moi lan dung. Khong co thi ky tam (ad-hoc).
DANH_TINH="$(security find-identity -v -p codesigning | sed -n 's/.*"\(Developer ID Application: [^"]*\)".*/\1/p' | head -1)"
if [ -n "$DANH_TINH" ] && codesign --force --deep --options runtime --timestamp=none --sign "$DANH_TINH" "$APP" 2>/dev/null; then
  echo "     da ky: $DANH_TINH"
else
  codesign --force --deep --sign - "$APP"
  echo "     ky tam (ad-hoc)"
fi

echo "5/5  Tao file DMG…"
# Dung o thu muc tam NGOAI du an: lien ket toi /Applications neu nam trong du an
# se lam may chu xem thu di theo lien ket va quet ca thu muc Applications.
TAM="$(mktemp -d)/dmg"
mkdir -p "$TAM"
cp -R "$APP" "$TAM/"
ln -s /Applications "$TAM/Applications"
cp DOC-TRUOC-KHI-CAI.txt "$TAM/DOC TRUOC KHI CAI.txt"
hdiutil create -volname "Quan Ly Website" -srcfolder "$TAM" -ov -format UDZO \
  -fs HFS+ build/QuanLyWebsite.dmg > /dev/null
rm -rf "$(dirname "$TAM")"

cp build/QuanLyWebsite.dmg ~/Desktop/"Quan Ly Website.dmg"
echo
echo "XONG. File DMG da nam ngoai Desktop: Quan Ly Website.dmg"
