import AppKit
import WebKit
import CoreImage

// ===== Quan ly website - cua so rieng tren macOS =====

let KHOA_THUMUC = "thuMucWebsiteQL"
let CONG = 4500
let CONG_WEB = 4322

final class BoDieuKhien: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandlerWithReply {
    var cuaSo: NSWindow!
    var web: WKWebView!
    var tienTrinh: Process?
    var manCho: NSView?

    // ---------- Tim thu muc website ----------
    func thuMucWebsite() -> String? {
        let md = UserDefaults.standard
        if let luu = md.string(forKey: KHOA_THUMUC), hopLe(luu) { return luu }
        // Cac cho hay de ma nguon website, thu lan luot
        let doan = [
            "/Volumes/CODE/DuAn/WebPhanMem",
            NSHomeDirectory() + "/Documents/WebPhanMem",
            NSHomeDirectory() + "/Desktop/phần mềm đang sửa/WebPhanMem",
        ]
        for d in doan where hopLe(d) { md.set(d, forKey: KHOA_THUMUC); return d }
        return chonThuMuc()
    }

    func hopLe(_ d: String) -> Bool {
        FileManager.default.fileExists(atPath: d + "/src/content/phan-mem")
            && FileManager.default.fileExists(atPath: d + "/package.json")
    }

    func chonThuMuc() -> String? {
        let bang = NSAlert()
        bang.messageText = "Chưa tìm thấy thư mục website"
        bang.informativeText = "Hãy chọn thư mục chứa mã nguồn website (thư mục có sẵn package.json và src). "
            + "Nếu để trên ổ ngoài thì cắm ổ vào trước."
        bang.addButton(withTitle: "Chọn thư mục…")
        bang.addButton(withTitle: "Thoát")
        if bang.runModal() != .alertFirstButtonReturn { return nil }

        let chon = NSOpenPanel()
        chon.canChooseDirectories = true
        chon.canChooseFiles = false
        chon.allowsMultipleSelection = false
        chon.prompt = "Chọn"
        chon.directoryURL = URL(fileURLWithPath: "/Volumes")
        guard chon.runModal() == .OK, let u = chon.url else { return nil }
        guard hopLe(u.path) else {
            let l = NSAlert()
            l.messageText = "Thư mục không đúng"
            l.informativeText = "Thư mục này không phải mã nguồn website. Hãy chọn thư mục có chứa file package.json."
            l.runModal()
            return chonThuMuc()
        }
        UserDefaults.standard.set(u.path, forKey: KHOA_THUMUC)
        return u.path
    }

    // ---------- Tim node ----------
    func duongDanNode() -> String? {
        if let kem = Bundle.main.path(forResource: "node", ofType: nil),
           FileManager.default.isExecutableFile(atPath: kem) { return kem }
        let cho = ["/usr/local/bin/node", "/opt/homebrew/bin/node", "/usr/bin/node",
                   NSHomeDirectory() + "/.nvm/versions/node/current/bin/node"]
        for d in cho where FileManager.default.isExecutableFile(atPath: d) { return d }
        return nil
    }

    // ---------- Khoi dong ----------
    func applicationDidFinishLaunching(_ n: Notification) {
        NSApp.setActivationPolicy(.regular)
        dungMenu()
        dungCuaSo()

        guard let thuMuc = thuMucWebsite() else { NSApp.terminate(nil); return }
        guard let node = duongDanNode() else {
            let l = NSAlert()
            l.messageText = "Máy chưa cài Node.js"
            l.informativeText = "Phần mềm cần Node.js để chạy. Hãy cài Node.js bản LTS tại nodejs.org rồi mở lại."
            l.runModal()
            NSApp.terminate(nil); return
        }
        chayMayChu(node: node, thuMuc: thuMuc)
        choMayChu()
    }

    func dungCuaSo() {
        let khung = NSRect(x: 0, y: 0, width: 1280, height: 860)
        cuaSo = NSWindow(contentRect: khung,
                         styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
                         backing: .buffered, defer: false)
        cuaSo.title = "Quản lý website"
        cuaSo.minSize = NSSize(width: 980, height: 640)
        cuaSo.center()
        cuaSo.setFrameAutosaveName("CuaSoQuanLyWebsite")

        let caiDat = WKWebViewConfiguration()
        caiDat.preferences.setValue(true, forKey: "developerExtrasEnabled")
        // Trang goi webkit.messageHandlers.qr.postMessage(link) de xin anh ma QR (muc Dien thoai)
        caiDat.userContentController.addScriptMessageHandler(self, contentWorld: .page, name: "qr")
        web = WKWebView(frame: khung, configuration: caiDat)
        web.navigationDelegate = self
        web.uiDelegate = self
        web.autoresizingMask = [.width, .height]
        web.setValue(false, forKey: "drawsBackground")

        cuaSo.contentView = NSView(frame: khung)
        cuaSo.contentView?.addSubview(web)
        veManCho()
        cuaSo.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func veManCho() {
        guard let goc = cuaSo.contentView else { return }
        let m = NSView(frame: goc.bounds)
        m.autoresizingMask = [.width, .height]
        m.wantsLayer = true
        m.layer?.backgroundColor = NSColor.white.cgColor

        let chu = NSTextField(labelWithString: "Đang mở bảng điều khiển website…")
        chu.font = NSFont.systemFont(ofSize: 15, weight: .medium)
        chu.textColor = NSColor.secondaryLabelColor
        chu.alignment = .center
        chu.frame = NSRect(x: 0, y: goc.bounds.height / 2 - 14, width: goc.bounds.width, height: 28)
        chu.autoresizingMask = [.width, .minYMargin, .maxYMargin]
        m.addSubview(chu)

        let quay = NSProgressIndicator()
        quay.style = .spinning
        quay.frame = NSRect(x: goc.bounds.width / 2 - 16, y: goc.bounds.height / 2 + 24, width: 32, height: 32)
        quay.autoresizingMask = [.minXMargin, .maxXMargin, .minYMargin, .maxYMargin]
        quay.startAnimation(nil)
        m.addSubview(quay)

        goc.addSubview(m, positioned: .above, relativeTo: web)
        manCho = m
    }

    func chayMayChu(node: String, thuMuc: String) {
        guard let kichBan = Bundle.main.path(forResource: "may-chu", ofType: "mjs") else { return }
        let p = Process()
        p.executableURL = URL(fileURLWithPath: node)
        p.arguments = [kichBan]
        p.currentDirectoryURL = URL(fileURLWithPath: thuMuc)
        var moiTruong = ProcessInfo.processInfo.environment
        moiTruong["QLWEB_APP"] = "1"
        moiTruong["QLWEB_THUMUC"] = thuMuc
        moiTruong["QLWEB_CONG"] = String(CONG)
        moiTruong["QLWEB_CONG_WEB"] = String(CONG_WEB)
        let duong = moiTruong["PATH"] ?? ""
        moiTruong["PATH"] = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:" + NSHomeDirectory() + "/bin:" + duong
        p.environment = moiTruong
        p.standardOutput = FileHandle.nullDevice
        p.standardError = FileHandle.nullDevice
        try? p.run()
        tienTrinh = p
    }

    func choMayChu(lan: Int = 0) {
        var yc = URLRequest(url: URL(string: "http://localhost:\(CONG)/api/danh-sach")!)
        yc.timeoutInterval = 2
        URLSession.shared.dataTask(with: yc) { du, _, _ in
            DispatchQueue.main.async {
                if du != nil {
                    self.web.load(URLRequest(url: URL(string: "http://localhost:\(CONG)")!))
                } else if lan < 360 {   // 3 phut: lan dau macOS con hoi quyen doc o ngoai, may chu dung cho
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { self.choMayChu(lan: lan + 1) }
                } else {
                    let l = NSAlert()
                    l.messageText = "Không khởi động được"
                    l.informativeText = "Phần mềm không nối được tới máy chủ nội bộ. Thử mở lại, hoặc kiểm tra thư mục website còn nguyên không."
                    l.runModal()
                    NSApp.terminate(nil)
                }
            }
        }.resume()
    }

    // ---------- Ve ma QR cho muc "Dien thoai" ----------
    func userContentController(_ b: WKUserContentController, didReceive tin: WKScriptMessage,
                               replyHandler tra: @escaping (Any?, String?) -> Void) {
        guard tin.name == "qr", let chu = tin.body as? String, !chu.isEmpty, chu.count < 600 else {
            tra(nil, "Thieu noi dung"); return
        }
        tra(anhQR(chu), nil)
    }

    /// PNG (base64) cua ma QR, moi o vuong phong to 10 lan cho net
    func anhQR(_ chu: String) -> String? {
        guard let loc = CIFilter(name: "CIQRCodeGenerator") else { return nil }
        loc.setValue(Data(chu.utf8), forKey: "inputMessage")
        loc.setValue("M", forKey: "inputCorrectionLevel")
        guard let anh = loc.outputImage?.transformed(by: CGAffineTransform(scaleX: 10, y: 10)) else { return nil }
        let bieuDien = NSBitmapImageRep(ciImage: anh)
        return bieuDien.representation(using: .png, properties: [:])?.base64EncodedString()
    }

    func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
        manCho?.removeFromSuperview(); manCho = nil
    }

    func webView(_ w: WKWebView, createWebViewWith c: WKWebViewConfiguration,
                 for yc: WKNavigationAction, windowFeatures f: WKWindowFeatures) -> WKWebView? {
        if let u = yc.request.url { NSWorkspace.shared.open(u) }
        return nil
    }

    func webView(_ w: WKWebView, runOpenPanelWith thamSo: WKOpenPanelParameters,
                 initiatedByFrame khung: WKFrameInfo,
                 completionHandler xong: @escaping ([URL]?) -> Void) {
        let hop = NSOpenPanel()
        hop.canChooseFiles = true
        hop.canChooseDirectories = thamSo.allowsDirectories
        hop.allowsMultipleSelection = thamSo.allowsMultipleSelection
        hop.resolvesAliases = true
        hop.prompt = "Chọn"
        hop.message = "Chọn file cần tải lên"
        hop.beginSheetModal(for: cuaSo) { ketQua in xong(ketQua == .OK ? hop.urls : nil) }
    }

    func webView(_ w: WKWebView, runJavaScriptAlertPanelWithMessage chu: String,
                 initiatedByFrame khung: WKFrameInfo, completionHandler xong: @escaping () -> Void) {
        let bang = NSAlert()
        bang.messageText = chu
        bang.addButton(withTitle: "OK")
        bang.beginSheetModal(for: cuaSo) { _ in xong() }
    }

    func webView(_ w: WKWebView, runJavaScriptConfirmPanelWithMessage chu: String,
                 initiatedByFrame khung: WKFrameInfo, completionHandler xong: @escaping (Bool) -> Void) {
        let bang = NSAlert()
        bang.messageText = chu
        bang.addButton(withTitle: "Đồng ý")
        bang.addButton(withTitle: "Huỷ")
        bang.beginSheetModal(for: cuaSo) { kq in xong(kq == .alertFirstButtonReturn) }
    }

    func webView(_ w: WKWebView, runJavaScriptTextInputPanelWithPrompt chu: String, defaultText mac: String?,
                 initiatedByFrame khung: WKFrameInfo, completionHandler xong: @escaping (String?) -> Void) {
        let bang = NSAlert()
        bang.messageText = chu
        let o = NSTextField(frame: NSRect(x: 0, y: 0, width: 320, height: 24))
        o.stringValue = mac ?? ""
        bang.accessoryView = o
        bang.addButton(withTitle: "OK")
        bang.addButton(withTitle: "Huỷ")
        bang.beginSheetModal(for: cuaSo) { kq in xong(kq == .alertFirstButtonReturn ? o.stringValue : nil) }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ a: NSApplication) -> Bool { true }
    func applicationWillTerminate(_ n: Notification) {
        tienTrinh?.terminate()
        let p = Process()
        p.executableURL = URL(fileURLWithPath: "/usr/bin/pkill")
        p.arguments = ["-f", "astro dev"]
        try? p.run()
    }

    // ---------- Menu ----------
    func dungMenu() {
        let menu = NSMenu()

        let mUng = NSMenuItem(); menu.addItem(mUng)
        let sUng = NSMenu()
        sUng.addItem(withTitle: "Về phần mềm quản lý website", action: #selector(veApp), keyEquivalent: "").target = self
        sUng.addItem(.separator())
        sUng.addItem(withTitle: "Đổi thư mục website…", action: #selector(doiThuMuc), keyEquivalent: "").target = self
        sUng.addItem(.separator())
        sUng.addItem(withTitle: "Ẩn", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        sUng.addItem(withTitle: "Thoát", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        mUng.submenu = sUng

        let mSua = NSMenuItem(title: "Sửa", action: nil, keyEquivalent: ""); menu.addItem(mSua)
        let sSua = NSMenu(title: "Sửa")
        sSua.addItem(withTitle: "Hoàn tác", action: Selector(("undo:")), keyEquivalent: "z")
        sSua.addItem(withTitle: "Làm lại", action: Selector(("redo:")), keyEquivalent: "Z")
        sSua.addItem(.separator())
        sSua.addItem(withTitle: "Cắt", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        sSua.addItem(withTitle: "Chép", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        sSua.addItem(withTitle: "Dán", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        sSua.addItem(withTitle: "Chọn tất cả", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        mSua.submenu = sSua

        let mXem = NSMenuItem(title: "Xem", action: nil, keyEquivalent: ""); menu.addItem(mXem)
        let sXem = NSMenu(title: "Xem")
        sXem.addItem(withTitle: "Tải lại", action: #selector(taiLai), keyEquivalent: "r").target = self
        sXem.addItem(withTitle: "Mở website xem thử", action: #selector(moXemThu), keyEquivalent: "p").target = self
        sXem.addItem(withTitle: "Mở website thật", action: #selector(moWebThat), keyEquivalent: "").target = self
        sXem.addItem(.separator())
        sXem.addItem(withTitle: "Toàn màn hình", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        mXem.submenu = sXem

        NSApp.mainMenu = menu
    }

    @objc func taiLai() { web.reload() }
    @objc func moXemThu() { NSWorkspace.shared.open(URL(string: "http://localhost:\(CONG_WEB)")!) }
    @objc func moWebThat() { NSWorkspace.shared.open(URL(string: "https://phanmemtq.com")!) }
    @objc func veApp() {
        let l = NSAlert()
        let ban = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? ""
        l.messageText = "Quản lý website " + ban
        l.informativeText = "Bảng điều khiển cho website phần mềm: bài viết, phần mềm, phát hành, ép cập nhật, ví, thống kê và quản lý từ điện thoại.\n\nThư mục website:\n"
            + (UserDefaults.standard.string(forKey: KHOA_THUMUC) ?? "chưa đặt")
        l.runModal()
    }
    @objc func doiThuMuc() {
        UserDefaults.standard.removeObject(forKey: KHOA_THUMUC)
        let l = NSAlert()
        l.messageText = "Đã xoá thư mục đã lưu"
        l.informativeText = "Hãy thoát và mở lại phần mềm để chọn thư mục website khác."
        l.runModal()
    }
}

let ung = NSApplication.shared
let bdk = BoDieuKhien()
ung.delegate = bdk
ung.run()
