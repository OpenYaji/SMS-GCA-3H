<?php
require_once __DIR__ . '/../models/DocumentRequest.php';

class DocumentRequestController {
    private $documentRequest;
    private $studentProfileID;

    // Document types that only allow 1 copy (original only)
    private $singleCopyDocuments = ['form137', 'goodMoral', 'honorable'];
    
    // Maximum copies allowed for other documents
    private $maxCopies = 3;

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

        // Validate document type
        $validDocTypes = ['form137', 'grades', 'goodMoral', 'enrollment', 'completion', 'honorable'];
        if (!in_array($data['documentType'], $validDocTypes)) {
            return [
                'success' => false,
                'message' => 'Invalid document type'
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
}
