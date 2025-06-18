document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cyberForm');
    const passwordInput = document.getElementById('password');
    const birthDateInput = document.getElementById('birthDate');
    const aboutTextarea = document.getElementById('about');
    const charCount = document.getElementById('charCount');
    const phoneInput = document.getElementById('phone');
    const nameInputs = [
        document.getElementById('surname'),
        document.getElementById('name'),
        document.getElementById('patronymic')
    ];

    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Анкета отправлена ✿';
    document.body.appendChild(successMessage);

    // Ripple effect for inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Name fields validation
    nameInputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', function(e) {
            const value = this.value;
            const sanitized = value.replace(/[^А-Яа-яЁёA-Za-z\s-]/g, '');
            
            if (value !== sanitized) {
                this.value = sanitized;
                this.classList.add('shake');
                setTimeout(() => {
                    this.classList.remove('shake');
                }, 500);
            }
        });
    });

    // Phone input validation
    phoneInput.addEventListener('input', function(e) {
        let value = this.value;
        const sanitized = value.replace(/[^\d+]/g, '');
        
        if (sanitized.includes('+') && sanitized.indexOf('+') > 0) {
            value = sanitized.replace(/\+/g, '');
        } else {
            value = sanitized;
        }
        
        if ((value.match(/\+/g) || []).length > 1) {
            value = '+' + value.replace(/\+/g, '');
        }
        
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
    
        if (value !== this.value) {
            this.value = value;
            this.classList.add('shake');
            setTimeout(() => {
                this.classList.remove('shake');
            }, 500);
        }
    });

    // Set max date for birthDate
    const today = new Date();
    birthDateInput.max = today.toISOString().split('T')[0];

    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = {
            length: password.length >= 8 && password.length <= 25,
            hasUpper: /[A-ZА-ЯЁ]/.test(password),
            hasLower: /[a-zа-яё]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*]/.test(password)
        };

        // Update hints
        document.getElementById('lengthHint').classList.toggle('valid', strength.length);
        document.getElementById('upperHint').classList.toggle('valid', strength.hasUpper);
        document.getElementById('lowerHint').classList.toggle('valid', strength.hasLower);
        document.getElementById('numberHint').classList.toggle('valid', strength.hasNumber);
        document.getElementById('specialHint').classList.toggle('valid', strength.specialHint);

        // Calculate strength percentage
        const strengthScore = Object.values(strength).filter(Boolean).length;
        const strengthPercentage = (strengthScore / 5) * 100;

        // Update strength indicator
        const strengthEl = document.getElementById('passwordStrength');
        strengthEl.style.width = strengthPercentage + '%';
        strengthEl.style.backgroundColor = 
            strengthPercentage <= 20 ? '#FFB7D5' :
            strengthPercentage <= 40 ? '#FF9EBA' :
            strengthPercentage <= 60 ? '#FF85A1' :
            strengthPercentage <= 80 ? '#FF6B88' :
            '#FF526F';
    });

    // Character counter for about textarea
    aboutTextarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        successMessage.classList.add('show');
        
        // Add clear animation to form
        form.classList.add('form-clear');
        
        // Wait for animation to complete
        setTimeout(() => {
            // Reset form
            form.reset();
            charCount.textContent = '0';
            document.querySelectorAll('.hint').forEach(hint => hint.classList.remove('valid'));
            document.getElementById('passwordStrength').style.width = '0';
            
            // Remove animation class
            form.classList.remove('form-clear');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        }, 500);
    });

    // Reset form
    form.addEventListener('reset', function() {
        setTimeout(() => {
            charCount.textContent = '0';
            document.querySelectorAll('.hint').forEach(hint => hint.classList.remove('valid'));
            document.getElementById('passwordStrength').style.width = '0';
        }, 0);
    });
});