function Header(){

    return(
        <div className="header">
            <h1 style={{display:"flex",marginLeft:"2.5rem",alignItems:"center"}}>Volunteer Application</h1>
            <div className="nav">
               <ul className="ul">
                <li className="headerLi"><a className="a" href="/">Home</a></li>
                <li className="headerLi"><a className="a" href="/contact">Contact</a></li>
                <li className="headerLi"><a className="a" href="/register">Register</a></li>
                <li className="headerLi"><a className="a" href="/login">Login</a></li>
               </ul>
            </div>
        </div>
    );
}

export default Header