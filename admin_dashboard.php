<?php
/**
 * Quantum Shield Labs - Admin Dashboard
 * View and manage early access leads
 * Simple authentication and lead management interface
 */

// Simple authentication (change this password!)
$admin_password = "QSL2025!Admin"; // Change this to a secure password
$authenticated = false;

session_start();

// Check authentication
if (isset($_POST['admin_password'])) {
    if ($_POST['admin_password'] === $admin_password) {
        $_SESSION['qsl_admin'] = true;
        $authenticated = true;
    } else {
        $error = "Invalid password";
    }
} elseif (isset($_SESSION['qsl_admin']) && $_SESSION['qsl_admin'] === true) {
    $authenticated = true;
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin-dashboard.php');
    exit;
}

// Database configuration
$db_host = "srv1852.hstgr.io";
$db_name = "u624659440_2fLiI";
$db_user = "u624659440_q2cYa";
$db_pass = "Gtop49!Lok"; 

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QSL Admin Dashboard - Lead Management</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: linear-gradient(to bottom, #0f172a, #000); color: white; }
        .table-row:hover { background-color: rgba(59, 130, 246, 0.1); }
    </style>
</head>
<body class="min-h-screen">

<?php if (!$authenticated): ?>
    <!-- Login Form -->
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
            <div class="text-center mb-6">
                <i class="fas fa-shield-alt text-blue-500 text-4xl mb-4"></i>
                <h1 class="text-2xl font-bold">QSL Admin Dashboard</h1>
                <p class="text-gray-300">Lead Management System</p>
            </div>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-900 bg-opacity-50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>
            
            <form method="post" class="space-y-4">
                <div>
                    <label for="admin_password" class="block text-sm font-medium mb-2">Admin Password</label>
                    <input type="password" id="admin_password" name="admin_password" 
                           class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Enter admin password" required>
                </div>
                <button type="submit" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                    <i class="fas fa-sign-in-alt mr-2"></i> Access Dashboard
                </button>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- Dashboard Content -->
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold mb-2">
                    <i class="fas fa-shield-alt text-blue-500 mr-3"></i>
                    Quantum Shield Labs Admin
                </h1>
                <p class="text-gray-300">Early Access Lead Management</p>
            </div>
            <div class="flex items-center space-x-4">
                <a href="/" class="text-blue-400 hover:text-blue-300">
                    <i class="fas fa-home mr-2"></i>Back to Site
                </a>
                <a href="?logout=1" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </a>
            </div>
        </div>

        <?php
        try {
            // Connect to database
            $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            // Get statistics
            $stats_query = "
                SELECT 
                    COUNT(*) as total_leads,
                    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
                    COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
                    COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
                    COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
                    COUNT(CASE WHEN submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as this_week,
                    COUNT(CASE WHEN submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as this_month
                FROM early_access_leads
            ";
            $stats = $pdo->query($stats_query)->fetch();

            // Handle status updates
            if (isset($_POST['update_status']) && isset($_POST['lead_id']) && isset($_POST['new_status'])) {
                $update_stmt = $pdo->prepare("UPDATE early_access_leads SET status = ?, notes = ? WHERE id = ?");
                $update_stmt->execute([$_POST['new_status'], $_POST['notes'] ?? '', $_POST['lead_id']]);
                echo '<div class="bg-green-900 bg-opacity-50 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">Lead status updated successfully!</div>';
                
                // Refresh stats
                $stats = $pdo->query($stats_query)->fetch();
            }
        ?>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-blue-500"><?= $stats['total_leads'] ?? 0 ?></div>
                <div class="text-gray-300">Total Leads</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-yellow-500"><?= $stats['new_leads'] ?? 0 ?></div>
                <div class="text-gray-300">New</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-blue-500"><?= $stats['contacted_leads'] ?? 0 ?></div>
                <div class="text-gray-300">Contacted</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-purple-500"><?= $stats['qualified_leads'] ?? 0 ?></div>
                <div class="text-gray-300">Qualified</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-green-500"><?= $stats['converted_leads'] ?? 0 ?></div>
                <div class="text-gray-300">Converted</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-orange-500"><?= $stats['this_week'] ?? 0 ?></div>
                <div class="text-gray-300">This Week</div>
            </div>
            <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-pink-500"><?= $stats['this_month'] ?? 0 ?></div>
                <div class="text-gray-300">This Month</div>
            </div>
        </div>

        <!-- Leads Table -->
        <div class="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg">
            <div class="p-6 border-b border-gray-700">
                <h2 class="text-xl font-semibold">Early Access Leads</h2>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-800 bg-opacity-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        <?php
                        // Get all leads
                        $leads_query = "SELECT * FROM early_access_leads ORDER BY submitted_at DESC";
                        $leads = $pdo->query($leads_query)->fetchAll();

                        if (empty($leads)):
                        ?>
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                                    <i class="fas fa-inbox text-4xl mb-4"></i>
                                    <br>No leads yet. When someone submits the contact form, they'll appear here.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($leads as $lead): ?>
                                <tr class="table-row">
                                    <td class="px-6 py-4">
                                        <div class="font-medium"><?= htmlspecialchars($lead['name']) ?></div>
                                        <div class="text-gray-400 text-sm">
                                            <a href="mailto:<?= htmlspecialchars($lead['email']) ?>" class="text-blue-400 hover:text-blue-300">
                                                <?= htmlspecialchars($lead['email']) ?>
                                            </a>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        <?= htmlspecialchars($lead['company'] ?: 'Not specified') ?>
                                    </td>
                                    <td class="px-6 py-4 text-sm max-w-xs">
                                        <div class="truncate" title="<?= htmlspecialchars($lead['message']) ?>">
                                            <?= htmlspecialchars(substr($lead['message'], 0, 100)) ?><?= strlen($lead['message']) > 100 ? '...' : '' ?>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <form method="post" class="inline">
                                            <input type="hidden" name="lead_id" value="<?= $lead['id'] ?>">
                                            <select name="new_status" onchange="this.form.submit()" 
                                                    class="bg-gray-800 text-white rounded px-2 py-1 text-sm">
                                                <option value="new" <?= $lead['status'] === 'new' ? 'selected' : '' ?>>New</option>
                                                <option value="contacted" <?= $lead['status'] === 'contacted' ? 'selected' : '' ?>>Contacted</option>
                                                <option value="qualified" <?= $lead['status'] === 'qualified' ? 'selected' : '' ?>>Qualified</option>
                                                <option value="converted" <?= $lead['status'] === 'converted' ? 'selected' : '' ?>>Converted</option>
                                            </select>
                                            <input type="hidden" name="update_status" value="1">
                                        </form>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-400">
                                        <?= date('M j, Y H:i', strtotime($lead['submitted_at'])) ?>
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        <a href="mailto:<?= htmlspecialchars($lead['email']) ?>?subject=Re: Early Access Application&body=Hi <?= htmlspecialchars($lead['name']) ?>,%0A%0AThank you for your interest in Quantum Shield Labs..." 
                                           class="text-blue-400 hover:text-blue-300 mr-2">
                                            <i class="fas fa-envelope"></i> Email
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <?php
        } catch (PDOException $e) {
            echo '<div class="bg-red-900 bg-opacity-50 border border-red-500 text-red-300 px-4 py-3 rounded">';
            echo 'Database connection error. Please check your database configuration.';
            echo '<br><small>Error: ' . htmlspecialchars($e->getMessage()) . '</small>';
            echo '</div>';
        }
        ?>

        <!-- Footer -->
        <div class="mt-8 text-center text-gray-400 text-sm">
            <p>Quantum Shield Labs Admin Dashboard &copy; 2025</p>
            <p>Last updated: <?= date('Y-m-d H:i:s') ?></p>
        </div>
    </div>
<?php endif; ?>

</body>
</html>