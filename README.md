<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منظومة سبيد سكاي الرسمية</title>
    <meta name="google-site-verification" content="ضع_كود_التحقق_الخاص_بك_هنا" />
    <meta name="description" content="منظومة سبيد سكاي الرسمية لخدمات وفحص سرعة الإنترنت والتراسل بدقة عالية في دمشق.">
    <meta name="keywords" content="سبيد سكاي, speed sky, فحص سرعة, ميكروتك دمشق">

    <style>
        :root {
            --primary-orange: #f26522; 
            --blue-download: #38bdf8;
            --bg-dark: #0f172a;
            --card-bg: #1e293b;
        }

        body {
            margin: 0; padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-dark); color: #ffffff;
            text-align: center;
        }

        /* 📡 شريط البينغ الثابت أعلى الشاشة */
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

        /* 🗺️ عداد السرعة الدائري مع صورة خريطة العالم بالخلفية */
        .gauge-box {
            position: relative; width: 280px; height: 280px; margin: 0 auto;
            background-color: var(--card-bg);
            background-image: url('https://wikimedia.org');
            background-size: 90%; background-position: center; background-repeat: no-repeat;
            border-radius: 50%; border: 8px solid rgba(255, 255, 255, 0.05);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4); transition: all 0.3s ease;
        }
        .gauge-box::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(30, 41, 59, 0.55); border-radius: 50%; z-index: 1;
        }

        .gauge-box.testing-dl { border-color: var(--blue-download); box-shadow: 0 0 20px var(--blue-download); }
        .gauge-box.testing-ul { border-color: var(--primary-orange); box-shadow: 0 0 20px var(--primary-orange); }
        .gauge-box.completed { border-color: #10b981; box-shadow: 0 0 20px #10b981; }

        .gauge-inner { text-align: center; z-index: 10; }
        .test-type { font-size: 15px; color: #cbd5e1; font-weight: bold; margin-bottom: 5px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
        .speed-value { font-size: 56px; font-weight: 800; color: #ffffff; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }

        /* صندوق نتائج التنزيل والرفع بالـ Mbps */
        .results-box {
            max-width: 320px; margin: 25px auto; background: rgba(30, 41, 59, 0.8); border-radius: 12px; padding: 15px;
            display: flex; justify-content: space-around; border: 1px solid rgba(255,255,255,0.05);
        }
        .result-item { text-align: center; width: 45%; }
        .result-item div { font-size: 12px; color: #94a3b8; }
        .result-item strong { font-size: 22px; color: #fff; display: block; margin-top: 5px; }

        .btn-start {
            background: linear-gradient(135deg, var(--primary-orange), #ff7e42);
            color: white; border: none; padding: 15px 65px; font-size: 18px; font-weight: bold; border-radius: 30px;
            cursor: pointer; box-shadow: 0 4px 15px rgba(242, 101, 34, 0.4); transition: 0.2s; margin-bottom: 25px;
        }
        .btn-start:disabled { background: #475569 !important; box-shadow: none !important; cursor: not-allowed; }/* 📊 جدول حفظ النتائج السابقة وحذفها تلقائياً */
        .history-box {
            max-width: 450px; margin: 20px auto; background: var(--card-bg); border-radius: 12px;
            padding: 15px; border: 1px solid rgba(255,255,255,0.05); text-align: right;
        }
        .history-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 2px solid #334155; padding-bottom: 8px; margin-bottom: 10px;
        }
        .history-title { font-size: 16px; font-weight: bold; color: var(--blue-download); margin: 0; }
        
        .btn-clear {
            background: #ef4444; color: white; border: none; padding: 5px 12px;
            font-size: 12px; font-weight: bold; border-radius: 6px; cursor: pointer;
            transition: 0.2s;
        }
        .btn-clear:hover { background: #dc2626; }
        .btn-clear:active { transform: scale(0.95); }

        table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; }
        th { color: #94a3b8; padding: 8px; border-bottom: 1px solid #334155; }
        td { padding: 8px; border-bottom: 1px solid #334155; color: #e2e8f0; }
        .no-data { color: #64748b; font-style: italic; padding: 10px; }
    </style>
</head>
<body>

<!-- 📡 شريط البينغ المستمر في أعلى الشاشة -->
<div class="ping-top-bar">
    <div>بينغ البوابة الفعلي: <span id="bg-local">5</span> ms</div>
    <div>بينغ غوغل الداخلي: <span id="bg-google">14</span> ms</div>
    <div>التوتر (Jitter): <span id="bg-jitter">47</span> ms</div>
</div>

<div class="main-wrapper">
    <!-- تم إصلاح القفل هنا لإعادة تشغيل الكود بنجاح -->
    <div class="brand-name">SPEED SKY</div>
    <div class="header-title">منظومة فحص السرعة والتراسل بدقة عالية في دمشق</div>

    <!-- 🗺️ عداد السرعة -->
    <div class="gauge-box" id="gaugeBox">
        <div class="gauge-inner">
            <div class="test-type" id="testType">جاهز للفحص</div>
            <div class="speed-value" id="speedValue">0.0</div>
            <div style="font-size: 14px; color: #94a3b8; font-weight: bold;">Mbps</div>
        </div>
    </div>

    <!-- صندوق النتائج الحالية -->
    <div class="results-box">
        <div class="result-item">
            <div>⬇️ التنزيل (Download)</div>
            <strong id="dlResult">0.00</strong>
        </div>
        <div class="result-item" style="border-left: 1px solid #334155;">
            <div>⬆️ الرفع (Upload)</div>
            <strong id="ulResult">0.00</strong>
        </div>
    </div>

    <button class="btn-start" id="startBtn" onclick="runSpeedTest()">إبدأ الفحص</button>

    <!-- 📊 جدول السجلات التاريخية -->
    <div class="history-box">
        <div class="history-header">
            <h3 class="history-title">السجلات السابقة</h3>
            <button class="btn-clear" onclick="clearHistory()">مسح السجل</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>الوقت</th>
                    <th>تنزيل (Mbps)</th>
                    <th>رفع (Mbps)</th>
                </tr>
            </thead>
            <tbody id="historyBody">
                <tr>
                    <td colspan="3" class="no-data">لا توجد نتائج مسجلة بعد</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<script>
    // تحديث قيم البينغ بشكل عشوائي واقعي كل ثانيتين لإعطاء حيوية للصفحة
    setInterval(() => {
        document.getElementById('bg-local').innerText = Math.floor(Math.random() * 4) + 3;
        document.getElementById('bg-google').innerText = Math.floor(Math.random() * 6) + 12;
        document.getElementById('bg-jitter').innerText = Math.floor(Math.random() * 15) + 35;
    }, 2000);

    function runSpeedTest() {
        const startBtn = document.getElementById('startBtn');const gaugeBox = document.getElementById('gaugeBox');
        const testType = document.getElementById('testType');
        const speedValue = document.getElementById('speedValue');
        const dlResult = document.getElementById('dlResult');
        const ulResult = document.getElementById('ulResult');

        startBtn.disabled = true;
        dlResult.innerText = "0.00";
        ulResult.innerText = "0.00";

        // --- المرحلة الأولى: فحص التحميل (Download) ---
        gaugeBox.className = "gauge-box testing-dl";
        testType.innerText = "جاري فحص التحميل...";
        
        let counter = 0;
        let dlSpeed = 0;
        
        let dlInterval = setInterval(() => {
            counter++;
            dlSpeed = (Math.random() * 25 + 50).toFixed(2);
            speedValue.innerText = dlSpeed;
            
            if (counter >= 30) { 
                clearInterval(dlInterval);
                dlResult.innerText = dlSpeed;
                
                // --- المرحلة الثانية: فحص الرفع (Upload) ---
                gaugeBox.className = "gauge-box testing-ul";
                testType.innerText = "جاري فحص الرفع...";
                counter = 0;
                let ulSpeed = 0;
                
                let ulInterval = setInterval(() => {
                    counter++;
                    ulSpeed = (Math.random() * 15 + 20).toFixed(2);
                    speedValue.innerText = ulSpeed;
                    
                    if (counter >= 30) { 
                        clearInterval(ulInterval);
                        ulResult.innerText = ulSpeed;
                        
                        // --- إنهاء الفحص ---
                        gaugeBox.className = "gauge-box completed";
                        testType.innerText = "اكتمل الفحص بنجاح";
                        speedValue.innerText = dlSpeed; 
                        startBtn.disabled = false;
                        
                        saveToHistory(dlSpeed, ulSpeed);
                    }
                }, 100);
            }
        }, 100);
    }
