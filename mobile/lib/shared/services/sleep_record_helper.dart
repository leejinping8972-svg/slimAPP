import 'package:flutter/material.dart';
import '../models/models.dart';

/// Sleep time helpers (HH:mm) and display labels for ritual UI.
class SleepRecordHelper {
  static double? hoursBetween(String bedtime, String wakeTime) {
    final bed = _parseHm(bedtime);
    final wake = _parseHm(wakeTime);
    if (bed == null || wake == null) return null;
    var mins = (wake.hour * 60 + wake.minute) - (bed.hour * 60 + bed.minute);
    if (mins <= 0) mins += 24 * 60;
    return mins / 60.0;
  }

  static TimeOfDay? parseHm(String raw) => _parseHm(raw);

  static TimeOfDay? _parseHm(String raw) {
    final parts = raw.trim().split(':');
    if (parts.length < 2) return null;
    final h = int.tryParse(parts[0]);
    final m = int.tryParse(parts[1]);
    if (h == null || m == null) return null;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return TimeOfDay(hour: h, minute: m);
  }

  static String formatHm(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

  static String qualityLabel(String quality) => switch (quality) {
        'good' => 'Bien',
        'okay' => 'Regular',
        'poor' => 'Mal',
        'logged' => 'Registrado',
        _ => quality.isEmpty ? '' : quality,
      };

  static String summary(TodayRecord record) {
    if (!record.hasSleepRecord) return 'Registra sueño';
    final parts = <String>[];
    if (record.sleepBedtime.isNotEmpty && record.sleepWakeTime.isNotEmpty) {
      parts.add('${record.sleepBedtime}–${record.sleepWakeTime}');
    } else if (record.sleepBedtime.isNotEmpty) {
      parts.add('Dormir ${record.sleepBedtime}');
    } else if (record.sleepWakeTime.isNotEmpty) {
      parts.add('Despertar ${record.sleepWakeTime}');
    } else if (record.sleepHours > 0) {
      parts.add('${record.sleepHours.toStringAsFixed(1)} h');
    }
    final q = qualityLabel(record.sleepQuality);
    if (q.isNotEmpty) parts.add(q);
    return parts.join(' · ');
  }
}
