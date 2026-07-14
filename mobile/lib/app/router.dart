import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'theme/luckdate_theme.dart';
import '../../features/auth/auth_flow_pages.dart';
import '../../features/auth/auth_pages.dart';
import '../../features/collection/collection_page.dart';
import '../../features/home/home_page.dart';
import '../../features/home/sunny_suggestion_page.dart';
import '../../features/record/check_in_record_page.dart';
import '../../features/onboarding/onboarding_page.dart';
import '../../features/onboarding/plan_intro_page.dart';
import '../../features/plan/plan_page.dart';
import '../../features/profile/profile_page.dart';
import '../../features/profile/reminder_settings_page.dart';
import '../../features/ritual/ritual_page.dart';
import '../../features/journey/journey_page.dart';
import '../../features/splash/splash_page.dart';
import '../../shared/models/models.dart';
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
      final path = state.matchedLocation;
      final profile = ref.read(appStateProvider).profile;
      if (path.startsWith('/region') || path.startsWith('/activation')) {
        return '/login';
      }

      final isPublicAuth =
          path == '/' ||
          path == '/login' ||
          path == '/register' ||
          path == '/register-success' ||
          path == '/link-order';

      if (!profile.isLoggedIn && !isPublicAuth) return '/login';

      if (profile.isLoggedIn) {
        if (!profile.isNewRegistration &&
            (path == '/register-success' || path == '/link-order')) {
          return '/ritual';
        }
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
            profile.isNewRegistration &&
            profile.orderLinkStatus != OrderLinkStatus.notStarted &&
            path != '/onboarding' &&
            path != '/register-success' &&
            path != '/link-order') {
          return '/onboarding';
        }
        if (profile.onboardingComplete &&
            (path == '/login' ||
                path == '/register' ||
                path == '/onboarding' ||
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
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterPage()),
      GoRoute(
        path: '/register-success',
        builder: (_, __) => const RegisterSuccessPage(),
      ),
      GoRoute(path: '/link-order', builder: (_, __) => const OrderLinkPage()),
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

  @override
  Widget build(BuildContext context) {
    // Nav: 0 Sunny (fullscreen /home), 1-4 map to shell branches 0-3.
    final selectedNavIndex = navigationShell.currentIndex + 1;

    return Scaffold(
      backgroundColor: LuckdateColors.cloudIvory,
      body: navigationShell,
      bottomNavigationBar: LdMainBottomNav(
        currentIndex: selectedNavIndex,
        onTap: (index) {
          if (index == 0) {
            // Enter Sunny as a root route so the bottom nav is hidden.
            context.push('/home');
            return;
          }
          navigationShell.goBranch(index - 1);
        },
      ),
    );
  }
}
