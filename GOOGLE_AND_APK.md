# SpeedUp: ظهور الموقع في Google وتحميل التطبيق

## الجزء 1: بناء ملف التطبيق (APK) على جهازك

1. افتح نافذة الأوامر أو طرفية VS Code في أي مجلد فارغ، ونفّذ:
   ```
   flutter create --project-name internet_checker speedup_app
   cd speedup_app
   ```
2. من حزمة `speedup-project.zip` انسخ الملفين التاليين من مجلد `internet_checker` إلى `speedup_app` واستبدل الموجود:
   - `pubspec.yaml`
   - `lib\main.dart`
3. افتح `speedup_app\android\app\src\main\AndroidManifest.xml` وطبّق الإضافات الموجودة في `internet_checker\README.md` (الصلاحيات، وخدمة الخلفية، والتسمية `SpeedUp`). في `android\app\build.gradle` اجعل `minSdkVersion` يساوي 23 أو أكثر.
4. نفّذ:
   ```
   flutter pub get
   flutter build apk --release --split-per-abi
   ```
5. ستجد الملف هنا: `build\app\outputs\flutter-apk\app-arm64-v8a-release.apk` (يناسب معظم الهواتف الحديثة وحجمه أصغر).
6. غيّر اسمه إلى `speedup.apk` وضعه في مجلد `app` داخل مجلد الموقع.

إن ظهر خطأ في أي خطوة فأرسل لي صورة النص كاملاً.

## الجزء 2: نشر الموقع (شرط لظهوره في Google)

Google لا يرى `127.0.0.1` ولا Live Server. يجب أن يكون للموقع رابط حقيقي. أسهل طريقة مجانية GitHub Pages:

1. ادخل github.com وأنشئ مستودعاً جديداً (New repository) باسم `speedup`، واختر **Public**.
2. اضغط **uploading an existing file** واسحب **محتويات** مجلد الموقع (وليس المجلد نفسه). يجب أن يظهر `index.html` في أول المستودع.
3. إن كان `speedup.apk` أكبر من 25 MB فلا يقبله الرفع من المتصفح: ارفعه من تبويب **Releases** ثم ضع رابطه في زر التحميل.
4. من **Settings ثم Pages** اختر Branch: `main` والمجلد `/ (root)` ثم Save.
5. بعد دقيقة أو دقيقتين يظهر رابط الموقع، وشكله `https://اسم-حسابك.github.io/speedup/`.

## الجزء 3: ظهور الموقع في بحث Google

1. افتح `robots.txt` و`sitemap.xml` في مجلد الموقع، وبدّل `YOUR-SITE-URL` بعنوان موقعك (بدون https:// في المكانين اللذين يحتويان `https://` أصلاً، أي اترك `https://` وبدّل ما بعده فقط). أعد رفعهما.
2. ادخل search.google.com/search-console وسجّل بحساب Google.
3. اختر **Add property** ثم **URL prefix** والصق رابط موقعك كاملاً.
4. للتحقق من ملكيتك اختر طريقة **HTML tag**، وانسخ الوسم الذي يعطيك، والصقه في `index.html` مكان السطر المعلّق الذي يبدأ بـ`<meta name="google-site-verification"`. أعد رفع الملف ثم اضغط Verify.
5. من القائمة الجانبية اختر **Sitemaps** وأضف `sitemap.xml`.
6. من **URL Inspection** الصق رابط الصفحة الرئيسية واضغط **Request indexing**.

## ملاحظات
- الفهرسة تستغرق من أيام إلى أسابيع، ولا يمكن لأحد ضمان ترتيب معيّن. للتأكد أنه فُهرس اكتب في Google: `site:اسم-حسابك.github.io`.
- الاسم SpeedUp شائع، فلن يظهر الموقع أولاً عند البحث به وحده.
- إذا كان زوارك داخل سوريا ولم يفتح الرابط عندهم، فاستضف الموقع على سيرفر محلي (انظر `DEPLOY.md`) وطبّق الجزء 3 عليه.
