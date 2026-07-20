export interface ScaffoldFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const FLUTTER_SCAFFOLD_FILES: ScaffoldFile[] = [
  {
    name: "pubspec.yaml",
    path: "pubspec.yaml",
    language: "yaml",
    content: `name: placement_os
description: A startup-grade single operating system for college internships, placements, and career tracking.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Navigation & Routing
  go_router: ^13.2.0

  # State Management
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.3

  # Backend & Database
  supabase_flutter: ^2.6.0

  # UI & Presentation
  lucide_icons: ^0.320.0
  google_fonts: ^6.2.0
  flutter_spinkit: ^5.2.1
  shimmer: ^3.1.0

  # Local Storage & Cache
  shared_preferences: ^2.2.2
  cached_network_image: ^3.3.1
  flutter_secure_storage: ^9.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.8
  riverpod_generator: ^2.3.9

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - .env
`
  },
  {
    name: "main.dart",
    path: "lib/main.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'core/routing/app_router.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase using environment variables (no hardcoded secrets)
  const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  );

  runApp(
    const ProviderScope(
      child: VeyloPrepApp(),
    ),
  );
}

class VeyloPrepApp extends ConsumerWidget {
  const VeyloPrepApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'VeyloPrep',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark, // Defaulting to the Obsidian Dark Mode first
      routerConfig: router,
    );
  }
}
`
  },
  {
    name: "design_tokens.dart",
    path: "lib/core/theme/design_tokens.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';

class AppSpacing {
  static const double xxs = 4.0;
  static const double xs = 8.0;
  static const double sm = 12.0;
  static const double md = 16.0;
  static const double lg = 20.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  static const double h1 = 40.0;
  static const double h2 = 48.0;
  static const double h3 = 64.0;
}

class AppRadius {
  static const double xs = 2.0;
  static const double sm = 4.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const BorderRadius full = BorderRadius.all(Radius.circular(9999.0));

  static BorderRadius get xsRadius => const BorderRadius.all(Radius.circular(xs));
  static BorderRadius get smRadius => const BorderRadius.all(Radius.circular(sm));
  static BorderRadius get mdRadius => const BorderRadius.all(Radius.circular(md));
  static BorderRadius get lgRadius => const BorderRadius.all(Radius.circular(lg));
  static BorderRadius get xlRadius => const BorderRadius.all(Radius.circular(xl));
}

class AppDurations {
  static const Duration fast = Duration(milliseconds: 80);
  static const Duration medium = Duration(milliseconds: 150);
  static const Duration slow = Duration(milliseconds: 250);
  static const Duration verySlow = Duration(milliseconds: 400);
}

class AppCurves {
  static const Curve standard = Cubic(0.2, 0.8, 0.2, 1.0);
  static const Curve accelerate = Cubic(0.3, 0.0, 0.8, 0.15);
  static const Curve decelerate = Cubic(0.05, 0.7, 0.1, 1.0);
}
`
  },
  {
    name: "app_theme.dart",
    path: "lib/core/theme/app_theme.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Dark Palette (Obsidian Core)
  static const Color darkBackground = Color(0xFF09090B);
  static const Color darkSurface = Color(0xFF121214);
  static const Color darkSurfaceElevated = Color(0xFF1E1E22);
  static const Color primaryAccent = Color(0xFF2563EB);
  static const Color secondaryAccent = Color(0xFF38BDF8);
  static const Color darkBorder = Color(0xFF27272A);
  static const Color darkDivider = Color(0xFF18181B);

  // Light Palette
  static const Color lightBackground = Color(0xFFFAFAFA);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceElevated = Color(0xFFF4F4F5);
  static const Color lightBorder = Color(0xFFE4E4E7);
  static const Color lightDivider = Color(0xFFF4F4F5);

  // Statuses
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF6366F1);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryAccent,
        secondary: secondaryAccent,
        surface: darkSurface,
        error: error,
        outline: darkBorder,
      ),
      dividerColor: darkDivider,
      textTheme: _buildTextTheme(Brightness.dark),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: lightBackground,
      colorScheme: const ColorScheme.light(
        primary: primaryAccent,
        secondary: secondaryAccent,
        surface: lightSurface,
        error: error,
        outline: lightBorder,
      ),
      dividerColor: lightDivider,
      textTheme: _buildTextTheme(Brightness.light),
    );
  }

  static TextTheme _buildTextTheme(Brightness brightness) {
    final baseTheme = brightness == Brightness.dark 
        ? ThemeData.dark().textTheme 
        : ThemeData.light().textTheme;

    return TextTheme(
      displayLarge: GoogleFonts.inter(
        textStyle: baseTheme.displayLarge?.copyWith(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.02,
        ),
      ),
      headlineLarge: GoogleFonts.inter(
        textStyle: baseTheme.headlineLarge?.copyWith(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.015,
        ),
      ),
      titleMedium: GoogleFonts.inter(
        textStyle: baseTheme.titleMedium?.copyWith(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.01,
        ),
      ),
      bodyLarge: GoogleFonts.inter(
        textStyle: baseTheme.bodyLarge?.copyWith(
          fontSize: 14,
          fontWeight: FontWeight.normal,
          letterSpacing: 0.0,
        ),
      ),
      labelLarge: GoogleFonts.inter(
        textStyle: baseTheme.labelLarge?.copyWith(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.02,
        ),
      ),
    );
  }
}
`
  },
  {
    name: "app_router.dart",
    path: "lib/core/routing/app_router.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Import features / screens placeholders
// Note: In real app, we would import concrete screens. Here we represent scaffolding structure.

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const PlaceholderScreen(title: 'Login Gate'),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const PlaceholderScreen(title: 'Signup Gate'),
      ),
      ShellRoute(
        builder: (context, state, child) {
          return NavigationShell(child: child);
        },
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const PlaceholderScreen(title: 'Workspace Dashboard'),
          ),
          GoRoute(
            path: '/tracker',
            builder: (context, state) => const PlaceholderScreen(title: 'Placement Tracker'),
          ),
          GoRoute(
            path: '/vault',
            builder: (context, state) => const PlaceholderScreen(title: 'Career Vault'),
          ),
          GoRoute(
            path: '/deadlines',
            builder: (context, state) => const PlaceholderScreen(title: 'Deadline Tracker'),
          ),
          GoRoute(
            path: '/jobs',
            builder: (context, state) => const PlaceholderScreen(title: 'Job Portal'),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const PlaceholderScreen(title: 'Settings'),
          ),
        ],
      ),
    ],
    redirect: (context, state) {
      // Direct implementation of Auth Guard.
      // E.g. Check auth state and redirect if not logged in.
      return null;
    },
  );
});

class NavigationShell extends StatelessWidget {
  final Widget child;
  const NavigationShell({required this.child, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      // Shared navigation shell layout
    );
  }
}

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({required this.title, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('Placeholder for $title')),
    );
  }
}
`
  },
  {
    name: "failure.dart",
    path: "lib/core/errors/failure.dart",
    language: "dart",
    content: `// Sealed Result monad for type-safe Clean Architecture communication
sealed class Result<S, E extends Failure> {
  const Result();

  R fold<R>({
    required R Function(S success) onSuccess,
    required R Function(E failure) onFailure,
  }) {
    if (this is Success<S, E>) {
      return onSuccess((this as Success<S, E>).value);
    } else if (this is FailureState<S, E>) {
      return onFailure((this as FailureState<S, E>).failure);
    }
    throw Exception('Unknown Result type');
  }
}

class Success<S, E extends Failure> extends Result<S, E> {
  final S value;
  const Success(this.value);
}

class FailureState<S, E extends Failure> extends Result<S, E> {
  final E failure;
  const FailureState(this.failure);
}

// Exception abstraction hierarchy
abstract class Failure {
  final String message;
  const Failure(this.message);
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = "An unexpected server error occurred."]);
}

class DatabaseFailure extends Failure {
  const DatabaseFailure([super.message = "Database synchronization failed."]);
}

class AuthFailure extends Failure {
  const AuthFailure([super.message = "Authentication credentials rejected."]);
}

class ValidationFailure extends Failure {
  const ValidationFailure([super.message = "Invalid input fields detected."]);
}
`
  },
  {
    name: "responsive_layout.dart",
    path: "lib/core/utils/responsive_layout.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';

enum DeviceType { smallPhone, largePhone, tablet, desktop }

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    required this.mobile,
    this.tablet,
    this.desktop,
    super.key,
  });

  static DeviceType getDeviceType(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 360) return DeviceType.smallPhone;
    if (width < 600) return DeviceType.largePhone;
    if (width < 1024) return DeviceType.tablet;
    return DeviceType.desktop;
  }

  static bool isMobile(BuildContext context) => getDeviceType(context) == DeviceType.largePhone || getDeviceType(context) == DeviceType.smallPhone;
  static bool isTablet(BuildContext context) => getDeviceType(context) == DeviceType.tablet;
  static bool isDesktop(BuildContext context) => getDeviceType(context) == DeviceType.desktop;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width >= 1024 && desktop != null) {
      return desktop!;
    } else if (width >= 600 && tablet != null) {
      return tablet!;
    } else {
      return mobile;
    }
  }
}
`
  },
  {
    name: "primary_button.dart",
    path: "lib/shared/widgets/primary_button.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import '../../core/theme/design_tokens.dart';

class PrimaryButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isDanger;

  const PrimaryButton({
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isDanger = false,
    super.key,
  });

  @override
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> {
  double _scale = 1.0;

  void _onTapDown(TapDownDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      setState(() => _scale = 0.98);
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.onPressed != null && !widget.isLoading) {
      setState(() => _scale = 1.0);
    }
  }

  void _onTapCancel() {
    setState(() => _scale = 1.0);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    final backgroundColor = widget.onPressed == null
        ? theme.colorScheme.primary.withOpacity(0.12)
        : widget.isDanger 
            ? theme.colorScheme.error 
            : theme.colorScheme.primary;

    final textColor = widget.onPressed == null
        ? theme.textTheme.labelLarge?.color?.withOpacity(0.38)
        : Colors.white;

    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedScale(
        scale: _scale,
        duration: AppDurations.fast,
        curve: AppCurves.standard,
        child: Container(
          height: 44,
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
          ),
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
              color: isDark ? Colors.white.withOpacity(0.12) : Colors.black.withOpacity(0.08),
              width: 1.0,
            ),
          ),
          child: widget.isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : Text(
                  widget.text,
                  style: theme.textTheme.labelLarge?.copyWith(
                    color: textColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
        ),
      ),
    );
  }
}
`
  },
  {
    name: "custom_text_field.dart",
    path: "lib/shared/widgets/custom_text_field.dart",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import '../../core/theme/design_tokens.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final String? placeholder;
  final bool isPassword;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final TextInputType keyboardType;

  const CustomTextField({
    required this.label,
    this.placeholder,
    this.isPassword = false,
    this.controller,
    this.validator,
    this.keyboardType = TextInputType.text,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: theme.textTheme.labelLarge?.copyWith(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: theme.hintColor,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        TextFormField(
          controller: controller,
          obscureText: isPassword,
          validator: validator,
          keyboardType: keyboardType,
          style: theme.textTheme.bodyLarge,
          decoration: InputDecoration(
            hintText: placeholder,
            filled: true,
            fillColor: theme.brightness == Brightness.dark 
                ? const Color(0xFF1E1E22) 
                : const Color(0xFFF4F4F5),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: BorderSide(color: theme.dividerColor, width: 1.0),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: BorderSide(color: theme.dividerColor, width: 1.0),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: BorderSide(color: theme.colorScheme.primary, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              borderSide: BorderSide(color: theme.colorScheme.error, width: 1.0),
            ),
          ),
        ),
      ],
    );
  }
}
`
  },
  {
    name: "auth_controller.dart",
    path: "lib/features/auth/presentation/controllers/auth_controller.dart",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user.dart';

// State definition for safe UI rendering
class AuthState {
  final bool isLoading;
  final PlacementUser? user;
  final String? errorMessage;

  const AuthState({
    this.isLoading = false,
    this.user,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isLoading,
    PlacementUser? user,
    String? errorMessage,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class AuthController extends StateNotifier<AuthState> {
  AuthController() : super(const AuthState());

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      // Simulate API round-trip
      await Future.delayed(const Duration(seconds: 1));
      
      if (email == 'singhxayush100@gmail.com' && password == 'password') {
        state = state.copyWith(
          isLoading: false,
          user: const PlacementUser(
            id: 'usr_9124',
            email: 'singhxayush100@gmail.com',
            fullName: 'Ayush Singh',
          ),
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: 'Invalid email or password credentials.',
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Connection lost. Try again later.',
      );
    }
  }

  Future<void> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await Future.delayed(const Duration(seconds: 1));
      state = state.copyWith(
        isLoading: false,
        user: const PlacementUser(
          id: 'usr_google_81',
          email: 'singhxayush100@gmail.com',
          fullName: 'Ayush Singh (Google)',
        ),
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Google authenticaton cancelled.',
      );
    }
  }

  void logout() {
    state = const AuthState();
  }
}

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController();
});
`
  }
];
