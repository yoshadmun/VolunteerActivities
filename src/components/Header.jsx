function Header(){

    return(
        <div className="header">
            Volunteer Application
            <div className="nav">
               <ul className="ul">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/service">Service</a></li>
                <li><a href="/contact">Contact</a></li>
               </ul>
            </div>
        </div>
    );
}

export default Header