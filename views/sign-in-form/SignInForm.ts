/// <reference path="../View.ts" />
namespace Views {
    export class SignInForm extends Views.View<HTMLFormElement> {
        private _disabled: boolean;

        private _errorNotice: HTMLParagraphElement;
        private _inputUsername: HTMLInputElement;
        private _inputPassword: HTMLInputElement;
        private _inputRememberMe: HTMLInputElement;
        private _inputRememberMeNotice: HTMLParagraphElement;
        private _submitButton: HTMLButtonElement;

        public submitCallback: (form: SignInForm) => void;

        constructor() {
            super(Views.Templates.cloneTemplate<HTMLFormElement>('sign-in-form'));

            this._errorNotice = this.root.querySelector('.error-notice') as HTMLParagraphElement;
            this._inputUsername = this.root.querySelector('input[name="username"]') as HTMLInputElement;
            this._inputPassword = this.root.querySelector('input[name="password"]') as HTMLInputElement;
            this._inputRememberMe = this.root.querySelector('input[name="remember-me"]') as HTMLInputElement;
            this._inputRememberMeNotice = this.root.querySelector('.remember-me-warning') as HTMLParagraphElement;
            this._submitButton = this.root.querySelector('button[type="submit"]') as HTMLButtonElement;

            $(this._inputRememberMe).click((e) => this.onRememberMeClick(e));
            $(this.root).submit((e) => this.onFormSubmit(e));

            this._disabled = false;
        }

        get disabled(): boolean {
            return this._disabled;
        }
        set disabled(value: boolean) {
            if (value != this._disabled) {
                $([this._inputUsername, this._inputPassword, this._inputRememberMe, this._submitButton]).prop("disabled", value);
                this._disabled = value;
            }
        }

        public get username() { return this._inputUsername.value; }
        public set username(value: string) { this._inputUsername.value = value; }

        public get password() { return this._inputPassword.value; }
        public set password(value: string) { this._inputPassword.value = value; }

        public get rememberMe() { return this._inputRememberMe.checked; }
        public set rememberMe(value: boolean) {
            this._inputRememberMe.checked = value;
            if (value) $(this._inputRememberMeNotice).show();
            else $(this._inputRememberMeNotice).hide();
        }

        public focus() {
            if ($(this._inputUsername).val()) $(this._inputPassword).focus();
            else $(this._inputUsername).focus();
        }

        public set errorNotice(message: string) {
            if (message) {
                this._errorNotice.innerText = message;
                $(this._errorNotice).slideDown(160);
            }
            else {
                $(this._errorNotice).slideUp(160);
            }
        }

        private onRememberMeClick(e: JQueryEventObject) {
            if (this._inputRememberMe.checked)
                $(this._inputRememberMeNotice).slideDown(160);
            else
                $(this._inputRememberMeNotice).slideUp(160);
        }

        private onFormSubmit(e: JQueryEventObject) {
            e.preventDefault();
            if ((this._disabled) || (!this._inputUsername.checkValidity()) || (!this._inputPassword.checkValidity())) return;
            if (this.submitCallback) this.submitCallback(this);
        }
    }
}
