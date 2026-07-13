import 'package:flutter/material.dart';

class LuckdateColors {
  static const moonBeige = Color(0xFFF7E2D4);
  static const vitalitySage = Color(0xFF8FA86E);
  static const solarSand = Color(0xFFF5C542);
  static const chocolateBrown = Color(0xFF5C4635);
  static const cloudIvory = Color(0xFFFFF9F5);
  static const deepSage = Color(0xFF5E6B45);
  static const mossDark = Color(0xFF4A5D45);
  static const sunGold = Color(0xFFD4A853);
  static const ivoryWhite = Color(0xFFFFFFFF);
  static const sageSoft = Color(0xFFE8EFE0);
  static const lineSoft = Color(0xFFE8DFD4);
  static const textPrimary = Color(0xFF2C3A2E);
  static const textSecondary = Color(0xFF7A6E62);
  static const errorSoft = Color(0xFFB8756B);
  static const warning = Color(0xFFD9A23E);
  static const success = Color(0xFF6D7A52);
  static const chatBubble = Color(0xFFF8F3EC);
  static const navIndicator = Color(0xFFE8EFE0);

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
  static const lg = 16.0;
  static const xl = 20.0;
  static const sheet = 28.0;
  static const pill = 999.0;
}

class LuckdateShadows {
  static const card = [
    BoxShadow(
      color: Color(0x14000000),
      offset: Offset(0, 4),
      blurRadius: 20,
      spreadRadius: 0,
    ),
  ];
  static const soft = [
    BoxShadow(
      color: Color(0x0A000000),
      offset: Offset(0, 2),
      blurRadius: 12,
    ),
  ];
}

class LuckdateGradients {
  static const authHero = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFFFFBF7), Color(0xFFFFF3EA), Color(0xFFF5EBE0)],
  );
  static const pageHeader = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFFFBF7), Color(0xFFF8F0E6)],
  );
}

class LuckdateTextStyles {
  static const display = TextStyle(
    fontSize: 32,
    height: 40 / 32,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
    letterSpacing: -0.5,
  );
  static const h1 = TextStyle(
    fontSize: 26,
    height: 32 / 26,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
    letterSpacing: -0.3,
  );
  static const h2 = TextStyle(
    fontSize: 20,
    height: 26 / 20,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const title = TextStyle(
    fontSize: 17,
    height: 22 / 17,
    fontWeight: FontWeight.w600,
    color: LuckdateColors.textPrimary,
  );
  static const body = TextStyle(
    fontSize: 15,
    height: 22 / 15,
    fontWeight: FontWeight.w400,
    color: LuckdateColors.textPrimary,
  );
  static const bodySmall = TextStyle(
    fontSize: 13,
    height: 18 / 13,
    fontWeight: FontWeight.w400,
    color: LuckdateColors.textSecondary,
  );
  static const caption = TextStyle(
    fontSize: 11,
    height: 14 / 11,
    fontWeight: FontWeight.w500,
    color: LuckdateColors.textSecondary,
    letterSpacing: 0.2,
  );
  static const tabLabel = TextStyle(
    fontSize: 10,
    height: 12 / 10,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
  );
  static const brand = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w300,
    letterSpacing: 4,
    color: LuckdateColors.chocolateBrown,
  );
}

ThemeData buildLuckdateTheme() {
  return ThemeData(
    useMaterial3: true,
    fontFamily: 'Montserrat',
    scaffoldBackgroundColor: LuckdateColors.cloudIvory,
    colorScheme: const ColorScheme.light(
      primary: LuckdateColors.deepSage,
      secondary: LuckdateColors.sunGold,
      surface: LuckdateColors.ivoryWhite,
      onPrimary: LuckdateColors.ivoryWhite,
      onSurface: LuckdateColors.textPrimary,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: true,
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
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: LuckdateColors.deepSage,
        foregroundColor: LuckdateColors.ivoryWhite,
        elevation: 0,
        minimumSize: const Size(0, 52),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        ),
        textStyle: LuckdateTextStyles.body.copyWith(fontWeight: FontWeight.w600),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: LuckdateColors.ivoryWhite,
      hintStyle: LuckdateTextStyles.bodySmall.copyWith(
        color: LuckdateColors.textSecondary.withValues(alpha: 0.55),
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        borderSide: const BorderSide(color: LuckdateColors.lineSoft),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        borderSide: const BorderSide(color: LuckdateColors.lineSoft),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.pill),
        borderSide: const BorderSide(color: LuckdateColors.deepSage, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: LuckdateSpacing.lg,
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
    dialogTheme: DialogThemeData(
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.xl),
      ),
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: LuckdateColors.mossDark,
      contentTextStyle: LuckdateTextStyles.body.copyWith(
        color: LuckdateColors.ivoryWhite,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(LuckdateRadius.md),
      ),
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: LuckdateColors.ivoryWhite,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(LuckdateRadius.sheet),
        ),
      ),
    ),
    dividerTheme: const DividerThemeData(
      color: LuckdateColors.lineSoft,
      thickness: 0.5,
    ),
  );
}
