import React from 'react';

export const ReusableFilter = ({ config, filterState, setFilterState, onApply, onClear, onDownload }) => {
    return (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px', alignItems: 'flex-end' }}>
            {config.map((f) => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{f.label}</label>
                    {f.type === 'text' ? (
                        <input type="text" value={filterState[f.name] || ''} onChange={(e) => setFilterState({ ...filterState, [f.name]: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    ) : f.type === 'date' ? (
                        <input type="date" value={filterState[f.name] || ''} onChange={(e) => setFilterState({ ...filterState, [f.name]: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    ) : (
                        <select value={filterState[f.name] || ''} onChange={(e) => setFilterState({ ...filterState, [f.name]: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}>
                            <option value="">All</option>
                            {f.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={onApply} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply Filters</button>
                <button onClick={onClear} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear Filters</button>
                {onDownload && <button onClick={onDownload} style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download</button>}
            </div>
        </div>
    );
};
