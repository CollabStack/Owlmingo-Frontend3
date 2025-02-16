<template>

    <div class="forget-container">
      
    <div class="left-side">
      <h2 class="welcome-text">Forget Password</h2>
      <input type="email" class="email-input" placeholder="Email" />
      <div class="remember-forgot">
            <a href="#" class="back-to-sign-in">Back in to Sign Up</a>
      </div>
      <button class="login-button">Send</button>
      <div class="rectangle">
          <div class="line">
              <span class="or-continue">or continue with</span>
          </div>
      </div>
      <div class="social-icons">
        <a href="#" class="icon-link">
          <img src="hC:\Owlmingo-Frontend3\public\icons\icons8-google-480.png" alt="Google" class="icons" />
        </a>
        <a href="#" class="icon-link">
          <img src="C:\Owlmingo-Frontend3\public\icons\icons8-github-480.png" alt="GitHub" class="icons"/>
        </a>
        <a href="#" class="icon-link">
          <img src="hC:\Owlmingo-Frontend3\public\icons\icons8-telegram-144.svg" alt="Telegram" class="icons"/>
        </a>
      </div>
      <div class="sign-up">
        <span>Don't have an account?</span>
        <a href="#" class="sign-up-link">Sign Up</a>
      </div>
    </div>

    <div class="right-side" style="width: 50%; height: 100%;">
        <img src="C:\Owlmingo-Frontend3\public\images\3d-business-man-working-at-laptop-with-robot-assistant.png" alt="" class="image" />
        
    </div>
  </div>
</template>
  
  <style scoped>
  .forget-container {
    margin-left: 250px;
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
    display: flex;
    background-color: #ffffff;
    justify-content: center;
  }

  .image{
    width: 400px;
    height: cover;
 
  }
  
  .welcome-text {
    width: 425px;
    color: #00B0FF;
    text-align-last : center;
    font-size: 24px;
    margin-bottom: 20px;

  }
  
  
  .email-input{
    width: 75%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .remember-forgot {
    display: flex;
    font-size: 12px;
    padding-bottom: 10px;
    width: 75%;
    justify-content: flex-end;
  }

  
  .back-to-sign-in {
    color: #00B0FF;
    text-decoration: none;

  }
  
  .login-button {
    width: 75%;
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
    left: +18px
}

  .line {
  width: 90%;  /* Full width of the rectangle */
  height: 1px;
  background-color: black;
  position: absolute;
  top: 50%;  /* Center the line vertically */

 
}

.or-continue {
    width: 40%;
    background-color: white;
    position: absolute;
    top: -7px; 
    transform: translateX(-50%); 
    font-size: 9px;
    color: black;
    font-weight: bold;
    left: +95px;
    padding-left: 5px;
    padding-right: 5px;

    }
  
  .social-icons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    left: -20px

  }
  
  .icon-link {
    margin: 0 10px;
  }
  .icons{
    width: 30px;
    height: 30px;
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

  