import { NextResponse } from 'next/server';
import * as querystring from "node:querystring";
import * as https from "node:https";

const YANDEX_CAPTCHA_SECRET = process.env.YANDEX_CAPTCHA_SECRET_KEY!;
// const YANDEX_VERIFY_URL = 'https://smartcaptcha.yandexcloud.net/validate';

// async function verifyCaptcha(token: string) {
//     const postData = querystring.stringify({
//         secret: YANDEX_CAPTCHA_SECRET,
//         token: token,
//     });
//     const options = {
//         hostname: 'smartcaptcha.yandexcloud.net',
//         port: 443,
//         path: '/validate',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Content-Length': Buffer.byteLength(postData),
//         },
//     };
//     try {
//         const req = https.request(options, (res) => {
//             let content = '';
//
//             res.on('data', (chunk) => {
//                 content += chunk;
//             });
//
//             res.on('end', () => {
//                 if (res.statusCode !== 200) {
//                     console.error(`Allow access due to an error: code=${res.statusCode}; message=${content}`);
//
//                     return false;
//                 }
//
//                 try {
//                     const parsedContent = JSON.parse(content);
//                     return parsedContent.status === 'ok';
//                 } catch (err) {
//                     console.error('Error parsing response: ', err);
//                     return false;
//                 }
//             });
//         });
//
//         req.on('error', (error) => {
//             console.error(error);
//             return false;
//         });
//
//         // Write the POST data to the request body
//         req.write(postData);
//         req.end();
//     } catch (error) {
//         console.error('Captcha verification error:', error);
//         return false;
//     }
// }
//
// export async function POST(request: Request) {
//     try {
//         const { email, captchaToken } = await request.json();
//         console.log(captchaToken);
//         // Verify captcha first
//         const isCaptchaValid = await verifyCaptcha(captchaToken);
//         if (!isCaptchaValid) {
//             return NextResponse.json(
//                 { message: 'Ошибка проверки капчи', success: false },
//                 { status: 400 }
//             );
//         }
//         return NextResponse.json(
//             {message: 'Капча успешно пройдена!', success: true}
//         )
//         // If captcha is valid, forward the subscription request to your Golang backend
//         // const response = await fetch('YOUR_GOLANG_API_URL/subscribe', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Content-Type': 'application/json',
//         //     },
//         //     body: JSON.stringify({ email }),
//         // });
//         //
//         // const data = await response.json();
//         // return NextResponse.json(data, { status: response.status });
//
//     } catch (error) {
//         console.error('Subscription error:', error);
//         return NextResponse.json(
//             { message: 'Произошла ошибка. Попробуйте позже.' },
//             { status: 500 }
//         );
//     }
// }

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        // Get user's IP from request headers
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

        const formData = new URLSearchParams({
            secret: YANDEX_CAPTCHA_SECRET,
            token: token,
            ip: ip,
        });

        const response = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });


        if (!response.ok) {
            console.error(`Captcha validation error: ${response.status}`);
            return NextResponse.json({ passed: false });
        }

        const data = await response.json();
        console.log(data);

        return NextResponse.json({ passed: data.status === 'ok', message: "Капча успешно пройдена" });

    } catch (error) {
        console.error('Error validating captcha:', error);
        return NextResponse.json({ passed: false });
    }
}