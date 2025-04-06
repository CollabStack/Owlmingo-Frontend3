import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import Cookies from 'js-cookie';

export const adminAuth = defineStore('adminAuth', {
    state: () => ({
        token: Cookies.get('token') || null,
        admin: null, 
        isLoggedIn: !!Cookies.get('token'),
        tokenInitialized: false // Add a flag to track initialization
    }),
    actions: {
        // admin management methods
        setAdmin(admin) {
            console.log("Admin from params", admin)
            this.admin = { ...admin }; // Ensure reactivity
            localStorage.setItem('admin', JSON.stringify(admin)); // Persist
        },
        
        // Add initialization method
        async init() {
            if (this.tokenInitialized) return;
            
            const token = this.getToken();
            const storeAdmin = localStorage.getItem('admin');
            
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                this.tokenInitialized = true;
                // this.admin = storeAdmin ? JSON.parse(storeAdmin) : null; // Restore admin
            }
            
            // setTimeout(() => {
            //     this.refreshToken();
            // }, 300);
            await this.refreshToken(); // Refresh token on initialization

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
        },
        
        getToken() {
            return Cookies.get('token'); 
        },

        resetToken(){
            this.token = null;
            this.isLoggedIn = false;
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('admin');
        },
        
        getAdmin() {
            if (!this.admin) {
                const storeAdmin = localStorage.getItem('admin');
                // this.admin = storeAdmin ? JSON.parse(storeAdmin) : null;
                this.admin = storeAdmin ? JSON.parse(storeAdmin) : null;
            }
            return this.admin;
        },
        
        // Authentication methods
        async login(email, password) {
            console.log("email", email);
            console.log("password", password);
            const {$AdminPublicAxios} = useNuxtApp();
            try {
                const response = await $AdminPublicAxios.post('login', {
                    email: email,
                    password: password
                });
                
                this.setAdmin(response.data.data.user);
                this.setToken(response.data.data.token);
                this.isLoggedIn = true;

                return response.data;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
                
        // Session management methods
        logout() {
            this.admin = null;
            this.token = null;
            this.isLoggedIn = false;
            this.tokenInitialized = false;
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('admin');
        },

        async refreshToken() {
            try {
                const {$AdminPrivateAxios} = useNuxtApp();
                this.token = this.getToken(); // Ensure token is set before making the request
                if (!this.token) {
                    console.error("No token available for refresh.");
                    return;
                }

                const response = await $AdminPrivateAxios.post('/refresh-token');
                
                if(response.data.success === false) {
                    console.error("Refresh token failed:", response.data.message);
                    return;
                }

        
                const token = response.data.data.token;
                const admin = response.data.data.user;
                
                this.setToken(token);
                this.setAdmin(admin); // Update admin data
                                
                return token;
            } catch (error) {
                console.error("Refresh Token Error:", error);
                this.logout(); // Logout on error
                // setTimeout(() => this.refreshToken(), 60 * 1000);
            }
        }
        ,
        
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
                    // this.logout();
                    // return false;
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