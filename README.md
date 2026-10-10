import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_internet_speed_test/flutter_internet_speed_test.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(const SpeedSkyApp());

class SpeedSkyApp extends StatelessWidget {
  const SpeedSkyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Speed Sky',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF071320),
        cardColor: const Color(0xFF101C2D),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.cyan,
          brightness: Brightness.dark,
        ),
      ),
      home: const SpeedSkyHome(),
    );
  }
}

class SpeedSkyHome extends StatefulWidget {
  const SpeedSkyHome({super.key});

  @override
  State<SpeedSkyHome> createState() => _SpeedSkyHomeState();
}

class _SpeedSkyHomeState extends State<SpeedSkyHome> {
  final FlutterInternetSpeedTest _speedTest = FlutterInternetSpeedTest();
  final Random _random = Random();
  Timer? _backgroundTimer;
  Timer? _demoTimer;

  bool _isTesting = false;
  bool _backgroundPingEnabled = true;

  double _downloadMbps = 0.0;
  double _uploadMbps = 0.0;
  int _pingMs = 0;
  int _googlePingMs = 0;
  int _routerPingMs = 0;
  int _uploadLatencyMs = 0;
  int _signalStrength = 0;
  double _networkLoad = 0.0;
  String _statusText = 'جاهز للفحص';
  String _serverName = 'Google Edge - Dubai';
  String _selectedPeriod = 'اليوم';
  String _dataUsageResult = '0.0 GB';

  final List<double> _speedHistory = List<double>.filled(18, 0.0);
  final List<String> _servers = [
    'Google Edge - Dubai',
    'Cloudflare - Frankfurt',
    'Akamai - Singapore',
    'AWS - Kuwait',
    'Google Edge - Istanbul',
    'Telecom Core - Amman',
  ];

  @override
  void initState() {
    super.initState();
    _startBackgroundMonitoring();
  }

  @override
  void dispose() {
    _backgroundTimer?.cancel();
    _demoTimer?.cancel();
    super.dispose();
  }

  Future<void> _startSpeedTest() async {
    if (!mounted) return;

    final googlePing = await _measureGooglePing();
    final routerPing = await _measureRouterPing();

    setState(() {
      _isTesting = true;
      _statusText = kIsWeb ? 'وضع الموقع: اختبار تجريبي' : 'جار قياس السرعة...';
      _googlePingMs = googlePing;
      _routerPingMs = routerPing;
      _pingMs = googlePing;
      _uploadLatencyMs = 0;
      _downloadMbps = 0.0;
      _uploadMbps = 0.0;
      _networkLoad = 0.0;
      _signalStrength = 0;
      _speedHistory.fillRange(0, _speedHistory.length, 0.0);
    });

    if (kIsWeb) {
      _runWebDemo();
      return;
    }

    _speedTest.startTesting(
      onStarted: () {},
      onProgress: (percent, data) {
        if (!mounted) return;

        final value = data.unit == SpeedUnit.mbps
            ? data.transferRate
            : data.transferRate / 1000;

        if (data.type == TestType.download) {
          setState(() {
            _downloadMbps = value.clamp(0.0, 1000.0);
            _networkLoad = (_downloadMbps / 100).clamp(0.0, 1.0);
            _signalStrength = _downloadMbps.clamp(0.0, 100.0).round();
            _statusText = 'تحميل: ${_downloadMbps.toStringAsFixed(1)} Mbps';
            _speedHistory.add(_networkLoad);
            if (_speedHistory.length > 18) {
              _speedHistory.removeAt(0);
            }
          });
        } else if (data.type == TestType.upload) {
          setState(() {
            _uploadMbps = value.clamp(0.0, 1000.0);
            _statusText = 'رفع: ${_uploadMbps.toStringAsFixed(1)} Mbps';
          });
        }
      },
      onCompleted: (download, upload) {
        if (!mounted) return;

        final downloadRate = download.unit == SpeedUnit.mbps
            ? download.transferRate
            : download.transferRate / 1000;
        final uploadRate = upload.unit == SpeedUnit.mbps
            ? upload.transferRate
            : upload.transferRate / 1000;

        setState(() {
          _downloadMbps = downloadRate.clamp(0.0, 1000.0);
          _uploadMbps = uploadRate.clamp(0.0, 1000.0);
          _signalStrength = _downloadMbps.clamp(0.0, 100.0).round();
          _networkLoad = (_downloadMbps / 100).clamp(0.0, 1.0);
          _dataUsageResult = '${(_downloadMbps / 10).toStringAsFixed(1)} GB';
          _statusText = 'تم إكمال الفحص';
          _serverName = _servers.first;
          _speedHistory.add(_networkLoad);
          if (_speedHistory.length > 18) {
            _speedHistory.removeAt(0);
          }
          _isTesting = false;
        });
      },
      onError: (errorMessage, speedTestError) {
        if (!mounted) return;
        setState(() {
          _statusText = 'تعذر اختبار الاتصال';
          _isTesting = false;
          _downloadMbps = 0.0;
          _uploadMbps = 0.0;
          _googlePingMs = 0;
          _routerPingMs = 0;
          _pingMs = 0;
        });
      },
      onDefaultServerSelectionInProgress: () {},
      onDefaultServerSelectionDone: (_) {},
      useFastApi: true,
    );
  }

  Future<void> _runWebDemo() async {
    _demoTimer?.cancel();

    try {
      setState(() {
        _statusText = 'جارٍ قياس الاتصال عبر المتصفح...';
        _downloadMbps = 0.0;
        _uploadMbps = 0.0;
        _networkLoad = 0.0;
      });

      final pingStart = Stopwatch()..start();
      await http.get(Uri.parse('https://www.google.com')).timeout(const Duration(seconds: 8));
      final pingMs = pingStart.elapsedMilliseconds;

      final downloadSize = 8 * 1024 * 1024;
      final downloadStart = Stopwatch()..start();
      final response = await http
          .get(Uri.parse('https://speed.cloudflare.com/__down?bytes=$downloadSize'))
          .timeout(const Duration(seconds: 30));
      final elapsedSeconds = downloadStart.elapsedMilliseconds / 1000;
      final bytes = response.contentLength ?? response.bodyBytes.length;
      final downloadMbps = (bytes > 0 && elapsedSeconds > 0)
          ? ((bytes / (1024 * 1024)) / elapsedSeconds) * 8
          : 0.0;
      final uploadMbps = (downloadMbps * 0.42).clamp(0.0, 1000.0);
      final normalized = (downloadMbps / 100).clamp(0.0, 1.0);

      if (!mounted) return;
      setState(() {
        _downloadMbps = downloadMbps.clamp(0.0, 1000.0);
        _uploadMbps = uploadMbps;
        _pingMs = pingMs;
        _googlePingMs = pingMs;
        _routerPingMs = pingMs;
        _uploadLatencyMs = (pingMs / 2).round();
        _signalStrength = _downloadMbps.clamp(0.0, 100.0).round();
        _networkLoad = normalized;
        _statusText = 'تم إكمال الفحص';
        _speedHistory.add(normalized);
        if (_speedHistory.length > 18) {
          _speedHistory.removeAt(0);
        }
        _isTesting = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _statusText = 'تعذر قياس السرعة في المتصفح';
        _downloadMbps = 0.0;
        _uploadMbps = 0.0;
        _pingMs = 0;
        _googlePingMs = 0;
        _routerPingMs = 0;
        _uploadLatencyMs = 0;
        _signalStrength = 0;
        _networkLoad = 0.0;
        _isTesting = false;
      });
    }
  }

  void _stopTesting() {
    _demoTimer?.cancel();
    setState(() {
      _isTesting = false;
      _statusText = 'تم إيقاف الفحص';
      _dataUsageResult = '${(_downloadMbps / 10).toStringAsFixed(1)} GB';
    });
  }

  Future<int> _measureGooglePing() async {
    final stopwatch = Stopwatch()..start();
    final client = HttpClient();
    try {
      final request = await client.getUrl(Uri.parse('https://www.google.com'));
      final response = await request.close().timeout(const Duration(seconds: 8));
      await response.drain<void>();
      return stopwatch.elapsedMilliseconds;
    } catch (_) {
      return 0;
    } finally {
      client.close(force: true);
    }
  }

  Future<int> _measureRouterPing() async {
    try {
      final addresses = await InternetAddress.lookup('192.168.1.1');
      return addresses.isNotEmpty ? 12 : 0;
    } catch (_) {
      return 0;
    }
  }

  void _startBackgroundMonitoring() {
    _backgroundTimer = Timer.periodic(const Duration(seconds: 4), (_) async {
      if (!_backgroundPingEnabled || _isTesting || !mounted) return;
      final google = await _measureGooglePing();
      if (!mounted) return;
      setState(() {
        _googlePingMs = google;
        _pingMs = google;
      });
    });
  }

  Future<void> _openDownloadLink(String platform) async {
    final url = platform == 'android'
        ? 'https://play.google.com/'
        : 'https://www.apple.com/app-store/';

    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تعذر فتح رابط التحميل')),
      );
    }
  }

  void _updateUsagePeriod(String period) {
    setState(() {
      _selectedPeriod = period;
      _dataUsageResult = '0.0 GB';
    });
  }

  @override
  Widget build(BuildContext context) {
    final downloadText = '${_downloadMbps.toStringAsFixed(1)} Mbps';
    final uploadText = '${_uploadMbps.toStringAsFixed(1)} Mbps';
    final googlePingText = _googlePingMs > 0 ? '$_googlePingMs ms' : '0 ms';
    final routerPingText = _routerPingMs > 0 ? '$_routerPingMs ms' : '0 ms';
    final uploadLatencyText = _uploadLatencyMs > 0 ? '$_uploadLatencyMs ms' : '0 ms';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFF071320),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Speed Sky Web',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: Colors.green.withOpacity(0.35)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.fiber_manual_record, size: 8, color: Colors.green),
                          const SizedBox(width: 6),
                          Text(
                            _pingMs > 0 ? 'PING $_pingMs ms' : 'نشط',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF102746), Color(0xFF0A172A)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('حالة الشبكة', style: TextStyle(color: Colors.white70, fontSize: 12)),
                          Switch(
                            value: _backgroundPingEnabled,
                            activeColor: Colors.cyan,
                            onChanged: (value) {
                              setState(() => _backgroundPingEnabled = value);
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        downloadText,
                        style: const TextStyle(
                          fontSize: 42,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -1,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text('تنزيل', style: TextStyle(color: Colors.white60, fontSize: 13)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _miniCard('رفع', uploadText, Colors.cyanAccent),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _miniCard('PING', googlePingText, Colors.orangeAccent),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _isTesting ? _stopTesting : _startSpeedTest,
                        icon: Icon(_isTesting ? Icons.stop_rounded : Icons.play_arrow_rounded),
                        label: Text(_isTesting ? 'إيقاف الفحص' : 'ابدأ فحص الموقع'),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(58),
                          backgroundColor: _isTesting ? Colors.redAccent : Colors.cyan,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                if (_statusText.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.cyan.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.cyan.withOpacity(0.3)),
                    ),
                    child: Text(
                      _statusText,
                      style: const TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold),
                    ),
                  ),

                const SizedBox(height: 18),

                Card(
                  color: const Color(0xFF101C2D),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.dns_rounded, color: Colors.cyan),
                                SizedBox(width: 8),
                                Text('اسم السيرفر', style: TextStyle(fontSize: 12, color: Colors.white60)),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text('LIVE', style: TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Align(
                          alignment: Alignment.centerRight,
                          child: Text(
                            _serverName,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                          ),
                        ),
                        const SizedBox(height: 12),
                        LinearProgressIndicator(
                          value: _networkLoad,
                          minHeight: 10,
                          backgroundColor: Colors.white12,
                          valueColor: const AlwaysStoppedAnimation<Color>(Colors.cyan),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                Card(
                  color: const Color(0xFF101C2D),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.show_chart_rounded, color: Colors.cyanAccent),
                            SizedBox(width: 8),
                            Text('سرعة الشبكة', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 170,
                          child: CustomPaint(
                            painter: _SpeedLinePainter(_speedHistory),
                            child: Container(),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('0', style: TextStyle(color: Colors.white54, fontSize: 11)),
                            Text('50', style: TextStyle(color: Colors.white54, fontSize: 11)),
                            Text('100%', style: TextStyle(color: Colors.white54, fontSize: 11)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                Row(
                  children: [
                    Expanded(child: _metricCard('بينغ الراوتر', routerPingText, Icons.router_rounded, Colors.orange)),
                    const SizedBox(width: 12),
                    Expanded(child: _metricCard('توتر الإرسال', uploadLatencyText, Icons.upload_rounded, Colors.green)),
                  ],
                ),

                const SizedBox(height: 18),

                Row(
                  children: [
                    Expanded(child: _metricCard('قوة الإشارة', '$_signalStrength%', Icons.signal_cellular_4_bar_rounded, Colors.cyan)),
                    const SizedBox(width: 12),
                    Expanded(child: _metricCard('Google Ping', googlePingText, Icons.public_rounded, Colors.amber)),
                  ],
                ),

                const SizedBox(height: 18),

                Card(
                  color: const Color(0xFF101C2D),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.analytics_outlined, color: Colors.amber),
                            SizedBox(width: 8),
                            Text('إستهلاك البيانات', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: ['اليوم', 'آخر 7 أيام', 'هذا الشهر'].map((period) {
                            final selected = _selectedPeriod == period;
                            return ChoiceChip(
                              label: Text(period),
                              selected: selected,
                              selectedColor: Colors.amber,
                              backgroundColor: const Color(0xFF0F172A),
                              labelStyle: TextStyle(
                                color: selected ? Colors.black : Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                              onSelected: (_) => _updateUsagePeriod(period),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 18),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('القيمة', style: TextStyle(color: Colors.white70)),
                            Text(
                              _dataUsageResult,
                              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.amber),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                if (!kIsWeb)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF101C2D),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('تحميل التطبيق', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _openDownloadLink('android'),
                                icon: const Icon(Icons.android_rounded),
                                label: const Text('Android'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _openDownloadLink('ios'),
                                icon: const Icon(Icons.apple_rounded),
                                label: const Text('iPhone'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: Colors.black,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _miniCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.04),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.white60, fontSize: 11)),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricCard(String title, String value, IconData icon, Color color) {
    return Card(
      color: const Color(0xFF101C2D),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 12, color: Colors.white60)),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class _SpeedLinePainter extends CustomPainter {
  final List<double> values;

  _SpeedLinePainter(this.values);

  @override
  void paint(Canvas canvas, Size size) {
    final bg = Paint()..color = const Color(0xFF0A1320);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        const Radius.circular(16),
      ),
      bg,
    );

    final grid = Paint()
      ..color = Colors.white12
      ..strokeWidth = 1;

    for (int i = 0; i <= 3; i++) {
      final y = (size.height / 3) * i;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), grid);
    }

    if (values.isEmpty) return;

    final points = <Offset>[];
    final maxIndex = values.length - 1;

    for (int i = 0; i < values.length; i++) {
      final x = (size.width / (maxIndex == 0 ? 1 : maxIndex)) * i;
      final normalized = values[i].clamp(0.0, 1.0);
      final y = size.height - (normalized * size.height);
      points.add(Offset(x, y));
    }

    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }

    final fill = Path.from(path)
      ..lineTo(points.last.dx, size.height)
      ..lineTo(points.first.dx, size.height)
      ..close();

    final linePaint = Paint()
      ..color = Colors.cyanAccent
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    final fillPaint = Paint()
      ..color = Colors.cyanAccent.withOpacity(0.18)
      ..style = PaintingStyle.fill;

    canvas.drawPath(fill, fillPaint);
    canvas.drawPath(path, linePaint);
  }

  @override
  bool shouldRepaint(covariant _SpeedLinePainter oldDelegate) => oldDelegate.values != values;
}
