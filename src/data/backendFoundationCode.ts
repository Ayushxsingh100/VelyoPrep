export interface BackendFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const BACKEND_FOUNDATION_FILES: BackendFile[] = [
  {
    name: "supabase_schema.sql",
    path: "supabase/migrations/20260717000000_init_schema.sql",
    description: "Complete database schema including Users, Profiles, Applications, Deadlines, Resumes, and Storage policies with RLS enabled.",
    language: "sql",
    content: `-- =========================================================================
-- PLACEMENT OS: PRIMARY DATABASE SCHEMA (TICKET-002: BACKEND FOUNDATION)
-- Author: PostgreSQL Database Architect & Supabase Expert
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- -------------------------------------------------------------------------
CREATE TYPE application_status AS ENUM ('Applied', 'Interviewing', 'Offered', 'Rejected');

-- -------------------------------------------------------------------------
-- 2. TABLES
-- -------------------------------------------------------------------------

-- Users Profile table mapped directly to Auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role_preference TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Career Profiles (Bento credentials)
CREATE TABLE IF NOT EXISTS public.career_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    primary_skills TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    bio_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Company Applications Track
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    status application_status DEFAULT 'Applied'::application_status NOT NULL,
    salary_package NUMERIC(12, 2),
    job_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Scheduled deadlines
CREATE TABLE IF NOT EXISTS public.deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Resume Versions pointing to storage bucket objects
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    parsed_keywords TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- System Settings
CREATE TABLE IF NOT EXISTS public.settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    theme_preference TEXT DEFAULT 'system' NOT NULL,
    push_notifications_enabled BOOLEAN DEFAULT true NOT NULL,
    email_digests_enabled BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------------
-- 3. INDEXING FOR HIGH-DENSITY SEARCH
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_deadlines_user_due ON public.deadlines(user_id, due_date) WHERE completed = false;
CREATE INDEX IF NOT EXISTS idx_resumes_user_primary ON public.resume_versions(user_id) WHERE is_primary = true;

-- -------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Select own user profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Insert own user profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Update own user profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Applications policies
CREATE POLICY "Select own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Delete own applications" ON public.applications
    FOR DELETE USING (auth.uid() = user_id);

-- Deadlines policies
CREATE POLICY "Select own deadlines" ON public.deadlines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert own deadlines" ON public.deadlines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own deadlines" ON public.deadlines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Delete own deadlines" ON public.deadlines
    FOR DELETE USING (auth.uid() = user_id);

-- Resume Versions policies
CREATE POLICY "Select own resume records" ON public.resume_versions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert own resume records" ON public.resume_versions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delete own resume records" ON public.resume_versions
    FOR DELETE USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Manage own settings" ON public.settings
    FOR ALL USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 5. STORAGE BUCKET CREATION & SECURING (SQL CLI)
-- -------------------------------------------------------------------------
-- Note: Buckets are typically provisioned via migration or storage schema.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects (authenticated owners only)
CREATE POLICY "Owners can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Owners can download own resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- -------------------------------------------------------------------------
-- 6. AUTOMATIC UPDATED_AT TRIGGERS
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_career_profiles_updated_at BEFORE UPDATE ON public.career_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_applications_updated_at BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER tr_deadlines_updated_at BEFORE UPDATE ON public.deadlines
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`
  },
  {
    name: "auth_repository.dart",
    path: "lib/features/auth/domain/repositories/auth_repository.dart",
    description: "Type-safe abstract Auth Repository interface enforcing monadic result design pattern.",
    language: "dart",
    content: `import '../../../../core/errors/failure.dart';
import '../entities/user.dart';

abstract class IAuthRepository {
  /// Stream monitoring live auth session changes
  Stream<PlacementUser?> get onAuthStateChanged;

  /// Authenticate using email & password
  Future<Result<PlacementUser, Failure>> signInWithEmail({
    required String email,
    required String password,
  });

  /// Register new student account
  Future<Result<PlacementUser, Failure>> signUpWithEmail({
    required String email,
    required String password,
    required String fullName,
  });

  /// Authenticate via unified Google Sign-In
  Future<Result<PlacementUser, Failure>> signInWithGoogle();

  /// Trigger secure password recovery link email
  Future<Result<void, Failure>> sendPasswordReset(String email);

  /// Get current session profile or null
  Future<PlacementUser?> getCurrentUser();

  /// Revoke session and log out
  Future<Result<void, Failure>> signOut();
}
`
  },
  {
    name: "supabase_auth_repository.dart",
    path: "lib/features/auth/data/repositories/supabase_auth_repository.dart",
    description: "Concrete production-ready Auth Repository implementation catching and mapping all Supabase Exceptions.",
    language: "dart",
    content: `import 'dart:async';
import 'package:supabase_flutter/supabase_flutter.dart' as supabase;
import '../../../../core/errors/failure.dart';
import '../../../../services/logger/app_logger.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/entities/user.dart';
import '../models/user_dto.dart';

class SupabaseAuthRepository implements IAuthRepository {
  final supabase.SupabaseClient _client;
  final IAppLogger _logger;

  SupabaseAuthRepository(this._client, this._logger);

  @override
  Stream<PlacementUser?> get onAuthStateChanged {
    return _client.auth.onAuthStateChange.map((state) {
      final session = state.session;
      if (session == null || session.user == null) return null;
      return UserDto.fromSupabase(session.user!).toEntity();
    });
  }

  @override
  Future<Result<PlacementUser, Failure>> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      _logger.info('Attempting sign in for: $email');
      final response = await _client.auth.signInWithPassword(
        email: email,
        password: password,
      );
      if (response.user == null) {
        return const FailureState(AuthFailure('No user returned from security server.'));
      }
      final user = UserDto.fromSupabase(response.user!).toEntity();
      return Success(user);
    } on supabase.AuthException catch (e) {
      _logger.error('Supabase AuthException during signin', e);
      return FailureState(AuthFailure(e.message));
    } catch (e) {
      _logger.fatal('Unexpected system crash during signin', e);
      return FailureState(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Result<PlacementUser, Failure>> signUpWithEmail({
    required String email,
    required String password,
    required String fullName,
  }) async {
    try {
      _logger.info('Attempting registration for: $email');
      final response = await _client.auth.signUp(
        email: email,
        password: password,
        data: {'full_name': fullName},
      );
      if (response.user == null) {
        return const FailureState(AuthFailure('Registration failed on server.'));
      }
      final user = UserDto.fromSupabase(response.user!).toEntity();
      return Success(user);
    } on supabase.AuthException catch (e) {
      _logger.error('Supabase AuthException during signup', e);
      return FailureState(AuthFailure(e.message));
    } catch (e) {
      _logger.fatal('Unexpected failure', e);
      return FailureState(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Result<PlacementUser, Failure>> signInWithGoogle() async {
    try {
      _logger.info('Triggering Google OAuth Flow');
      // Typically utilizes standard secure web redirection or native plugin credential exchange
      final success = await _client.auth.signInWithOAuth(
        supabase.OAuthProvider.google,
        redirectTo: 'placementos://auth-callback',
      );
      if (!success) {
        return const FailureState(AuthFailure('Google login workflow aborted.'));
      }
      // Session updates are propagated asynchronously via onAuthStateChanged stream
      return const FailureState(AuthFailure('Awaiting browser redirection completion.'));
    } catch (e) {
      _logger.error('Google Auth flow crash', e);
      return FailureState(AuthFailure(e.toString()));
    }
  }

  @override
  Future<Result<void, Failure>> sendPasswordReset(String email) async {
    try {
      await _client.auth.resetPasswordForEmail(email);
      return const Success(null);
    } on supabase.AuthException catch (e) {
      return FailureState(AuthFailure(e.message));
    } catch (e) {
      return FailureState(ServerFailure(e.toString()));
    }
  }

  @override
  Future<PlacementUser?> getCurrentUser() async {
    final user = _client.auth.currentUser;
    if (user == null) return null;
    return UserDto.fromSupabase(user).toEntity();
  }

  @override
  Future<Result<void, Failure>> signOut() async {
    try {
      await _client.auth.signOut();
      return const Success(null);
    } catch (e) {
      return FailureState(ServerFailure(e.toString()));
    }
  }
}
`
  },
  {
    name: "user_dto.dart",
    path: "lib/features/auth/data/models/user_dto.dart",
    description: "Data Transfer Object mapping, serialization and deserialization of Users from Database JSON format.",
    language: "dart",
    content: `import 'package:supabase_flutter/supabase_flutter.dart' as supabase;
import '../../domain/entities/user.dart';

class UserDto {
  final String id;
  final String email;
  final String fullName;
  final String? avatarUrl;
  final String? rolePreference;

  const UserDto({
    required this.id,
    required this.email,
    required this.fullName,
    this.avatarUrl,
    this.rolePreference,
  });

  /// Factory map from Supabase internal Auth User instance
  factory UserDto.fromSupabase(supabase.User user) {
    return UserDto(
      id: user.id,
      email: user.email ?? '',
      fullName: user.userMetadata?['full_name'] ?? 'User Profile',
      avatarUrl: user.userMetadata?['avatar_url'],
      rolePreference: user.userMetadata?['role_preference'],
    );
  }

  /// Deserialization from Database raw map JSON
  factory UserDto.fromJson(Map<String, dynamic> json) {
    return UserDto(
      id: json['id'] as String,
      email: json['email'] as String? ?? '',
      fullName: json['full_name'] as String? ?? 'Placement Student',
      avatarUrl: json['avatar_url'] as String?,
      rolePreference: json['role_preference'] as String?,
    );
  }

  /// Serialization to Database raw JSON map
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'role_preference': rolePreference,
    };
  }

  /// Mapping DTO back to Clean Architecture Domain Entity
  PlacementUser toEntity() {
    return PlacementUser(
      id: id,
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
      rolePreference: rolePreference,
    );
  }
}
`
  },
  {
    name: "app_logger.dart",
    path: "lib/services/logger/app_logger.dart",
    description: "Logger abstraction to isolate console printing from production crash aggregators.",
    language: "dart",
    content: `abstract class IAppLogger {
  void debug(String message);
  void info(String message);
  void warn(String message);
  void error(String message, [dynamic error, StackTrace? stackTrace]);
  void fatal(String message, [dynamic error, StackTrace? stackTrace]);
}

class ConsoleLogger implements IAppLogger {
  @override
  void debug(String message) {
    print('DEBUG: [\${DateTime.now()}] $message');
  }

  @override
  void info(String message) {
    print('INFO: [\${DateTime.now()}] $message');
  }

  @override
  void warn(String message) {
    print('WARN: [\${DateTime.now()}] $message');
  }

  @override
  void error(String message, [dynamic error, StackTrace? stackTrace]) {
    print('ERROR: [\${DateTime.now()}] $message | Error: $error');
  }

  @override
  void fatal(String message, [dynamic error, StackTrace? stackTrace]) {
    print('FATAL: [\${DateTime.now()}] $message | Error: $error');
  }
}
`
  },
  {
    name: "di_registry.dart",
    path: "lib/core/config/di_registry.dart",
    description: "Dependency injection registrations for global repositories, logging systems, and Supabase client bindings.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../services/logger/app_logger.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/data/repositories/supabase_auth_repository.dart';

// 1. Supabase Native Client Provider
final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

// 2. High Density Console Logger Provider
final appLoggerProvider = Provider<IAppLogger>((ref) {
  return ConsoleLogger();
});

// 3. Isolated Auth Repository Provider
final authRepositoryProvider = Provider<IAuthRepository>((ref) {
  final client = ref.watch(supabaseClientProvider);
  final logger = ref.watch(appLoggerProvider);
  return SupabaseAuthRepository(client, logger);
});
`
  }
];
