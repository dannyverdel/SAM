import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context as AuthContext } from '../../context/authContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state, signIn } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (state.token) {
            navigate('/');
        }
    }, [state.token])

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
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" placeholder="wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {
                                state.errorMessage ? (
                                    <div className='row'>
                                        <div className='col-12'>
                                            <div className='alert alert-danger' role='alert'>
                                                {state.errorMessage}
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                            <button className="btn btn-outline-success px-5 mb-5 w-100" onClick={() => signIn(email, password)}>
                                Login
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login