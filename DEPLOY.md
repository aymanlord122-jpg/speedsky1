# نشر موقع SpeedUp وتثبيته على الهاتف

## 1) محتويات المجلد
| الملف | وظيفته |
|---|---|
| `index.html` | الموقع نفسه |
| `config.js` | **ملف الإعدادات الوحيد الذي تعدّله**: السيرفرات ومدد الفحص |
| `manifest.webmanifest` + `icons/` | يجعل الموقع قابلاً للتثبيت كتطبيق |
| `sw.js` | يخزّن الصفحة ليفتح الموقع بسرعة |
| `_headers` | إعدادات ترويسات لـNetlify وCloudflare Pages |
| `app/` | صفحة الآيفون ومكان ملف `speedup.apk` |

## 2) إعدادات السيرفر (`config.js`)
- ضع سيرفرات LibreSpeed المحلية في `servers` مع `local: true`.
- `base` هو المجلد الذي فيه `garbage.php` و`empty.php` و`getIP.php` (غالباً `/backend/`).
- لا تستخدم HTTP: الموقع على HTTPS يمنع الاتصال بسيرفر HTTP.
- بقية الخيارات: `monitorIntervalMs` (فاصل المراقبة)، `downloadSeconds` و`uploadSeconds` (مدة القياس).

## 3) أين تستضيف الموقع
**أ) سيرفر داخل سوريا (الأنسب لك).** منصات مثل GitHub وNetlify قد تكون محجوبة أو مقيّدة من سوريا، وسيرفرك المحلي متاح أصلاً.
مثال nginx (استبدل الدومين والمسار):
```nginx
server {
    listen 80;
    server_name speedup.example.sy;
    root /var/www/speedup;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    location = /sw.js { add_header Cache-Control "no-cache"; }
    location = /config.js { add_header Cache-Control "no-cache"; }
}
```
ثم شهادة HTTPS (تحتاج دومين يشير إلى السيرفر):
```bash
sudo certbot --nginx -d speedup.example.sy
```
**ب) استضافة جاهزة:** Netlify (سحب المجلد إلى netlify.com/drop) أو GitHub Pages أو Cloudflare Pages، إن كانت متاحة لك.

## 4) التثبيت على الهاتف
- **أندرويد (Chrome):** افتح الرابط ثم القائمة ⋮ ثم «تثبيت التطبيق».
- **آيفون (Safari):** المشاركة ثم «إضافة إلى الشاشة الرئيسية».
التثبيت يتطلب HTTPS.

## 5) قبل أن تثق بالنتائج
1. أطفئ الـVPN.
2. افتح الموقع من الشبكة التي تريد قياسها.
3. تأكد أن السيرفر المختار يظهر بكلمة «محلي».
4. إن ظهر تحذير «لا يوجد سيرفر محلي متاح» فالنتيجة عبر الإنترنت الدولي.
