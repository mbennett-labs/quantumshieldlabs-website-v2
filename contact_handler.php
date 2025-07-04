<?php
/**
 * Quantum Shield Labs - Contact Form Handler
 * Processes early access applications and stores in MySQL database
 * Sends email notifications for new leads
 */

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$db_host = "srv1852.hstgr.io";
$db_name = "u624659440_2fLiI";
$db_user = "u624659440_q2cYa";
$db_pass = "Gtop49!Lok"; 
// Email configuration
$notification_email = "michael@quantumshieldlabs.dev"; // Where to send notifications
$from_email = "no-reply@quantumshieldlabs.dev";

// Set JSON response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If JSON decode fails, try regular POST data
    if (!$input) {
        $input = $_POST;
    }
    
    // Validate required fields
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $company = trim($input['company'] ?? '');
    $message = trim($input['message'] ?? '');
    
    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        throw new Exception('Name, email, and message are required fields.');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email address.');
    }
    
    // Connect to database
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    // Create table if it doesn't exist
    $create_table_sql = "
    CREATE TABLE IF NOT EXISTS early_access_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        message TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new', 'contacted', 'qualified', 'converted') DEFAULT 'new',
        notes TEXT,
        source VARCHAR(50) DEFAULT 'website',
        ip_address VARCHAR(45),
        user_agent TEXT,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_submitted (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $pdo->exec($create_table_sql);
    
    // Check for duplicate email (optional - remove if you want to allow duplicates)
    $check_stmt = $pdo->prepare("SELECT id FROM early_access_leads WHERE email = ?");
    $check_stmt->execute([$email]);
    
    if ($check_stmt->fetch()) {
        // Update existing record instead of creating duplicate
        $update_stmt = $pdo->prepare("
            UPDATE early_access_leads 
            SET name = ?, company = ?, message = ?, submitted_at = CURRENT_TIMESTAMP,
                ip_address = ?, user_agent = ?
            WHERE email = ?
        ");
        
        $update_stmt->execute([
            $name,
            $company,
            $message,
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_USER_AGENT'] ?? '',
            $email
        ]);
        
        $lead_id = $check_stmt->fetchColumn();
        $action = 'updated';
    } else {
        // Insert new lead
        $insert_stmt = $pdo->prepare("
            INSERT INTO early_access_leads (name, email, company, message, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $insert_stmt->execute([
            $name,
            $email,
            $company,
            $message,
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
        
        $lead_id = $pdo->lastInsertId();
        $action = 'created';
    }
    
    // Send email notification
    $subject = "New Early Access Application - Quantum Shield Labs";
    $email_body = "
New Early Access Application Received!

Name: $name
Email: $email
Company: $company
Message: $message

Submitted: " . date('Y-m-d H:i:s') . "
IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "

Lead ID: $lead_id

View all leads: https://quantumshieldlabs.dev/admin-dashboard.php
    ";
    
    $headers = "From: $from_email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email (mail function works on most hosting providers)
    $email_sent = mail($notification_email, $subject, $email_body, $headers);
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your interest! We\'ll be in touch soon.',
        'lead_id' => $lead_id,
        'action' => $action,
        'email_sent' => $email_sent
    ]);
    
} catch (PDOException $e) {
    // Database error
    error_log("Database error in contact-handler.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred. Please try again later.',
        'debug' => $e->getMessage() // Remove this line in production
    ]);
    
} catch (Exception $e) {
    // General error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>