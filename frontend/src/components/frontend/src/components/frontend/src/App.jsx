import React, { useState, useEffect } from 'react';
import { ReusableFilter } from './components/ReusableFilter';
import { ReusableTable } from './components/ReusableTable';

export default function App() {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/state').then(res => res.json()).then(d => setStates(d.map(s => ({ label: s, value: s }))));
        fetch('http://localhost:5000/api/city').then(res => res.json()).then(d => setCities(d.map(c => ({ label: c, value: c }))));
    }, []);

    const fetchData = async () => {
        setLoading(true);
        let url = `http://localhost:5000/api/users/getUserList?page=${page}`;
        if (activeTab === 'hotels') url = `http://localhost:5000/api/hotels/getHotelList?page=${page}`;
        if (activeTab === 'bookings') url = `http://localhost:5000/api/bookings/getBookings?page=${page}`;

        Object.keys(appliedFilters).forEach(key => { if (appliedFilters[key]) url += `&${key}=${appliedFilters[key]}`; });
        const res = await fetch(url); const result = await res.json();
        setData(result.users || result.hotels || result.bookings || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [activeTab, page, appliedFilters]);

    const handleApply = () => { setAppliedFilters({ ...filters }); setPage(1); };
    const handleClear = () => { setFilters({}); setAppliedFilters({}); setPage(1); };
    const handleDownload = () => { window.open(`http://localhost:5000/api/bookings/getBookings?download=true`, '_blank'); };

    const userConfigs = [{ name: 'search', label: 'Search Name/Email/Phone', type: 'text' }];
    const hotelConfigs = [
        { name: 'search', label: 'Search Hotel Name', type: 'text' },
        { name: 'state', label: 'State', type: 'select', options: states },
        { name: 'city', label: 'City', type: 'select', options: cities },
        { name: 'rating', label: 'Rating', type: 'select', options:.map(n => ({ label: `${n} Star`, value: n })) },
        { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }] }
    ];
    const bookingConfigs = [
        { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Confirmed', value: 0 }, { label: 'Cancelled', value: 1 }, { label: 'Completed', value: 2 }] },
        { name: 'startDate', label: 'Check-In From', type: 'date' },
        { name: 'endDate', label: 'Check-In To', type: 'date' }
    ];

    const userCols = [{ field: 'name', header: 'Name' }, { field: 'email', header: 'Email' }, { field: 'phone', header: 'Phone' }, { field: 'createdAt', header: 'Created Date' }];
    const hotelCols = [{ field: 'name', header: 'Hotel Name' }, { field: 'location', header: 'Location' }, { field: 'city', header: 'City' }, { field: 'rating', header: 'Rating' }, { field: 'isActive', header: 'Status', render: (row) => row.isActive ? 'Active' : 'Inactive' }];
    const bookingCols = [
        { field: 'guestName', header: 'Guest Name', render: (row) => row.userId?.name || 'N/A' },
        { field: 'hotelName', header: 'Hotel Name', render: (row) => row.hotelId?.name || 'N/A' },
        { field: 'checkInDate', header: 'Check-in Date', render: (row) => new Date(row.checkInDate).toLocaleDateString() },
        { field: 'status', header: 'Status', render: (row) => row.status === 0 ? 'Confirmed' : row.status === 1 ? 'Cancelled' : 'Completed' }
    ];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Hotel Booking Management</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['users', 'hotels', 'bookings'].map(t => (
                    <button key={t} onClick={() => { setActiveTab(t); handleClear(); }} style={{ padding: '10px', background: activeTab === t ? '#007bff' : '#ccc', color: '#fff', border: 'none', cursor: 'pointer' }}>{t.toUpperCase()}</button>
                ))}
            </div>
            {activeTab === 'users' && <ReusableFilter config={userConfigs} filterState={filters} setFilterState={setFilters} onApply={handleApply} onClear={handleClear} />}
            {activeTab === 'hotels' && <ReusableFilter config={hotelConfigs} filterState={filters} setFilterState={setFilters} onApply={handleApply} onClear={handleClear} />}
            {activeTab === 'bookings' && <ReusableFilter config={bookingConfigs} filterState={filters} setFilterState={setFilters} onApply={handleApply} onClear={handleClear} onDownload={handleDownload} />}
            <ReusableTable columns={activeTab === 'users' ? userCols : activeTab === 'hotels' ? hotelCols : bookingCols} data={data} loading={loading} page={page} setPage={setPage} />
        </div>
    );
}
