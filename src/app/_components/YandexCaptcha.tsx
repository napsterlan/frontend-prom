import {InvisibleSmartCaptcha, useSmartCaptchaLoader} from "@yandex/smart-captcha";

interface InvisibleCaptchaProps {
    onSuccess: (success: boolean, message: string) => void;
    visible: boolean;
    onChallengeHidden: () => void;
}

export const InvisibleCaptcha = ({ onSuccess, visible, onChallengeHidden }: InvisibleCaptchaProps) => {
    // useSmartCaptchaLoader()?.execute()
    const handleCaptchaSuccess = async (token: string) => {
        try {
            const response = await fetch('/api/captcha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            const data = await response.json();
            onSuccess(response.ok, data.message);
        } catch (error) {
            onSuccess(false, 'Произошла ошибка. Попробуйте позже.');
        }
    };
    return (
        <InvisibleSmartCaptcha
            sitekey={process.env.NEXT_PUBLIC_YANDEX_CAPTCHA_SITEKEY!}
            onSuccess={handleCaptchaSuccess}
            onChallengeHidden={onChallengeHidden}
            visible={visible}
            hideShield={true}
        />
    );
};

export default InvisibleCaptcha;