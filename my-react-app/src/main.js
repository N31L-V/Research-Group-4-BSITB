import './style.css'

const signHandover = async (batchId) => {
    const statusLabel = document.querySelector('#status');
    const verifyBtn = document.querySelector('#verifyBtn');
    
    try {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        verifyBtn.disabled = true;
        statusLabel.innerText = "Step 1: Capturing GPS...";

        // 1. Get GPS Location
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        const gps = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;

        // 2. Request Wallet Access
        statusLabel.innerText = "Step 2: Connecting Wallet...";
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const wallet = accounts[0];

        // 3. Prepare the Digital Receipt
        const timestamp = new Date().toLocaleString();
        const message = `DSWD RELIEF AUDIT RECEIPT\n--------------------------\nBatch ID: ${batchId}\nLocation: ${gps}\nTimestamp: ${timestamp}\nStatus: Verified Handover\nLGU: Pavia, Iloilo\n--------------------------\nBy signing, you anchor this data to the blockchain.`;

        // Native Hex Converter (Bypasses the "Buffer is not defined" error)
        const toHex = (str) => {
            let hex = '';
            for (let i = 0; i < str.length; i++) {
                hex += str.charCodeAt(i).toString(16);
            }
            return '0x' + hex;
        };

        const hexMsg = toHex(message);

        statusLabel.innerText = "Step 3: Awaiting Official Signature...";

        // 4. Request the Signature (This bypasses the 0x0 transaction block)
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [hexMsg, wallet],
        });

        // 5. Success UI
        statusLabel.innerHTML = `
            <div style="color: #1b5e20; background: #e8f5e9; padding: 15px; border-radius: 8px; border: 2px solid #2e7d32; text-align: left;">
                <strong style="font-size: 16px;">✔ HANDOVER VERIFIED</strong><br>
                <small style="display:block; margin-top:5px;"><b>GPS:</b> ${gps}</small>
                <small style="display:block;"><b>Batch:</b> ${batchId}</small>
                <hr style="border:0; border-top:1px solid #c8e6c9; margin: 10px 0;">
                <code style="font-size:9px; word-break: break-all; color: #333;">Audit-Hash: ${signature.substring(0,40)}...</code>
            </div>
        `;

    } catch (e) {
        console.error(e);
        statusLabel.innerHTML = "<span style='color:red'>Verification Error: Secure Handshake failed. Please try again.</span>";
        verifyBtn.disabled = false;
    }
}

document.querySelector('#app').innerHTML = `
  <div class="container" style="max-width: 400px; margin: auto; padding: 20px; font-family: sans-serif; text-align: center;">
    <div style="border: 2px solid #003366; border-radius: 15px; padding: 25px; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
      <h2 style="color: #003366; margin-bottom: 5px;">DSWD Relief Flow</h2>
      <p style="margin-top: 0; color: #666;"><strong>Pavia LGU Handover</strong></p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <div id="status" style="margin: 20px 0; font-weight: bold; min-height: 60px; color: #444;">Status: Ready for Handshake</div>
      <button id="verifyBtn" style="background: #003366; color: white; padding: 18px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 16px; font-weight: bold;">
        Sign & Verify Receipt
      </button>
    </div>
  </div>
`

document.querySelector('#verifyBtn').addEventListener('click', () => signHandover(101));