import AppKit

func veIcon(_ canh: Int) -> NSImage {
    let anh = NSImage(size: NSSize(width: canh, height: canh))
    anh.lockFocus()
    let c = CGFloat(canh)
    let goc = NSRect(x: 0, y: 0, width: c, height: c)

    // Nen bo goc kieu macOS
    let bo = NSBezierPath(roundedRect: goc, xRadius: c * 0.2237, yRadius: c * 0.2237)
    bo.addClip()
    let nen = NSGradient(colors: [
        NSColor(srgbRed: 0.25, green: 0.47, blue: 0.98, alpha: 1),
        NSColor(srgbRed: 0.42, green: 0.24, blue: 0.86, alpha: 1),
    ])!
    nen.draw(in: goc, angle: -60)

    // Anh sang nhe o goc tren
    let sang = NSGradient(colors: [NSColor(white: 1, alpha: 0.22), NSColor(white: 1, alpha: 0)])!
    sang.draw(in: NSRect(x: 0, y: c * 0.45, width: c, height: c * 0.55), angle: -90)

    // To giay
    let giay = NSRect(x: c * 0.245, y: c * 0.20, width: c * 0.44, height: c * 0.58)
    let bg = NSBezierPath(roundedRect: giay, xRadius: c * 0.035, yRadius: c * 0.035)
    NSColor(white: 1, alpha: 0.97).setFill()
    bg.fill()

    // Cac dong chu tren giay
    NSColor(srgbRed: 0.62, green: 0.67, blue: 0.75, alpha: 1).setFill()
    let traiD = giay.minX + c * 0.055
    let rongD = giay.width - c * 0.11
    let dayD = c * 0.028
    for (i, tiLe) in [1.0, 0.82, 0.94, 0.55].enumerated() {
        let y = giay.maxY - c * 0.10 - CGFloat(i) * c * 0.105
        let d = NSBezierPath(roundedRect: NSRect(x: traiD, y: y, width: rongD * CGFloat(tiLe), height: dayD),
                             xRadius: dayD / 2, yRadius: dayD / 2)
        d.fill()
    }

    // But chi cheo goc duoi phai
    let ctx = NSGraphicsContext.current!.cgContext
    ctx.saveGState()
    ctx.translateBy(x: c * 0.635, y: c * 0.145)
    ctx.rotate(by: .pi / 4)
    let rongBut = c * 0.115
    let daiBut = c * 0.40
    // Than but
    NSColor(srgbRed: 0.99, green: 0.75, blue: 0.20, alpha: 1).setFill()
    NSBezierPath(rect: NSRect(x: 0, y: rongBut * 0.75, width: rongBut, height: daiBut)).fill()
    NSColor(srgbRed: 0.95, green: 0.63, blue: 0.11, alpha: 1).setFill()
    NSBezierPath(rect: NSRect(x: rongBut * 0.6, y: rongBut * 0.75, width: rongBut * 0.4, height: daiBut)).fill()
    // Dau but
    let dau = NSBezierPath()
    dau.move(to: NSPoint(x: 0, y: rongBut * 0.75))
    dau.line(to: NSPoint(x: rongBut, y: rongBut * 0.75))
    dau.line(to: NSPoint(x: rongBut / 2, y: 0))
    dau.close()
    NSColor(srgbRed: 0.99, green: 0.90, blue: 0.72, alpha: 1).setFill()
    dau.fill()
    // Ngoi but
    let ngoi = NSBezierPath()
    ngoi.move(to: NSPoint(x: rongBut * 0.30, y: rongBut * 0.26))
    ngoi.line(to: NSPoint(x: rongBut * 0.70, y: rongBut * 0.26))
    ngoi.line(to: NSPoint(x: rongBut / 2, y: 0))
    ngoi.close()
    NSColor(srgbRed: 0.18, green: 0.20, blue: 0.25, alpha: 1).setFill()
    ngoi.fill()
    // Khoanh kim loai
    NSColor(srgbRed: 0.78, green: 0.81, blue: 0.86, alpha: 1).setFill()
    NSBezierPath(rect: NSRect(x: 0, y: rongBut * 0.75 + daiBut * 0.80, width: rongBut, height: daiBut * 0.09)).fill()
    ctx.restoreGState()

    anh.unlockFocus()
    return anh
}

let ra = CommandLine.arguments[1]
for canh in [16, 32, 64, 128, 256, 512, 1024] {
    let anh = veIcon(canh)
    guard let tiff = anh.tiffRepresentation,
          let bm = NSBitmapImageRep(data: tiff),
          let png = bm.representation(using: .png, properties: [:]) else { continue }
    try! png.write(to: URL(fileURLWithPath: "\(ra)/icon_\(canh).png"))
}
print("da ve icon")
