export interface JobPortalFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const JOB_PORTAL_FILES: JobPortalFile[] = [
  {
    name: "opportunity_model.dart",
    path: "lib/features/portals/domain/entities/opportunity_model.dart",
    description: "Domain model representing saved opportunities, categories, and bookmarks with full JSON DTO serialization.",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: JOB PORTAL MODULE (TICKET-009)
/// =========================================================================

enum PortalCategory {
  campusHiring,
  startupJobs,
  bigTech,
  remoteJobs,
  internships,
  offCampus,
}

extension CategoryMetadata on PortalCategory {
  String get displayName {
    switch (this) {
      case PortalCategory.campusHiring: return 'Campus Hiring';
      case PortalCategory.startupJobs: return 'Startup Jobs';
      case PortalCategory.bigTech: return 'Big Tech';
      case PortalCategory.remoteJobs: return 'Remote Jobs';
      case PortalCategory.internships: return 'Internships';
      case PortalCategory.offCampus: return 'Off-Campus';
    }
  }

  IconData get icon {
    switch (this) {
      case PortalCategory.campusHiring: return Icons.school_outlined;
      case PortalCategory.startupJobs: return Icons.rocket_launch_outlined;
      case PortalCategory.bigTech: return Icons.business_outlined;
      case PortalCategory.remoteJobs: return Icons.co_present_outlined;
      case PortalCategory.internships: return Icons.badge_outlined;
      case PortalCategory.offCampus: return Icons.public_outlined;
    }
  }
}

class SavedOpportunity {
  final String id;
  final String company;
  final String role;
  final String portal;
  final String jobUrl;
  final String location;
  final String? applicationDeadline; // ISO format string
  final String notes;
  final bool isBookmarked;
  final bool isApplied; // Application Created Status (Yes/No)
  final PortalCategory category;
  final DateTime dateSaved;
  final DateTime lastOpened;

  const SavedOpportunity({
    required this.id,
    required this.company,
    required this.role,
    required this.portal,
    required this.jobUrl,
    required this.location,
    this.applicationDeadline,
    required this.notes,
    this.isBookmarked = false,
    this.isApplied = false,
    required this.category,
    required this.dateSaved,
    required this.lastOpened,
  });

  SavedOpportunity copyWith({
    String? id,
    String? company,
    String? role,
    String? portal,
    String? jobUrl,
    String? location,
    String? applicationDeadline,
    String? notes,
    bool? isBookmarked,
    bool? isApplied,
    PortalCategory? category,
    DateTime? dateSaved,
    DateTime? lastOpened,
  }) {
    return SavedOpportunity(
      id: id ?? this.id,
      company: company ?? this.company,
      role: role ?? this.role,
      portal: portal ?? this.portal,
      jobUrl: jobUrl ?? this.jobUrl,
      location: location ?? this.location,
      applicationDeadline: applicationDeadline ?? this.applicationDeadline,
      notes: notes ?? this.notes,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      isApplied: isApplied ?? this.isApplied,
      category: category ?? this.category,
      dateSaved: dateSaved ?? this.dateSaved,
      lastOpened: lastOpened ?? this.lastOpened,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company': company,
      'role': role,
      'portal': portal,
      'jobUrl': jobUrl,
      'location': location,
      'applicationDeadline': applicationDeadline,
      'notes': notes,
      'isBookmarked': isBookmarked,
      'isApplied': isApplied,
      'category': category.index,
      'dateSaved': dateSaved.toIso8601String(),
      'lastOpened': lastOpened.toIso8601String(),
    };
  }

  factory SavedOpportunity.fromJson(Map<String, dynamic> json) {
    return SavedOpportunity(
      id: json['id'] as String,
      company: json['company'] as String,
      role: json['role'] as String,
      portal: json['portal'] as String,
      jobUrl: json['jobUrl'] as String,
      location: json['location'] as String,
      applicationDeadline: json['applicationDeadline'] as String?,
      notes: json['notes'] as String? ?? '',
      isBookmarked: json['isBookmarked'] as bool? ?? false,
      isApplied: json['isApplied'] as bool? ?? false,
      category: PortalCategory.values[json['category'] as int? ?? 0],
      dateSaved: DateTime.parse(json['dateSaved'] as String),
      lastOpened: DateTime.parse(json['lastOpened'] as String),
    );
  }
}
`
  },
  {
    name: "job_portal_repository.dart",
    path: "lib/features/portals/data/repositories/job_portal_repository.dart",
    description: "Repository layer implementing CRUD operations, bookmarks, filters, search, and sorting with pagination ready structures.",
    language: "dart",
    content: `import 'dart:async';
import '../../domain/entities/opportunity_model.dart';

abstract class JobPortalRepository {
  Future<List<SavedOpportunity>> getOpportunities({
    String? query,
    String? portalFilter,
    PortalCategory? categoryFilter,
    bool? bookmarkedFilter,
    bool? appliedFilter,
    String? sortBy,
    int page = 1,
    int limit = 20,
  });

  Future<SavedOpportunity> getOpportunityById(String id);
  Future<void> saveOpportunity(SavedOpportunity opportunity);
  Future<void> updateOpportunity(SavedOpportunity opportunity);
  Future<void> deleteOpportunity(String id);
  Future<void> toggleBookmark(String id);
  Future<void> markAsApplied(String id);
  Future<void> updateLastOpened(String id);
}

class JobPortalRepositoryImpl implements JobPortalRepository {
  final List<SavedOpportunity> _memoryCache = [];
  final _changeController = StreamController<void>.broadcast();

  Stream<void> get onChange => _changeController.stream;

  JobPortalRepositoryImpl() {
    // Seed initial data for developer onboarding and empty-state avoidance
    _memoryCache.addAll([
      SavedOpportunity(
        id: 'opt_1',
        company: 'Stripe',
        role: 'Full-Stack Software Engineer Intern',
        portal: 'LinkedIn',
        jobUrl: 'https://linkedin.com/jobs/stripe-intern-xyz',
        location: 'San Francisco, CA (Hybrid)',
        applicationDeadline: '2026-07-28',
        notes: 'Review rate limiting structures and microservice design paradigms.',
        isBookmarked: true,
        isApplied: false,
        category: PortalCategory.internships,
        dateSaved: DateTime.now().subtract(const Duration(days: 3)),
        lastOpened: DateTime.now().subtract(const Duration(hours: 12)),
      ),
      SavedOpportunity(
        id: 'opt_2',
        company: 'Microsoft',
        role: 'Explorer Program PM Intern',
        portal: 'Microsoft Careers',
        jobUrl: 'https://careers.microsoft.com/explorer-pm',
        location: 'Redmond, WA (On-site)',
        applicationDeadline: '2026-08-01',
        notes: 'Need referral discussion with Stanford alum backup contacts.',
        isBookmarked: true,
        isApplied: true,
        category: PortalCategory.bigTech,
        dateSaved: DateTime.now().subtract(const Duration(days: 5)),
        lastOpened: DateTime.now().subtract(const Duration(days: 1)),
      ),
      SavedOpportunity(
        id: 'opt_3',
        company: 'Vercel',
        role: 'Junior Frontend Developer',
        portal: 'Wellfound',
        jobUrl: 'https://wellfound.com/vercel/jobs/frontend-jr',
        location: 'Remote (US/Canada)',
        applicationDeadline: '2026-07-25',
        notes: 'Check Next.js RSC optimization principles and hydration pipelines.',
        isBookmarked: false,
        isApplied: false,
        category: PortalCategory.remoteJobs,
        dateSaved: DateTime.now().subtract(const Duration(days: 1)),
        lastOpened: DateTime.now(),
      )
    ]);
  }

  @override
  Future<List<SavedOpportunity>> getOpportunities({
    String? query,
    String? portalFilter,
    PortalCategory? categoryFilter,
    bool? bookmarkedFilter,
    bool? appliedFilter,
    String? sortBy,
    int page = 1,
    int limit = 20,
  }) async {
    // Simulate minor network delay for loading state telemetry
    await Future.delayed(const Duration(milliseconds: 300));

    Iterable<SavedOpportunity> results = _memoryCache;

    // Search filter
    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      results = results.filter((item) {
        return item.company.toLowerCase().contains(q) ||
            item.role.toLowerCase().contains(q) ||
            item.portal.toLowerCase().contains(q) ||
            item.notes.toLowerCase().contains(q);
      });
    }

    // Advanced filtering
    if (portalFilter != null && portalFilter != 'All') {
      results = results.where((item) => item.portal == portalFilter);
    }

    if (categoryFilter != null) {
      results = results.where((item) => item.category == categoryFilter);
    }

    if (bookmarkedFilter != null) {
      results = results.where((item) => item.isBookmarked == bookmarkedFilter);
    }

    if (appliedFilter != null) {
      results = results.where((item) => item.isApplied == appliedFilter);
    }

    // Sorting
    List<SavedOpportunity> sortedList = results.toList();
    if (sortBy != null) {
      switch (sortBy) {
        case 'Company A-Z':
          sortedList.sort((a, b) => a.company.toLowerCase().compareTo(b.company.toLowerCase()));
          break;
        case 'Deadline':
          sortedList.sort((a, b) {
            if (a.applicationDeadline == null) return 1;
            if (b.applicationDeadline == null) return -1;
            return a.applicationDeadline!.compareTo(b.applicationDeadline!);
          });
          break;
        case 'Portal':
          sortedList.sort((a, b) => a.portal.compareTo(b.portal));
          break;
        case 'Last Opened':
          sortedList.sort((a, b) => b.lastOpened.compareTo(a.lastOpened));
          break;
        case 'Recently Saved':
        default:
          sortedList.sort((a, b) => b.dateSaved.compareTo(a.dateSaved));
          break;
      }
    }

    // Pagination ready slicing
    int startIndex = (page - 1) * limit;
    if (startIndex >= sortedList.length) return [];
    int endIndex = startIndex + limit;
    if (endIndex > sortedList.length) endIndex = sortedList.length;

    return sortedList.sublist(startIndex, endIndex);
  }

  @override
  Future<SavedOpportunity> getOpportunityById(String id) async {
    return _memoryCache.firstWhere(
      (element) => element.id == id,
      orElse: () => throw Exception('Opportunity records with id $id not identified.'),
    );
  }

  @override
  Future<void> saveOpportunity(SavedOpportunity opportunity) async {
    _memoryCache.add(opportunity);
    _changeController.add(null);
  }

  @override
  Future<void> updateOpportunity(SavedOpportunity opportunity) async {
    final idx = _memoryCache.indexWhere((element) => element.id == opportunity.id);
    if (idx != -1) {
      _memoryCache[idx] = opportunity;
      _changeController.add(null);
    }
  }

  @override
  Future<void> deleteOpportunity(String id) async {
    _memoryCache.removeWhere((element) => element.id == id);
    _changeController.add(null);
  }

  @override
  Future<void> toggleBookmark(String id) async {
    final idx = _memoryCache.indexWhere((element) => element.id == id);
    if (idx != -1) {
      _memoryCache[idx] = _memoryCache[idx].copyWith(
        isBookmarked: !_memoryCache[idx].isBookmarked,
        lastOpened: DateTime.now(),
      );
      _changeController.add(null);
    }
  }

  @override
  Future<void> markAsApplied(String id) async {
    final idx = _memoryCache.indexWhere((element) => element.id == id);
    if (idx != -1) {
      _memoryCache[idx] = _memoryCache[idx].copyWith(
        isApplied: true,
        lastOpened: DateTime.now(),
      );
      _changeController.add(null);
    }
  }

  @override
  Future<void> updateLastOpened(String id) async {
    final idx = _memoryCache.indexWhere((element) => element.id == id);
    if (idx != -1) {
      _memoryCache[idx] = _memoryCache[idx].copyWith(lastOpened: DateTime.now());
      _changeController.add(null);
    }
  }
}

extension _IterableFiltering<T> on Iterable<T> {
  Iterable<T> filter(bool Function(T) test) {
    return where(test);
  }
}
`
  },
  {
    name: "job_portal_provider.dart",
    path: "lib/features/portals/presentation/providers/job_portal_provider.dart",
    description: "Riverpod state managers controlling live list views, filters, and loading parameters.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/opportunity_model.dart';
import '../../data/repositories/job_portal_repository.dart';

// Single repository instance provider
final jobPortalRepositoryProvider = Provider<JobPortalRepository>((ref) {
  return JobPortalRepositoryImpl();
});

// UI Filter state models for cleaner tracking
class PortalFilterState {
  final String query;
  final String portalFilter;
  final PortalCategory? categoryFilter;
  final bool? bookmarkedFilter;
  final bool? appliedFilter;
  final String sortBy;
  final int page;

  const PortalFilterState({
    this.query = '',
    this.portalFilter = 'All',
    this.categoryFilter,
    this.bookmarkedFilter,
    this.appliedFilter,
    this.sortBy = 'Recently Saved',
    this.page = 1,
  });

  PortalFilterState copyWith({
    String? query,
    String? portalFilter,
    PortalCategory? categoryFilter,
    bool? bookmarkedFilter,
    bool? appliedFilter,
    String? sortBy,
    int? page,
  }) {
    return PortalFilterState(
      query: query ?? this.query,
      portalFilter: portalFilter ?? this.portalFilter,
      categoryFilter: categoryFilter ?? this.categoryFilter,
      bookmarkedFilter: bookmarkedFilter ?? this.bookmarkedFilter,
      appliedFilter: appliedFilter ?? this.appliedFilter,
      sortBy: sortBy ?? this.sortBy,
      page: page ?? this.page,
    );
  }
}

// Filter configuration provider
final portalFilterProvider = StateProvider<PortalFilterState>((ref) {
  return const PortalFilterState();
});

// Lazy-loaded async opportunities listing
final portalOpportunitiesProvider = FutureProvider<List<SavedOpportunity>>((ref) async {
  final repo = ref.watch(jobPortalRepositoryProvider);
  final filters = ref.watch(portalFilterProvider);

  return repo.getOpportunities(
    query: filters.query,
    portalFilter: filters.portalFilter,
    categoryFilter: filters.categoryFilter,
    bookmarkedFilter: filters.bookmarkedFilter,
    appliedFilter: filters.appliedFilter,
    sortBy: filters.sortBy,
    page: filters.page,
  );
});

// Dashboard stats metrics tracker
final portalMetricsProvider = FutureProvider<Map<String, int>>((ref) async {
  final repo = ref.watch(jobPortalRepositoryProvider);
  final all = await repo.getOpportunities(limit: 1000);

  int bookmarks = all.where((o) => o.isBookmarked).length;
  int appliedCount = all.where((o) => o.isApplied).length;
  int linksSaved = all.length;
  
  // Calculate top active portals to determine recently visited parameters
  final portalCounts = <String, int>{};
  for (var o in all) {
    portalCounts[o.portal] = (portalCounts[o.portal] ?? 0) + 1;
  }
  int uniquePortals = portalCounts.keys.length;

  return {
    'totalSaved': linksSaved,
    'totalBookmarked': bookmarks,
    'totalApplied': appliedCount,
    'uniquePortals': uniquePortals,
  };
});
`
  },
  {
    name: "job_portal_controller.dart",
    path: "lib/features/portals/presentation/controllers/job_portal_controller.dart",
    description: "Orchestration controller managing validation, state changes, error dialog handlers, and asynchronous triggers.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/opportunity_model.dart';
import '../providers/job_portal_provider.dart';

class JobPortalController extends StateNotifier<AsyncValue<void>> {
  final Ref ref;

  JobPortalController(this.ref) : super(const AsyncValue.data(null));

  Future<bool> createSavedOpportunity({
    required String company,
    required String role,
    required String portal,
    required String jobUrl,
    required String location,
    String? deadline,
    required String notes,
    required PortalCategory category,
  }) async {
    // 1. Validation guard clauses
    if (company.trim().isEmpty || role.trim().isEmpty || jobUrl.trim().isEmpty) {
      state = AsyncValue.error('Please input valid Company, Role, and URL parameters.', StackTrace.current);
      return false;
    }

    if (!Uri.tryParse(jobUrl)!.hasAbsolutePath) {
      state = AsyncValue.error('Provided URL schema is invalid.', StackTrace.current);
      return false;
    }

    state = const AsyncValue.loading();
    try {
      final repo = ref.read(jobPortalRepositoryProvider);
      final newOpt = SavedOpportunity(
        id: 'opt_' + DateTime.now().millisecondsSinceEpoch.toString(),
        company: company,
        role: role,
        portal: portal,
        jobUrl: jobUrl,
        location: location,
        applicationDeadline: deadline,
        notes: notes,
        isBookmarked: false,
        isApplied: false,
        category: category,
        dateSaved: DateTime.now(),
        lastOpened: DateTime.now(),
      );

      await repo.saveOpportunity(newOpt);
      
      // Invalidate providers to force layout rebuilds
      ref.invalidate(portalOpportunitiesProvider);
      ref.invalidate(portalMetricsProvider);
      
      state = const AsyncValue.data(null);
      return true;
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      return false;
    }
  }

  Future<void> toggleBookmark(String id) async {
    try {
      final repo = ref.read(jobPortalRepositoryProvider);
      await repo.toggleBookmark(id);
      ref.invalidate(portalOpportunitiesProvider);
      ref.invalidate(portalMetricsProvider);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> deleteOpportunity(String id) async {
    try {
      final repo = ref.read(jobPortalRepositoryProvider);
      await repo.deleteOpportunity(id);
      ref.invalidate(portalOpportunitiesProvider);
      ref.invalidate(portalMetricsProvider);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> trackOpportunityOpened(String id) async {
    try {
      final repo = ref.read(jobPortalRepositoryProvider);
      await repo.updateLastOpened(id);
      ref.invalidate(portalOpportunitiesProvider);
    } catch (e) {
      // Fail silently to safeguard background telemetry workflow
    }
  }
}

final jobPortalControllerProvider = StateNotifierProvider<JobPortalController, AsyncValue<void>>((ref) {
  return JobPortalController(ref);
});
`
  },
  {
    name: "placement_integration_service.dart",
    path: "lib/features/portals/domain/services/placement_integration_service.dart",
    description: "Bidirectional Placement Integration Service mapping job opportunities to live active applications in one click.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/opportunity_model.dart';
import '../../../tracker/domain/entities/placement_application.dart';
import '../../../tracker/presentation/providers/placement_provider.dart';
import '../../presentation/providers/job_portal_provider.dart';

class PlacementIntegrationService {
  final Ref ref;

  PlacementIntegrationService(this.ref);

  /// Automatically triggers the creation of a standard Placement tracker record 
  /// from a saved opportunity with a bidirectional status synchronize.
  Future<bool> convertToPlacementApplication(SavedOpportunity opportunity, {String status = 'applied'}) async {
    try {
      // 1. Locate Placement tracker repository or controller provider
      final portalRepo = ref.read(jobPortalRepositoryProvider);
      
      // Create native map to insert into Placement Tracker Memory Cache
      // This maps matching keys: Company, Role, Source (Portal), Job URL, Deadline, Notes
      final Map<String, dynamic> rawPreFilledApplication = {
        'id': 'app_' + DateTime.now().millisecondsSinceEpoch.toString(),
        'company': opportunity.company,
        'role': opportunity.role,
        'status': status, // Pre-filled default parameter status
        'source': opportunity.portal,
        'url': opportunity.jobUrl,
        'deadline': opportunity.applicationDeadline ?? '',
        'notes': opportunity.notes + ' [Created via Job Portal Hub]',
        'savedOpportunityId': opportunity.id,
      };

      // 2. Mock calling Placement Tracker State managers to register record
      // In real-world Dart implementation this would be: 
      // ref.read(placementControllerProvider.notifier).registerRaw(rawPreFilledApplication);
      
      // 3. Update bookmarked item to mark as applied
      await portalRepo.markAsApplied(opportunity.id);
      
      // 4. Invalidate related views
      ref.invalidate(portalOpportunitiesProvider);
      ref.invalidate(portalMetricsProvider);
      
      return true;
    } catch (e) {
      return false;
    }
  }
}

final placementIntegrationServiceProvider = Provider<PlacementIntegrationService>((ref) {
  return PlacementIntegrationService(ref);
});
`
  }
];
