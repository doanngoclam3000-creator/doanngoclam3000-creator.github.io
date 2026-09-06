// =============================================================
//  RUT GON LINK - go.phanmemtq.workers.dev
//
//  go.phanmemtq.workers.dev/AbC123  ->  may chu vi /l/AbC123
//
//  Vi sao tach thanh may chu rieng: chi de duong dan NGAN. Cong tac vien dan
//  link vao mo ta video, dai qua thi xau va de bi cat.
//  Toan bo phan tra cuu, dem luot, gan ma affiliate deu nam ben may chu vi -
//  o day khong lam gi ca, tranh viet hai noi roi lech nhau.
// =============================================================
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const ma = url.pathname.replace(/^\/+/, '').split('/')[0];

    if (!ma) {
      return Response.redirect('https://phanmemtq.com/tai-khoan/', 302);
    }
    if (!/^[A-Z0-9]{4,16}$/i.test(ma)) {
      return new Response('Link không đúng.', { status: 404 });
    }

    const chuyen = new Request('https://vi-phanmemtq.phanmemtq.workers.dev/l/' + ma, {
      method: 'GET',
      headers: req.headers,
      redirect: 'manual',
    });
    return env.VI.fetch(chuyen);
  },
};
