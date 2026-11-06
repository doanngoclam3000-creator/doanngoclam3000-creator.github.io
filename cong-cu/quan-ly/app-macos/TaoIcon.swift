import AppKit

// Icon: mot cua so trinh duyet, ben trong la ba cot bieu do -> "quan ly website"
func veIcon(_ canh: Int) -> NSImage {
    let anh = NSImage(size: NSSize(width: canh, height: canh))
    anh.lockFocus()
    let c = CGFloat(canh)
    let goc = NSRect(x: 0, y: 0, width: c, height: c)

    let bo = NSBezierPath(roundedRect: goc, xRadius: c * 0.2237, yRadius: c * 0.2237)
    bo.addClip()
    let nen = NSGradient(colors: [
        NSColor(srgbRed: 0.07, green: 0.18, blue: 0.38, alpha: 1),
        NSColor(srgbRed: 0.15, green: 0.39, blue: 0.92, alpha: 1),
    ])!
    nen.draw(in: goc, angle: -70)

    let sang = NSGradient(colors: [NSColor(white: 1, alpha: 0.20), NSColor(white: 1, alpha: 0)])!
    sang.draw(in: NSRect(x: 0, y: c * 0.45, width: c, height: c * 0.55), angle: -90)

    // Cua so trinh duyet
    let cuaSo = NSRect(x: c * 0.185, y: c * 0.225, width: c * 0.63, height: c * 0.55)
    let khung = NSBezierPath(roundedRect: cuaSo, xRadius: c * 0.045, yRadius: c * 0.045)
    NSColor(white: 1, alpha: 0.97).setFill()
    khung.fill()

    // Thanh tieu de cua so
    let thanh = NSRect(x: cuaSo.minX, y: cuaSo.maxY - c * 0.105, width: cuaSo.width, height: c * 0.105)
    NSGraphicsContext.current!.saveGraphicsState()
    NSBezierPath(roundedRect: cuaSo, xRadius: c * 0.045, yRadius: c * 0.045).addClip()
    NSColor(srgbRed: 0.89, green: 0.92, blue: 0.96, alpha: 1).setFill()
    NSBezierPath(rect: thanh).fill()
    NSGraphicsContext.current!.restoreGraphicsState()

    // Ba cham tron tren thanh tieu de
    let mauCham = [
        NSColor(srgbRed: 0.98, green: 0.42, blue: 0.40, alpha: 1),
        NSColor(srgbRed: 0.99, green: 0.75, blue: 0.25, alpha: 1),
        NSColor(srgbRed: 0.35, green: 0.80, blue: 0.48, alpha: 1),
    ]
    let dCham = c * 0.035
    for (i, mau) in mauCham.enumerated() {
        mau.setFill()
        let x = cuaSo.minX + c * 0.045 + CGFloat(i) * dCham * 1.9
        NSBezierPath(ovalIn: NSRect(x: x, y: thanh.midY - dCham / 2, width: dCham, height: dCham)).fill()
    }

    // Ba cot bieu do trong cua so
    let dayCot = cuaSo.minY + c * 0.065
    let rongCot = c * 0.105
    let caoCot: [CGFloat] = [0.16, 0.26, 0.345]
    let mauCot = [
        NSColor(srgbRed: 0.55, green: 0.72, blue: 0.98, alpha: 1),
        NSColor(srgbRed: 0.29, green: 0.55, blue: 0.96, alpha: 1),
        NSColor(srgbRed: 0.09, green: 0.65, blue: 0.47, alpha: 1),
    ]
    for i in 0..<3 {
        mauCot[i].setFill()
        let x = cuaSo.minX + c * 0.085 + CGFloat(i) * (rongCot + c * 0.055)
        let r = NSRect(x: x, y: dayCot, width: rongCot, height: c * caoCot[i])
        NSBezierPath(roundedRect: r, xRadius: c * 0.018, yRadius: c * 0.018).fill()
    }

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
