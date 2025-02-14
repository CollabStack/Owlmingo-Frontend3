<template>
    <div class="login-container">
        <div class="right-side" style="width: 50%; height: 100%;">
            <div class="left-side">
                <h2 class="welcome-text">Verification</h2>
                <p class="enter-code-text">Enter the verification code</p>
                <div class="otp-input-container">
                    <input type="text" class="otp-input" maxlength="1" />
                    <input type="text" class="otp-input" maxlength="1" />
                    <input type="text" class="otp-input" maxlength="1" />
                    <input type="text" class="otp-input" maxlength="1" />
                    <input type="text" class="otp-input" maxlength="1" />
                    <input type="text" class="otp-input" maxlength="1" />
                </div>
                <div class="resend-container">
                    <div class="empty-box"></div>
                    <a href="#" class="resend-link">If you didn't receive a code, Resend</a>
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

  .enter-code-text {
    width: 45%;
    color: #b2b7f3;
    text-align: left;
    font-size: 13px;
    margin-bottom: 20px;
  }

  .otp-input-container {
    display: flex;
    justify-content: space-between;
    width: 45%;
    margin-bottom: 20px;
  }

  .otp-input {
    width: 40px;
    height: 40px;
    font-size: 20px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .resend-container {
    display: flex;
    width: 45%;
    margin-bottom: 20px;
    align-items: center;
  }
  .empty-box{
    width: 25%;
  }

  .resend-link {

    color: #00B0FF;
    text-decoration: none;
    font-size: 10px;
  
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
