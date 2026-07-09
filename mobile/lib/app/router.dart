import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme/luckdate_theme.dart';
import '../../features/auth/auth_flow_pages.dart';
import '../../features/auth/auth_pages.dart';
import '../../features/chat/chat_page.dart';
import '../../features/collection/collection_page.dart';
import '../../features/journey/journey_page.dart';
import '../../features/onboarding/onboarding_page.dart';
import '../../features/profile/profile_page.dart';
import '../../features/profile/reminder_settings_page.dart';
import '../../features/splash/splash_page.dart';
import '../../features/today/today_page.dart';
import '../../shared/models/models.dart';
import '../../shared/providers/app_providers.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _todayKey = GlobalKey<NavigatorState>(debugLabel: 'today');
final _chatKey = GlobalKey<NavigatorState>(debugLabel: 'chat');
final _journeyKey = GlobalKey<NavigatorState>(debugLabel: 'journey');

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(appStateProvider, (_, __) => refresh.value++);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    refreshListenable: refresh,
    redirect: (context, state) {
      final path = state.matchedLocation;
      final profile = ref.read(appStateProvider).profile;
      if (path.startsWith('/region') || path.startsWith('/activation'))
        return '/login';

      final isPublicAuth =
          path == '/' ||
          path == '/login' ||
          path == '/register' ||
          path == '/register-success' ||
          path == '/link-order';

      if (!profile.isLoggedIn && !isPublicAuth) return '/login';

      if (profile.isLoggedIn) {
        if (profile.isNewRegistration &&
            !profile.couponRewardSeen &&
            path != '/register-success') {
          return '/register-success';
        }
        if (profile.isNewRegistration &&
            profile.couponRewardSeen &&
            profile.orderLinkStatus == OrderLinkStatus.notStarted &&
            path != '/link-order' &&
            path != '/onboarding') {
          return '/link-order';
        }
        if (!profile.onboardingComplete &&
            path != '/onboarding' &&
            path != '/register-success' &&
            path != '/link-order') {
          return '/onboarding';
        }
        if (profile.onboardingComplete &&
            (path == '/login' ||
                path == '/register' ||
                path == '/onboarding')) {
          return '/today';
        }
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const SplashPage()),
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterPage()),
      GoRoute(
        path: '/register-success',
        builder: (_, __) => const RegisterSuccessPage(),
      ),
      GoRoute(path: '/link-order', builder: (_, __) => const OrderLinkPage()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingPage()),
      GoRoute(
        path: '/journey/report',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const Day28ReportPage(),
      ),
      GoRoute(
        path: '/collection/product/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, state) =>
            ProductDetailPage(productId: state.pathParameters['id']!),
      ),
      GoRoute(path: '/collection', builder: (_, __) => const CollectionPage()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
      GoRoute(
        path: '/profile/reminders',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const ReminderSettingsPage(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return _MainShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _todayKey,
            routes: [
              GoRoute(path: '/today', builder: (_, __) => const TodayPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _chatKey,
            routes: [
              GoRoute(path: '/chat', builder: (_, __) => const ChatPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _journeyKey,
            routes: [
              GoRoute(
                path: '/journey',
                builder: (_, __) => const JourneyPage(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

class _MainShell extends StatelessWidget {
  const _MainShell({required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    final hideBottomNav = navigationShell.currentIndex == 1;

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: navigationShell,
      bottomNavigationBar: hideBottomNav
          ? null
          : NavigationBar(
              selectedIndex: navigationShell.currentIndex,
              onDestinationSelected: navigationShell.goBranch,
              backgroundColor: LuckdateColors.ivoryWhite,
              indicatorColor: LuckdateColors.sageSoft,
              height: 72,
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.home_outlined),
                  selectedIcon: Icon(Icons.home_rounded),
                  label: 'Ritual',
                ),
                NavigationDestination(
                  icon: Icon(Icons.chat_bubble_outline_rounded),
                  selectedIcon: Icon(Icons.chat_bubble_rounded),
                  label: 'Viva',
                ),
                NavigationDestination(
                  icon: Icon(Icons.explore_outlined),
                  selectedIcon: Icon(Icons.explore_rounded),
                  label: 'Journey',
                ),
              ],
            ),
    );
  }
}
