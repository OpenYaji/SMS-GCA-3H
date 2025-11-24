<?php
class Escort {
    private $conn;
    private $table = 'authorized_escort';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getEscortsByStudent($studentProfileID) {
        $query = "SELECT 
                    EscortID,
                    FullName,
                    RelationshipToStudent as relationship,
                    ContactNumber,
                    Address,
                    AdditionalNotes,
                    EscortStatus as status,
                    IsActive,
                    DATE_FORMAT(DateAdded, '%Y-%m-%d') as dateAdded
                  FROM " . $this->table . "
                  WHERE StudentProfileID = :studentProfileID 
                  AND IsActive = 1
                  ORDER BY DateAdded DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addEscort($data) {
        $query = "INSERT INTO " . $this->table . "
                  (StudentProfileID, FullName, RelationshipToStudent, ContactNumber, 
                   Address, AdditionalNotes, EscortStatus, DateAdded)
                  VALUES 
                  (:studentProfileID, :fullName, :relationship, :contactNumber,
                   :address, :additionalNotes, 'Pending', NOW())";

        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':studentProfileID', $data['studentProfileID']);
        $stmt->bindParam(':fullName', $data['fullName']);
        $stmt->bindParam(':relationship', $data['relationship']);
        $stmt->bindParam(':contactNumber', $data['contactNumber']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':additionalNotes', $data['additionalNotes']);

        return $stmt->execute();
    }

    public function getEscortById($escortID, $studentProfileID) {
        $query = "SELECT * FROM " . $this->table . "
                  WHERE EscortID = :escortID 
                  AND StudentProfileID = :studentProfileID 
                  AND IsActive = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':escortID', $escortID);
        $stmt->bindParam(':studentProfileID', $studentProfileID);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
