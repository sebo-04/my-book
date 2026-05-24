import { useState } from 'react'; // استيراد Hook الحالة

const LoginAndSign = () => {
    // تعريف حالة للتحكم في الكلاس active
    const [isActive, setIsActive] = useState(false);
    
    const switchMode = () => {
        setIsActive(!isActive); // تبديل الحالة بين true و false
    };

    return (
        <>
            {/* تاغ الـ style المدمج لـ CSS */}
            <style>{`
                html, body, #root {
                    height: 100%;
                    margin: 0;
                    --brown: #bc986a;
                    --beige: #e2cca8;
                    --dark-text: #6b4f2a;
                    --white: #ffffff;
                }

                .body {
                    background-color: #f5eee0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: 'Arial', sans-serif;
                }

                .container {
                    position: relative;
                    width: 800px;
                    height: 480px;
                    background-color: var(--beige);
                    border: 1px solid #333;
                    overflow: hidden;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                }

                /* الطبقة الخلفية للحقول */
                .forms-bg-layer {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                }

                .form-panel {
                    width: 50%; /* تم التعديل إلى 50% ليتوزع النصفان بالتساوي خلف الـ overlay */
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    z-index: 1;
                }

                .input-group {
                    background: var(--white);
                    width: 200px; /* تم تكبير العرض قليلاً ليكون شكل المدخلات متناسقاً ومريحاً للكتابة */
                    padding: 12px 18px;
                    margin: 10px 0;
                    border-radius: 25px;
                    display: flex;
                    align-items: center;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                .input-group input {
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 14px;
                }

                .input-group i { 
                    color: #555; 
                    margin-left: 10px; 
                }

                /* الجزء العلوي المتحرك */
                .overlay-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.6s ease-in-out;
                    z-index: 10;
                }

                /* الحركة عند النقر */
                .container.active .overlay-container {
                    transform: translateX(100%);
                }

                .overlay {
                    position: relative;
                    left: -100%;
                    height: 100%;
                    width: 200%;
                    background: var(--brown);
                    transition: transform 0.6s ease-in-out;
                    /* رسم الميلان باستخدام clip-path */
                    clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
                }

                .container.active .overlay {
                    transform: translateX(50%);
                    clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
                }

                .overlay-left, .overlay-right {
                    position: absolute;
                    top: 0;
                    width: 50%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.6s ease-in-out;
                }

                .overlay-right { right: 0; }

                /* العناوين الضخمة */
                .big-title {
                    font-size: 40px;
                    color: var(--dark-text);
                    margin: 0;
                    text-shadow: 2px 2px 0px rgba(255,255,255,0.3);
                    text-transform: capitalize;
                }

                p {
                    color: #6b4f2a;
                    margin: 10px 0;
                }

                /* الأزرار */
                .btn {
                    cursor: pointer;
                    border-radius: 25px;
                    padding: 10px 40px;
                    font-size: 16px;
                    transition: 0.3s;
                    font-weight: bold;
                }

                .action-btn { 
                    background: var(--brown); 
                    color: var(--white); 
                    border: 1px solid #333; 
                    margin-top: 15px;
                }
                
                .action-btn:hover {
                    background: #a48155;
                }

                .toggle-btn { 
                    background: #e2cca8; 
                    border: 1px solid var(--dark-text); 
                    color: var(--dark-text); 
                    margin-top: 20px; 
                }
                
                .toggle-btn:hover {
                    background: #d4b88f;
                }

                .forgot-link { 
                    font-size: 12px; 
                    color: var(--dark-text); 
                    text-decoration: none; 
                    margin-bottom: 15px; 
                }
                
                .forgot-link:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className='body'>
                <div className={`container ${isActive ? 'active' : ''}`} id="main-container">
                    <div className="forms-bg-layer">
                        {/* حقول التسجيل (تظهر في اليمين عندما تنزاح الـ overlay لليسار) */}
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
                            <button className="btn action-btn">Sign Up</button>
                        </div>

                        {/* حقول الدخول (تظهر في اليسار بشكل افتراضي) */}
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

                    {/* الطبقة المتحركة الغطاء */}
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-left">
                                <h1 className="big-title">Sign In</h1>
                                <p>Do you have an account?</p>
                                <button className="btn toggle-btn" onClick={switchMode}>Login</button>
                            </div>
                            <div className="overlay-right">
                                <h1 className="big-title">Login</h1>
                                <p>Don't have an account?</p>
                                <button className="btn toggle-btn" onClick={switchMode}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginAndSign;