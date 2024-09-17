const fs = require('fs');
const path = require('path');

const componentMap = {
    'AdminDashboardContent.jsx': 'dashboard',
    'ClientDashboardContent.jsx': 'dashboard',
    'Dashboard.jsx': 'dashboard',
    'ServiceWorkerDashboardContent.jsx': 'dashboard',
    'ProfileContent.jsx': 'dashboard',
    'ServiceWorkerServicesView.jsx': 'dashboard',
    'ClientServicesView.jsx': 'dashboard',
    'AdminServicesView.jsx': 'dashboard',
    'Sidebar.jsx': 'dashboard', // Will be renamed to DashboardSidebar.jsx
    'Navbar.jsx': 'common',
    'Footer.jsx': 'common',
    'About.jsx': 'common',
    'BlogPreview.jsx': 'common',
    'CommunityContent.jsx': 'common',
    'Contact.jsx': 'common',
    'GoalTracker.jsx': 'common',
    'Hero.jsx': 'common',
    'Testimonials.jsx': 'common',
    'ServiceCard.jsx': 'services',
    'ServiceModal.jsx': 'services',
    'ServiceRequestModal.jsx': 'services',
    'ServicesContent.jsx': 'services',
    'AppointmentModal.jsx': 'appointments',
    'UpcomingAppointments.jsx': 'appointments',
    'ZoomBooking.jsx': 'appointments',
    'ZoomMeetingInterface.jsx': 'appointments',
    'ZoomContent.jsx': 'appointments',
    'ZoomMeetingRoom.jsx': 'appointments',
    'NDISPlanContent.jsx': 'content',
    'SupportContent.jsx': 'content',
    'UserManagementContent.jsx': 'content',
    'ProtectedRoute.jsx': 'utilities',
    'RecentActivities.jsx': 'utilities',
    'EventsCalendar.jsx': 'utilities',
};

const baseDir = path.join(__dirname, 'src/components');

Object.entries(componentMap).forEach(([component, folder]) => {
    const oldPath = path.join(baseDir, component);
    const newPath = path.join(baseDir, folder, component);

    // Create folder if it doesn't exist
    if (!fs.existsSync(path.join(baseDir, folder))) {
        fs.mkdirSync(path.join(baseDir, folder));
    }

    // Move file to new folder
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
    }

    // Update imports in files
    const updateImportsInFiles = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                updateImportsInFiles(filePath);
            } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
                let content = fs.readFileSync(filePath, 'utf-8');
                const regex = new RegExp(`import\\s+.*\\s+from\\s+'\\.\\.\\/components\\/${component.replace('.', '\\.')}';`, 'g');
                content = content.replace(regex, match => {
                    return match.replace(`../components/${component}`, `../components/${folder}/${component}`);
                });
                fs.writeFileSync(filePath, content, 'utf-8');
            }
        });
    };

    updateImportsInFiles(path.join(__dirname, 'src'));
});

// Rename Sidebar.jsx to DashboardSidebar.jsx
const sidebarOldPath = path.join(baseDir, 'dashboard', 'Sidebar.jsx');
const sidebarNewPath = path.join(baseDir, 'dashboard', 'DashboardSidebar.jsx');
if (fs.existsSync(sidebarOldPath)) {
    fs.renameSync(sidebarOldPath, sidebarNewPath);

    // Update imports for DashboardSidebar.jsx
    const updateSidebarImports = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                updateSidebarImports(filePath);
            } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
                let content = fs.readFileSync(filePath, 'utf-8');
                content = content.replace(`../components/dashboard/Sidebar`, `../components/dashboard/DashboardSidebar`);
                fs.writeFileSync(filePath, content, 'utf-8');
            }
        });
    };

    updateSidebarImports(path.join(__dirname, 'src'));
}

// Remove unused Header.jsx
const headerPath = path.join(baseDir, 'Header.jsx');
if (fs.existsSync(headerPath)) {
    fs.unlinkSync(headerPath);
}
