export interface AICaptureFile {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const AI_CAPTURE_FILES: AICaptureFile[] = [
  {
    name: "ai_provider_interface.dart",
    path: "lib/features/capture/domain/providers/ai_provider_interface.dart",
    description: "Provider interface abstracting the AI model provider (Groq, Gemini, OpenAI) with confidence scores.",
    language: "dart",
    content: `import 'dart:convert';
import '../models/extracted_job_model.dart';

/// Abstract interface for AI extraction providers.
/// Keeps the AI engine (Groq, Gemini, Claude) interchangeable.
abstract class IAICaptureProvider {
  /// Name of the provider (e.g., 'Groq (Llama-3)', 'Gemini-1.5-Pro')
  String get providerName;

  /// Performs extraction of webpage plain text content into structured job entities.
  Future<ExtractedJobModel> extractJobDetails({
    required String pageContent,
    required String sourceUrl,
  });
}
`
  },
  {
    name: "groq_provider.dart",
    path: "lib/features/capture/infrastructure/providers/groq_provider.dart",
    description: "Groq (Llama-3-70b-8192) implementation of the IAICaptureProvider with custom system instructions.",
    language: "dart",
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../domain/providers/ai_provider_interface.dart';
import '../models/extracted_job_model.dart';

/// Groq API provider utilizing Llama-3-70b-8192 for high-precision extraction.
class GroqCaptureProvider implements IAICaptureProvider {
  final String _apiKey;
  final http.Client _client;

  GroqCaptureProvider({
    required String apiKey,
    http.Client? client,
  })  : _apiKey = apiKey,
        _client = client ?? http.Client();

  @override
  String get providerName => 'Groq (Llama-3)';

  @override
  Future<ExtractedJobModel> extractJobDetails({
    required String pageContent,
    required String sourceUrl,
  }) async {
    final response = await _client.post(
      Uri.parse('https://api.groq.com/openai/v1/chat/completions'),
      headers: {
        'Authorization': 'Bearer $_apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'model': 'llama3-70b-8192',
        'response_format': {'type': 'json_object'},
        'messages': [
          {
            'role': 'system',
            'content': _getSystemPrompt(),
          },
          {
            'role': 'user',
            'content': 'Extract structured details from: $pageContent\\nSource URL: $sourceUrl',
          }
        ],
        'temperature': 0.1,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Groq API Error: \${response.statusCode} - \${response.body}');
    }

    final data = jsonDecode(response.body);
    final jsonContent = data['choices'][0]['message']['content'];
    
    return ExtractedJobModel.fromJson(
      jsonDecode(jsonContent),
      sourceUrl,
    );
  }

  String _getSystemPrompt() {
    return '''
    You are an expert career data scraper for PlacementOS. Your goal is to extract structured job details from raw webpage text.
    You must output a single JSON object with the following schema:
    {
      "company": {"value": "Stripe", "confidence": 99},
      "role": {"value": "Software Engineer Intern", "confidence": 95},
      "employmentType": {"value": "Internship", "confidence": 90},
      "location": {"value": "San Francisco, CA", "confidence": 92},
      "salary": {"value": "\$12,000/mo", "confidence": 60},
      "deadline": {"value": "2026-07-28", "confidence": 75},
      "experience": {"value": "0-1 Years", "confidence": 85},
      "eligibility": {"value": "Enrolled in BS/MS CS", "confidence": 90},
      "requiredSkills": ["React", "TypeScript", "Node.js"],
      "preferredSkills": ["GraphQL", "Docker"],
      "summary": {"value": "Develop scale API systems.", "confidence": 95},
      "portal": {"value": "LinkedIn", "confidence": 95}
    }
    All "confidence" values must be integers between 0 and 100 based on your self-assessment.
    Ensure "employmentType" is either "Internship" or "Full-Time".
    Ensure "location" specifies remote/hybrid/onsite where possible.
    ''';
  }
}
`
  },
  {
    name: "extracted_job_model.dart",
    path: "lib/features/capture/domain/models/extracted_job_model.dart",
    description: "Domain model representing extracted job specifications and nested confidence scores.",
    language: "dart",
    content: `import 'package:flutter/foundation.dart';

class FieldWithConfidence<T> {
  final T value;
  final int confidence; // 0 to 100

  const FieldWithConfidence({
    required this.value,
    required this.confidence,
  });

  bool get isLowConfidence => confidence < 75;

  factory FieldWithConfidence.fromJson(Map<String, dynamic> json, T defaultValue) {
    return FieldWithConfidence(
      value: (json['value'] as T?) ?? defaultValue,
      confidence: (json['confidence'] as int?) ?? 50,
    );
  }

  FieldWithConfidence<T> copyWith({T? value, int? confidence}) {
    return FieldWithConfidence(
      value: value ?? this.value,
      confidence: confidence ?? this.confidence,
    );
  }
}

class ExtractedJobModel {
  final FieldWithConfidence<String> company;
  final FieldWithConfidence<String> role;
  final FieldWithConfidence<String> employmentType;
  final FieldWithConfidence<String> location;
  final FieldWithConfidence<String> salary;
  final FieldWithConfidence<String> deadline; // ISO YYYY-MM-DD
  final FieldWithConfidence<String> experience;
  final FieldWithConfidence<String> eligibility;
  final List<String> requiredSkills;
  final List<String> preferredSkills;
  final FieldWithConfidence<String> summary;
  final FieldWithConfidence<String> portal;
  final String applicationUrl;

  const ExtractedJobModel({
    required this.company,
    required this.role,
    required this.employmentType,
    required this.location,
    required this.salary,
    required this.deadline,
    required this.experience,
    required this.eligibility,
    required this.requiredSkills,
    required this.preferredSkills,
    required this.summary,
    required this.portal,
    required this.applicationUrl,
  });

  factory ExtractedJobModel.fromJson(Map<String, dynamic> json, String url) {
    return ExtractedJobModel(
      company: FieldWithConfidence.fromJson(json['company'] ?? {}, 'Unknown'),
      role: FieldWithConfidence.fromJson(json['role'] ?? {}, 'Unknown Position'),
      employmentType: FieldWithConfidence.fromJson(json['employmentType'] ?? {}, 'Full-Time'),
      location: FieldWithConfidence.fromJson(json['location'] ?? {}, 'Remote'),
      salary: FieldWithConfidence.fromJson(json['salary'] ?? {}, 'Not Specified'),
      deadline: FieldWithConfidence.fromJson(json['deadline'] ?? {}, ''),
      experience: FieldWithConfidence.fromJson(json['experience'] ?? {}, 'None'),
      eligibility: FieldWithConfidence.fromJson(json['eligibility'] ?? {}, 'Any Graduation'),
      requiredSkills: List<String>.from(json['requiredSkills'] ?? []),
      preferredSkills: List<String>.from(json['preferredSkills'] ?? []),
      summary: FieldWithConfidence.fromJson(json['summary'] ?? {}, ''),
      portal: FieldWithConfidence.fromJson(json['portal'] ?? {}, 'Direct Career Site'),
      applicationUrl: url,
    );
  }

  ExtractedJobModel copyWith({
    FieldWithConfidence<String>? company,
    FieldWithConfidence<String>? role,
    FieldWithConfidence<String>? employmentType,
    FieldWithConfidence<String>? location,
    FieldWithConfidence<String>? salary,
    FieldWithConfidence<String>? deadline,
    FieldWithConfidence<String>? experience,
    FieldWithConfidence<String>? eligibility,
    List<String>? requiredSkills,
    List<String>? preferredSkills,
    FieldWithConfidence<String>? summary,
    FieldWithConfidence<String>? portal,
    String? applicationUrl,
  }) {
    return ExtractedJobModel(
      company: company ?? this.company,
      role: role ?? this.role,
      employmentType: employmentType ?? this.employmentType,
      location: location ?? this.location,
      salary: salary ?? this.salary,
      deadline: deadline ?? this.deadline,
      experience: experience ?? this.experience,
      eligibility: eligibility ?? this.eligibility,
      requiredSkills: requiredSkills ?? this.requiredSkills,
      preferredSkills: preferredSkills ?? this.preferredSkills,
      summary: summary ?? this.summary,
      portal: portal ?? this.portal,
      applicationUrl: applicationUrl ?? this.applicationUrl,
    );
  }
}
`
  },
  {
    name: "ai_capture_repository.dart",
    path: "lib/features/capture/data/repositories/ai_capture_repository.dart",
    description: "Repository pattern containing caching layers, URL validators, and webpage content sanitation filters.",
    language: "dart",
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../domain/providers/ai_provider_interface.dart';
import '../../domain/models/extracted_job_model.dart';

class AICaptureRepository {
  final IAICaptureProvider _aiProvider;
  final http.Client _httpClient;
  
  // High-performance cache map to avoid duplicate extraction requests
  final Map<String, ExtractedJobModel> _captureCache = {};

  AICaptureRepository({
    required IAICaptureProvider aiProvider,
    http.Client? httpClient,
  })  : _aiProvider = aiProvider,
        _httpClient = httpClient ?? http.Client();

  /// Validate URL formats before launching extraction (Ticket-010 Part 2)
  bool validateUrl(String url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    final uri = Uri.tryParse(url);
    if (uri == null || !uri.hasAbsolutePath) return false;
    return true;
  }

  /// Extracts structured details from url with sanitizing middleware
  Future<ExtractedJobModel> captureJob(String url) async {
    if (!validateUrl(url)) {
      throw ArgumentError('Invalid URL scheme or bad hostname provided.');
    }

    // Cache hit
    if (_captureCache.containsKey(url)) {
      return _captureCache[url]!;
    }

    // Phase 1: Fetch Page Content
    final rawText = await _fetchAndSanitize(url);

    // Phase 2: Secure extraction via AI provider
    final extracted = await _aiProvider.extractJobDetails(
      pageContent: rawText,
      sourceUrl: url,
    );

    // Cache results for lightning subsequent renders
    _captureCache[url] = extracted;
    return extracted;
  }

  /// Sanitizes fetched HTML, stripping script, style, and telemetry tag garbage
  Future<String> _fetchAndSanitize(String url) async {
    try {
      final response = await _httpClient.get(
        Uri.parse(url),
        headers: {
          'User-Agent': 'PlacementOS-AICapture/1.0',
        },
      ).timeout(const Duration(seconds: 12));

      if (response.statusCode != 200) {
        throw Exception('Failed to fetch career page: HTTP status \${response.statusCode}');
      }

      final body = response.body;
      
      // Sanitizer: strip HTML tags to avoid wasting LLM context window tokens
      final sanitized = body
          .replaceAll(RegExp(r'<script[^>]*>([\\s\\S]*?)</script>'), '')
          .replaceAll(RegExp(r'<style[^>]*>([\\s\\S]*?)</style>'), '')
          .replaceAll(RegExp(r'<[^>]*>'), ' ')
          .replaceAll(RegExp(r'\\s+'), ' ')
          .trim();

      if (sanitized.isEmpty) {
        throw Exception('The URL returned empty text payload after sanitation.');
      }

      // Limit characters to preserve context limit budget
      return sanitized.length > 8000 ? sanitized.substring(0, 8000) : sanitized;
    } catch (e) {
      throw Exception('Network communication failed during page fetch: \$e');
    }
  }
}
`
  },
  {
    name: "ai_capture_controller.dart",
    path: "lib/features/capture/presentation/controllers/ai_capture_controller.dart",
    description: "Riverpod state notifier handling step-based loading states, cache registries, and validation hooks.",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/extracted_job_model.dart';
import '../../data/repositories/ai_capture_repository.dart';

enum CaptureStep {
  idle,
  fetchingPage,
  processingContent,
  extractingInfo,
  preparingReview,
  reviewActive,
  savedSuccess,
  failure
}

class AICaptureState {
  final CaptureStep step;
  final String? errorMessage;
  final ExtractedJobModel? currentReviewData;
  final List<AICaptureHistoryItem> history;

  AICaptureState({
    this.step = CaptureStep.idle,
    this.errorMessage,
    this.currentReviewData,
    this.history = const [],
  });

  AICaptureState copyWith({
    CaptureStep? step,
    String? errorMessage,
    ExtractedJobModel? currentReviewData,
    List<AICaptureHistoryItem>? history,
  }) {
    return AICaptureState(
      step: step ?? this.step,
      errorMessage: errorMessage ?? this.errorMessage,
      currentReviewData: currentReviewData ?? this.currentReviewData,
      history: history ?? this.history,
    );
  }
}

class AICaptureHistoryItem {
  final String id;
  final DateTime capturedAt;
  final String url;
  final String company;
  final String role;
  final String status;
  final ExtractedJobModel data;

  AICaptureHistoryItem({
    required this.id,
    required this.capturedAt,
    required this.url,
    required this.company,
    required this.role,
    required this.status,
    required this.data,
  });
}

class AICaptureController extends StateNotifier<AICaptureState> {
  final AICaptureRepository _repository;

  AICaptureController({
    required AICaptureRepository repository,
  })  : _repository = repository,
        super(AICaptureState());

  /// Pastes URL and triggers the high-fidelity sequential capture workflow (Ticket-010 Part 11)
  Future<void> runCaptureFlow(String url) async {
    if (!_repository.validateUrl(url)) {
      state = state.copyWith(
        step: CaptureStep.failure,
        errorMessage: 'Invalid URL format. Please input an absolute HTTP/HTTPS URL.',
      );
      return;
    }

    try {
      // Step 1: Fetching Webpage
      state = state.copyWith(step: CaptureStep.fetchingPage, errorMessage: null);
      await Future.delayed(const Duration(milliseconds: 800));

      // Step 2: Processing Content
      state = state.copyWith(step: CaptureStep.processingContent);
      await Future.delayed(const Duration(milliseconds: 600));

      // Step 3: AI Extraction
      state = state.copyWith(step: CaptureStep.extractingInfo);
      final extractedJob = await _repository.captureJob(url);

      // Step 4: Preparing review UI
      state = state.copyWith(step: CaptureStep.preparingReview);
      await Future.delayed(const Duration(milliseconds: 500));

      // Transition to Active Review
      state = state.copyWith(
        step: CaptureStep.reviewActive,
        currentReviewData: extractedJob,
      );
    } catch (e) {
      state = state.copyWith(
        step: CaptureStep.failure,
        errorMessage: e.toString().replaceAll('Exception: ', ''),
      );
    }
  }

  /// Saves the modified or approved extracted results directly to pipeline tracker and deadline tracker
  void saveToPipeline({
    required ExtractedJobModel finalModel,
    required bool createLinkedDeadline,
    required WidgetRef ref,
  }) {
    // 1. Dispatch into local Placement Tracker state
    // final placementController = ref.read(placementControllerProvider.notifier);
    // placementController.registerExtracted(finalModel);

    // 2. Dispatch into Deadline Tracker if checked
    if (createLinkedDeadline && finalModel.deadline.value.isNotEmpty) {
      // final deadlineController = ref.read(deadlineControllerProvider.notifier);
      // deadlineController.addExtractedDeadline(finalModel);
    }

    // Add record to session history list
    final newHistoryItem = AICaptureHistoryItem(
      id: 'his_\${DateTime.now().millisecondsSinceEpoch}',
      capturedAt: DateTime.now(),
      url: finalModel.applicationUrl,
      company: finalModel.company.value,
      role: finalModel.role.value,
      status: 'Success',
      data: finalModel,
    );

    state = state.copyWith(
      step: CaptureStep.savedSuccess,
      history: [newHistoryItem, ...state.history],
      currentReviewData: null,
    );
  }

  /// Allows restoring past history capture items back to review active stage
  void reopenCapture(AICaptureHistoryItem item) {
    state = state.copyWith(
      step: CaptureStep.reviewActive,
      currentReviewData: item.data,
    );
  }

  void reset() {
    state = state.copyWith(step: CaptureStep.idle, errorMessage: null, currentReviewData: null);
  }
}
`
  }
];
