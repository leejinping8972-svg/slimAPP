import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme/luckdate_theme.dart';
import '../../features/auth/auth_pages.dart';
import '../../features/chat/chat_page.dart';
import '../../features/collection/collection_page.dart';
import '../../features/journey/journey_page.dart';
import '../../features/onboarding/onboarding_page.dart';
import '../../features/profile/profile_page.dart';
import '../../features/splash/splash_page.dart';
import '../../features/today/today_page.dart';
import '../../shared/providers/app_providers.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _todayKey = GlobalKey<NavigatorState>(debugLabel: 'today');
final _chatKey = GlobalKey<NavigatorState>(debugLabel: 'chat');
final _journeyKey = GlobalKey<NavigatorState>(debugLabel: 'journey');
final _collectionKey = GlobalKey<NavigatorState>(debugLabel: 'collection');
final _profileKey = GlobalKey<NavigatorState>(debugLabel: 'profile');

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
      if (path.startsWith('/region')) return '/activation';

      final isAuthFlow = path == '/' ||
          path.startsWith('/activation') ||
          path.startsWith('/login') ||
          path.startsWith('/onboarding');

      if (!profile.isLoggedIn && !isAuthFlow) return '/';
      if (profile.isLoggedIn && !profile.onboardingComplete && path == '/login') {
        return '/onboarding';
      }
      if (profile.isLoggedIn && !profile.onboardingComplete && path != '/onboarding' && !isAuthFlow) {
        return '/onboarding';
      }
      if (profile.onboardingComplete && isAuthFlow && path != '/') {
        if (path == '/login' || path == '/onboarding') return '/today';
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const SplashPage()),
      GoRoute(path: '/activation', builder: (_, __) => const ActivationPage()),
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingPage()),
      GoRoute(
        path: '/journey/report',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const Day30ReportPage(),
      ),
      GoRoute(
        path: '/collection/product/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, state) => ProductDetailPage(productId: state.pathParameters['id']!),
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
              GoRoute(path: '/journey', builder: (_, __) => const JourneyPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _collectionKey,
            routes: [
              GoRoute(path: '/collection', builder: (_, __) => const CollectionPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _profileKey,
            routes: [
              GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
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
    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: navigationShell.goBranch,
        backgroundColor: LuckdateColors.ivoryWhite,
        indicatorColor: LuckdateColors.sageSoft,
        height: 72,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), selectedIcon: Icon(Icons.chat_bubble_rounded), label: 'Chat'),
          NavigationDestination(icon: Icon(Icons.explore_outlined), selectedIcon: Icon(Icons.explore_rounded), label: 'Journey'),
          NavigationDestination(icon: Icon(Icons.grid_view_rounded), selectedIcon: Icon(Icons.grid_view_rounded), label: 'Collection'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}
