/* إعدادات SpeedUp: عدّل هذا الملف فقط */
window.SPEEDUP_CONFIG = {
  /* سيرفرات الفحص
     type: 'ls' = LibreSpeed (سيرفر محلي) ، 'cf' = Cloudflare (خارجي للمقارنة فقط)
     base: المجلد الذي فيه garbage.php و empty.php و getIP.php ويجب أن يكون HTTPS
     local: true لسيرفرات داخل سوريا (يفضّلها البرنامج تلقائياً) */
  servers: [
    { name: 'دمشق', base: 'https://speedtest.example.sy/backend/', type: 'ls', local: true },
    // { name: 'حلب', base: 'https://speedtest-aleppo.example.sy/backend/', type: 'ls', local: true },
    { name: 'Cloudflare', base: 'https://speed.cloudflare.com', type: 'cf', local: false }
  ],

  monitorIntervalMs: 1000,  /* كل كم مللي ثانية يُقاس البينغ في صفحة المراقبة */
  downloadSeconds: 12,      /* مدة قياس التحميل */
  uploadSeconds: 10,        /* مدة قياس الرفع */
  downloadStreams: 6,       /* عدد اتصالات التحميل المتوازية */
  uploadStreams: 4          /* عدد اتصالات الرفع المتوازية */
};
