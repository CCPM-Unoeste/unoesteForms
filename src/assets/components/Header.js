import React from 'react';
import '../style/css/Header.css';

class Header extends React.Component{
    render(){
        return(
            <header>
                <nav>
                    <div className="brand">
                        <img src="assets/media/brand/brand.svg" alt=""/>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;