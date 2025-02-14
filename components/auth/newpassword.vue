<template>
    <div class="login-container">
    <div class="right-side" style="width: 50%; height: 100%;">
        
    </div>
    <div class="left-side">
      <h2 class="welcome-text">New Password</h2>
      <input type="email" class="new-password" placeholder="New Password" />
      <input type="password" class="confirm-password" placeholder="Confirm Password" />
      <div class="remember-forgot">
        <div class="remember-me">
          <input type="checkbox" id="remember-me" />
          <label for="remember-me">Remember me</label>
        </div>
        <a href="#" class="forgot-password">Forgot password?</a>
      </div>
      <button class="login-button">Login</button>
      <div class="rectangle">
          <div class="line">
              <span class="or-continue">or continue with</span>
          </div>
      </div>
      <div class="social-icons">
        <a href="#" class="icon-link">
          <img src="https://via.placeholder.com/30/0077B6/ffffff?text=G" alt="Google" />
        </a>
        <a href="#" class="icon-link">
          <img src="https://via.placeholder.com/30/333333/ffffff?text=G" alt="GitHub" />
        </a>
        <a href="#" class="icon-link">
          <img src="https://via.placeholder.com/30/26A5E4/ffffff?text=T" alt="Telegram" />
        </a>
      </div>
      <div class="sign-up">
        <span>Don't have an account?</span>
        <a href="#" class="sign-up-link">Sign Up</a>
      </div>
    </div>
  </div>
</template>
  
  <style>
  .login-container {
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    justify-items: space-between;
  }
  
  .left-side {
    background-color: #fff;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
  }
  
  .right-side {
    background-color: #ffffff;
  }
  
  .welcome-text {
    width: 80%;
    color: #00B0FF;
    text-align-last : center;
    font-size: 24px;
    margin-bottom: 20px;

  }
  
  
  .new-password,
  .confirm-password {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .remember-forgot {
    display: flex;
    font-size: 12px;
    padding-bottom: 10px;
  }
  
  .remember-me label {
    margin-left: 5px;
    padding-right: 120px;
 
  }
  
  .forgot-password {
    color: #00B0FF;
    text-decoration: none;
  }
  
  .login-button {
    width: 100%;
    background-color: #00B0FF;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .rectangle {
    width: 60%;
    height: 2px;
    margin-bottom: 20px;
    box-sizing: border-box;
}

  .line {
  width: 100%;  /* Full width of the rectangle */
  height: 1px;
  background-color: black;
  top: 50%;  /* Center the line vertically */
  left: +1px;
 
}

.or-continue {
    width: 43%;
    background-color: white;
    position: absolute;
    top: -7px; 
    transform: translateX(-50%); 
    font-size: 9px;
    color: black;
    font-weight: bold;
    left: +90px;
    padding-left: 8px;

    }
  
  .social-icons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .icon-link {
    margin: 0 10px;
  }
  
  .sign-up {
    text-align: center;
    background-color: #b6b2b2;
    width: 75%;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .sign-up-link {
    color: #00B0FF;
    text-decoration: none;
  }
  </style>