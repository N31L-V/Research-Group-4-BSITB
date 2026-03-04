// src/components/Verification.jsx
import React, { useState } from 'react';
import { getContract } from '../blockchain/Service';

const Verification = ({ batchId }) => {
    const [msg, setMsg] = useState("Ready for Handover");

    const signHandover = async () => {
        setMsg("Fetching GPS...");
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const gps = `${pos.coords.latitude},${pos.coords.longitude}`;
                const contract = await getContract();
                setMsg("Waiting for MetaMask...");
                const tx = await contract.receiveBatch(batchId, gps);
                setMsg("Syncing with Blockchain...");
                await tx.wait();
                setMsg("Success! Delivery Recorded.");
            } catch (e) { setMsg("Error: " + e.message); }
        });
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h3>Batch #{batchId} Verification</h3>
            <p>{msg}</p>
            <button onClick={signHandover}>Sign Digital Handshake</button>
        </div>
    );
};

export default Verification;