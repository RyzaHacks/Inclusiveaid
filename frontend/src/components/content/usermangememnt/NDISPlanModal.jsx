import React from 'react';

const NdisPlanModal = ({ isOpen, onClose, ndisPlan, setNdisPlan, updateNdisPlan }) => {
  if (!isOpen || !ndisPlan) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">NDIS Plan Management</h3>
        <input
          type="number"
          placeholder="Total Budget"
          className="input input-bordered w-full mt-2"
          value={ndisPlan.totalBudget || ''}
          onChange={(e) => setNdisPlan({ ...ndisPlan, totalBudget: e.target.value })}
        />
        <input
          type="date"
          className="input input-bordered w-full mt-2"
          value={ndisPlan.endDate ? ndisPlan.endDate.split('T')[0] : ''}
          onChange={(e) => setNdisPlan({ ...ndisPlan, endDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          className="input input-bordered w-full mt-2"
          value={ndisPlan.planStatus || ''}
          onChange={(e) => setNdisPlan({ ...ndisPlan, planStatus: e.target.value })}
        />
        <input
          type="date"
          className="input input-bordered w-full mt-2"
          value={ndisPlan.reviewDate ? ndisPlan.reviewDate.split('T')[0] : ''}
          onChange={(e) => setNdisPlan({ ...ndisPlan, reviewDate: e.target.value })}
        />
        <div className="modal-action">
          <button className="btn" onClick={() => updateNdisPlan(ndisPlan)}>Update NDIS Plan</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NdisPlanModal;
