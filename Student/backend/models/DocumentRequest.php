<?php
class DocumentRequest {
    private $conn;
    private $table = 'document_request';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getStudentGradeLevel($studentProfileID) {
        // Get grade level from current enrollment
        $query = "SELECT 
                    gl.LevelName as GradeLevel,
                    sp.StudentStatus as Status
                  FROM studentprofile sp
                  LEFT JOIN enrollment e ON sp.StudentProfileID = e.StudentProfileID 
                      AND e.SchoolYearID = (SELECT SchoolYearID FROM schoolyear WHERE IsActive = 1 LIMIT 1)
                  LEFT JOIN section s ON e.SectionID = s.SectionID
                  LEFT JOIN gradelevel gl ON s.GradeLevelID = gl.GradeLevelID
                  WHERE sp.StudentProfileID = :studentProfileID";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
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
                    DATE_FORMAT(DateCompleted, '%Y-%m-%d') as dateCompleted,
                    DATE_FORMAT(ScheduledPickupDate, '%Y-%m-%d') as scheduledPickupDate,
                    ScheduledPickupTime,
                    RejectionReason
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
        $query = "SELECT 
                    dr.*,
                    DATE_FORMAT(dr.DateRequested, '%Y-%m-%d %H:%i') as formattedDateRequested,
                    DATE_FORMAT(dr.DateCompleted, '%Y-%m-%d %H:%i') as formattedDateCompleted,
                    DATE_FORMAT(dr.ScheduledPickupDate, '%Y-%m-%d') as scheduledPickupDate,
                    dr.ScheduledPickupTime,
                    dr.RejectionReason,
                    dr.ProcessedByUserID
                  FROM " . $this->table . " dr
                  WHERE dr.RequestID = :requestID 
                  AND dr.StudentProfileID = :studentProfileID";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':requestID', $requestID);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
