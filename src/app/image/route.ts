import { NextResponse } from 'next/server';
import * as querystring from "node:querystring";
import * as https from "node:https";

const YANDEX_CAPTCHA_SECRET = process.env.YANDEX_CAPTCHA_SECRET_KEY!;


export async function GET(request: Request) {
    try {
        const { token } = await request.json();
        console.log(token)
        // // Get user's IP from request headers
        // const forwarded = request.headers.get('x-forwarded-for');
        // const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
        //
        // const formData = new URLSearchParams({
        //     secret: YANDEX_CAPTCHA_SECRET,
        //     token: token,
        //     ip: ip,
        // });
        //
        // const response = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: formData.toString(),
        // });
        //
        //
        // if (!response.ok) {
        //     console.error(`Captcha validation error: ${response.status}`);
        //     return NextResponse.json({ passed: false });
        // }
        //
        // const data = await response.json();
        // console.log(data);
        //
        // return NextResponse.json({ passed: data.status === 'ok', message: "Капча успешно пройдена" });

    } catch (error) {
        console.error('Error validating captcha:', error);
        return NextResponse.json({ passed: false });
    }
}