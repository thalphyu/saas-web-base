import { FormControl } from '@angular/forms';
export class CustomValidator {

    static validatePassword(fc: FormControl) {
        const minPasswordLength = localStorage.getItem('MinPasswordLength');
        // tslint:disable-next-line:radix
        const minpswlength = parseInt(minPasswordLength, 10) - 1;
        const pattern = new RegExp('^([A-Z].*)(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + minpswlength + ',}$');
        if (!pattern.test(fc.value)) {
            return {validatePassword: false};
        } else {
            return null;
        }
    }

    static matchingConfirmPasswords(passwordKey: any) {
        const passwordInput = passwordKey.value;
        if (passwordInput.Password === passwordInput.ConfirmPassword) {
            return null;
        } else {
            return passwordKey.controls.ConfirmPassword.setErrors({ passwordNotEquivalent: true });
        }
    }


    static PasswordValidation(fc: FormControl) {
        const pwdPolicy=localStorage.getItem('PasswordPolicy');
        if(pwdPolicy!=='')
        {
            const passwordInput = fc.value;
            const minpswlength = parseInt('8', 10);
            const pattern = new RegExp('^([A-Z].*)(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{' + minpswlength + ',}$');
            if (!pattern.test(passwordInput))
            {
                //console.log("fc:",fc);
                return {validatePassword: false};
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }

    }

    static ConfirmPasswordMatch(passwordKey: any) {
        const passwordInput = passwordKey.value;
        if (passwordInput.NewPassword === passwordInput.ConfirmPassword) {
            return null;
        } else {
            return passwordKey.controls.ConfirmPassword.setErrors({ passwordNotEquivalent: true });
        }
    }
}
