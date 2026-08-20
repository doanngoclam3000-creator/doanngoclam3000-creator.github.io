import Foundation
#if canImport(AppKit)
import AppKit
#endif

// ===== Kiem tra ban moi tu website, dung cho app macOS =====
//
// Cach dung trong app cua ban:
//
//   KiemTraBanMoi.chay(maPhanMem: "gia-lap-vi-tri", banHienTai: "3.0")
//
// - Neu ban hien tai cu hon "banToiThieu" tren web  -> BAT BUOC cap nhat,
//   hien bang khong the bo qua, bam la mo trang tai va thoat app.
// - Neu chi cu hon "phienBan"                        -> nhac nhe, cho bo qua.

enum KiemTraBanMoi {
    static let diaChi = "https://phanmemtq.com/phien-ban.json"

    struct GoiTin: Decodable {
        let phanMem: [MotPhanMem]
    }
    struct MotPhanMem: Decodable {
        let ma: String
        let ten: String
        let phienBan: String?
        let banToiThieu: String?
        let ghiChuCapNhat: String?
        let tai: DuongTai
        let trang: String
    }
    struct DuongTai: Decodable {
        let mac: String?
        let windows: String?
    }

    /// So sanh hai chuoi phien ban kieu "3.1.2". Tra ve true neu a < b.
    static func cuHon(_ a: String, _ b: String) -> Bool {
        let x = a.split(separator: ".").map { Int($0) ?? 0 }
        let y = b.split(separator: ".").map { Int($0) ?? 0 }
        for i in 0..<max(x.count, y.count) {
            let m = i < x.count ? x[i] : 0
            let n = i < y.count ? y[i] : 0
            if m != n { return m < n }
        }
        return false
    }

    static func chay(maPhanMem: String, banHienTai: String) {
        guard let url = URL(string: diaChi) else { return }
        var yc = URLRequest(url: url)
        yc.cachePolicy = .reloadIgnoringLocalCacheData
        yc.timeoutInterval = 10

        URLSession.shared.dataTask(with: yc) { du, _, _ in
            guard let du,
                  let goi = try? JSONDecoder().decode(GoiTin.self, from: du),
                  let pm = goi.phanMem.first(where: { $0.ma == maPhanMem })
            else { return }   // Khong co mang thi bo qua, khong lam phien nguoi dung

            // 1. Bat buoc cap nhat
            if let toiThieu = pm.banToiThieu, cuHon(banHienTai, toiThieu) {
                DispatchQueue.main.async { batCapNhat(pm, banHienTai: banHienTai) }
                return
            }
            // 2. Nhac nhe khi co ban moi hon
            if let moi = pm.phienBan, cuHon(banHienTai, moi) {
                DispatchQueue.main.async { nhacCapNhat(pm, banHienTai: banHienTai) }
            }
        }.resume()
    }

    #if canImport(AppKit)
    private static func linkTai(_ pm: MotPhanMem) -> String { pm.tai.mac ?? pm.trang }

    /// Bang khong the bo qua: chi co mot lua chon la di cap nhat
    private static func batCapNhat(_ pm: MotPhanMem, banHienTai: String) {
        let bang = NSAlert()
        bang.alertStyle = .critical
        bang.messageText = "Cần cập nhật \(pm.ten)"
        var chu = "Bạn đang dùng bản \(banHienTai). Bản này đã quá cũ và không dùng tiếp được.\n\n"
        chu += "Hãy tải bản \(pm.phienBan ?? "mới nhất") để tiếp tục."
        if let g = pm.ghiChuCapNhat { chu += "\n\n\(g)" }
        bang.informativeText = chu
        bang.addButton(withTitle: "Tải bản mới")
        bang.addButton(withTitle: "Thoát")

        let chon = bang.runModal()
        if chon == .alertFirstButtonReturn, let u = URL(string: linkTai(pm)) {
            NSWorkspace.shared.open(u)
        }
        NSApp.terminate(nil)   // Khong cho dung tiep ban cu
    }

    /// Nhac nhe, cho phep dung tiep
    private static func nhacCapNhat(_ pm: MotPhanMem, banHienTai: String) {
        let khoa = "boQuaBan-\(pm.ma)"
        // Nguoi dung da bam "Bo qua ban nay" thi khong hoi lai nua
        if UserDefaults.standard.string(forKey: khoa) == pm.phienBan { return }

        let bang = NSAlert()
        bang.messageText = "Đã có \(pm.ten) bản \(pm.phienBan ?? "mới")"
        var chu = "Bạn đang dùng bản \(banHienTai)."
        if let g = pm.ghiChuCapNhat { chu += "\n\n\(g)" }
        bang.informativeText = chu
        bang.addButton(withTitle: "Tải ngay")
        bang.addButton(withTitle: "Để sau")
        bang.addButton(withTitle: "Bỏ qua bản này")

        switch bang.runModal() {
        case .alertFirstButtonReturn:
            if let u = URL(string: linkTai(pm)) { NSWorkspace.shared.open(u) }
        case .alertThirdButtonReturn:
            UserDefaults.standard.set(pm.phienBan, forKey: khoa)
        default:
            break
        }
    }
    #else
    private static func batCapNhat(_ pm: MotPhanMem, banHienTai: String) {}
    private static func nhacCapNhat(_ pm: MotPhanMem, banHienTai: String) {}
    #endif
}
