import { useState } from 'react'; // استيراد Hook الحالة
import './style1.css';
const LoginAndSign = () => {
    // تعريف حالة للتحكم في الكلاس active
    const [isActive, setIsActive] = useState(false);
    const switchMode = () => {
        setIsActive(!isActive); // تبديل الحالة بين true و false
    };
    return (
        <div className='body'>
        <div className={`container ${isActive ? 'active' : ''}`} id="main-container">
            <div className="forms-bg-layer">
                {/* حقول التسجيل */}
                <div className="form-panel sign-up-fields">
                    <div className="input-group">
                        <input type="text" placeholder="User Name" />
                        <i className="fas fa-user" />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Email" />
                        <i className="fas fa-envelope" />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" />
                        <i className="fas fa-lock" />
                    </div>
                    <button className="btn action-btn">Sign In</button>
                </div>

                {/* حقول الدخول */}
                <div className="form-panel login-fields">
                    <div className="input-group">
                        <input type="email" placeholder="Email" />
                        <i className="fas fa-envelope" />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" />
                        <i className="fas fa-lock" />
                    </div>
                    <a href="#" className="forgot-link">Forgot Password?</a>
                    <button className="btn action-btn">Login</button>
                </div>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-left">
                        <h1 className="big-title">sign in</h1>
                        <p>Do you have an account?</p>
                        <button className="btn toggle-btn" onClick={switchMode}>Login</button>
                    </div>
                    <div className="overlay-right">
                        <h1 className="big-title">Login</h1>
                        <p>Don't have an account?</p>
                        <button className="btn toggle-btn" onClick={switchMode}>sign in</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default LoginAndSign;