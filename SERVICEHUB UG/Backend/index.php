<?php
// ServiceHub UG - Backend API
// Sample PHP file for handling API requests

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration or connection setup
$host = 'localhost';
$dbname = 'servicehub_ug';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

// Get request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$endpoint = $request[0] ?? '';

// Handle different endpoints
switch($endpoint) {
    case 'register':
        handleRegister($pdo, $method);
        break;
    case 'login':
        handleLogin($pdo, $method);
        break;
    case 'technicians':
        handleTechnicians($pdo, $method);
        break;
    case 'bookings':
        handleBookings($pdo, $method);
        break;
    case 'payments':
        handlePayments($pdo, $method);
        break;
    default:
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// User registration handler
function handleRegister($pdo, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $required = ['fullName', 'email', 'phone', 'password', 'accountType'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        return;
    }

    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, date_of_birth, password_hash, user_type, street_address, city, postal_code, country, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Uganda', NOW())");
    $stmt->execute([
        $data['fullName'],
        $data['email'],
        $data['phone'],
        $data['dateOfBirth'] ?? null,
        $hashedPassword,
        $data['accountType'],
        $data['streetAddress'] ?? null,
        $data['city'] ?? null,
        $data['postalCode'] ?? null
    ]);

    $userId = $pdo->lastInsertId();

    // If technician, insert technician details
    if ($data['accountType'] === 'technician') {
        $stmt = $pdo->prepare("INSERT INTO technicians (user_id, skills, experience_years, qualifications, hourly_rate, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $userId,
            json_encode($data['skills'] ?? []),
            $data['experience'] ?? null,
            $data['qualifications'] ?? null,
            $data['hourlyRate'] ?? null
        ]);
    }

    echo json_encode(['success' => true, 'user_id' => $userId]);
}

// User login handler
function handleLogin($pdo, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
        return;
    }

    $stmt = $pdo->prepare("SELECT id, full_name, password_hash, user_type FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    // Generate simple session token (in production, use JWT or proper sessions)
    $token = bin2hex(random_bytes(32));

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'name' => $user['full_name'],
            'type' => $user['user_type']
        ],
        'token' => $token
    ]);
}

// Technicians listing handler
function handleTechnicians($pdo, $method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $query = "SELECT u.id, u.full_name, u.city, t.skills, t.experience_years, t.hourly_rate, t.verified
              FROM users u
              JOIN technicians t ON u.id = t.user_id
              WHERE u.user_type = 'technician'";

    $params = [];

    // Apply filters
    if (isset($_GET['skill'])) {
        $query .= " AND JSON_CONTAINS(t.skills, ?)";
        $params[] = json_encode($_GET['skill']);
    }

    if (isset($_GET['city'])) {
        $query .= " AND u.city LIKE ?";
        $params[] = '%' . $_GET['city'] . '%';
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $technicians = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['technicians' => $technicians]);
}

// Bookings handler
function handleBookings($pdo, $method) {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        $stmt = $pdo->prepare("INSERT INTO bookings (customer_id, technician_id, service_type, description, preferred_date, preferred_time, location_address, location_city, urgency, special_instructions, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");
        $stmt->execute([
            $data['customerId'],
            $data['technicianId'],
            $data['serviceType'],
            $data['description'],
            $data['preferredDate'],
            $data['preferredTime'],
            $data['locationAddress'],
            $data['locationCity'],
            $data['urgency'],
            $data['specialInstructions']
        ]);

        echo json_encode(['success' => true, 'booking_id' => $pdo->lastInsertId()]);
    } elseif ($method === 'GET') {
        // Get bookings for user
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
            return;
        }

        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE customer_id = ? OR technician_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId, $userId]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['bookings' => $bookings]);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

// Payments handler
function handlePayments($pdo, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, created_at) VALUES (?, ?, ?, 'completed', ?, NOW())");
    $stmt->execute([
        $data['bookingId'],
        $data['amount'],
        $data['paymentMethod'],
        $data['transactionId'] ?? uniqid('txn_')
    ]);

    echo json_encode(['success' => true, 'payment_id' => $pdo->lastInsertId()]);
}
?>