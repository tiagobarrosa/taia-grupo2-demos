/* Código de acesso: apenas dissuasor. Não é segurança: quem ler o código-fonte consegue contorná-lo. */
(function () {
  var H = 'c6ec90429d72e00b1d0280fecc68ac4531be06a05f6d4e6d22a1d9f5e02a2f8f'; // SHA-256 do código. Para mudar o código, usa definir_codigo.html
  var KEY = 'taia_acesso_v1';
  function sha256(s){
    s = unescape(encodeURIComponent(s));
    var K = [], H = [], p = 0, c, i;
    var isPrime = function(n){ for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
    for (c = 2; p < 64; c++) if (isPrime(c)) { if (p < 8) H[p] = (Math.pow(c, 0.5) % 1 * 4294967296) | 0; K[p++] = (Math.pow(c, 1 / 3) % 1 * 4294967296) | 0; }
    var b = []; for (i = 0; i < s.length; i++) b.push(s.charCodeAt(i));
    var bl = b.length * 8; b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    for (i = 7; i >= 0; i--) b.push(i >= 4 ? 0 : (bl >>> (i * 8)) & 255);
    var W = new Array(64);
    for (var o = 0; o < b.length; o += 64){
      for (i = 0; i < 16; i++) W[i] = (b[o + 4 * i] << 24) | (b[o + 4 * i + 1] << 16) | (b[o + 4 * i + 2] << 8) | b[o + 4 * i + 3];
      for (i = 16; i < 64; i++){ var w15 = W[i - 15], w2 = W[i - 2];
        var s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
        var s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0; }
      var a = H[0], bb = H[1], cc = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++){
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + W[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var mj = (a & bb) ^ (a & cc) ^ (bb & cc);
        var t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function(x){ return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  
  try { if (sessionStorage.getItem(KEY) === H) return; } catch (e) {}
  var root = document.documentElement; root.style.visibility = 'hidden';
  function build() {
    var o = document.createElement('div'); o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Código de acesso');
    o.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;visibility:visible;display:grid;place-items:center;padding:20px;background:linear-gradient(135deg,#2457f5,#7a3cff);font:18px/1.5 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#101828';
    o.innerHTML = '<form style="background:#fff;border-radius:26px;box-shadow:0 20px 50px rgba(16,24,40,.35);padding:34px;max-width:420px;width:100%;text-align:center">' +
      '<div style="font-size:42px">🔒</div><h1 style="margin:6px 0 4px;font-size:26px;letter-spacing:-.02em">Acesso reservado</h1>' +
      '<p style="margin:0 0 18px;color:#667085">Material de apoio à apresentação do Grupo 2 (TAIA). Pede o código ao grupo.</p>' +
      '<input id="acc" type="password" autocomplete="off" aria-label="Código" placeholder="Código" style="width:100%;font:inherit;padding:12px 16px;border:1.5px solid #e4e7ee;border-radius:999px;text-align:center;margin-bottom:12px">' +
      '<button type="submit" style="width:100%;font:inherit;font-weight:600;padding:12px;border:0;border-radius:999px;color:#fff;background:linear-gradient(135deg,#2457f5,#7a3cff);cursor:pointer">Entrar</button>' +
      '<div id="accm" role="alert" style="min-height:26px;margin-top:10px;color:#e0412f;font-weight:600"></div>' +
      '<p style="margin:6px 0 0;font-size:13px;color:#98a2b3">Todos os dados são fictícios.</p></form>';
    document.body.appendChild(o);
    var inp = o.querySelector('#acc'); inp.focus();
    o.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (sha256(inp.value.trim()) === H) {
        try { sessionStorage.setItem(KEY, H); } catch (x) {}
        o.remove(); root.style.visibility = '';
      } else { o.querySelector('#accm').textContent = 'Código incorreto.'; inp.value = ''; inp.focus(); }
    });
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
