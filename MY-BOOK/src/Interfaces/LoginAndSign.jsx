import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LoginAndSign = () => {
    const [isActive, setIsActive] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const switchMode = () => {
        setIsActive(!isActive);
        setErrorMessage('');
        setSuccessMessage('');
        setLoginEmail('');
        setLoginPassword('');
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch('http://localhost:3030/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('تم تسجيل الدخول بنجاح:', data);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            } else {
                setErrorMessage(data.message || 'حدث خطأ أثناء تسجيل الدخول');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('تعذر الاتصال بالخادم، تأكد من تشغيل الباك اند');
        }
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await fetch('http://localhost:3030/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: signupName, email: signupEmail, password: signupPassword })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.');
                setIsActive(false); 
                setSignupName('');
                setSignupEmail('');
                setSignupPassword('');
            } else {
                setErrorMessage(data.message || 'حدث خطأ أثناء التسجيل');
            }
        } catch {
            setErrorMessage('تعذر الاتصال بالخادم');
        }
    };
    return (
        <>
            <style>{`
                html, body, #root { height: 100%; margin: 0; --brown: #bc986a; --beige: #e2cca8; --dark-text: #6b4f2a; --white: #ffffff; }
                .body { background-color: #f5eee0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Arial', sans-serif; }
                .container { position: relative; width: 800px; height: 480px; background-color: var(--beige); border: 1px solid #333; overflow: hidden; box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
                .forms-bg-layer { position: absolute; width: 100%; height: 100%; display: flex; }
                .form-panel { width: 50%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; z-index: 1; }
                .input-group { background: var(--white); width: 200px; padding: 12px 18px; margin: 10px 0; border-radius: 25px; display: flex; align-items: center; border: 1px solid rgba(0,0,0,0.1); }
                .input-group input { border: none; outline: none; width: 100%; font-size: 14px; }
                .overlay-container { position: absolute; top: 0; left: 0; width: 50%; height: 100%; overflow: hidden; transition: transform 0.6s ease-in-out; z-index: 10; }
                .container.active .overlay-container { transform: translateX(100%); }
                .overlay { position: relative; left: -100%; height: 100%; width: 200%; background: var(--brown); transition: transform 0.6s ease-in-out; clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%); }
                .container.active .overlay { transform: translateX(50%); clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%); }
                .overlay-left, .overlay-right { position: absolute; top: 0; width: 50%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: transform 0.6s ease-in-out; }
                .overlay-right { right: 0; }
                .big-title { font-size: 40px; color: var(--dark-text); margin: 0; text-shadow: 2px 2px 0px rgba(255,255,255,0.3); }
                p { color: #6b4f2a; margin: 10px 0; }
                .btn { cursor: pointer; border-radius: 25px; padding: 10px 40px; font-size: 16px; transition: 0.3s; font-weight: bold; }
                .action-btn { background: var(--brown); color: var(--white); border: 1px solid #333; margin-top: 15px; }
                .toggle-btn { background: #e2cca8; border: 1px solid var(--dark-text); color: var(--dark-text); margin-top: 20px; }
                .error-msg { color: red; font-size: 13px; margin: 5px 0; text-align: center; }
                .success-msg { color: green; font-size: 13px; margin: 5px 0; text-align: center; }
            `}</style>
            <div className='body'>
                <div className={`container ${isActive ? 'active' : ''}`} id="main-container">
                    <div className="forms-bg-layer">
                        <form className="form-panel sign-up-fields" onSubmit={handleSignUp}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    required
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn action-btn">Sign Up</button>
                        </form>
                        <form className="form-panel login-fields" onSubmit={handleLogin}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>                            
                            {errorMessage && <div className="error-msg">{errorMessage}</div>}
                            {successMessage && <div className="success-msg">{successMessage}</div>}

                            <button type="submit" className="btn action-btn">Login</button>
                        </form>
                    </div>
                         <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-left">
                                <h1 className="big-title">Sign In</h1>
                                <p>Do you have an account?</p>
                                <button type="button" className="btn toggle-btn" onClick={switchMode}>Login</button>
                            </div>
                            <div className="overlay-right">
                                <h1 className="big-title">Login</h1>
                                <p>Don't have an account?</p>
                                <button type="button" className="btn toggle-btn" onClick={switchMode}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LoginAndSign;