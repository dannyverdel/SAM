import Logo from '/SAM-IRS-ICON-removebg.png'

const Sidebar = () => {
    return (
        <aside className="main-sidebar sidebar-light-light elevation-1 ">
            <a href="/" className="brand-link">
                <img src={Logo} alt="SAM Logo" className="brand-image mr-2" style={{ opacity: 0.8 }} />
                <span className="brand-text font-weight-light">SAM</span>
            </a>
            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item menu-open">
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <a href="/" className="nav-link">
                                        <i className="fas fa-chart-pie nav-icon"></i>
                                        <p>Dashboard</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="/incidenten" className="nav-link">
                                        <i className="fab fa-gripfire nav-icon"></i>
                                        <p>Incidenten</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="/personen" className="nav-link">
                                        <i className="fas fa-users nav-icon"></i>
                                        <p>Personen</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="/middelen" className="nav-link">
                                        <i className="fas fa-truck-moving nav-icon"></i>
                                        <p>Middelen</p>
                                    </a>
                                </li>
                            </ul >
                        </li >
                    </ul >
                </nav >
            </div >
        </aside >
    )
}

export default Sidebar;