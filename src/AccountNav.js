import './AccountNav.css';
export default function AccountNav() {
    return (
        <nav className="nav">
            <a href="/" className="site-title">Site Name</a>
            <ul>
                <li>
                    <a href="/AccountInfo">Account Info</a>
                </li>
               
                <li>
                    <a href="/Security">Security</a>
                </li>
                <li>
                    <a href="/Orders">Orders</a>
                </li>
                <li>
                    <a href="/CustomerRequests">Customer Requests</a>
                </li>
                
            
                <li>
                    <a href="/LogOut">Logout</a>
                </li>
                
            </ul>
        </nav>
    );
}
