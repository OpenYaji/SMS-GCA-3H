<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

header("Content-Type: application/json");

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/ApplicantController.php';

$controller = new ApplicantController();
$controller->getApplicants();
