export default function FeeStatus({ fees, darkMode }) {
  if (!fees || fees.length === 0) {
    return (
      <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
        <div className="card-header">
          <h3 className="card-title">Fee Status</h3>
          <button className="card-menu">⋯</button>
        </div>
        <div className="fee-list">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No fee data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-card ${darkMode ? "dark" : ""}`}>
      <div className="card-header">
        <h3 className="card-title">Fee Status</h3>
        <button className="card-menu">⋯</button>
      </div>
      <div className="fee-list">
        {fees.map((f, i) => (
          <div key={i} className="fee-item">
            <div className="fee-amount">{f.amount}</div>
            <div className={`fee-status ${f.color}`}>{f.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
