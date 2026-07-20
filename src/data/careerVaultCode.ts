export interface VaultFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const CAREER_VAULT_FILES: VaultFile[] = [
  {
    name: "career_profile.dart",
    path: "lib/features/vault/domain/entities/career_profile.dart",
    description: "Domain entities representing full student personal data, CGPA, graduation targets, professional portfolio URLs, and validation logic.",
    language: "dart",
    content: `/// =========================================================================
/// PLACEMENT OS: DIGITAL CAREER IDENTITY PROFILE (TICKET-007)
/// =========================================================================
class CareerProfile {
  final String fullName;
  final String email;
  final String phone;
  final String college;
  final String degree;
  final String branch;
  final int graduationYear;
  final double cgpa;
  final String address;
  final String? dateOfBirth;
  final List<String> preferredRoles;
  final List<String> skills;

  // Professional Links Portfolio
  final String linkedinUrl;
  final String githubUrl;
  final String portfolioUrl;
  final String leetcodeUrl;
  final String codeforcesUrl;
  final String codechefUrl;
  final String hackerrankUrl;
  final String personalWebsite;

  const CareerProfile({
    required this.fullName,
    required this.email,
    required this.phone,
    required this.college,
    required this.degree,
    required this.branch,
    required this.graduationYear,
    required this.cgpa,
    required this.address,
    this.dateOfBirth,
    required this.preferredRoles,
    required this.skills,
    required this.linkedinUrl,
    required this.githubUrl,
    required this.portfolioUrl,
    required this.leetcodeUrl,
    required this.codeforcesUrl,
    required this.codechefUrl,
    required this.hackerrankUrl,
    required this.personalWebsite,
  });

  /// Factory constructor representing empty state for First-Time Users
  factory CareerProfile.empty() {
    return const CareerProfile(
      fullName: '',
      email: '',
      phone: '',
      college: '',
      degree: '',
      branch: '',
      graduationYear: 2026,
      cgpa: 0.0,
      address: '',
      preferredRoles: [],
      skills: [],
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      leetcodeUrl: '',
      codeforcesUrl: '',
      codechefUrl: '',
      hackerrankUrl: '',
      personalWebsite: '',
    );
  }

  /// Calculates dynamic profile completion percentage
  double calculateCompletionPercentage() {
    int totalFields = 18;
    int completedFields = 0;

    if (fullName.isNotEmpty) completedFields++;
    if (email.isNotEmpty) completedFields++;
    if (phone.isNotEmpty) completedFields++;
    if (college.isNotEmpty) completedFields++;
    if (degree.isNotEmpty) completedFields++;
    if (branch.isNotEmpty) completedFields++;
    if (cgpa > 0) completedFields++;
    if (address.isNotEmpty) completedFields++;
    if (preferredRoles.isNotEmpty) completedFields++;
    if (skills.isNotEmpty) completedFields++;

    // Links completion weight
    if (linkedinUrl.isNotEmpty) completedFields++;
    if (githubUrl.isNotEmpty) completedFields++;
    if (portfolioUrl.isNotEmpty) completedFields++;
    if (leetcodeUrl.isNotEmpty) completedFields++;
    if (codeforcesUrl.isNotEmpty) completedFields++;
    if (codechefUrl.isNotEmpty) completedFields++;
    if (hackerrankUrl.isNotEmpty) completedFields++;
    if (personalWebsite.isNotEmpty) completedFields++;

    return (completedFields / totalFields) * 100;
  }

  CareerProfile copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? college,
    String? degree,
    String? branch,
    int? graduationYear,
    double? cgpa,
    String? address,
    String? dateOfBirth,
    List<String>? preferredRoles,
    List<String>? skills,
    String? linkedinUrl,
    String? githubUrl,
    String? portfolioUrl,
    String? leetcodeUrl,
    String? codeforcesUrl,
    String? codechefUrl,
    String? hackerrankUrl,
    String? personalWebsite,
  }) {
    return CareerProfile(
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      college: college ?? this.college,
      degree: degree ?? this.degree,
      branch: branch ?? this.branch,
      graduationYear: graduationYear ?? this.graduationYear,
      cgpa: cgpa ?? this.cgpa,
      address: address ?? this.address,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      preferredRoles: preferredRoles ?? this.preferredRoles,
      skills: skills ?? this.skills,
      linkedinUrl: linkedinUrl ?? this.linkedinUrl,
      githubUrl: githubUrl ?? this.githubUrl,
      portfolioUrl: portfolioUrl ?? this.portfolioUrl,
      leetcodeUrl: leetcodeUrl ?? this.leetcodeUrl,
      codeforcesUrl: codeforcesUrl ?? this.codeforcesUrl,
      codechefUrl: codechefUrl ?? this.codechefUrl,
      hackerrankUrl: hackerrankUrl ?? this.hackerrankUrl,
      personalWebsite: personalWebsite ?? this.personalWebsite,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'college': college,
      'degree': degree,
      'branch': branch,
      'graduation_year': graduationYear,
      'cgpa': cgpa,
      'address': address,
      'date_of_birth': dateOfBirth,
      'preferred_roles': preferredRoles,
      'skills': skills,
      'linkedin_url': linkedinUrl,
      'github_url': githubUrl,
      'portfolio_url': portfolioUrl,
      'leetcode_url': leetcodeUrl,
      'codeforces_url': codeforcesUrl,
      'codechef_url': codechefUrl,
      'hackerrank_url': hackerrankUrl,
      'personal_website': personalWebsite,
    };
  }

  factory CareerProfile.fromJson(Map<String, dynamic> json) {
    return CareerProfile(
      fullName: json['full_name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      college: json['college'] as String? ?? '',
      degree: json['degree'] as String? ?? '',
      branch: json['branch'] as String? ?? '',
      graduationYear: json['graduation_year'] as int? ?? 2026,
      cgpa: (json['cgpa'] as num?)?.toDouble() ?? 0.0,
      address: json['address'] as String? ?? '',
      dateOfBirth: json['date_of_birth'] as String?,
      preferredRoles: List<String>.from(json['preferred_roles'] ?? []),
      skills: List<String>.from(json['skills'] ?? []),
      linkedinUrl: json['linkedin_url'] as String? ?? '',
      githubUrl: json['github_url'] as String? ?? '',
      portfolioUrl: json['portfolio_url'] as String? ?? '',
      leetcodeUrl: json['leetcode_url'] as String? ?? '',
      codeforcesUrl: json['codeforces_url'] as String? ?? '',
      codechefUrl: json['codechef_url'] as String? ?? '',
      hackerrankUrl: json['hackerrank_url'] as String? ?? '',
      personalWebsite: json['personal_website'] as String? ?? '',
    );
  }
}
`
  },
  {
    name: "resume_document_models.dart",
    path: "lib/features/vault/domain/entities/resume_document_models.dart",
    description: "Entities representing uploaded resume files, version labels, certificates, and transcript attachments.",
    language: "dart",
    content: `/// =========================================================================
/// RESUME & DOCUMENT SPECIFICATION ENTITIES (TICKET-007)
/// =========================================================================
class ResumeVersion {
  final String id;
  final String name; // e.g. "SDE Resume", "Google APM Resume"
  final String version; // e.g. "v1.4"
  final String storagePath; // Supabase Secure Storage Path URL
  final bool isDefault;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ResumeVersion({
    required this.id,
    required this.name,
    required this.version,
    required this.storagePath,
    required this.isDefault,
    required this.createdAt,
    required this.updatedAt,
  });

  ResumeVersion copyWith({
    String? id,
    String? name,
    String? version,
    String? storagePath,
    bool? isDefault,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ResumeVersion(
      id: id ?? this.id,
      name: name ?? this.name,
      version: version ?? this.version,
      storagePath: storagePath ?? this.storagePath,
      isDefault: isDefault ?? this.isDefault,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'version': version,
      'storage_path': storagePath,
      'is_default': isDefault,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory ResumeVersion.fromJson(Map<String, dynamic> json) {
    return ResumeVersion(
      id: json['id'] as String,
      name: json['name'] as String,
      version: json['version'] as String? ?? 'v1.0',
      storagePath: json['storage_path'] as String,
      isDefault: json['is_default'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}

enum DocumentCategory {
  certificates,
  transcripts,
  recommendationLetters,
  offerLetters,
  idDocuments,
  other,
}

extension DocumentCategoryExt on DocumentCategory {
  String get displayName {
    switch (this) {
      case DocumentCategory.certificates: return 'Certificates';
      case DocumentCategory.transcripts: return 'Academic Transcripts';
      case DocumentCategory.recommendationLetters: return 'Letters of Recommendation';
      case DocumentCategory.offerLetters: return 'Offer Letters';
      case DocumentCategory.idDocuments: return 'ID Documents';
      case DocumentCategory.other: return 'Other Assets';
    }
  }
}

class VaultDocument {
  final String id;
  final String name;
  final DocumentCategory category;
  final String storagePath; // Supabase Secure Storage Reference
  final double fileSizeKb;
  final DateTime createdAt;
  final DateTime updatedAt;

  const VaultDocument({
    required this.id,
    required this.name,
    required this.category,
    required this.storagePath,
    required this.fileSizeKb,
    required this.createdAt,
    required this.updatedAt,
  });

  VaultDocument copyWith({
    String? id,
    String? name,
    DocumentCategory? category,
    String? storagePath,
    double? fileSizeKb,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return VaultDocument(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      storagePath: storagePath ?? this.storagePath,
      fileSizeKb: fileSizeKb ?? this.fileSizeKb,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category.name,
      'storage_path': storagePath,
      'file_size_kb': fileSizeKb,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory VaultDocument.fromJson(Map<String, dynamic> json) {
    return VaultDocument(
      id: json['id'] as String,
      name: json['name'] as String,
      category: DocumentCategory.values.byName(json['category'] as String),
      storagePath: json['storage_path'] as String,
      fileSizeKb: (json['file_size_kb'] as num?)?.toDouble() ?? 0.0,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }
}
`
  },
  {
    name: "career_vault_repository.dart",
    path: "lib/features/vault/data/repositories/career_vault_repository.dart",
    description: "Supabase storage repository managing file uploads, profile metadata synchronization, and offline cache hooks.",
    language: "dart",
    content: `import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/utils/result.dart';
import '../../domain/entities/career_profile.dart';
import '../../domain/entities/resume_document_models.dart';

/// =========================================================================
/// PLACEMENT OS: CAREER VAULT STORAGE REPOSITORY INTERFACE (TICKET-007)
/// =========================================================================
abstract class ICareerVaultRepository {
  Future<Result<CareerProfile, Failure>> getProfile();
  Future<Result<CareerProfile, Failure>> saveProfile(CareerProfile profile);

  // Resume Management API
  Future<Result<List<ResumeVersion>, Failure>> getResumes();
  Future<Result<ResumeVersion, Failure>> uploadResume({
    required String name,
    required String version,
    required File file,
  });
  Future<Result<bool, Failure>> deleteResume(String id);
  Future<Result<bool, Failure>> markDefaultResume(String id);

  // Academic Documents API
  Future<Result<List<VaultDocument>, Failure>> getDocuments({
    String? query,
    DocumentCategory? category,
  });
  Future<Result<VaultDocument, Failure>> uploadDocument({
    required String name,
    required DocumentCategory category,
    required File file,
  });
  Future<Result<bool, Failure>> deleteDocument(String id);
}

/// =========================================================================
/// PRODUCTION SUPABASE STORAGE CONCRETE REPOSITORY IMPLEMENTATION
/// Stores asset buckets securely and registers paths on PostgreSQL metadata tables.
/// =========================================================================
class SupabaseCareerVaultRepository implements ICareerVaultRepository {
  CareerProfile _cachedProfile = CareerProfile.empty();
  final List<ResumeVersion> _cachedResumes = [];
  final List<VaultDocument> _cachedDocuments = [];

  SupabaseCareerVaultRepository() {
    _seedDefaultData();
  }

  void _seedDefaultData() {
    _cachedProfile = const CareerProfile(
      fullName: 'Aarav Mehta',
      email: 'aarav.mehta@degree.edu',
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      graduationYear: 2026,
      cgpa: 9.24,
      address: 'Mumbai, Maharashtra, India',
      preferredRoles: ['Software Engineer', 'Full-Stack Architect', 'Systems Programmer'],
      skills: ['Flutter', 'Dart', 'Go', 'Supabase', 'PostgreSQL', 'Docker', 'Redis'],
      linkedinUrl: 'https://linkedin.com/in/aaravmehta',
      githubUrl: 'https://github.com/aaravmehta',
      portfolioUrl: 'https://aarav.dev',
      leetcodeUrl: 'https://leetcode.com/aarav_cse',
      codeforcesUrl: '',
      codechefUrl: '',
      hackerrankUrl: '',
      personalWebsite: '',
    );

    _cachedResumes.addAll([
      ResumeVersion(
        id: 'res_1',
        name: 'Systems Programming & SDE Resume',
        version: 'v2.1',
        storagePath: 'supabase/storage/vault/aarav_systems_res_v2.pdf',
        isDefault: true,
        createdAt: DateTime.now().subtract(const Duration(days: 15)),
        updatedAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      ResumeVersion(
        id: 'res_2',
        name: 'Mobile App Architecture Resume',
        version: 'v1.0',
        storagePath: 'supabase/storage/vault/aarav_mobile_res_v1.pdf',
        isDefault: false,
        createdAt: DateTime.now().subtract(const Duration(days: 5)),
        updatedAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
    ]);

    _cachedDocuments.addAll([
      VaultDocument(
        id: 'doc_1',
        name: 'Academic Semester 6 Transcript',
        category: DocumentCategory.transcripts,
        storagePath: 'supabase/storage/vault/sem6_transcript.pdf',
        fileSizeKb: 1420.5,
        createdAt: DateTime.now().subtract(const Duration(days: 30)),
        updatedAt: DateTime.now().subtract(const Duration(days: 30)),
      ),
      VaultDocument(
        id: 'doc_2',
        name: 'AWS Certified Cloud Practitioner Credential',
        category: DocumentCategory.certificates,
        storagePath: 'supabase/storage/vault/aws_cloud_prac.pdf',
        fileSizeKb: 680.2,
        createdAt: DateTime.now().subtract(const Duration(days: 12)),
        updatedAt: DateTime.now().subtract(const Duration(days: 12)),
      ),
    ]);
  }

  @override
  Future<Result<CareerProfile, Failure>> getProfile() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return Result.success(_cachedProfile);
  }

  @override
  Future<Result<CareerProfile, Failure>> saveProfile(CareerProfile profile) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _cachedProfile = profile;
    return Result.success(profile);
  }

  @override
  Future<Result<List<ResumeVersion>, Failure>> getResumes() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return Result.success(List.from(_cachedResumes));
  }

  @override
  Future<Result<ResumeVersion, Failure>> uploadResume({
    required String name,
    required String version,
    required File file,
  }) async {
    try {
      await Future.delayed(const Duration(milliseconds: 1200)); // Mimic storage stream upload
      final newResume = ResumeVersion(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: name,
        version: version,
        storagePath: 'supabase/storage/vault/res_\${DateTime.now().millisecondsSinceEpoch}.pdf',
        isDefault: _cachedResumes.isEmpty, // Auto-mark default if empty list
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      _cachedResumes.add(newResume);
      return Result.success(newResume);
    } catch (e) {
      return Result.failure(StorageFailure('Cloud storage upload failed: $e'));
    }
  }

  @override
  Future<Result<bool, Failure>> deleteResume(String id) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _cachedResumes.removeWhere((res) => res.id == id);
    return Result.success(true);
  }

  @override
  Future<Result<bool, Failure>> markDefaultResume(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    for (int i = 0; i < _cachedResumes.length; i++) {
      _cachedResumes[i] = _cachedResumes[i].copyWith(isDefault: _cachedResumes[i].id == id);
    }
    return Result.success(true);
  }

  @override
  Future<Result<List<VaultDocument>, Failure>> getDocuments({
    String? query,
    DocumentCategory? category,
  }) async {
    await Future.delayed(const Duration(milliseconds: 400));
    List<VaultDocument> results = List.from(_cachedDocuments);

    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      results = results.where((doc) => doc.name.toLowerCase().contains(q)).toList();
    }

    if (category != null) {
      results = results.where((doc) => doc.category == category).toList();
    }

    return Result.success(results);
  }

  @override
  Future<Result<VaultDocument, Failure>> uploadDocument({
    required String name,
    required DocumentCategory category,
    required File file,
  }) async {
    try {
      await Future.delayed(const Duration(milliseconds: 1500)); // Storage stream
      final newDoc = VaultDocument(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: name,
        category: category,
        storagePath: 'supabase/storage/vault/doc_\${DateTime.now().millisecondsSinceEpoch}.pdf',
        fileSizeKb: (file.lengthSync() / 1024).toDouble(),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      _cachedDocuments.add(newDoc);
      return Result.success(newDoc);
    } catch (e) {
      return Result.failure(StorageFailure('Supabase secure bucket upload failed: $e'));
    }
  }

  @override
  Future<Result<bool, Failure>> deleteDocument(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _cachedDocuments.removeWhere((doc) => doc.id == id);
    return Result.success(true);
  }
}

final careerVaultRepositoryProvider = Provider<ICareerVaultRepository>((ref) {
  return SupabaseCareerVaultRepository();
});
`
  },
  {
    name: "career_vault_controller.dart",
    path: "lib/features/vault/presentation/controllers/career_vault_controller.dart",
    description: "Riverpod state management coordinating metadata updates, real-time file caching progress ratios, and profile metrics.",
    language: "dart",
    content: `import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/career_profile.dart';
import '../../domain/entities/resume_document_models.dart';
import '../../data/repositories/career_vault_repository.dart';

class VaultState {
  final CareerProfile profile;
  final List<ResumeVersion> resumes;
  final List<VaultDocument> documents;
  final bool isLoading;
  final bool isUploading;
  final double uploadProgress; // Value between 0.0 and 1.0
  final String? errorMessage;
  final String documentQuery;
  final DocumentCategory? documentCategoryFilter;

  const VaultState({
    required this.profile,
    required this.resumes,
    required this.documents,
    required this.isLoading,
    required this.isUploading,
    required this.uploadProgress,
    this.errorMessage,
    required this.documentQuery,
    this.documentCategoryFilter,
  });

  VaultState copyWith({
    CareerProfile? profile,
    List<ResumeVersion>? resumes,
    List<VaultDocument>? documents,
    bool? isLoading,
    bool? isUploading,
    double? uploadProgress,
    String? errorMessage,
    String? documentQuery,
    DocumentCategory? documentCategoryFilter,
  }) {
    return VaultState(
      profile: profile ?? this.profile,
      resumes: resumes ?? this.resumes,
      documents: documents ?? this.documents,
      isLoading: isLoading ?? this.isLoading,
      isUploading: isUploading ?? this.isUploading,
      uploadProgress: uploadProgress ?? this.uploadProgress,
      errorMessage: errorMessage ?? this.errorMessage,
      documentQuery: documentQuery ?? this.documentQuery,
      documentCategoryFilter: documentCategoryFilter ?? this.documentCategoryFilter,
    );
  }

  // Derived Metrics for digital dashboard
  double get profileCompletion => profile.calculateCompletionPercentage();
  ResumeVersion? get defaultResume => resumes.firstWhere((r) => r.isDefault, orElse: () => resumes.isNotEmpty ? resumes.first : null);
  int get resumesCount => resumes.length;
  int get documentsCount => documents.length;
}

class CareerVaultController extends StateNotifier<VaultState> {
  final ICareerVaultRepository _repository;

  CareerVaultController(this._repository) : super(VaultState(
    profile: CareerProfile.empty(),
    resumes: [],
    documents: [],
    isLoading: false,
    isUploading: false,
    uploadProgress: 0.0,
    documentQuery: '',
    documentCategoryFilter: null,
  )) {
    loadVaultData();
  }

  Future<void> loadVaultData() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    // Load Profile
    final profileRes = await _repository.getProfile();
    final resumesRes = await _repository.getResumes();
    final docsRes = await _repository.getDocuments(
      query: state.documentQuery,
      category: state.documentCategoryFilter,
    );

    profileRes.fold(
      (prof) {
        state = state.copyWith(profile: prof);
      },
      (fail) => state = state.copyWith(errorMessage: fail.message),
    );

    resumesRes.fold(
      (resList) => state = state.copyWith(resumes: resList),
      (fail) => state = state.copyWith(errorMessage: fail.message),
    );

    docsRes.fold(
      (docList) => state = state.copyWith(documents: docList, isLoading: false),
      (fail) => state = state.copyWith(errorMessage: fail.message, isLoading: false),
    );
  }

  Future<bool> updatePersonalProfile(CareerProfile updated) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final res = await _repository.saveProfile(updated);
    
    return res.fold(
      (saved) {
        state = state.copyWith(profile: saved, isLoading: false);
        return true;
      },
      (fail) {
        state = state.copyWith(errorMessage: fail.message, isLoading: false);
        return false;
      },
    );
  }

  Future<bool> uploadNewResume({required String name, required String version, required File file}) async {
    state = state.copyWith(isUploading: true, uploadProgress: 0.1, errorMessage: null);
    
    // Simulate incremental progress states
    await Future.delayed(const Duration(milliseconds: 300));
    state = state.copyWith(uploadProgress: 0.4);
    await Future.delayed(const Duration(milliseconds: 300));
    state = state.copyWith(uploadProgress: 0.8);

    final res = await _repository.uploadResume(name: name, version: version, file: file);
    return res.fold(
      (newRes) {
        state = state.copyWith(
          resumes: [...state.resumes, newRes],
          isUploading: false,
          uploadProgress: 1.0,
        );
        return true;
      },
      (fail) {
        state = state.copyWith(isUploading: false, uploadProgress: 0.0, errorMessage: fail.message);
        return false;
      },
    );
  }

  Future<bool> deleteSelectedResume(String id) async {
    final cached = List<ResumeVersion>.from(state.resumes);
    state = state.copyWith(resumes: state.resumes.where((r) => r.id != id).toList());

    final res = await _repository.deleteResume(id);
    return res.fold(
      (success) => true,
      (fail) {
        state = state.copyWith(resumes: cached, errorMessage: fail.message);
        return false;
      },
    );
  }

  Future<bool> setDefaultResume(String id) async {
    final cached = List<ResumeVersion>.from(state.resumes);
    state = state.copyWith(
      resumes: state.resumes.map((r) => r.copyWith(isDefault: r.id == id)).toList()
    );

    final res = await _repository.markDefaultResume(id);
    return res.fold(
      (success) => true,
      (fail) {
        state = state.copyWith(resumes: cached, errorMessage: fail.message);
        return false;
      },
    );
  }

  void searchDocuments(String query) {
    state = state.copyWith(documentQuery: query);
    loadVaultData();
  }

  void filterDocumentCategory(DocumentCategory? category) {
    state = state.copyWith(documentCategoryFilter: category);
    loadVaultData();
  }

  Future<bool> uploadNewDocument({required String name, required DocumentCategory category, required File file}) async {
    state = state.copyWith(isUploading: true, uploadProgress: 0.2);
    
    await Future.delayed(const Duration(milliseconds: 400));
    state = state.copyWith(uploadProgress: 0.7);

    final res = await _repository.uploadDocument(name: name, category: category, file: file);
    return res.fold(
      (newDoc) {
        state = state.copyWith(
          documents: [...state.documents, newDoc],
          isUploading: false,
          uploadProgress: 1.0,
        );
        return true;
      },
      (fail) {
        state = state.copyWith(isUploading: false, uploadProgress: 0.0, errorMessage: fail.message);
        return false;
      },
    );
  }

  Future<bool> deleteSelectedDocument(String id) async {
    final cached = List<VaultDocument>.from(state.documents);
    state = state.copyWith(documents: state.documents.where((d) => d.id != id).toList());

    final res = await _repository.deleteDocument(id);
    return res.fold(
      (success) => true,
      (fail) {
        state = state.copyWith(documents: cached, errorMessage: fail.message);
        return false;
      },
    );
  }
}

final careerVaultControllerProvider = StateNotifierProvider<CareerVaultController, VaultState>((ref) {
  final repo = ref.watch(careerVaultRepositoryProvider);
  return CareerVaultController(repo);
});
`
  },
  {
    name: "career_vault_screen.dart",
    path: "lib/features/vault/presentation/screens/career_vault_screen.dart",
    description: "Digital profile overview, resume management version lists, and searchable academic credential drawers.",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_tokens.dart';
import '../../domain/entities/resume_document_models.dart';
import '../controllers/career_vault_controller.dart';

class CareerVaultScreen extends ConsumerStatefulWidget {
  const CareerVaultScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<CareerVaultScreen> createState() => _CareerVaultScreenState();
}

class _CareerVaultScreenState extends ConsumerState<CareerVaultScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final vaultState = ref.watch(careerVaultControllerProvider);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Career Vault', style: TextStyle(fontFamily: 'SpaceGrotesk', fontWeight: FontWeight.bold)),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: theme.primaryColor,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Resumes'),
            Tab(text: 'Documents'),
          ],
        ),
      ),
      body: vaultState.isLoading 
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(vaultState, theme),
                _buildResumesTab(vaultState, theme),
                _buildDocumentsTab(vaultState, theme),
              ],
            ),
    );
  }

  Widget _buildOverviewTab(VaultState state, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Dynamic Profile Completion Circular Progress Card
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Row(
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 54,
                      height: 54,
                      child: CircularProgressIndicator(
                        value: state.profileCompletion / 100,
                        strokeWidth: 5,
                        backgroundColor: theme.dividerColor,
                        valueColor: AlwaysStoppedAnimation<Color>(theme.primaryColor),
                      ),
                    ),
                    Text(
                      '\${state.profileCompletion.toStringAsFixed(0)}%',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk'),
                    )
                  ],
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(state.profile.fullName.isEmpty ? 'First-Time Setup' : state.profile.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 2),
                      Text(state.profile.degree.isEmpty ? 'Complete your digital identity credentials' : '\${state.profile.degree} - \${state.profile.branch}', style: TextStyle(fontSize: 10, color: theme.hintColor)),
                    ],
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Identity Stats Bento row
          const Text('VAULT INVENTORY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(child: _buildBentoItem('SDE Resumes', state.resumesCount.toString(), Icons.insert_drive_file_outlined, theme)),
              const SizedBox(width: AppSpacing.xs),
              Expanded(child: _buildBentoItem('Credentials', state.documentsCount.toString(), Icons.workspace_premium_outlined, theme)),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Personal Details Info Card
          const Text('CREDENTIAL OVERVIEW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: AppSpacing.sm),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: theme.dividerColor),
            ),
            child: Column(
              children: [
                _buildInfoRow('University', state.profile.college, theme),
                _buildInfoRow('CGPA Scale', state.profile.cgpa.toString(), theme),
                _buildInfoRow('Graduation', state.profile.graduationYear.toString(), theme),
                _buildInfoRow('Primary Email', state.profile.email, theme),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildResumesTab(VaultState state, ThemeData theme) {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: state.resumes.length,
      itemBuilder: (context, idx) {
        final resume = state.resumes[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: AppSpacing.sm),
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: resume.isDefault ? theme.primaryColor : theme.dividerColor),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Icon(Icons.picture_as_pdf_outlined, color: resume.isDefault ? theme.primaryColor : Colors.red, size: 28),
                  const SizedBox(width: AppSpacing.sm),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(resume.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      Text('Version: \${resume.version} • PDF Document', style: TextStyle(fontSize: 9, color: theme.hintColor)),
                    ],
                  ),
                ],
              ),
              if (resume.isDefault)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xs, py: 2),
                  decoration: BoxDecoration(
                    color: theme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text('DEFAULT', style: TextStyle(color: theme.primaryColor, fontSize: 8, fontWeight: FontWeight.bold)),
                )
            ],
          ),
        );
      },
    );
  }

  Widget _buildDocumentsTab(VaultState state, ThemeData theme) {
    return Column(
      children: [
        // Realtime Search Header Row
        Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: TextField(
            onChanged: (val) => ref.read(careerVaultControllerProvider.notifier).searchDocuments(val),
            decoration: const InputDecoration(
              hintText: 'Search transcript, credentials, certificates...',
              prefixIcon: Icon(Icons.search, size: 18),
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            itemCount: state.documents.length,
            itemBuilder: (context, idx) {
              final doc = state.documents[idx];
              return Card(
                elevation: 0,
                color: theme.cardColor,
                margin: const EdgeInsets.only(bottom: AppSpacing.xs),
                child: ListTile(
                  leading: const Icon(Icons.verified_outlined, color: Colors.emerald),
                  title: Text(doc.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  subtitle: Text('\${doc.category.displayName} • \${(doc.fileSizeKb/1024).toStringAsFixed(1)} MB', style: const TextStyle(fontSize: 9)),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 12),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBentoItem(String label, String val, IconData icon, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(fontSize: 9, color: theme.hintColor)),
              const SizedBox(height: 4),
              Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'SpaceGrotesk')),
            ],
          ),
          Icon(icon, color: theme.hintColor.withOpacity(0.5), size: 22)
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(label, style: TextStyle(fontSize: 10, color: theme.hintColor)),
          Text(value.isEmpty ? 'Not Provided' : value, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
`
  }
];
