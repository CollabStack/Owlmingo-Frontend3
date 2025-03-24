import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import Cookies from 'js-cookie';

export const userAuth = defineStore('userAuth', {
    state: () => ({
        token: Cookies.get('token') || null,
        user: null, 
        isLoggedIn: !!Cookies.get('token'),
        tokenInitialized: false // Add a flag to track initialization
    }),
    actions: {
        // User management methods
        setUser(user) {
            this.user = user;
        },
        
        // Add initialization method
        init() {
            if (this.tokenInitialized) return; // Prevent multiple initializations
            
            const token = this.getToken();
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                this.tokenInitialized = true;
                
                // Add a timeout to allow component mount before refresh
                setTimeout(() => {
                    this.refreshToken();
                }, 300);
            }
        },

        setToken(token) {
            this.token = token;
            this.isLoggedIn = true;
            this.tokenInitialized = true;
            
            // Use more complete cookie options
            Cookies.set('token', token, { 
                expires: 7, // 7 days
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                // sameSite: 'Lax' // Important for cross-site requests
            });
            
            // Also store in localStorage as backup
            localStorage.setItem('auth_token_backup', token);
        },
        
        getToken() {
            // Try to get token from cookie first, then from localStorage as backup
            let token = Cookies.get('token');
            if (!token) {
                token = localStorage.getItem('auth_token_backup');
                // If found in localStorage but not in cookies, restore the cookie
                if (token) {
                    Cookies.set('token', token, { 
                        expires: 7,
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Lax'
                    });
                }
            }
            return token;
        },
        
        getUser() {
            return this.user;
        },
        
        // Returns the reset token stored in localStorage
        getResetToken() {
            return localStorage.getItem('resetOTP');
        },
        
        // Clears the reset token
        clearResetToken() {
            localStorage.removeItem('resetOTP');
        },
        
        // Authentication methods
        async login(email, password) {
            console.log("email", email);
            console.log("password", password);
            const {$UserPublicAxios} = useNuxtApp();
            try {
                const response = await $UserPublicAxios.post('login', {
                    email: email,
                    password: password
                });
                
                this.setUser(response.data.data.user);
                this.setToken(response.data.data.token);
                this.isLoggedIn = true;

                return response.data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        
        // Registration methods
        async signUp(username, email, password) {
            console.log("username", username);
            console.log("email", email);
            console.log("password", password);
            const {$UserPublicAxios} = useNuxtApp();
            try {
                const response = await $UserPublicAxios.post('/register', {
                    username: username,
                    email: email,
                    password: password
                });
                console.log("register response", response);
                
                // Store email for verification process
                localStorage.setItem('signupEmail', email);
                
                return response.data;
            } catch (error) {
                console.error('Registration error:', error);
                throw error;
            }   
        },
        
        // Email verification methods (for new account signup)
        async verifyOtp(email, otp) {
            console.log("Verifying OTP for email:", email);
            console.log("OTP code:", otp);
            
            const {$UserPublicAxios} = useNuxtApp();
            
            try {
                const response = await $UserPublicAxios.post('/verify-otp', {
                    email: email, 
                    otp: otp
                });
                
                console.log("Email verification response:", response.data);
                
                // Set user data and token if available in the response
                if (response.data && response.data.data) {
                    if (response.data.data.user) {
                        this.setUser(response.data.data.user);
                    }
                    
                    if (response.data.data.token) {
                        this.setToken(response.data.data.token);
                        this.isLoggedIn = true;
                    }
                }
                
                return response.data;
            } catch (error) {
                console.error("OTP verification error:", error);
                
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    
                    if (error.response.status === 401) {
                        if (error.response.data && error.response.data.message) {
                            throw new Error(error.response.data.message);
                        } else {
                            throw new Error("Invalid OTP code. Please try again or request a new code.");
                        }
                    } else {
                        throw new Error(error.response.data.message || "Verification failed");
                    }
                } else if (error.request) {
                    throw new Error("No response from server. Please check your connection and try again.");
                } else {
                    throw new Error("Error setting up verification request: " + error.message);
                }
            }
        },
        
        async resendOtp(email) {
            console.log("Resending OTP for email verification:", email);
            
            const {$UserPublicAxios} = useNuxtApp();
            
            try {
                const response = await $UserPublicAxios.post('/resend-otp', { 
                    email: email 
                });
                
                console.log("Resend OTP response:", response.data);
                
                if (response.data && response.data.success === false) {
                    throw new Error(response.data.message || "Failed to resend verification code");
                }
                
                return response.data;
            } catch (error) {
                console.error("OTP resend error:", error);
                
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    
                    throw new Error(error.response.data.message || "Failed to resend verification code");
                } else if (error.request) {
                    throw new Error("No response from server. Please check your connection and try again.");
                } else {
                    throw new Error("Error resending OTP: " + error.message);
                }
            }
        },
        
        // ======== PASSWORD RESET FLOW - UPDATED TO MATCH API ENDPOINTS ========
        
        // Step 1: Request a password reset
        async ForgotPassword(email) {
            console.log("Requesting password reset for email:", email);
            const {$UserPublicAxios} = useNuxtApp();
            
            try {
                const response = await $UserPublicAxios.post('/forget-password', {
                    email: email
                });
                
                // Store email for the reset password flow
                localStorage.setItem('resetPasswordEmail', email);
                
                console.log("Password reset request response:", response.data);
                return response.data;
            } catch (error) {
                console.error('Forgot Password error:', error);
                throw error;
            }
        },
        
        // Step 2: Store OTP for password reset (called from Otp.vue)
        // This doesn't make an API call - just stores the OTP for the next step
        storePasswordResetOTP(otp) {
            console.log("Storing OTP for password reset:", otp);
            localStorage.setItem('resetOTP', otp);
        },
        
        // Step 3: Resend password reset OTP if needed
        async resendPasswordResetOTP(email) {
            console.log("Resending password reset OTP for:", email);
            
            const {$UserPublicAxios} = useNuxtApp();
            
            try {
                // Use the forget-password endpoint to resend OTP
                const response = await $UserPublicAxios.post('/forget-password', {
                    email: email
                });
                
                console.log("Resend reset OTP response:", response.data);
                return response.data;
            } catch (error) {
                console.error("Resend reset OTP error:", error);
                
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    
                    throw new Error(error.response.data.message || "Failed to resend verification code");
                } else if (error.request) {
                    throw new Error("No response from server. Please check your connection and try again.");
                } else {
                    throw new Error("Error resending reset OTP: " + error.message);
                }
            }
        },
        
        // Step 4: Reset password with OTP and new password
        async resetPassword(email, newPassword) {
            console.log("Resetting password for:", email);
            
            const otp = localStorage.getItem('resetOTP');
            
            if (!otp) {
                throw new Error("OTP is missing. Please verify your email first.");
            }
            
            const {$UserPublicAxios} = useNuxtApp();
            
            try {
                // Using the exact endpoint and parameter names from your API
                const response = await $UserPublicAxios.post('/reset-password', {
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                });
                
                console.log("Password reset response:", response.data);
                
                // Clear stored data after successful reset
                localStorage.removeItem('resetOTP');
                localStorage.removeItem('resetPasswordEmail');
                
                return response.data;
            } catch (error) {
                console.error('Reset Password error:', error);
                
                if (error.response) {
                    let errorMessage = error.response.data?.message || "Failed to reset password";
                    throw new Error(errorMessage);
                } else if (error.request) {
                    throw new Error("No response from server. Please check your connection and try again.");
                } else {
                    throw new Error("Error resetting password: " + error.message);
                }
            }
        },
        
        // Session management methods
        logout() {
            this.user = null;
            this.token = null;
            this.isLoggedIn = false;
            this.tokenInitialized = false;
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('auth_token_backup');
        },

        async telegramOAuth(data) {
            const {$UserPublicAxios} = useNuxtApp(); // Use full Nuxt app instance
            try {
            const {first_name, last_name, username} = data;
            const telegram_id = data.id;
            const response = await $UserPublicAxios.post('/telegram-oauth', {first_name, last_name, username, telegram_id});
            if (response.status !== 200) {
                throw new Error(`Error: Received status code ${response.status}`);
            }
            console.log("response OAuth", response);
            const token = response.data.data['token'];
            this.setUser(response.data.data['user']);
            this.setToken(token);
            this.refreshToken();
            this.isLoggedIn = true;
            return response;
            } catch (error) {
            throw error;
            }
        },
        async refreshToken() {
            try {
                const {$UserPrivateAxios} = useNuxtApp();
                const response = await $UserPrivateAxios.post('/refresh-token');
                
                if (!response.data || !response.data.data || !response.data.data.token) {
                    console.error('Invalid refresh token response', response);
                    return;
                }
                
                const token = response.data.data.token;
                console.log("=============  Refresh Token =============");
                console.log('Refreshed token:', token);
                console.log("==========================================");
                this.setToken(token);
                
                // Schedule next token refresh (every 15 minutes)
                setTimeout(() => {
                    this.refreshToken();
                }, 15 * 60 * 1000);
                
                return token;
            } catch (error) {
                console.error("Refresh Token Error:", error);
                // Don't logout on refresh failures - just try again later
                setTimeout(() => {
                    this.refreshToken();
                }, 60 * 1000);
            }
        },
        
        async checkTokenExpired() {
            let token = this.getToken();
            if (!token) {
                return false;
            }
            
            try {
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token format');
                }
                
                const payload = JSON.parse(atob(parts[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                // If token is expired or close to expiry, refresh it
                if (!payload.exp || payload.exp < currentTime) {
                    console.log('Token expired, getting new one');
                    token = await this.refreshToken();
                    return !!token;
                } else if (payload.exp - currentTime < 900) { // 15 minutes
                    console.log('Token expiring soon, refreshing');
                    this.refreshToken(); // Don't await, let it refresh in background
                }
                
                return true;
            } catch (error) {
                console.error('Token validation error:', error);
                return false;
            }
        },
        
        initializeSession() {
            if (!this.token) {
                this.logout();
                return;
            }
            this.checkTokenExpired().then(isValid => {
                if (isValid) {
                    this.refreshToken();
                }
            });
        }
    }
});