import React from 'react';

export const ReusableTable = ({ columns, data, loading, page, setPage }) => {
    if (loading) return <p>Loading records...</p>;
    if (!data || data.length === 0) return <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No records found</p>;

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ background: '#e9ecef', textAlign: 'left' }}>
                        {columns.map((col) => <th key={col.field} style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>{col.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                            {columns.map((col) => <td key={col.field} style={{ padding: '12px' }}>{col.render ? col.render(row) : row[col.field]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span>Page {page}</span>
                <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};
