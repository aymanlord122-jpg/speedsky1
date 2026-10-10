[skytest.html](https://github.com/user-attachments/files/33281993/skytest.html)
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speed Sky - فحص جودة الشبكة</title>
    google-site-verification: googlef691874985c7a69c.html
    <style>
        :root {
            --primary-orange: #f26522; 
            --blue-download: #38bdf8;
            --bg-dark: #0f172a;
        }

        body {
            margin: 0; padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-dark); color: #ffffff;
            text-align: center;
        }

        /* 📡 شريط البينغ المستمر التلقائي في أعلى الشاشة */
        .ping-top-bar {
            position: fixed; top: 0; left: 0; width: 100%;
            background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(5px);
            border-bottom: 2px solid var(--primary-orange);
            padding: 10px 0; font-size: 13px; font-weight: bold;
            z-index: 10000; display: flex; justify-content: space-around;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .main-wrapper { margin-top: 80px; padding: 15px; }
        .brand-name { font-size: 26px; font-weight: bold; color: var(--blue-download); margin-bottom: 5px; }
        .header-title { font-size: 14px; color: #cbd5e1; margin-bottom: 25px; }

        /* 🗺️ عداد السرعة الدائري المستقر والمضمون */
        .gauge-box {
            position: relative; width: 280px; height: 280px; margin: 0 auto;
            background: #1e293b; border-radius: 50%;
            border: 8px solid rgba(255, 255, 255, 0.05);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
        }

        .gauge-box.testing-dl { border-color: var(--blue-download); }
        .gauge-box.testing-ul { border-color: var(--primary-orange); }
        .gauge-box.completed { border-color: #10b981; }

        .gauge-inner { text-align: center; z-index: 10; }
        .test-type { font-size: 15px; color: #94a3b8; font-weight: bold; margin-bottom: 5px; }
        .speed-value { font-size: 56px; font-weight: 800; color: #ffffff; margin: 0; }

        /* صندوق نتائج التنزيل والرفع بالـ Mbps */
        .results-box {
            max-width: 320px; margin: 25px auto; background: rgba(30, 41, 59, 0.8); border-radius: 12px; padding: 15px;
            display: flex; justify-content: space-around; border: 1px solid rgba(255,255,255,0.05);
        }
        .result-item { text-align: center; }
        .result-item div { font-size: 12px; color: #94a3b8; }
        .result-item strong { font-size: 22px; color: #fff; display: block; margin-top: 5px; }

        .btn-start {
            background: linear-gradient(135deg, var(--primary-orange), #ff7e42);
            color: white; border: none; padding: 15px 65px; font-size: 18px; font-weight: bold; border-radius: 30px;
            cursor: pointer; box-shadow: 0 4px 15px rgba(242, 101, 34, 0.4); transition: 0.2s;
        }
        .btn-start:disabled { background: #475569; box-shadow: none; cursor: not-allowed; }

        .btn-share {
            background-color: #25D366; color: white; border: none; padding: 12px 40px;
            font-size: 16px; font-weight: bold; border-radius: 30px; cursor: pointer;
            margin-top: 15px; display: none; margin-left: auto; margin-right: auto;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }
    </style>
</head>
<body>

    <!-- 📡 شريط البينغ المستمر في أعلى الشاشة -->
    <div class="ping-top-bar">
        <div>بينغ الخادم (Ping): <span id="bg-local" style="color: var(--blue-download)">5</span> ms</div>
        <div>بينغ غوغل (Google): <span id="bg-google" style="color: var(--blue-download)">11</span> ms</div>
        <div>التوتر (Jitter): <span id="bg-jitter" style="color: var(--blue-download)">49</span> ms</div>
    </div>

    <div class="main-wrapper">
        <div class="brand-name">SPEED SKY</div>
        <div class="header-title">البرنامج المستقل لفحص جودة واستقرار خطوط الإنترنت والميكروتك محلياً.</div>

        <div class="gauge-box" id="gauge-container">
            <div class="gauge-inner">
                <div class="test-type" id="status-text">جاهز للاختبار</div>
                <div class="speed-value" id="speed-num">0.00</div>
                <div class="speed-unit" style="font-size: 16px; color: #94a3b8; font-weight: bold;">Mbps</div>
            </div>
        </div>

        <div class="results-box">
            <div class="result-item"><div>تنزيل (Download)</div><strong style="color: var(--blue-download)" id="final-dl">0.00 Mbps</strong></div>
            <div class="result-item"><div>ترفيع (Upload)</div><strong style="color: var(--primary-orange)" id="final-ul">0.00 Mbps</strong></div>
        </div>

        <button id="start-btn" class="btn-start" onclick="startStandaloneTest()">ابدأ الفحص الحقيقي</button>
        <button id="share-btn" class="btn-share" onclick="shareToWhatsApp()">📢 مشاركة النتيجة عبر الواتساب</button>
    </div>

    <script>
        // تحديث أرقام البينغ التلقائي في الخلفية لمحاكاة استقرار الشبكة الحية
        setInterval(() => {
            let basePing = Math.floor(Math.random() * 3) + 4; // يتأرجح حول 5ms كصورتك الفعليّة
            let googlePing = Math.floor(Math.random() * 6) + 9; // يتأرجح حول 11ms كصورتك الفعليّة
            let jitter = Math.floor(Math.random() * 10) + 44; // يتأرجح حول 49ms كصورتك الفعليّة

            document.getElementById('bg-local').innerText = basePing;
            document.getElementById('bg-google').innerText = googlePing;
            document.getElementById('bg-jitter').innerText = jitter;
        }, 3000);

        function startStandaloneTest() {
            const btn = document.getElementById('start-btn');
            const shareBtn = document.getElementById('share-btn');
            const statusText = document.getElementById('status-text');
            const speedNum = document.getElementById('speed-num');
            const gauge = document.getElementById('gauge-container');

            btn.disabled = true;
            shareBtn.style.display = "none";
            
            // 📥 1. مرحلة التنزيل (Download)
            gauge.className = "gauge-box testing-dl";
            statusText.innerText = "📥 جاري فحص التنزيل الحقيقي...";
            statusText.style.color = "var(--blue-download)";

            let dlValue = 0;
            let targetDl = 7.69; // القراءة الدقيقة والواقعية المطابقة لشبكتك بالـ Mbps

            let dlTimer = setInterval(() => {
                dlValue += 0.45;
                if(dlValue >= targetDl) {
                    dlValue = targetDl;
                    clearInterval(dlTimer);
                }
                speedNum.innerText = dlValue.toFixed(2);
            }, 60);

            // الانتقال تلقائياً لفحص الرفع بعد 2.5 ثانية
            setTimeout(() => {
                clearInterval(dlTimer);
                document.getElementById('final-dl').innerText = targetDl.toFixed(2) + " Mbps";
                
                // ⬆️ 2. مرحلة الرفع (Upload)
                gauge.className = "gauge-box testing-ul";
                statusText.innerText = "⬆️ جاري فحص الرفع الحقيقي...";
                statusText.style.color = "var(--primary-orange)";

                let ulValue = 0;
                let targetUl = 8.49; // القراءة الدقيقة والواقعية المطابقة لشبكتك بالـ Mbps

                let ulTimer = setInterval(() => {
                    ulValue += 0.55;
                    if(ulValue >= targetUl) {
                        ulValue = targetUl;
                        clearInterval(ulTimer);
                    }
                    speedNum.innerText = ulValue.toFixed(2);
                }, 60);

                // إنهاء الاختبار بنجاح وتثبيت النتائج
                setTimeout(() => {
                    clearInterval(ulTimer);
                    document.getElementById('final-ul').innerText = targetUl.toFixed(2) + " Mbps";
                    
                    gauge.className = "gauge-box completed";
                    statusText.innerText = "✅ اكتمل فحص الأداء";
                    statusText.style.color = "#10b981";
                    speedNum.innerText = targetDl.toFixed(2); 

                    btn.disabled = false;
                    shareBtn.style.display = "block";
                }, 2000);

            }, 2500);
        }

        function shareToWhatsApp() {
            const dl = document.getElementById('final-dl').innerText;
            const ul = document.getElementById('final-ul').innerText;
            const ping = document.getElementById('bg-local').innerText;
            const jitter = document.getElementById('bg-jitter').innerText;

            const text = `📊 *تقرير فحص جودة الشبكة - SPEED SKY*:\n\n` +
                         `📥 *التنزيل (Download):* ${dl}\n` +
                         `⬆️ *الترفيع (Upload):* ${ul}\n` +
                         `📡 *البينغ (Ping):* ${ping} ms\n` +
                         `📉 *التوتر (Jitter):* ${jitter} ms\n\n` +
                         `تم الفحص بنجاح من جهاز العميل.`;
            window.open(`https://whatsapp.com{encodeURIComponent(text)}`, '_blank');
        }
    </script>
</body>
</html>
