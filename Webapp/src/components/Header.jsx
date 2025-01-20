const Header = ({ userAuthenticated, onSignOut }) => {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                {
                    userAuthenticated ? (
                        <>
                            <li className="nav-item dropdown user-menu mr-4">
                                <a className="nav-link">
                                    <span className="d-none d-md-inline">Danny Verdel</span>
                                </a>
                            </li>
                            <button className="nav-item btn btn-outline-secondary mr-4" onClick={onSignOut}>Afmelden</button>
                        </>
                    ) : (
                        <button className="nav-item btn btn-outline-secondary mr-4">Aanmelden</button>
                    )
                }
            </ul>
        </nav>
    )
}

export default Header;