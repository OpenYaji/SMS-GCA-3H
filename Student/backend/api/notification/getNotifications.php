<?php
require_once __DIR__ . '/../../controllers/NotificationController.php';

$controller = new NotificationController();
$controller->getNotifications();
