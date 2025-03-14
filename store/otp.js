import { defineStore } from "pinia";
import axios from 'axios'
export const useOtpStore = defineStore('otp', {
    state: () => ({
        email: '',
        otp: '',
        newPassword: '',
        message: '',
        error: '',
        mode: 'forget-password', 
        loading: false,
}),

    actions: {
        async sendOtp(email) {
          this.loading = true
          this.error = ''
          try {
            const response = await axios.post('/api/v1/user/forget-password', { email })
            this.message = response.data.message
          } catch (err) {
            this.error = err.response?.data?.message || 'Failed to send OTP'
          } finally {
            this.loading = false
          }
        },

        async verifyOtp(email, otp) {
            this.loading = true
            this.error = ''
            try {
              const response = await axios.post('/api/v1/user/verify-otp', { email,otp })
              this.message = response.data.message
            } catch (err) {
              this.error = err.response?.data?.message || 'OTP verification failed'
            } finally {
              this.loading = false
            }
        },

        async resetPassword(email, otp, newPassword) {
            this.loading = true
            this.error = ''

            try {
                const response = await axios.post('/api/v1/user/reset-password', { email, otp, newPassword })
                this.message = response.data.message
            }catch (err) {
                this.error = err.response?.data?.message || 'Failed to reset password'
            }finally {
                this.loading = false
            }
        },
        
        setMode(newMode) {
            this.mode = newMode
        }
    }

})

