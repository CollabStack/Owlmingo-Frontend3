<template>
    <div class="login-container">
        <div class="right-side" style="width: 50%; height: 100%;">
            <div class="left-side">
                <h2 class="welcome-text">Forgot Password</h2>
                <div class="email-input-container">
                    <input type="email" class="email-input" placeholder="Enter your email" />
                </div>
                <div class="back-sign-in-container">
                    <a href="#" class="back-sign-in-link">Back to Sign In</a>
                </div>
                <button class="send-button">Send</button>
                <div class="rectangle">
                    <div class="line">
                        <span class="or-continue">or continue with</span>
                    </div>
                </div>
                <div class="social-icons">
                    <div class="empty-icon"></div>
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
                <div>
                    <button class="sign-up">Don't have an account? Sign Up</button>
                </div>
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
    text-align-last: center;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .email-input-container {
    width: 45%;
    margin-bottom: 20px;
  }

  .email-input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .back-sign-in-container {
    width: 45%;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .back-sign-in-link {
    color: #00B0FF;
    text-decoration: none;
    font-size: 12px;
  }

  .send-button {
    width: 45%;
    background-color: #00B0FF;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .rectangle {
    width: 50%;
    height: 2px;
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
  }

  .line {
    width: 70%;
    height: 1px;
    background-color: black;
    position: absolute;
    top: 50%;
    left: 50px;
  }

  .or-continue {
    width: 33%;
    background-color: white;
    position: absolute;
    top: -7px;
    transform: translateX(-50%);
    font-size: 9px;
    color: black;
    font-weight: bold;
    left: 120px;
    padding-left: 5px;
    padding-right: 5px;
  }

  .social-icons {
    width: 25%;
    display: flex;
    padding: 1px;
  }

  .icon-link {
    margin: 0 10px;
  }

  .sign-up {
    text-align: center;
    background-color: #b6b2b2;
    width: 100%;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .sign-up-link {
    color: #00B0FF;
    text-decoration: none;
  }
</style>
