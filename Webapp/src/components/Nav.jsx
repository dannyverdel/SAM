import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { Context as AuthContext } from '../context/authContext';
import Cookies from 'js-cookie';

const Nav = () => {
    const navigate = useNavigate();
    const { state, signOut, tryLocalSignin, getMe } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            await tryLocalSignin();
            setLoading(false);
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        const mfa = Cookies.get('mfa');
        if (!loading) {
            if (!state.token || !mfa || mfa == undefined) {
                navigate('/login');
            } else {
                getMe();
            }
        }
    }, [state.token, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header userAuthenticated={state.token ? true : false} onSignOut={signOut} />
            <Sidebar />
            <div className='content-wrapper p-3'>
                <Outlet />
            </div>
        </>
    );
}

export default Nav;