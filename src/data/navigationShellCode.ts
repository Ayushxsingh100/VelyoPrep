export interface NavigationFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const NAVIGATION_SHELL_FILES: NavigationFile[] = [
  {
    name: "app_router.dart",
    path: "lib/core/navigation/app_router.dart",
    description: "Complete GoRouter configuration using nested ShellRoute, Auth guards, and smooth page transition specs.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/placeholders/presentation/placeholder_screens.dart';
import '../layout/app_shell.dart';

/// =========================================================================
/// PLACEMENT OS: NESTED SHELL NAVIGATION (TICKET-004)
/// Provides adaptive route redirection and guard triggers.
/// =========================================================================

final appNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell');

final routerProvider = Provider<GoRouter>((ref) {
  // Listen to Auth state changes to trigger automatic reactive routing
  final authState = ref.watch(authRepositoryProvider);

  return GoRouter(
    navigatorKey: appNavigatorKey,
    initialLocation: '/dashboard',
    redirect: (context, state) async {
      final user = await authState.getCurrentUser();
      final isLoggingIn = state.matchedLocation == '/auth';

      if (user == null) {
        // Redirect anonymous users to Auth Portal
        return isLoggingIn ? null : '/auth';
      }

      if (isLoggingIn) {
        // Redirect already logged in users straight to Dashboard
        return '/dashboard';
      }

      return null;
    },
    routes: [
      // 1. Unauthenticated Public Route
      GoRoute(
        path: '/auth',
        builder: (context, state) => const PlaceholderAuthScreen(),
      ),

      // 2. Nested Authenticated Shell Route (App Shell)
      ShellRoute(
        navigatorKey: shellNavigatorKey,
        builder: (context, state, child) {
          return AppShell(child: child, currentLocation: state.matchedLocation);
        },
        routes: [
          GoRoute(
            path: '/dashboard',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderDashboardScreen(),
            ),
          ),
          GoRoute(
            path: '/tracker',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderTrackerScreen(),
            ),
          ),
          GoRoute(
            path: '/career-vault',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderCareerVaultScreen(),
            ),
          ),
          GoRoute(
            path: '/deadlines',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderDeadlinesScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderProfileScreen(),
            ),
          ),
          GoRoute(
            path: '/settings',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: PlaceholderSettingsScreen(),
            ),
          ),
        ],
      ),
    ],
  );
});
`
  },
  {
    name: "app_shell.dart",
    path: "lib/core/layout/app_shell.dart",
    description: "Adaptive Navigation layout adapting dynamically between Bottom Navigation, Navigation Rail, or Sidebar Sidebar based on Screen Classification.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../responsive/responsive.dart';
import '../theme/app_tokens.dart';
import 'global_appbar.dart';

/// =========================================================================
/// PLACEMENT OS: ADAPTIVE CORE APP SHELL
/// Renders BottomNav on Mobile, Rail on Tablet, and static Sidebar on Desktop.
/// =========================================================================

class AppShell extends StatelessWidget {
  final Widget child;
  final String currentLocation;

  const AppShell({
    Key? key,
    required this.child,
    required this.currentLocation,
  }) : super(key: key);

  int _locationToIndex(String location) {
    if (location.startsWith('/dashboard')) return 0;
    if (location.startsWith('/tracker')) return 1;
    if (location.startsWith('/career-vault')) return 2;
    if (location.startsWith('/deadlines')) return 3;
    if (location.startsWith('/settings')) return 4;
    return 0;
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/tracker');
        break;
      case 2:
        context.go('/career-vault');
        break;
      case 3:
        context.go('/deadlines');
        break;
      case 4:
        context.go('/settings');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activeIndex = _locationToIndex(currentLocation);

    return Scaffold(
      appBar: const PreferredSize(
        preferredSize: Size.fromHeight(60),
        child: GlobalAppBar(),
      ),
      body: ResponsiveLayout(
        // Phone Layout with bottom navigation
        mobile: Column(
          children: [
            Expanded(child: child),
            BottomNavigationBar(
              currentIndex: activeIndex,
              onTap: (idx) => _onItemTapped(idx, context),
              type: BottomNavigationBarType.fixed,
              selectedItemColor: theme.primaryColor,
              unselectedItemColor: theme.hintColor,
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
                BottomNavigationBarItem(icon: Icon(Icons.analytics_outlined), label: 'Tracker'),
                BottomNavigationBarItem(icon: Icon(Icons.folder_shared_outlined), label: 'Vault'),
                BottomNavigationBarItem(icon: Icon(Icons.alarm_on_outlined), label: 'Deadlines'),
                BottomNavigationBarItem(icon: Icon(Icons.settings_outlined), label: 'Settings'),
              ],
            ),
          ],
        ),
        
        // Tablet Layout with navigation rail
        tablet: Row(
          children: [
            NavigationRail(
              selectedIndex: activeIndex,
              onDestinationSelected: (idx) => _onItemTapped(idx, context),
              labelType: NavigationRailLabelType.all,
              selectedIconTheme: IconThemeData(color: theme.primaryColor),
              destinations: const [
                NavigationRailDestination(icon: Icon(Icons.dashboard_outlined), label: Text('Dashboard')),
                NavigationRailDestination(icon: Icon(Icons.analytics_outlined), label: Text('Tracker')),
                NavigationRailDestination(icon: Icon(Icons.folder_shared_outlined), label: Text('Vault')),
                NavigationRailDestination(icon: Icon(Icons.alarm_on_outlined), label: Text('Deadlines')),
                NavigationRailDestination(icon: Icon(Icons.settings_outlined), label: Text('Settings')),
              ],
            ),
            const VerticalDivider(thickness: 1, width: 1),
            Expanded(child: child),
          ],
        ),

        // Desktop Layout with dedicated Sidebar Navigation
        desktop: Row(
          children: [
            _buildSidebar(context, activeIndex),
            const VerticalDivider(thickness: 1, width: 1),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: child,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebar(BuildContext context, int activeIndex) {
    final theme = Theme.of(context);
    return Container(
      width: 240,
      color: theme.cardColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.all(AppSpacing.md),
            child: Text(
              'NAVIGATION',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5),
            ),
          ),
          _buildSidebarItem(context, 0, Icons.dashboard_outlined, 'Dashboard', activeIndex == 0),
          _buildSidebarItem(context, 1, Icons.analytics_outlined, 'Placement Tracker', activeIndex == 1),
          _buildSidebarItem(context, 2, Icons.folder_shared_outlined, 'Career Vault', activeIndex == 2),
          _buildSidebarItem(context, 3, Icons.alarm_on_outlined, 'Deadline Tracker', activeIndex == 3),
          _buildSidebarItem(context, 4, Icons.settings_outlined, 'Settings', activeIndex == 4),
        ],
      ),
    );
  }

  Widget _buildSidebarItem(BuildContext context, int index, IconData icon, String label, bool isActive) {
    final theme = Theme.of(context);
    return ListTile(
      leading: Icon(icon, color: isActive ? theme.primaryColor : theme.hintColor, size: 20),
      title: Text(
        label,
        style: TextStyle(
          fontSize: 13,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          color: isActive ? theme.primaryColor : theme.textTheme.bodyMedium?.color,
        ),
      ),
      onTap: () => _onItemTapped(index, context),
      selected: isActive,
      selectedTileColor: theme.primaryColor.withOpacity(0.08),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
    );
  }
}
`
  },
  {
    name: "global_appbar.dart",
    path: "lib/core/layout/global_appbar.dart",
    description: "Modular high-performance App Bar supporting search indicators, notification badges, and active workspace statuses.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import '../theme/app_tokens.dart';

class GlobalAppBar extends StatelessWidget {
  const GlobalAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return AppBar(
      titleSpacing: AppSpacing.md,
      backgroundColor: theme.cardColor,
      elevation: AppElevation.none,
      scrolledUnderElevation: AppElevation.none,
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.xxs),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Colors.blue, Colors.indigo]),
              borderRadius: BorderRadius.circular(AppRadius.sm),
            ),
            child: const Icon(Icons.flash_on, color: Colors.white, size: 16),
          ),
          const SizedBox(width: AppSpacing.xs),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'PlacementOS',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
              ),
              Text(
                'COLLEGE PLACEMENT SYSTEM',
                style: TextStyle(fontSize: 8, letterSpacing: 1.0, color: Colors.grey),
              ),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, size: 20),
          onPressed: () {
            // Trigger overlay search widget
          },
        ),
        Stack(
          alignment: Alignment.topRight,
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_none_outlined, size: 20),
              onPressed: () {},
            ),
            Positioned(
              right: 8,
              top: 8,
              child: Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
              ),
            ),
          ],
        ),
        const SizedBox(width: AppSpacing.xs),
        const CircleAvatar(
          radius: 14,
          backgroundColor: Colors.blue,
          child: Text(
            'AS',
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ),
        const SizedBox(width: AppSpacing.md),
      ],
    );
  }
}
`
  },
  {
    name: "placeholder_screens.dart",
    path: "lib/features/placeholders/presentation/placeholder_screens.dart",
    description: "Comprehensive adaptive shell screens for career profiles, deadlines trackers, and setting portals with custom empty states.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import '../../../core/theme/app_tokens.dart';

/// =========================================================================
/// PLACEMENT OS: USER INTERFACE PLACEHOLDERS (TICKET-004)
/// Perfectly styled empty states mapped to all future business logic scopes.
/// =========================================================================

class PlaceholderDashboardScreen extends StatelessWidget {
  const PlaceholderDashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Dashboard Workspace',
      desc: 'Active student status, current applications progress rates, and upcoming deadline counters.',
      icon: Icons.dashboard_outlined,
    );
  }
}

class PlaceholderTrackerScreen extends StatelessWidget {
  const PlaceholderTrackerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Placement Tracker',
      desc: 'Create, edit, and filter corporate internship application processes in real-time.',
      icon: Icons.analytics_outlined,
    );
  }
}

class PlaceholderCareerVaultScreen extends StatelessWidget {
  const PlaceholderCareerVaultScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Career Vault',
      desc: 'Store different versions of resumes, portfolio links, and parsed certificates safely.',
      icon: Icons.folder_shared_outlined,
    );
  }
}

class PlaceholderDeadlinesScreen extends StatelessWidget {
  const PlaceholderDeadlinesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Deadline Tracker',
      desc: 'Calibrated scheduling system grouping tech assessments, mock interviews, and submission deadlines.',
      icon: Icons.alarm_on_outlined,
    );
  }
}

class PlaceholderSettingsScreen extends StatelessWidget {
  const PlaceholderSettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Settings Portal',
      desc: 'Manage theme configurations, push notice preferences, email alerts, and OAuth accounts.',
      icon: Icons.settings_outlined,
    );
  }
}

class PlaceholderProfileScreen extends StatelessWidget {
  const PlaceholderProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _buildContainer(
      title: 'Student Profile',
      desc: 'Review verified contact info, skill collections, and bio details.',
      icon: Icons.person_outline,
    );
  }
}

class PlaceholderAuthScreen extends StatelessWidget {
  const PlaceholderAuthScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Authentication Portal Placeholder'),
      ),
    );
  }
}

Widget _buildContainer({required String title, required String desc, required IconData icon}) {
  return Builder(
    builder: (context) {
      final theme = Theme.of(context);
      return Center(
        child: Container(
          maxWidth: 420,
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: theme.primaryColor.withOpacity(0.06),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, size: 36, color: theme.primaryColor),
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                desc,
                style: const TextStyle(fontSize: 11, height: 1.5),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }
  );
}
`
  }
];
