import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme/luckdate_theme.dart';
import '../../core/widgets/ld_components.dart';
import '../../shared/providers/app_providers.dart';

/// Fixed Sunny opening — self-intro + Luckdate Slim product system (not chat).
class SunnyIntroPage extends ConsumerStatefulWidget {
  const SunnyIntroPage({super.key});

  @override
  ConsumerState<SunnyIntroPage> createState() => _SunnyIntroPageState();
}

class _SunnyIntroPageState extends ConsumerState<SunnyIntroPage> {
  final _pageController = PageController();
  int _page = 0;

  static const _slides = [
    _IntroSlide(
      title: 'Hi, I\'m Sunny',
      body:
          'Your Daily Vitality Ritual Partner\n\n'
          'Scientific Formula · AI Companionship · Daily Rituals · Growing Together',
      highlights: [
        (
          '☀️',
          'Daily Rituals',
          'Cultivate habits, brighten every day',
        ),
        (
          '📊',
          'Vitality Dashboard',
          'Track your data, see your progress',
        ),
        (
          '🪷',
          'Scientific Formula',
          'Professional formulas, reliable companionship',
        ),
        (
          '👥',
          'Community Support',
          'Support each other, grow together',
        ),
        (
          '🛍️',
          'Health Mall',
          'Curated quality products for a healthier lifestyle',
        ),
      ],
    ),
    _IntroSlide(
      title: 'Luckdate Slim Vitality',
      body:
          'A science-backed product system designed for everyday vitality — '
          'from slim support to beauty, energy, and healthy aging.',
      highlights: [
        ('🌿', 'Slim Vitality', ''),
        ('✨', 'Beauty Vitality', ''),
        ('🧬', 'Healthy Aging', ''),
        ('🌸', 'Women\'s Vitality', ''),
        ('🧠', 'Mind Vitality', ''),
        ('⚡', 'Energy Vitality', ''),
        ('☀️', 'Daily Vitality', ''),
      ],
    ),
    _IntroSlide(
      title: 'Your 28-Day Journey',
      body:
          'After you register, link your order to unlock the right plan. '
          'Then I\'ll ask a few core questions to build your personalized 28-day Slim Journey.',
      highlights: [
        ('📦', 'Link order or skip for now', ''),
        ('🎯', '3–5 core questions', ''),
        ('📋', 'Personalized 28-day plan', ''),
      ],
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _next() {
    if (_page < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeOutCubic,
      );
      return;
    }
    ref.read(appStateProvider.notifier).markSunnyOpeningSeen();
    context.go('/register');
  }

  @override
  Widget build(BuildContext context) {
    final isLast = _page == _slides.length - 1;
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
              child: Row(
                children: [
                  if (_page > 0)
                    IconButton(
                      onPressed: () => _pageController.previousPage(
                        duration: const Duration(milliseconds: 280),
                        curve: Curves.easeOutCubic,
                      ),
                      icon: const Icon(Icons.arrow_back_ios_new, size: 18),
                    )
                  else
                    const SizedBox(width: 48),
                  Expanded(
                    child: Text(
                      'Meet Sunny',
                      textAlign: TextAlign.center,
                      style: LuckdateTextStyles.title,
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (i) => setState(() => _page = i),
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(
                      LuckdateSpacing.lg,
                      LuckdateSpacing.xl,
                      LuckdateSpacing.lg,
                      LuckdateSpacing.lg,
                    ),
                    child: Column(
                      children: [
                        const LdSunnyAvatar(size: 120),
                        const SizedBox(height: LuckdateSpacing.xl),
                        Text(
                          slide.title,
                          textAlign: TextAlign.center,
                          style: LuckdateTextStyles.h1,
                        ),
                        const SizedBox(height: LuckdateSpacing.md),
                        Text(
                          slide.body,
                          textAlign: TextAlign.center,
                          style: LuckdateTextStyles.body.copyWith(height: 1.55),
                        ),
                        const SizedBox(height: LuckdateSpacing.xl),
                        ...slide.highlights.map((h) {
                          return Padding(
                            padding: const EdgeInsets.only(
                              bottom: LuckdateSpacing.sm,
                            ),
                            child: LdCard(
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(h.$1, style: const TextStyle(fontSize: 22)),
                                  const SizedBox(width: LuckdateSpacing.md),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          h.$2,
                                          style: LuckdateTextStyles.body.copyWith(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        if (h.$3.isNotEmpty) ...[
                                          const SizedBox(height: 2),
                                          Text(
                                            h.$3,
                                            style: LuckdateTextStyles.caption,
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                LuckdateSpacing.lg,
                LuckdateSpacing.sm,
                LuckdateSpacing.lg,
                LuckdateSpacing.lg,
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_slides.length, (i) {
                      final active = i == _page;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: active ? 10 : 6,
                        height: active ? 10 : 6,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: active
                              ? LuckdateColors.deepSage
                              : LuckdateColors.lineSoft,
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: LuckdateSpacing.lg),
                  LdPrimaryButton(
                    label: isLast ? 'Create my account' : 'Continue',
                    onPressed: _next,
                  ),
                  if (!isLast) ...[
                    const SizedBox(height: LuckdateSpacing.sm),
                    TextButton(
                      onPressed: () {
                        ref.read(appStateProvider.notifier).markSunnyOpeningSeen();
                        context.go('/register');
                      },
                      child: Text(
                        'Skip intro',
                        style: LuckdateTextStyles.caption.copyWith(
                          color: LuckdateColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _IntroSlide {
  const _IntroSlide({
    required this.title,
    required this.body,
    required this.highlights,
  });

  final String title;
  final String body;
  final List<(String, String, String)> highlights;
}
