<?php
require_once __DIR__ . '/../models/DocumentRequest.php';

class DocumentRequestController {
    private $documentRequest;
    private $studentProfileID;

    private $singleCopyDocuments = ['form137', 'goodMoral', 'honorable'];
    private $maxCopies = 3;

    // Map grade level names from database to internal keys
    // These match the actual database values from gradelevel table
    private $documentsByLevel = [
        'nursery' => ['enrollment', 'grades'],
        'k1' => ['enrollment', 'grades'],
        'k2' => ['enrollment', 'grades'],
        'grade 1' => ['enrollment', 'grades'],
        'grade 2' => ['enrollment', 'grades'],
        'grade 3' => ['enrollment', 'grades'],
        'grade 4' => ['enrollment', 'grades'],
        'grade 5' => ['enrollment', 'grades'],
        'grade 6' => ['enrollment', 'grades', 'form137', 'goodMoral', 'completion'],
        'graduated' => ['form137', 'grades', 'goodMoral', 'completion', 'honorable'],
        'withdrawn' => ['form137', 'grades', 'goodMoral', 'honorable']
    ];

    public function __construct($db, $studentProfileID) {
        $this->documentRequest = new DocumentRequest($db);
        $this->studentProfileID = $studentProfileID;
    }

    public function getRequests() {
        try {
            $requests = $this->documentRequest->getRequestsByStudent($this->studentProfileID);
            return [
                'success' => true,
                'requests' => $requests
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch requests: ' . $e->getMessage()
            ];
        }
    }

    public function addRequest($data) {
        // Validate required fields
        $requiredFields = ['documentType', 'purpose', 'quantity', 'deliveryMethod'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return [
                    'success' => false,
                    'message' => 'Missing required field: ' . $field
                ];
            }
        }

        // If purpose is "Other", validate customPurpose
        if ($data['purpose'] === 'Other') {
            if (!isset($data['customPurpose']) || trim($data['customPurpose']) === '') {
                return [
                    'success' => false,
                    'message' => 'Please specify the purpose for your request'
                ];
            }
            // Use custom purpose instead
            $data['purpose'] = trim($data['customPurpose']);
        }

        // Get student's grade level and status
        $studentInfo = $this->documentRequest->getStudentGradeLevel($this->studentProfileID);
        
        if (!$studentInfo) {
            return [
                'success' => false,
                'message' => 'Student information not found'
            ];
        }

        // Normalize the grade level (lowercase and trim)
        $gradeLevel = strtolower(trim($studentInfo['GradeLevel'] ?? ''));
        $status = strtolower(trim($studentInfo['Status'] ?? ''));

        // Determine allowed documents
        $allowedDocuments = [];

        // Check status first (for graduated/withdrawn students)
        if ($status === 'graduated') {
            $allowedDocuments = $this->documentsByLevel['graduated'];
        } elseif ($status === 'withdrawn') {
            $allowedDocuments = $this->documentsByLevel['withdrawn'];
        } 
        // Check grade level (for enrolled students)
        elseif ($gradeLevel && isset($this->documentsByLevel[$gradeLevel])) {
            $allowedDocuments = $this->documentsByLevel[$gradeLevel];
        } 
        // Fallback: try to extract number from grade level (e.g., "Grade 6" -> "grade 6")
        else {
            // This handles cases where database might have variations
            foreach ($this->documentsByLevel as $key => $docs) {
                if (stripos($gradeLevel, $key) !== false || stripos($key, $gradeLevel) !== false) {
                    $allowedDocuments = $docs;
                    break;
                }
            }
        }

        // If still no match found
        if (empty($allowedDocuments)) {
            return [
                'success' => false,
                'message' => 'Unable to determine available documents. Your grade level: "' . $studentInfo['GradeLevel'] . '". Please ensure you are enrolled for the current school year.'
            ];
        }

        // Validate document type against allowed documents
        $validDocTypes = ['form137', 'grades', 'goodMoral', 'enrollment', 'completion', 'honorable'];
        if (!in_array($data['documentType'], $validDocTypes)) {
            return [
                'success' => false,
                'message' => 'Invalid document type'
            ];
        }

        // Check if document is allowed for this student
        if (!in_array($data['documentType'], $allowedDocuments)) {
            return [
                'success' => false,
                'message' => 'This document is not available for your current grade level or status'
            ];
        }

        // Validate quantity based on document type
        if (in_array($data['documentType'], $this->singleCopyDocuments)) {
            if ($data['quantity'] != 1) {
                return [
                    'success' => false,
                    'message' => 'This document type only allows 1 original copy'
                ];
            }
        } else {
            if ($data['quantity'] < 1 || $data['quantity'] > $this->maxCopies) {
                return [
                    'success' => false,
                    'message' => 'Quantity must be between 1 and ' . $this->maxCopies
                ];
            }
        }

        // Validate delivery method (only pickup is available)
        if ($data['deliveryMethod'] !== 'pickup') {
            return [
                'success' => false,
                'message' => 'Mail delivery is currently not available'
            ];
        }

        // Prepare data for insertion
        $requestData = [
            'studentProfileID' => $this->studentProfileID,
            'documentType' => trim($data['documentType']),
            'purpose' => trim($data['purpose']),
            'quantity' => (int)$data['quantity'],
            'deliveryMethod' => trim($data['deliveryMethod']),
            'additionalNotes' => isset($data['additionalNotes']) ? trim($data['additionalNotes']) : null
        ];

        try {
            $result = $this->documentRequest->addRequest($requestData);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Document request submitted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to submit document request'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }

    public function getRequestDetails($requestID) {
        try {
            $request = $this->documentRequest->getRequestById($requestID, $this->studentProfileID);
            
            if ($request) {
                return [
                    'success' => true,
                    'request' => $request
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Request not found'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch request details: ' . $e->getMessage()
            ];
        }
    }
}
