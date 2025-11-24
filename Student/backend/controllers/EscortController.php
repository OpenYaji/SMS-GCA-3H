<?php
require_once __DIR__ . '/../models/Escort.php';

class EscortController {
    private $escort;
    private $studentProfileID;

    public function __construct($db, $studentProfileID) {
        $this->escort = new Escort($db);
        $this->studentProfileID = $studentProfileID;
    }

    public function getEscorts() {
        try {
            $escorts = $this->escort->getEscortsByStudent($this->studentProfileID);
            return [
                'success' => true,
                'escorts' => $escorts
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch escorts: ' . $e->getMessage()
            ];
        }
    }

    public function addEscort($data) {
        // Validate required fields
        $requiredFields = ['fullName', 'relationship', 'contactNumber'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return [
                    'success' => false,
                    'message' => 'Missing required field: ' . $field
                ];
            }
        }

        // Validate contact number format (11 digits)
        if (!preg_match('/^[0-9]{11}$/', $data['contactNumber'])) {
            return [
                'success' => false,
                'message' => 'Contact number must be 11 digits'
            ];
        }

        // Prepare data for insertion
        $escortData = [
            'studentProfileID' => $this->studentProfileID,
            'fullName' => trim($data['fullName']),
            'relationship' => trim($data['relationship']),
            'contactNumber' => trim($data['contactNumber']),
            'address' => isset($data['address']) ? trim($data['address']) : null,
            'additionalNotes' => isset($data['additionalNotes']) ? trim($data['additionalNotes']) : null
        ];

        try {
            $result = $this->escort->addEscort($escortData);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Escort request submitted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to submit escort request'
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
