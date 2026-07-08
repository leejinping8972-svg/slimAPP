import 'package:flutter/material.dart';

class LuckdateColors {
  static const moonBeige = Color(0xFFF7E2D4);
  static const vitalitySage = Color(0xFFA8C686);
  static const solarSand = Color(0xFFF5C542);
  static const chocolateBrown = Color(0xFF5C4635);
  static const cloudIvory = Color(0xFFF5F0E6);
  static const deepSage = Color(0xFFA8C686);
  static const sunGold = Color(0xFFF5C542);
  static const ivoryWhite = Color(0xFFFFFFFF);
  static const sageSoft = Color(0xFFEEF4E8);
  static const lineSoft = Color(0xFFDCCFBF);
  static const textPrimary = Color(0xFF233142);
  static const textSecondary = Color(0xFF6B5A49);
  static const errorSoft = Color(0xFFB8756B);
  static const warning = Color(0xFFD9A23E);
  static const success = Color(0xFF6D7A52);

  static const youth = Color(0xFF6E7D5B);
  static const femme = Color(0xFFD99A8E);
  static const recovery = Color(0xFFA593B5);
  static const active = Color(0xFF9DB3B3);
  static const daily = Color(0xFFD8A955);
}

class LuckdateSpacing {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const base = 16.0;
  static const lg = 20.0;
  static const xl = 24.0;
  static const xxl = 32.0;
}

class LuckdateRadius {
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 18.0;
  static const xl = 24.0;
  static const pill = 999.0;
}

class LuckdateTextStyles {
  static const display = TextStyle(
    fontSize: 32,
    height: 40 / 32,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const h1 = TextStyle(
    fontSize: 28,
    height: 34 / 28,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const h2 = TextStyle(
    fontSize: 24,
    height: 30 / 24,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const title = TextStyle(
    fontSize: 18,
    height: 24 / 18,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const body = TextStyle(
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w400,
    color: LuckdateColors.textPrimary,
  );
  static const bodySmall = TextStyle(
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w400,
    color: LuckdateColors.textSecondary,
  );
  static const caption = TextStyle(
    fontSize: 12,
    height: 16 / 12,
    fontWeight: FontWeight.w400,
    color: LuckdateColors.textSecondary,
  );
  static const tabLabel = TextStyle(
    fontSize: 11,
    height: 14 / 11,
    fontWeight: FontWeight.w500,
  );
}

ThemeData buildLuckdateTheme() {
  return ThemeData(
    useMaterial3: true,
    fontFamily: 'Montserrat',
    scaffoldBackgroundColor: LuckdateColors.cloudIvory,
    colorScheme: ColorScheme.light(
      primary: LuckdateColors.deepSage,
      secondary: LuckdateColors.solarSand,
      surface: LuckdateColors.ivoryWhite,
      onPrimary: LuckdateColors.ivoryWhite,
      onSurface: LuckdateColors.textPrimary,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      foregroundColor: LuckdateColors.textPrimary,
      titleTextStyle: LuckdateTextStyles.title,
    ),
    cardTheme: CardThemeData(
      color: LuckdateColors.ivoryWhite,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
        side: const BorderSide(color: LuckdateColors.lineSoft, width: 0.5),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: LuckdateColors.ivoryWhite,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        borderSide: const BorderSide(color: LuckdateColors.lineSoft),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.lg),
        borderSide: const BorderSide(color: LuckdateColors.lineSoft),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.base,
        vertical: LuckdateSpacing.md,
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: LuckdateTextStyles.display,
      headlineLarge: LuckdateTextStyles.h1,
      headlineMedium: LuckdateTextStyles.h2,
      titleMedium: LuckdateTextStyles.title,
      bodyLarge: LuckdateTextStyles.body,
      bodyMedium: LuckdateTextStyles.bodySmall,
      labelSmall: LuckdateTextStyles.caption,
    ),
  );
}
