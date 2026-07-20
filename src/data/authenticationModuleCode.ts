export interface AuthFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const AUTHENTICATION_MODULE_FILES: AuthFile[] = [
  {
    name: "auth_state.dart",
    path: "lib/features/auth/presentation/controllers/auth_state.dart",
    description: "Strongly typed sealed state representing the lifecycle of an active or pending authentication session.",
    language: "dart",
    content: `import '../../domain/entities/user.dart';

/// =========================================================================
/// PLACEMENT OS: AUTHENTICATION STATE UNION (TICKET-005)
/// Represents complete state machine for session handling.
/// =========================================================================

abstract class AuthState {
  const AuthState();
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class Authenticated extends AuthState {
  final PlacementUser user;
  const Authenticated(this.user);
}

class Unauthenticated extends AuthState {
  const Unauthenticated();
}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);
}
`
  },
  {
    name: "auth_controller.dart",
    path: "lib/features/auth/presentation/controllers/auth_controller.dart",
    description: "Riverpod StateNotifier managing credentials validation, session persistence, Google Sign-In, and password recovery.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_state.dart';

/// =========================================================================
/// PLACEMENT OS: STATE CONTROLLER (RIVERPOD SYSTEM)
/// Drives user action handlers with built-in validation guards.
/// =========================================================================

class AuthController extends StateNotifier<AuthState> {
  final IAuthRepository _repository;

  AuthController(this._repository) : super(const AuthInitial()) {
    _initSessionListener();
  }

  void _initSessionListener() {
    _repository.onAuthStateChanged.listen((user) {
      if (user != null) {
        state = Authenticated(user);
      } else {
        state = const Unauthenticated();
      }
    });
  }

  /// Sign In user with email and password
  Future<void> signInWithEmail(String email, String password) async {
    // Basic synchronous check before hitting service
    if (email.isEmpty || password.isEmpty) {
      state = const AuthError("Email and password cannot be empty.");
      return;
    }

    state = const AuthLoading();
    final result = await _repository.signInWithEmail(email: email, password: password);
    
    result.fold(
      (user) => state = Authenticated(user),
      (failure) => state = AuthError(failure.message),
    );
  }

  /// Sign Up a new user
  Future<void> signUpWithEmail({
    required String email,
    required String password,
    required String confirmPassword,
    required String fullName,
    required bool acceptedTerms,
  }) async {
    if (fullName.isEmpty || email.isEmpty || password.isEmpty) {
      state = const AuthError("Please fill out all fields.");
      return;
    }
    if (password != confirmPassword) {
      state = const AuthError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      state = const AuthError("Password must be at least 8 characters long.");
      return;
    }
    if (!acceptedTerms) {
      state = const AuthError("You must accept the Terms of Service.");
      return;
    }

    state = const AuthLoading();
    final result = await _repository.signUpWithEmail(
      email: email,
      password: password,
      fullName: fullName,
    );

    result.fold(
      (user) => state = Authenticated(user),
      (failure) => state = AuthError(failure.message),
    );
  }

  /// Unified Google Sign-In helper
  Future<void> signInWithGoogle() async {
    state = const AuthLoading();
    final result = await _repository.signInWithGoogle();

    result.fold(
      (user) => state = Authenticated(user),
      (failure) => state = AuthError(failure.message),
    );
  }

  /// Trigger password recovery email
  Future<bool> sendPasswordReset(String email) async {
    if (email.isEmpty || !email.contains('@')) {
      state = const AuthError("Please provide a valid email address.");
      return false;
    }

    final result = await _repository.sendPasswordReset(email);
    return result.fold(
      (_) => true,
      (failure) {
        state = AuthError(failure.message);
        return false;
      },
    );
  }

  /// Log out securely and invalidate local tokens
  Future<void> signOut() async {
    state = const AuthLoading();
    await _repository.signOut();
    state = const Unauthenticated();
  }
}

// Global Provider Definition
final authControllerProvider = StateNotifierProvider<AuthController, AuthState>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthController(repo);
});
`
  },
  {
    name: "login_screen.dart",
    path: "lib/features/auth/presentation/screens/login_screen.dart",
    description: "Modern minimalist Obsidian Dark login form featuring validation, Google OAuth, and animated error states.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/shared_widgets.dart';
import '../controllers/auth_controller.dart';
import '../controllers/auth_state.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState is AuthLoading;

    // Trigger visual toast overlay on error states
    ref.listen<AuthState>(authControllerProvider, (prev, next) {
      if (next is AuthError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.message),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    });

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Container(
            maxWidth: 400,
            padding: const EdgeInsets.all(AppSpacing.xxl),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Brand Header Section
                Center(
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        decoration: BoxDecoration(
                          color: theme.primaryColor.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(Icons.flash_on, size: 32, color: theme.primaryColor),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      const Text(
                        'Welcome Back',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'SpaceGrotesk',
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                      Text(
                        'Access the PlacementOS workspace',
                        style: TextStyle(fontSize: 12, color: theme.hintColor),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Inputs Setup
                Text(
                  'EMAIL ADDRESS',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: theme.hintColor),
                ),
                const SizedBox(height: AppSpacing.xxs),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: 'student@university.edu',
                    prefixIcon: Icon(Icons.mail_outline_rounded, size: 18),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                PasswordField(
                  controller: _passwordController,
                  label: 'PASSWORD',
                  placeholder: '••••••••',
                ),
                const SizedBox(height: AppSpacing.sm),

                // Remember Me + Forgot Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (val) => setState(() => _rememberMe = val ?? false),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xs)),
                        ),
                        Text('Remember me', style: TextStyle(fontSize: 11, color: theme.hintColor)),
                      ],
                    ),
                    TextButton(
                      onPressed: () => context.push('/forgot-password'),
                      child: Text('Forgot Password?', style: TextStyle(fontSize: 11, color: theme.primaryColor)),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // Primary Actions
                PrimaryButton(
                  text: 'Sign In',
                  isLoading: isLoading,
                  onPressed: () {
                    ref.read(authControllerProvider.notifier).signInWithEmail(
                          _emailController.text.trim(),
                          _passwordController.text,
                        );
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Divider Or Option
                Row(
                  children: [
                    Expanded(child: Divider(color: theme.dividerColor)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                      child: Text('OR CONTINUE WITH', style: TextStyle(fontSize: 9, color: theme.hintColor, fontWeight: FontWeight.bold)),
                    ),
                    Expanded(child: Divider(color: theme.dividerColor)),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // Google Button Integration
                SizedBox(
                  height: 48,
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                      side: BorderSide(color: theme.dividerColor),
                    ),
                    icon: const Icon(Icons.login, size: 18),
                    label: const Text('Google Workspaces', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    onPressed: () {
                      ref.read(authControllerProvider.notifier).signInWithGoogle();
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Bottom CTA Redirect
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("Don't have an account?", style: TextStyle(fontSize: 11, color: theme.hintColor)),
                    TextButton(
                      onPressed: () => context.push('/register'),
                      child: Text('Create Account', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.primaryColor)),
                    ),
                  ],
                ),
              ],
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
    name: "register_screen.dart",
    path: "lib/features/auth/presentation/screens/register_screen.dart",
    description: "Account creation panel with robust validation, Password strength indices, and interactive legal check toggles.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/shared_widgets.dart';
import '../controllers/auth_controller.dart';
import '../controllers/auth_state.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _acceptedTerms = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState is AuthLoading;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Container(
            maxWidth: 420,
            padding: const EdgeInsets.all(AppSpacing.xxl),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Create Student Space',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
                ),
                const SizedBox(height: AppSpacing.xxs),
                Text(
                  'Join the career placement workspace',
                  style: TextStyle(fontSize: 11, color: theme.hintColor),
                ),
                const SizedBox(height: AppSpacing.xl),

                // Name Input
                Text(
                  'FULL NAME',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.hintColor, letterSpacing: 1.2),
                ),
                const SizedBox(height: AppSpacing.xxs),
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    hintText: 'Alex Rivera',
                    prefixIcon: Icon(Icons.person_outline_rounded, size: 18),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Email Input
                Text(
                  'COLLEGE EMAIL ADDRESS',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.hintColor, letterSpacing: 1.2),
                ),
                const SizedBox(height: AppSpacing.xxs),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: 'alex.rivera@university.edu',
                    prefixIcon: Icon(Icons.mail_outline_rounded, size: 18),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // Password Input
                PasswordField(
                  controller: _passwordController,
                  label: 'PASSWORD',
                  placeholder: 'Min 8 characters',
                ),
                const SizedBox(height: AppSpacing.md),

                // Confirm Password Input
                PasswordField(
                  controller: _confirmController,
                  label: 'CONFIRM PASSWORD',
                  placeholder: 'Re-enter password',
                ),
                const SizedBox(height: AppSpacing.md),

                // Legal Terms Agreement
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Checkbox(
                      value: _acceptedTerms,
                      onChanged: (val) => setState(() => _acceptedTerms = val ?? false),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.xs)),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 10.0),
                        child: Text(
                          'I agree to the PlacementOS student guidelines, code policies, and secure background verification processes.',
                          style: TextStyle(fontSize: 10, color: theme.hintColor, height: 1.4),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),

                // Primary CTA
                PrimaryButton(
                  text: 'Register Credentials',
                  isLoading: isLoading,
                  onPressed: () {
                    ref.read(authControllerProvider.notifier).signUpWithEmail(
                          email: _emailController.text.trim(),
                          password: _passwordController.text,
                          confirmPassword: _confirmController.text,
                          fullName: _nameController.text.trim(),
                          acceptedTerms: _acceptedTerms,
                        );
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Existing account fallback
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Already have an account?', style: TextStyle(fontSize: 11, color: theme.hintColor)),
                    TextButton(
                      onPressed: () => context.pop(),
                      child: Text('Sign In Instead', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.primaryColor)),
                    ),
                  ],
                ),
              ],
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
    name: "forgot_password.dart",
    path: "lib/features/auth/presentation/screens/forgot_password.dart",
    description: "Email-driven recovery linkage interface triggering user-friendly dispatch notification prompts.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../../../shared/widgets/shared_widgets.dart';
import '../controllers/auth_controller.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _linkDispatched = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: theme.iconTheme.color),
          onPressed: () => context.pop(),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Container(
            maxWidth: 400,
            padding: const EdgeInsets.all(AppSpacing.xxl),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: theme.dividerColor),
            ),
            child: _linkDispatched 
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: const BoxDecoration(
                        color: Colors.emeraldOpacity,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle_outline_rounded, size: 40, color: Colors.green),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    const Text(
                      'Dispatch Successful',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'A password recovery verification link was transmitted to your secure inbox.',
                      style: TextStyle(fontSize: 12, color: theme.hintColor, height: 1.4),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    PrimaryButton(
                      text: 'Return to Sign In',
                      onPressed: () => context.pop(),
                    ),
                  ],
                )
              : Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Recover Access',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
                    ),
                    const SizedBox(height: AppSpacing.xxs),
                    Text(
                      'Input your registered college email and we will dispatch a secure validation link.',
                      style: TextStyle(fontSize: 11, color: theme.hintColor, height: 1.4),
                    ),
                    const SizedBox(height: AppSpacing.xl),

                    Text(
                      'EMAIL ADDRESS',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.hintColor, letterSpacing: 1.2),
                    ),
                    const SizedBox(height: AppSpacing.xxs),
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        hintText: 'alex.rivera@university.edu',
                        prefixIcon: Icon(Icons.mail_outline_rounded, size: 18),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),

                    PrimaryButton(
                      text: 'Transmit Reset Link',
                      isLoading: _isLoading,
                      onPressed: () async {
                        setState(() => _isLoading = true);
                        final success = await ref
                            .read(authControllerProvider.notifier)
                            .sendPasswordReset(_emailController.text.trim());
                        setState(() => _isLoading = false);
                        if (success) {
                          setState(() => _linkDispatched = true);
                        }
                      },
                    ),
                  ],
                ),
          ),
        ),
      ),
    );
  }
}
`
  }
];
