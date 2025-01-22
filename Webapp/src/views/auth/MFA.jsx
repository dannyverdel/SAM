import React, { useState, useEffect, useContext } from "react";
import { QRCodeSVG } from "qrcode.react";
import encode from "base32-encode";
import { Context as AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

const MFA = () => {
    const { state, setup2fa, getMe, } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        getMe((user) => {
            user.totpSecret ? setSecret(user.totpSecret) : generateSecret();
        });

        const mfa = Cookies.get('mfa')
        if (mfa === 'true') {
            navigate('/');
        }
    }, [])

    const [secret, setSecret] = useState("");
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(undefined);

    // Generate a secret key securely in the browser
    const generateSecret = () => {
        const randomBytes = new Uint8Array(20); // Generate 20 random bytes (~160 bits of entropy)
        window.crypto.getRandomValues(randomBytes);
        const generatedSecret = encode(randomBytes, "RFC4648", { padding: false });
        setSecret(generatedSecret);
    };

    const verifyToken = async () => {
        const timeStep = 30; // Time step in seconds
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const key = base32ToHex(secret); // Convert Base32 secret to Hex

        const window = 1; // Allowable time window (±1 step)
        let isValid = false;

        for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
            const counter = Math.floor(currentTime / timeStep) + errorWindow;
            const hmac = await generateHmac(key, counter); // Await HMAC generation

            // Extract dynamic offset
            const offset = hmac[hmac.length - 1] & 0xf;
            const binaryCode =
                ((hmac[offset] & 0x7f) << 24) |
                ((hmac[offset + 1] & 0xff) << 16) |
                ((hmac[offset + 2] & 0xff) << 8) |
                (hmac[offset + 3] & 0xff);

            // Generate the 6-digit OTP
            const generatedOtp = (binaryCode % 10 ** 6).toString().padStart(6, "0");

            if (generatedOtp === otp) {
                isValid = true;
                break;
            }
        }

        setVerified(isValid);

        if (isValid) {
            setup2fa(secret);
            Cookies.set('mfa', 'true', { expires: 0.0416666667, secure: true, sameSite: 'strict' });
            Swal.fire({
                icon: 'success',
                title: 'U wordt doorgestuurd',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                navigate('/');
            })
        }
    };

    const base32ToHex = (base32) => {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";

        for (let i = 0; i < base32.length; i++) {
            const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += val.toString(2).padStart(5, "0");
        }

        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substring(i, i + 4);
            hex += parseInt(chunk, 2).toString(16);
        }

        return hex;
    };

    const generateHmac = async (keyHex, counter) => {
        // Convert the hexadecimal key to a Uint8Array
        const keyBytes = hexToUint8Array(keyHex);

        // Import the key into the SubtleCrypto API
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "HMAC", hash: { name: "SHA-1" } },
            false,
            ["sign"]
        );

        // Convert the counter to an 8-byte ArrayBuffer
        const counterBuffer = new ArrayBuffer(8);
        const counterView = new DataView(counterBuffer);

        for (let i = 0; i < 8; i++) {
            counterView.setUint8(7 - i, counter & 0xff);
            counter = counter >> 8;
        }

        // Generate the HMAC
        const hmac = await window.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
        return new Uint8Array(hmac);
    };

    const hexToUint8Array = (hex) => {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return new Uint8Array(bytes);
    };

    if (!secret && !state.user) {
        return <div></div>
    }

    if (!state.user.totpSecret) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card my-5">
                            <div className="card-body p-lg-5">
                                <div className="text-center">
                                    <img src="/SAM-IRS-LOGO.png" className="img-fluid my-3"
                                        width="400px" alt="profile" />
                                </div>
                                <h1 className="text-center">MFA</h1>
                                <div className="align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h2>MFA instellen</h2>
                                    <br />
                                    <QRCodeSVG value={`otpauth://totp/${encodeURIComponent('IRSSAM')}:${encodeURIComponent('danny.verdel@gmail.com')}?secret=${secret}&issuer=${encodeURIComponent('IRSSAM')}`} height={200} width={200} />
                                    <br />
                                    <p>Backup Secret: {secret}</p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="MFA code invoeren"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="form-control mt-2 mb-2 text-center"
                                    />
                                </div>
                                {
                                    verified == false ? (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <div className='alert alert-danger text-center' role='alert'>
                                                    Ongeldige code
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                                <button className="btn btn-outline-success px-5 mb-5 w-100" onClick={verifyToken}>
                                    Verifiëren
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card my-5">
                        <div className="card-body p-lg-5">
                            <div className="text-center">
                                <img src="/SAM-IRS-LOGO.png" className="img-fluid my-3"
                                    width="400px" alt="profile" />
                            </div>
                            <h1 className="text-center">MFA</h1>
                            <div>
                                <input
                                    type="text"
                                    placeholder="MFA code invoeren"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="form-control mt-2 mb-2 text-center"
                                />
                            </div>
                            {
                                verified == false ? (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='alert alert-danger text-center' role='alert'>
                                                Ongeldige code
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <button className="btn btn-outline-success px-5 mb-5 w-100" onClick={verifyToken}>
                                Verifiëren
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default MFA;
