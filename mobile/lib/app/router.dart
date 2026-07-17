import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme/luckdate_theme.dart';
import '../../features/auth/auth_flow_pages.dart';
import '../../features/auth/auth_pages.dart';
import '../../features/collection/collection_page.dart';
import '../../features/collection/product_detail_page.dart';
import '../../features/home/home_page.dart';
import '../../features/home/sunny_suggestion_page.dart';
import '../../features/record/check_in_record_page.dart';
import '../../features/onboarding/onboarding_page.dart';
import '../../features/onboarding/plan_intro_page.dart';
import '../../features/onboarding/product_intro_page.dart';
import '../../features/plan/plan_page.dart';
import '../../features/profile/profile_page.dart';
import '../../features/profile/reminder_settings_page.dart';
import '../../features/ritual/ritual_page.dart';
import '../../features/journey/journey_page.dart';
import '../../features/splash/splash_page.dart';
import '../../features/splash/welcome_page.dart';
import '../../features/splash/sunny_intro_page.dart';
import '../../shared/providers/app_providers.dart';
import '../../core/widgets/ld_shell.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _ritualKey = GlobalKey<NavigatorState>(debugLabel: 'ritual');
final _planKey = GlobalKey<NavigatorState>(debugLabel: 'plan');
final _mallKey = GlobalKey<NavigatorState>(debugLabel: 'mall');
final _meKey = GlobalKey<NavigatorState>(debugLabel: 'me');

final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(appStateProvider, (_, __) => refresh.value++);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    refreshListenable: refresh,
    redirect: (context, state) {
      // Prefer path over matchedLocation so hash routes are stable on GH Pages.
      final path = state.uri.path.isEmpty ? '/' : state.uri.path;
      final app = ref.read(appStateProvider);
      final profile = app.profile;
      if (path.startsWith('/region') || path.startsWith('/activation')) {
        return '/login';
      }

      // Guests must pass launch splash→guide before auth screens.
      // Fixes refresh / deep-link to #/register skipping the guide.
      if (!profile.isLoggedIn && !app.launchGuideSeen) {
        if (path == '/login' ||
            path == '/register' ||
            path == '/welcome' ||
            path == '/sunny/intro' ||
            path == '/register-success' ||
            path == '/link-order' ||
            path == '/product-intro') {
          return '/';
        }
      }

      // Guests must finish fixed Sunny opening before register.
      if (!profile.isLoggedIn &&
          app.launchGuideSeen &&
          !app.sunnyOpeningSeen &&
          path == '/register') {
        return '/sunny/intro';
      }

      final isPublicAuth =
          path == '/' ||
          path == '/welcome' ||
          path == '/sunny/intro' ||
          path == '/login' ||
          path == '/register' ||
          path == '/register-success' ||
          path == '/link-order' ||
          path == '/product-intro';

      // Guests may only browse public auth/launch screens.
      if (!profile.isLoggedIn && !isPublicAuth) return '/login';

      if (profile.isLoggedIn) {
        // Logged-in users skip launch/guide.
        if (path == '/' || path == '/welcome') {
          return profile.onboardingComplete ? '/ritual' : '/home';
        }
        if (path == '/login' || path == '/register') {
          return profile.onboardingComplete ? '/ritual' : '/home';
        }
        if (!profile.isNewRegistration &&
            (path == '/register-success' || path == '/link-order')) {
          return profile.onboardingComplete ? '/ritual' : '/home';
        }
        // New registration with completed chat — don't reopen link-order.
        if (profile.isNewRegistration &&
            profile.onboardingComplete &&
            path == '/link-order') {
          return '/home';
        }
        if (profile.onboardingComplete &&
            (path == '/onboarding' ||
                path == '/register-success' ||
                path == '/link-order' ||
                path == '/today' ||
                path == '/chat' ||
                path == '/journey')) {
          return '/ritual';
        }
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const SplashPage()),
      GoRoute(path: '/welcome', builder: (_, __) => const WelcomePage()),
      GoRoute(path: '/sunny/intro', builder: (_, __) => const SunnyIntroPage()),
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterPage()),
      GoRoute(
        path: '/register-success',
        builder: (_, __) => const RegisterSuccessPage(),
      ),
      GoRoute(path: '/link-order', builder: (_, __) => const OrderLinkPage()),
      GoRoute(
        path: '/product-intro',
        builder: (_, __) => const ProductIntroPage(),
      ),
      GoRoute(
        path: '/plan/intro',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const PlanIntroPage(),
      ),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingPage()),
      GoRoute(
        path: '/home',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const HomePage(),
      ),
      GoRoute(
        path: '/sunny/suggestions',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const SunnySuggestionPage(),
      ),
      GoRoute(
        path: '/record',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (_, __) => const CheckInRecordPage(),
      ),
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
            navigatorKey: _ritualKey,
            routes: [
              GoRoute(path: '/ritual', builder: (_, __) => const RitualPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _planKey,
            routes: [
              GoRoute(path: '/plan', builder: (_, __) => const PlanPage()),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _mallKey,
            routes: [
              GoRoute(
                path: '/mall',
                builder: (_, __) => const CollectionPage(rootTab: true),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _meKey,
            routes: [
              GoRoute(
                path: '/me',
                builder: (_, __) => const ProfilePage(rootTab: true),
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

  int _selectedNavIndex(String location) {
    if (location.startsWith('/me') || location.startsWith('/profile')) {
      return 4;
    }
    if (location.startsWith('/mall') || location.startsWith('/collection')) {
      return 3;
    }
    if (location.startsWith('/plan')) return 2;
    if (location.startsWith('/ritual')) return 1;
    return navigationShell.currentIndex + 1;
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: navigationShell,
      bottomNavigationBar: LdMainBottomNav(
        currentIndex: _selectedNavIndex(location),
        onTap: (index) {
          switch (index) {
            case 0:
              // Fullscreen Sunny chat — keep bottom nav off this route.
              context.push('/home');
            case 1:
              context.go('/ritual');
            case 2:
              context.go('/plan');
            case 3:
              context.go('/mall');
            case 4:
              context.go('/me');
          }
        },
      ),
    );
  }
}
