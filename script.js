
// Data
const transactions = [
    { id: '#TRX-7891', customer: 'Sarah Johnson', email: 'sarah.j@example.com', date: '2024-01-15 14:30', amount: 294.00, status: 'completed', avatar: 'SJ' },
    { id: '#TRX-7890', customer: 'Michael Chen', email: 'm.chen@example.com', date: '2024-01-15 13:15', amount: 150.00, status: 'pending', avatar: 'MC' },
    { id: '#TRX-7889', customer: 'Emily Davis', email: 'emily.d@example.com', date: '2024-01-15 11:45', amount: 450.00, status: 'completed', avatar: 'ED' },
    { id: '#TRX-7888', customer: 'James Wilson', email: 'j.wilson@example.com', date: '2024-01-14 16:20', amount: 89.99, status: 'failed', avatar: 'JW' },
    { id: '#TRX-7887', customer: 'Lisa Anderson', email: 'lisa.a@example.com', date: '2024-01-14 10:00', amount: 599.00, status: 'completed', avatar: 'LA' },
    { id: '#TRX-7886', customer: 'Robert Taylor', email: 'rob.t@example.com', date: '2024-01-13 15:30', amount: 75.50, status: 'completed', avatar: 'RT' },
    { id: '#TRX-7885', customer: 'Amanda White', email: 'amanda@example.com', date: '2024-01-13 09:15', amount: 320.00, status: 'pending', avatar: 'AW' },
    { id: '#TRX-7884', customer: 'David Brown', email: 'd.brown@example.com', date: '2024-01-12 17:45', amount: 1250.00, status: 'completed', avatar: 'DB' },
    { id: '#TRX-7883', customer: 'Jennifer Lee', email: 'jlee@example.com', date: '2024-01-12 14:00', amount: 45.00, status: 'refunded', avatar: 'JL' },
    { id: '#TRX-7882', customer: 'Chris Martin', email: 'chris@example.com', date: '2024-01-11 11:30', amount: 899.00, status: 'completed', avatar: 'CM' },
    { id: '#TRX-7881', customer: 'Maria Garcia', email: 'maria.g@example.com', date: '2024-01-11 08:45', amount: 234.50, status: 'completed', avatar: 'MG' },
    { id: '#TRX-7880', customer: 'Kevin Park', email: 'k.park@example.com', date: '2024-01-10 16:15', amount: 567.00, status: 'pending', avatar: 'KP' }
];

const revenueData = {
    '24h': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        data: [1200, 1900, 3000, 2500, 4200, 3800],
        metrics: { revenue: '$12,450', orders: '142', customers: '38', conversion: '3.8%' }
    },
    '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12500, 19000, 15000, 22000, 28000, 24000, 18000],
        metrics: { revenue: '$48,294', orders: '1,482', customers: '384', conversion: '3.24%' }
    },
    '30d': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [85000, 120000, 95000, 140000],
        metrics: { revenue: '$440,000', orders: '5,920', customers: '1,536', conversion: '3.5%' }
    },
    '90d': {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [320000, 450000, 380000],
        metrics: { revenue: '$1,150,000', orders: '15,200', customers: '4,800', conversion: '3.1%' }
    }
};

// State
let currentPage = 1;
const itemsPerPage = 5;
let filteredTransactions = [...transactions];
let currentRange = '7d';
let revenueChart, paymentChart;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderTransactions();
    setupEventListeners();
    updateMetrics('7d');
});

function initCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? '#334155' : '#E2E8F0';

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const gradient = revenueCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 91, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 91, 255, 0)');

    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: revenueData['7d'].labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData['7d'].data,
                borderColor: '#635BFF',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#635BFF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1E293B' : '#fff',
                    titleColor: isDark ? '#fff' : '#0F172A',
                    bodyColor: isDark ? '#CBD5E1' : '#475569',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `$${context.parsed.y.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                },
                y: {
                    grid: { color: gridColor, borderDash: [5, 5] },
                    ticks: {
                        color: textColor,
                        callback: (value) => `$${value >= 1000 ? (value / 1000) + 'k' : value}`
                    }
                }
            }
        }
    });

    // Payment Methods Chart
    const paymentCtx = document.getElementById('paymentChart').getContext('2d');
    paymentChart = new Chart(paymentCtx, {
        type: 'doughnut',
        data: {
            labels: ['Card', 'PayPal', 'Bank Transfer'],
            datasets: [{
                data: [62, 24, 14],
                backgroundColor: ['#635BFF', '#3B82F6', '#10B981'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1E293B' : '#fff',
                    titleColor: isDark ? '#fff' : '#0F172A',
                    bodyColor: isDark ? '#CBD5E1' : '#475569',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => `${context.label}: ${context.parsed}%`
                    }
                }
            }
        }
    });
}

function renderTransactions() {
    const tbody = document.getElementById('transactionsTable');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredTransactions.slice(start, end);

    tbody.innerHTML = pageData.map(t => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-stripe-purple/10 flex items-center justify-center text-stripe-purple font-bold text-sm">
                                ${t.avatar}
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">${t.id}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">${t.email}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">${t.customer}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500 dark:text-gray-400">${t.date}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-gray-900 dark:text-white">$${t.amount.toFixed(2)}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(t.status)}">
                            ${t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-stripe-purple hover:text-stripe-purple/80 mr-3"><i class="fas fa-eye"></i></button>
                        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><i class="fas fa-ellipsis-v"></i></button>
                    </td>
                </tr>
            `).join('');

    updatePagination();
}

function getStatusStyle(status) {
    const styles = {
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return styles[status] || styles.pending;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredTransactions.length);

    document.getElementById('showingStart').textContent = filteredTransactions.length ? start : 0;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalEntries').textContent = filteredTransactions.length;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;

    const paginationContainer = document.getElementById('paginationNumbers');
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="px-3 py-1 rounded-lg text-sm font-medium ${i === currentPage ? 'bg-stripe-purple text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}" onclick="goToPage(${i})">${i}</button>`;
    }
    paginationContainer.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderTransactions();
}

function updateMetrics(range) {
    const data = revenueData[range];
    document.getElementById('totalRevenue').textContent = data.metrics.revenue;
    document.getElementById('totalOrders').textContent = data.metrics.orders;
    document.getElementById('newCustomers').textContent = data.metrics.customers;
    document.getElementById('conversionRate').textContent = data.metrics.conversion;

    // Update chart
    revenueChart.data.labels = data.labels;
    revenueChart.data.datasets[0].data = data.data;
    revenueChart.update('active');
}

function setupEventListeners() {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtn = document.getElementById('closeSidebar');

    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('-translate-x-full');
    });

    closeBtn?.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        themeIcon.className = isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-gray-600';

        // Update charts for dark mode
        const textColor = isDark ? '#94A3B8' : '#64748B';
        const gridColor = isDark ? '#334155' : '#E2E8F0';

        revenueChart.options.scales.x.ticks.color = textColor;
        revenueChart.options.scales.y.ticks.color = textColor;
        revenueChart.options.scales.y.grid.color = gridColor;
        revenueChart.options.plugins.tooltip.backgroundColor = isDark ? '#1E293B' : '#fff';
        revenueChart.options.plugins.tooltip.titleColor = isDark ? '#fff' : '#0F172A';
        revenueChart.options.plugins.tooltip.bodyColor = isDark ? '#CBD5E1' : '#475569';
        revenueChart.options.plugins.tooltip.borderColor = isDark ? '#334155' : '#E2E8F0';
        revenueChart.update();

        paymentChart.options.plugins.tooltip.backgroundColor = isDark ? '#1E293B' : '#fff';
        paymentChart.options.plugins.tooltip.titleColor = isDark ? '#fff' : '#0F172A';
        paymentChart.options.plugins.tooltip.bodyColor = isDark ? '#CBD5E1' : '#475569';
        paymentChart.options.plugins.tooltip.borderColor = isDark ? '#334155' : '#E2E8F0';
        paymentChart.update();
    });

    // Date Filters
    document.querySelectorAll('.date-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.date-filter').forEach(b => {
                b.classList.remove('bg-stripe-purple', 'text-white');
                b.classList.add('text-gray-600', 'dark:text-gray-300');
            });
            e.target.classList.remove('text-gray-600', 'dark:text-gray-300');
            e.target.classList.add('bg-stripe-purple', 'text-white');

            currentRange = e.target.dataset.range;
            updateMetrics(currentRange);
        });
    });

    // Search
    document.getElementById('searchTransactions').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filteredTransactions = transactions.filter(t =>
            t.customer.toLowerCase().includes(query) ||
            t.id.toLowerCase().includes(query) ||
            t.email.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderTransactions();
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.add('-translate-x-full');
        }
    });
}
