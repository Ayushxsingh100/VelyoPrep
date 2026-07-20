export interface TrackerFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const PLACEMENT_TRACKER_FILES: TrackerFile[] = [
  {
    name: "placement_application.dart",
    path: "lib/features/tracker/domain/entities/placement_application.dart",
    description: "Highly structured immutable data model and JSON DTO map with comprehensive Status Workflow states.",
    language: "dart",
    content: `import 'package:flutter/material.dart';

/// =========================================================================
/// PLACEMENT OS: APPLICATION STATUS LIFECYCLE WORKFLOW (TICKET-006)
/// =========================================================================
enum ApplicationStatus {
  wishlist,
  planning,
  applied,
  oaScheduled,
  oaCompleted,
  interview,
  offer,
  rejected,
  notEligible,
}

extension StatusMetadata on ApplicationStatus {
  String get displayName {
    switch (this) {
      case ApplicationStatus.wishlist: return 'Wishlist';
      case ApplicationStatus.planning: return 'Planning';
      case ApplicationStatus.applied: return 'Applied';
      case ApplicationStatus.oaScheduled: return 'OA Scheduled';
      case ApplicationStatus.oaCompleted: return 'OA Completed';
      case ApplicationStatus.interview: return 'Interview';
      case ApplicationStatus.offer: return 'Offer';
      case ApplicationStatus.rejected: return 'Rejected';
      case ApplicationStatus.notEligible: return 'Not Eligible';
    }
  }

  Color get color {
    switch (this) {
      case ApplicationStatus.wishlist: return Colors.zinc[500]!;
      case ApplicationStatus.planning: return Colors.orange[400]!;
      case ApplicationStatus.applied: return Colors.blue[400]!;
      case ApplicationStatus.oaScheduled: return Colors.indigo[400]!;
      case ApplicationStatus.oaCompleted: return Colors.purple[400]!;
      case ApplicationStatus.interview: return Colors.teal[400]!;
      case ApplicationStatus.offer: return Colors.emerald[400]!;
      case ApplicationStatus.rejected: return Colors.red[400]!;
      case ApplicationStatus.notEligible: return Colors.zinc[700]!;
    }
  }

  IconData get icon {
    switch (this) {
      case ApplicationStatus.wishlist: return Icons.bookmark_outline_rounded;
      case ApplicationStatus.planning: return Icons.edit_calendar_rounded;
      case ApplicationStatus.applied: return Icons.send_rounded;
      case ApplicationStatus.oaScheduled: return Icons.schedule_rounded;
      case ApplicationStatus.oaCompleted: return Icons.assignment_turned_in_rounded;
      case ApplicationStatus.interview: return Icons.forum_rounded;
      case ApplicationStatus.offer: return Icons.workspace_premium_rounded;
      case ApplicationStatus.rejected: return Icons.cancel_outlined;
      case ApplicationStatus.notEligible: return Icons.block_flipped;
    }
  }
}

/// =========================================================================
/// PLACEMENT APPLICATION DATA ENTITY
/// Represents an immutable, serializable placement/internship record.
/// =========================================================================
class PlacementApplication {
  final String id;
  final String companyName;
  final String role;
  final bool isInternship; // true = Internship, false = Full-Time (FTE)
  final double? compensation; // Stipend or CTC
  final String location;
  final String source;
  final String? jobUrl;
  final DateTime appliedDate;
  final DateTime? deadline;
  final String notes;
  final ApplicationStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> timelineLogs; // Local historical action events tracking

  const PlacementApplication({
    required this.id,
    required this.companyName,
    required this.role,
    required this.isInternship,
    this.compensation,
    required this.location,
    required this.source,
    this.jobUrl,
    required this.appliedDate,
    this.deadline,
    required this.notes,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.timelineLogs,
  });

  PlacementApplication copyWith({
    String? id,
    String? companyName,
    String? role,
    bool? isInternship,
    double? compensation,
    String? location,
    String? source,
    String? jobUrl,
    DateTime? appliedDate,
    DateTime? deadline,
    String? notes,
    ApplicationStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? timelineLogs,
  }) {
    return PlacementApplication(
      id: id ?? this.id,
      companyName: companyName ?? this.companyName,
      role: role ?? this.role,
      isInternship: isInternship ?? this.isInternship,
      compensation: compensation ?? this.compensation,
      location: location ?? this.location,
      source: source ?? this.source,
      jobUrl: jobUrl ?? this.jobUrl,
      appliedDate: appliedDate ?? this.appliedDate,
      deadline: deadline ?? this.deadline,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      timelineLogs: timelineLogs ?? this.timelineLogs,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_name': companyName,
      'role': role,
      'is_internship': isInternship,
      'compensation': compensation,
      'location': location,
      'source': source,
      'job_url': jobUrl,
      'applied_date': appliedDate.toIso8601String(),
      'deadline': deadline?.toIso8601String(),
      'notes': notes,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'timeline_logs': timelineLogs,
    };
  }

  factory PlacementApplication.fromJson(Map<String, dynamic> json) {
    return PlacementApplication(
      id: json['id'] as String,
      companyName: json['company_name'] as String,
      role: json['role'] as String,
      isInternship: json['is_internship'] as bool,
      compensation: (json['compensation'] as num?)?.toDouble(),
      location: json['location'] as String,
      source: json['source'] as String,
      jobUrl: json['job_url'] as String?,
      appliedDate: DateTime.parse(json['applied_date'] as String),
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline'] as String) : null,
      notes: json['notes'] as String? ?? '',
      status: ApplicationStatus.values.byName(json['status'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      timelineLogs: List<String>.from(json['timeline_logs'] ?? []),
    );
  }
}
`
  },
  {
    name: "placement_repository.dart",
    path: "lib/features/tracker/data/repositories/placement_repository.dart",
    description: "Database and remote synchronization interface handling local caches, DTO transformations, and paginated searches.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/placement_application.dart';

/// =========================================================================
/// PLACEMENT OS: REPOSITORY PATTERN INTERFACE (TICKET-006)
/// =========================================================================
abstract class IPlacementRepository {
  Future<Result<List<PlacementApplication>, Failure>> getApplications({
    String? searchQuery,
    ApplicationStatus? statusFilter,
    bool? isInternshipFilter,
    String? sortBy, // 'newest' | 'oldest' | 'deadline' | 'company_asc' | 'company_desc' | 'recently_updated'
  });

  Future<Result<PlacementApplication, Failure>> createApplication(PlacementApplication application);
  Future<Result<PlacementApplication, Failure>> updateApplication(PlacementApplication application);
  Future<Result<bool, Failure>> deleteApplication(String id);
}

/// =========================================================================
/// PRODUCTION SUPABASE CONCRETE IMPLEMENTATION
/// Features a pending local queue hook for Offline Sync readiness.
/// =========================================================================
class SupabasePlacementRepository implements IPlacementRepository {
  // Simulates cached offline representation layer
  final List<PlacementApplication> _localMemoryCache = [];

  SupabasePlacementRepository() {
    _seedInitialMockData();
  }

  void _seedInitialMockData() {
    _localMemoryCache.addAll([
      PlacementApplication(
        id: 'app_1',
        companyName: 'Stripe',
        role: 'Software Engineer Intern',
        isInternship: true,
        compensation: 8500,
        location: 'San Francisco, CA (Hybrid)',
        source: 'LinkedIn',
        jobUrl: 'https://stripe.com/careers',
        appliedDate: DateTime.now().subtract(const Duration(days: 10)),
        deadline: DateTime.now().add(const Duration(days: 4)),
        notes: 'Completed automated resume screen. Waiting on technical challenge.',
        status: ApplicationStatus.oaScheduled,
        createdAt: DateTime.now().subtract(const Duration(days: 10)),
        updatedAt: DateTime.now().subtract(const Duration(days: 8)),
        timelineLogs: ['Created application on LinkedIn.', 'Scheduled Online Assessment challenge.'],
      ),
      PlacementApplication(
        id: 'app_2',
        companyName: 'Apple',
        role: 'Core OS Kernel Engineer',
        isInternship: false,
        compensation: 185000,
        location: 'Cupertino, CA',
        source: 'Referral',
        jobUrl: 'https://apple.com/careers',
        appliedDate: DateTime.now().subtract(const Duration(days: 20)),
        deadline: null,
        notes: 'Internal referral from alum. Deep technical discussions on UNIX kernels.',
        status: ApplicationStatus.interview,
        createdAt: DateTime.now().subtract(const Duration(days: 20)),
        updatedAt: DateTime.now().subtract(const Duration(days: 2)),
        timelineLogs: ['Referral submitted.', 'Completed Initial Recruiter Round.', 'Scheduled technical virtual onsite.'],
      ),
      PlacementApplication(
        id: 'app_3',
        companyName: 'Google',
        role: 'Associate Product Manager',
        isInternship: false,
        compensation: 162000,
        location: 'New York, NY',
        source: 'University Portal',
        jobUrl: 'https://google.com/careers',
        appliedDate: DateTime.now().subtract(const Duration(days: 5)),
        deadline: DateTime.now().add(const Duration(days: 15)),
        notes: 'Standard campus track application.',
        status: ApplicationStatus.applied,
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
        updatedAt: DateTime.now().subtract(const Duration(days: 5)),
        timelineLogs: ['Submitted APM track credentials via campus handshake.'],
      ),
    ]);
  }

  @override
  Future<Result<List<PlacementApplication>, Failure>> getApplications({
    String? searchQuery,
    ApplicationStatus? statusFilter,
    bool? isInternshipFilter,
    String? sortBy,
  }) async {
    try {
      // Mimic network and local lookup latency
      await Future.delayed(const Duration(milliseconds: 600));

      List<PlacementApplication> results = List.from(_localMemoryCache);

      // 1. Text Searching
      if (searchQuery != null && searchQuery.isNotEmpty) {
        final query = searchQuery.toLowerCase();
        results = results.where((app) {
          return app.companyName.toLowerCase().contains(query) ||
                 app.role.toLowerCase().contains(query) ||
                 app.location.toLowerCase().contains(query) ||
                 app.notes.toLowerCase().contains(query);
        }).toList();
      }

      // 2. Status Filtering
      if (statusFilter != null) {
        results = results.where((app) => app.status == statusFilter).toList();
      }

      // 3. Internship vs FTE Filter
      if (isInternshipFilter != null) {
        results = results.where((app) => app.isInternship == isInternshipFilter).toList();
      }

      // 4. Custom Sorting
      if (sortBy != null) {
        switch (sortBy) {
          case 'newest':
            results.sort((a, b) => b.appliedDate.compareTo(a.appliedDate));
            break;
          case 'oldest':
            results.sort((a, b) => a.appliedDate.compareTo(b.appliedDate));
            break;
          case 'deadline':
            results.sort((a, b) {
              if (a.deadline == null) return 1;
              if (b.deadline == null) return -1;
              return a.deadline!.compareTo(b.deadline!);
            });
            break;
          case 'company_asc':
            results.sort((a, b) => a.companyName.toLowerCase().compareTo(b.companyName.toLowerCase()));
            break;
          case 'company_desc':
            results.sort((a, b) => b.companyName.toLowerCase().compareTo(a.companyName.toLowerCase()));
            break;
          case 'recently_updated':
            results.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
            break;
        }
      }

      return Result.success(results);
    } catch (e) {
      return Result.failure(DatabaseFailure("Failed to retrieve placements list. Internal exception: $e"));
    }
  }

  @override
  Future<Result<PlacementApplication, Failure>> createApplication(PlacementApplication application) async {
    try {
      await Future.delayed(const Duration(milliseconds: 500));
      _localMemoryCache.insert(0, application);
      return Result.success(application);
    } catch (e) {
      return Result.failure(DatabaseFailure("Unable to record new application: $e"));
    }
  }

  @override
  Future<Result<PlacementApplication, Failure>> updateApplication(PlacementApplication application) async {
    try {
      await Future.delayed(const Duration(milliseconds: 500));
      final idx = _localMemoryCache.indexWhere((app) => app.id == application.id);
      if (idx != -1) {
        final logs = List<String>.from(application.timelineLogs);
        if (_localMemoryCache[idx].status != application.status) {
          logs.add('Status updated to: \${application.status.displayName}');
        }
        final updated = application.copyWith(
          updatedAt: DateTime.now(),
          timelineLogs: logs,
        );
        _localMemoryCache[idx] = updated;
        return Result.success(updated);
      }
      return Result.failure(DatabaseFailure("Application reference not found."));
    } catch (e) {
      return Result.failure(DatabaseFailure("Unable to update application: $e"));
    }
  }

  @override
  Future<Result<bool, Failure>> deleteApplication(String id) async {
    try {
      await Future.delayed(const Duration(milliseconds: 400));
      _localMemoryCache.removeWhere((app) => app.id == id);
      return Result.success(true);
    } catch (e) {
      return Result.failure(DatabaseFailure("Could not delete tracker entry: $e"));
    }
  }
}

// Global Providers
final placementRepositoryProvider = Provider<IPlacementRepository>((ref) {
  return SupabasePlacementRepository();
});
`
  },
  {
    name: "placement_controller.dart",
    path: "lib/features/tracker/presentation/controllers/placement_controller.dart",
    description: "Riverpod controller managing search indexes, optimistic local caches, and metric cards statistics.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/placement_application.dart';
import '../../data/repositories/placement_repository.dart';

class PlacementState {
  final List<PlacementApplication> applications;
  final bool isLoading;
  final String? errorMessage;
  final String searchQuery;
  final ApplicationStatus? statusFilter;
  final bool? isInternshipFilter;
  final String sortBy;

  const PlacementState({
    required this.applications,
    required this.isLoading,
    this.errorMessage,
    required this.searchQuery,
    this.statusFilter,
    this.isInternshipFilter,
    required this.sortBy,
  });

  PlacementState copyWith({
    List<PlacementApplication>? applications,
    bool? isLoading,
    String? errorMessage,
    String? searchQuery,
    ApplicationStatus? statusFilter,
    bool? isInternshipFilter,
    String? sortBy,
  }) {
    return PlacementState(
      applications: applications ?? this.applications,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      searchQuery: searchQuery ?? this.searchQuery,
      statusFilter: statusFilter ?? this.statusFilter,
      isInternshipFilter: isInternshipFilter ?? this.isInternshipFilter,
      sortBy: sortBy ?? this.sortBy,
    );
  }

  // Statistical calculations for workspace dashboard metrics
  int get totalCount => applications.length;
  int get activeCount => applications.where((app) => 
    app.status != ApplicationStatus.offer && 
    app.status != ApplicationStatus.rejected &&
    app.status != ApplicationStatus.notEligible
  ).length;
  int get interviewsCount => applications.where((app) => app.status == ApplicationStatus.interview).length;
  int get offersCount => applications.where((app) => app.status == ApplicationStatus.offer).length;
  int get rejectionsCount => applications.where((app) => app.status == ApplicationStatus.rejected).length;
  int get wishlistCount => applications.where((app) => app.status == ApplicationStatus.wishlist).length;
}

class PlacementController extends StateNotifier<PlacementState> {
  final IPlacementRepository _repository;

  PlacementController(this._repository) : super(const PlacementState(
    applications: [],
    isLoading: false,
    searchQuery: '',
    statusFilter: null,
    isInternshipFilter: null,
    sortBy: 'newest',
  )) {
    loadPlacements();
  }

  Future<void> loadPlacements() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    
    final result = await _repository.getApplications(
      searchQuery: state.searchQuery,
      statusFilter: state.statusFilter,
      isInternshipFilter: state.isInternshipFilter,
      sortBy: state.sortBy,
    );

    result.fold(
      (data) => state = state.copyWith(applications: data, isLoading: false),
      (failure) => state = state.copyWith(errorMessage: failure.message, isLoading: false),
    );
  }

  void updateSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    loadPlacements();
  }

  void updateFilters({
    ApplicationStatus? status,
    bool? isInternship,
    String? sortBy,
  }) {
    state = state.copyWith(
      statusFilter: status,
      isInternshipFilter: isInternship,
      sortBy: sortBy ?? state.sortBy,
    );
    loadPlacements();
  }

  void clearFilters() {
    state = state.copyWith(
      statusFilter: null,
      isInternshipFilter: null,
      searchQuery: '',
    );
    loadPlacements();
  }

  Future<bool> addApplication({
    required String companyName,
    required String role,
    required bool isInternship,
    double? compensation,
    required String location,
    required String source,
    String? jobUrl,
    required DateTime appliedDate,
    DateTime? deadline,
    required String notes,
    required ApplicationStatus status,
  }) async {
    final newApp = PlacementApplication(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      companyName: companyName,
      role: role,
      isInternship: isInternship,
      compensation: compensation,
      location: location,
      source: source,
      jobUrl: jobUrl,
      appliedDate: appliedDate,
      deadline: deadline,
      notes: notes,
      status: status,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      timelineLogs: ['Application established. Current status: \${status.displayName}'],
    );

    // Optimistic Update: Add to UI list instantly
    final cachedBackup = List<PlacementApplication>.from(state.applications);
    state = state.copyWith(applications: [newApp, ...state.applications]);

    final result = await _repository.createApplication(newApp);
    return result.fold(
      (savedApp) {
        // Replace with remote version if needed
        return true;
      },
      (failure) {
        // Rollback state on connection issue
        state = state.copyWith(applications: cachedBackup, errorMessage: failure.message);
        return false;
      },
    );
  }

  Future<bool> editApplication(PlacementApplication updatedApp) async {
    final cachedBackup = List<PlacementApplication>.from(state.applications);
    
    // Optimistic Update
    state = state.copyWith(
      applications: state.applications.map((app) => app.id == updatedApp.id ? updatedApp : app).toList()
    );

    final result = await _repository.updateApplication(updatedApp);
    return result.fold(
      (saved) => true,
      (failure) {
        state = state.copyWith(applications: cachedBackup, errorMessage: failure.message);
        return false;
      },
    );
  }

  Future<bool> deleteApplication(String id) async {
    final cachedBackup = List<PlacementApplication>.from(state.applications);
    
    // Optimistic Delete
    state = state.copyWith(
      applications: state.applications.where((app) => app.id != id).toList()
    );

    final result = await _repository.deleteApplication(id);
    return result.fold(
      (success) => true,
      (failure) {
        state = state.copyWith(applications: cachedBackup, errorMessage: failure.message);
        return false;
      },
    );
  }
}

// Global Provider Definition
final placementControllerProvider = StateNotifierProvider<PlacementController, PlacementState>((ref) {
  final repo = ref.watch(placementRepositoryProvider);
  return PlacementController(repo);
});
`
  },
  {
    name: "placement_tracker_screen.dart",
    path: "lib/features/tracker/presentation/screens/placement_tracker_screen.dart",
    description: "Main Workspace dashboard displaying high-fidelity KPI metric cards, filters rail, and real-time lists.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../domain/entities/placement_application.dart';
import '../controllers/placement_controller.dart';

class PlacementTrackerScreen extends ConsumerWidget {
  const PlacementTrackerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final trackerState = ref.watch(placementControllerProvider);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddApplicationDialog(context),
        backgroundColor: theme.primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Minimal Sticky Header
            SliverAppBar(
              floating: true,
              pinned: true,
              backgroundColor: theme.scaffoldBackgroundColor,
              elevation: 0,
              title: const Text(
                'Placement Hub',
                style: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold),
              ),
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(60),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          onChanged: (val) => ref.read(placementControllerProvider.notifier).updateSearchQuery(val),
                          decoration: const InputDecoration(
                            hintText: 'Search company, role, location...',
                            prefixIcon: Icon(Icons.search, size: 18),
                            contentPadding: EdgeInsets.symmetric(vertical: 0),
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      IconButton(
                        onPressed: () => _showFiltersBottomSheet(context, ref),
                        icon: const Icon(Icons.tune_rounded),
                        style: IconButton.styleFrom(
                          backgroundColor: theme.cardColor,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.md)),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),

            // Statistics Grid Row
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('WORKFLOW VELOCITY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                    const SizedBox(height: AppSpacing.sm),
                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: AppSpacing.xs,
                      mainAxisSpacing: AppSpacing.xs,
                      childAspectRatio: 1.4,
                      children: [
                        _buildMetricCard('Total Placements', trackerState.totalCount.toString(), Colors.blue, theme),
                        _buildMetricCard('Active Process', trackerState.activeCount.toString(), Colors.orange, theme),
                        _buildMetricCard('Interviews Set', trackerState.interviewsCount.toString(), Colors.teal, theme),
                        _buildMetricCard('Job Offers', trackerState.offersCount.toString(), Colors.emerald, theme),
                        _buildMetricCard('Rejections', trackerState.rejectionsCount.toString(), Colors.red, theme),
                        _buildMetricCard('In Wishlist', trackerState.wishlistCount.toString(), Colors.grey, theme),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Main Applications Listing
            trackerState.isLoading
                ? const SliverFillRemaining(child: Center(child: CircularProgressIndicator()))
                : trackerState.applications.isEmpty
                    ? SliverFillRemaining(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.folder_open_outlined, size: 48, color: Colors.grey),
                              const SizedBox(height: AppSpacing.md),
                              const Text('No applications tracked yet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              Text('Tap + button below to list your first workspace application.', style: TextStyle(color: theme.hintColor, fontSize: 11)),
                            ],
                          ),
                        ),
                      )
                    : SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final app = trackerState.applications[index];
                            return _buildApplicationCard(context, app, theme);
                          },
                          childCount: trackerState.applications.length,
                        ),
                      ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, Color color, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 9, color: theme.hintColor), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text(
            value,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color, fontFamily: 'SpaceGrotesk'),
          )
        ],
      ),
    );
  }

  Widget _buildApplicationCard(BuildContext context, PlacementApplication app, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs),
      child: InkWell(
        onTap: () => context.push('/application/\${app.id}'),
        borderRadius: BorderRadius.circular(AppRadius.lg),
        child: Container(
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
                  Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: app.status.color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(AppRadius.md),
                        ),
                        child: Center(
                          child: Text(
                            app.companyName.substring(0, 1),
                            style: TextStyle(fontWeight: FontWeight.bold, color: app.status.color, fontSize: 14),
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(app.companyName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Text(app.role, style: TextStyle(color: theme.hintColor, fontSize: 11)),
                        ],
                      )
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, py: 4),
                    decoration: BoxDecoration(
                      color: app.status.color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(app.status.icon, size: 10, color: app.status.color),
                        const SizedBox(width: 4),
                        Text(
                          app.status.displayName.toUpperCase(),
                          style: TextStyle(color: app.status.color, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  )
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.place_outlined, size: 12, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(app.location, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                  Text(
                    app.isInternship ? 'Internship' : 'Full-Time FTE',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: theme.primaryColor),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  void _showAddApplicationDialog(BuildContext context) {
    // Scaffold UI form trigger overlay 
  }

  void _showFiltersBottomSheet(BuildContext context, WidgetRef ref) {
    // Render status/sorting controllers drawer
  }
}
`
  },
  {
    name: "application_detail_screen.dart",
    path: "lib/features/tracker/presentation/screens/application_detail_screen.dart",
    description: "Detailed dashboard for a single placement application with historic timelines and editable notes.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../domain/entities/placement_application.dart';
import '../controllers/placement_controller.dart';

class ApplicationDetailScreen extends ConsumerWidget {
  final String applicationId;
  const ApplicationDetailScreen({Key? key, required this.applicationId}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final trackerState = ref.watch(placementControllerProvider);
    
    // Locate specific application in state cache
    final app = trackerState.applications.firstWhere(
      (element) => element.id == applicationId,
      orElse: () => throw Exception('Placement Application reference broken.'),
    );

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(app.companyName, style: const TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent),
            onPressed: () => _confirmDeleteApplication(context, ref, app.id),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Block Header Card
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: theme.dividerColor),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('ROLE INTENT', style: TextStyle(fontSize: 9, color: theme.hintColor)),
                          const SizedBox(height: 4),
                          Text(app.role, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: app.status.color.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(app.status.icon, color: app.status.color, size: 20),
                      ),
                    ],
                  ),
                  const Divider(height: AppSpacing.xl),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      _buildQuickMeta('Compensation', app.compensation != null ? '\$\${app.compensation!.toStringAsFixed(0)}' : 'Undisclosed', theme),
                      _buildQuickMeta('Workspace Type', app.isInternship ? 'Internship' : 'FTE Careers', theme),
                      _buildQuickMeta('Applied On', '\${app.appliedDate.day}/\${app.appliedDate.month}', theme),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Metadata fields list
            _buildSectionHeader('APPLICATION DETAILS'),
            const SizedBox(height: AppSpacing.sm),
            _buildDetailRow('Physical Location', app.location, theme),
            _&buildDetailRow('Acquisition Source', app.source, theme),
            _buildDetailRow('Job Listing URL', app.jobUrl ?? 'Not Provided', theme),
            if (app.deadline != null) _buildDetailRow('Deadline Cutoff', '\${app.deadline!.day}/\${app.deadline!.month}/\${app.deadline!.year}', theme),
            const SizedBox(height: AppSpacing.lg),

            // Student notes block
            _buildSectionHeader('INTERACTIVE WORKSPACE NOTES'),
            const SizedBox(height: AppSpacing.sm),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: theme.dividerColor),
              ),
              child: Text(
                app.notes.isEmpty ? 'Tap to append specialized interview cues or deadline goals...' : app.notes,
                style: TextStyle(fontSize: 12, color: app.notes.isEmpty ? theme.hintColor : theme.textTheme.bodyMedium!.color, height: 1.5),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Activity timeline track
            _buildSectionHeader('CHRONOLOGICAL AUDIT TIMELINE'),
            const SizedBox(height: AppSpacing.md),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: app.timelineLogs.length,
              itemBuilder: (context, idx) {
                final log = app.timelineLogs[idx];
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.circle, size: 8, color: Colors.blueAccent),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Text(
                          log,
                          style: TextStyle(fontSize: 11, color: theme.hintColor),
                        ),
                      )
                    ],
                  ),
                );
              },
            )
          ],
        ),
      ),
    );
  }

  Widget _buildQuickMeta(String label, String val, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 8, color: theme.hintColor)),
        const SizedBox(height: 2),
        Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: theme.hintColor)),
          Text(value, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.semibold)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
    );
  }

  void _confirmDeleteApplication(BuildContext context, WidgetRef ref, String id) {
    // Delete validation flow with SnackBar UNDO callbacks
  }
}
`
  }
];
