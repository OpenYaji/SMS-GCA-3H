<?php
class DocumentRequest {
    private $conn;
    private $table = 'document_request';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getRequestsByStudent($studentProfileID) {
        $query = "SELECT 
                    RequestID,
                    DocumentType,
                    Purpose,
                    Quantity,
                    DeliveryMethod,
                    AdditionalNotes,
                    RequestStatus as status,
                    DATE_FORMAT(DateRequested, '%Y-%m-%d') as dateRequested,
                    DATE_FORMAT(DateCompleted, '%Y-%m-%d') as dateCompleted
                  FROM " . $this->table . "
                  WHERE StudentProfileID = :studentProfileID
                  ORDER BY DateRequested DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addRequest($data) {
        $query = "INSERT INTO " . $this->table . "
                  (StudentProfileID, DocumentType, Purpose, Quantity, 
                   DeliveryMethod, AdditionalNotes, RequestStatus, DateRequested)
                  VALUES 
                  (:studentProfileID, :documentType, :purpose, :quantity,
                   :deliveryMethod, :additionalNotes, 'Pending', NOW())";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':studentProfileID', $data['studentProfileID']);
        $stmt->bindParam(':documentType', $data['documentType']);
        $stmt->bindParam(':purpose', $data['purpose']);
        $stmt->bindParam(':quantity', $data['quantity']);
        $stmt->bindParam(':deliveryMethod', $data['deliveryMethod']);
        $stmt->bindParam(':additionalNotes', $data['additionalNotes']);

        return $stmt->execute();
    }

    public function getRequestById($requestID, $studentProfileID) {
        $query = "SELECT * FROM " . $this->table . "
                  WHERE RequestID = :requestID 
                  AND StudentProfileID = :studentProfileID";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':requestID', $requestID);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
