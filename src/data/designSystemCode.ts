export interface DesignSystemFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const DESIGN_SYSTEM_FILES: DesignSystemFile[] = [
  {
    name: "app_tokens.dart",
    path: "lib/core/theme/app_tokens.dart",
    description: "Strongly typed design tokens for spacing scales, border-radii, elevations, and layout opacities.",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: STRONGLY TYPED DESIGN TOKENS (TICKET-003)
/// Enforces absolute visual consistency. No raw values allowed in UI tree.
/// =========================================================================

class AppSpacing {
  AppSpacing._();
  static const double none = 0.0;
  static const double xxs = 4.0;    // Micro items (Text next to icon)
  static const double xs = 8.0;     // Badge padding, list element gap
  static const double sm = 12.0;    // Nested elements, card inner elements
  static const double md = 16.0;    // Screen layout margins, standard spacing
  static const double lg = 20.0;    // Section gap, headers
  static const double xl = 24.0;    // Major grid sections
  static const double xxl = 32.0;   // App shell gutters
  static const double xxxl = 48.0;  // Immersive layouts
}

class AppRadius {
  AppRadius._();
  static const double none = 0.0;
  static const double xs = 4.0;     // Tag indicators
  static const double sm = 8.0;     // Standard input fields, small badges
  static const double md = 12.0;    // Main interaction buttons, inner cards
  static const double lg = 16.0;    // Card structures, bento modules
  static const double xl = 24.0;    // Dialog panels, bottom sheets
  static const double circular = 999.0; // Avatars, pill status badges
}

class AppElevation {
  AppElevation._();
  static const double none = 0.0;
  static const double card = 2.0;
  static const double menu = 4.0;
  static const double modal = 8.0;
  static const double banner = 12.0;
}

class AppOpacity {
  AppOpacity._();
  static const double hover = 0.08;
  static const double pressed = 0.16;
  static const double disabled = 0.38;
  static const double border = 0.12;
  static const double glassOverlay = 0.65;
}

class AppStrokeWidth {
  AppStrokeWidth._();
  static const double hairline = 0.5;
  static const double border = 1.0;
  static const double activeBorder = 2.0;
  static const double indicator = 3.0;
}
`
  },
  {
    name: "app_colors.dart",
    path: "lib/core/theme/app_colors.dart",
    description: "Light and Dark palette color specifications with semantic indicators (Success, Warning, Error).",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: CORE PALETTE & COLOR SYSTEM
/// Implements dual-theme spec. Colors are paired with high-contrast rules.
/// =========================================================================

class AppColors {
  AppColors._();

  // 1. Light Mode Palette (Paper Classic)
  static const Color lightPrimary = Color(0xFF2563EB); // Royal Indigo Accent
  static const Color lightBackground = Color(0xFFFAFAFA); // Crisp Off-White
  static const Color lightSurface = Color(0xFFFFFFFF); // Pure Card Surface
  static const Color lightSurfaceElevated = Color(0xFFF4F4F5); 
  static const Color lightBorder = Color(0xFFE4E4E7); 
  static const Color lightTextPrimary = Color(0xFF09090B); 
  static const Color lightTextSecondary = Color(0xFF71717A); 
  static const Color lightTextMuted = Color(0xFFA1A1AA);

  // 2. Dark Mode Palette (Obsidian Black)
  static const Color darkPrimary = Color(0xFF3B82F6); // Electric Blue Accent
  static const Color darkBackground = Color(0xFF09090B); // Deeper Cosmos Black
  static const Color darkSurface = Color(0xFF121214); // Obsidian Surface Card
  static const Color darkSurfaceElevated = Color(0xFF1E1E22);
  static const Color darkBorder = Color(0xFF27272A); 
  static const Color darkTextPrimary = Color(0xFFFAFAFA); 
  static const Color darkTextSecondary = Color(0xFFA1A1AA); 
  static const Color darkTextMuted = Color(0xFF52525B);

  // 3. Constant Semantic Color Mappings (Accessible High Contrast)
  static const Color success = Color(0xFF10B981); // Emerald Green
  static const Color warning = Color(0xFFF59E0B); // Bright Amber
  static const Color error = Color(0xFFEF4444); // Crimson Red
  static const Color info = Color(0xFF0EA5E9); // Tech Sky Blue
}
`
  },
  {
    name: "app_theme.dart",
    path: "lib/core/theme/app_theme.dart",
    description: "Theme data configurations for Light & Dark mode supporting modern Material 3.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_tokens.dart';

class AppTheme {
  AppTheme._();

  /// Comprehensive Light Theme Specification
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.lightPrimary,
      scaffoldBackgroundColor: AppColors.lightBackground,
      cardColor: AppColors.lightSurface,
      dividerColor: AppColors.lightBorder,
      
      colorScheme: const ColorScheme.light(
        primary: AppColors.lightPrimary,
        secondary: AppColors.lightPrimary,
        surface: AppColors.lightSurface,
        background: AppColors.lightBackground,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSurface: AppColors.lightTextPrimary,
        onBackground: AppColors.lightTextPrimary,
      ),

      textTheme: const TextTheme(
        displayLarge: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold, color: AppColors.lightTextPrimary),
        headlineMedium: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        titleMedium: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        bodyLarge: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.normal, color: AppColors.lightTextPrimary),
        bodyMedium: TextStyle(fontFamily: 'Inter', color: AppColors.lightTextSecondary),
        labelSmall: TextStyle(fontFamily: 'JetBrainsMono', fontWeight: FontWeight.w500, color: AppColors.lightTextMuted),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.lightSurfaceElevated,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.lightBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.lightBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.lightPrimary, width: AppStrokeWidth.activeBorder),
        ),
      ),
    );
  }

  /// Comprehensive Dark Theme Specification (Obsidian Dark)
  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AppColors.darkPrimary,
      scaffoldBackgroundColor: AppColors.darkBackground,
      cardColor: AppColors.darkSurface,
      dividerColor: AppColors.darkBorder,
      
      colorScheme: const ColorScheme.dark(
        primary: AppColors.darkPrimary,
        secondary: AppColors.darkPrimary,
        surface: AppColors.darkSurface,
        background: AppColors.darkBackground,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSurface: AppColors.darkTextPrimary,
        onBackground: AppColors.darkTextPrimary,
      ),

      textTheme: const TextTheme(
        displayLarge: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold, color: AppColors.darkTextPrimary),
        headlineMedium: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        titleMedium: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        bodyLarge: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.normal, color: AppColors.darkTextPrimary),
        bodyMedium: TextStyle(fontFamily: 'Inter', color: AppColors.darkTextSecondary),
        labelSmall: TextStyle(fontFamily: 'JetBrainsMono', fontWeight: FontWeight.w500, color: AppColors.darkTextMuted),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.darkSurfaceElevated,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.darkBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.darkBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.md),
          borderSide: const BorderSide(color: AppColors.darkPrimary, width: AppStrokeWidth.activeBorder),
        ),
      ),
    );
  }
}
`
  },
  {
    name: "app_motion.dart",
    path: "lib/core/theme/app_motion.dart",
    description: "Motion standards, timings, ease-curves, and interactive hover/press parameters.",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: MOTION SYSTEM SPEC
/// Smooth, responsive frame intervals keeping presentation snappy.
/// =========================================================================

class AppDuration {
  AppDuration._();
  static const Duration micro = Duration(milliseconds: 100);  // Hover feedback
  static const Duration quick = Duration(milliseconds: 200);  // Button status switches
  static const Duration standard = Duration(milliseconds: 300); // Route/Sheet entrances
  static const Duration visual = Duration(milliseconds: 500); // Elaborate graph draws
}

class AppCurve {
  AppCurve._();
  static const Curve primary = Curves.easeInOutCubic;
  static const Curve spring = Curves.fastOutSlowIn;
  static const Curve deceleration = Curves.easeOutCubic;
}
`
  },
  {
    name: "responsive.dart",
    path: "lib/core/responsive/responsive.dart",
    description: "Layout helper to classification screen size and provide adaptive margins.",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: RESPONSIVE SCREEN SEGMENTER
/// Assures flawless display across Mobile, Tablet, and Desktop ratios.
/// =========================================================================

enum ScreenType { mobile, tablet, desktop }

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget desktop;

  const ResponsiveLayout({
    Key? key,
    required this.mobile,
    this.tablet,
    required this.desktop,
  }) : super(key: key);

  static ScreenType getScreenType(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    if (width < 640) return ScreenType.mobile;
    if (width < 1024) return ScreenType.tablet;
    return ScreenType.desktop;
  }

  static bool isMobile(BuildContext context) => getScreenType(context) == ScreenType.mobile;
  static bool isTablet(BuildContext context) => getScreenType(context) == ScreenType.tablet;
  static bool isDesktop(BuildContext context) => getScreenType(context) == ScreenType.desktop;

  @override
  Widget build(BuildContext context) {
    final type = getScreenType(context);
    switch (type) {
      case ScreenType.mobile:
        return mobile;
      case ScreenType.tablet:
        return tablet ?? mobile;
      case ScreenType.desktop:
        return desktop;
    }
  }
}
`
  },
  {
    name: "shared_widgets.dart",
    path: "lib/shared/widgets/shared_widgets.dart",
    description: "Production-ready reusable widgets including PrimaryButton, PasswordField, and Dropdown with clean states.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import '../../core/theme/app_tokens.dart';

/// =========================================================================
/// REUSABLE PRIMARY ELEVATED ACTION BUTTON (SUPPORTING ACTIVE STATES)
/// =========================================================================
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Widget? icon;

  const PrimaryButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDisabled = onPressed == null || isLoading;

    return SizedBox(
      height: 48,
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          elevation: AppElevation.none,
          backgroundColor: theme.primaryColor,
          disabledBackgroundColor: theme.primaryColor.withOpacity(AppOpacity.disabled),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
        ),
        onPressed: isDisabled ? null : onPressed,
        child: isLoading
            ? const SizedBox(
                height: 18,
                width: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[icon!, const SizedBox(width: AppSpacing.xs)],
                  Text(
                    text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

/// =========================================================================
/// REUSABLE PASSWORD TEXT FIELD WITH TOGGLEABILITY
/// =========================================================================
class PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final String? placeholder;

  const PasswordField({
    Key? key,
    required this.controller,
    required this.label,
    this.placeholder,
  }) : super(key: key);

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label.toUpperCase(),
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        const SizedBox(height: AppSpacing.xxs),
        TextField(
          controller: widget.controller,
          obscureText: _obscureText,
          style: const TextStyle(fontSize: 13),
          decoration: InputDecoration(
            hintText: widget.placeholder ?? "••••••••",
            prefixIcon: const Icon(Icons.lock_outline, size: 18),
            suffixIcon: IconButton(
              icon: Icon(_obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 18),
              onPressed: () => setState(() => _obscureText = !_obscureText),
            ),
          ),
        ),
      ],
    );
  }
}

/// =========================================================================
/// ACCESSIBLE AND INTERACTIVE DROPDOWN COMPONENT
/// =========================================================================
class AppDropdown<T> extends StatelessWidget {
  final String label;
  final T value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;

  const AppDropdown({
    Key? key,
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
        ),
        const SizedBox(height: AppSpacing.xxs),
        DropdownButtonFormField<T>(
          value: value,
          items: items,
          onChanged: onChanged,
          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 18),
          decoration: const InputDecoration(
            contentPadding: EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
          ),
        ),
      ],
    );
  }
}

/// =========================================================================
/// METRIC CARD (BENTO) FOR DATA PRESENTATION
/// =========================================================================
class MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final Widget? trailing;

  const MetricCard({
    Key? key,
    required this.label,
    required this.value,
    this.trailing,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                label.toUpperCase(),
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: theme.hintColor),
              ),
              if (trailing != null) trailing!,
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
          ),
        ],
      ),
    );
  }
}
`
  }
];
